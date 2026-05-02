import os
os.environ["OPENAI_API_KEY"] = "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"

import pandas as pd
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS

# Load CSV
df = pd.read_csv("final_groundwater_rag_ready.csv", low_memory=False)

documents = []
for _, row in df.iterrows():
    documents.append(
        Document(
            page_content=str(row["rag_text"]),
            metadata={
                "state": row.get("state"),
                "district": row.get("district"),
                "year": row.get("year")
            }
        )
    )

# Embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large"
)

# Vector DB
vectorstore = FAISS.from_documents(documents, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Prompt
prompt = ChatPromptTemplate.from_template("""
You are a groundwater expert.
Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}

Answer:
""")

# RAG Chain (LCEL)
rag_chain = (
    {
        "context": retriever,
        "question": lambda x: x
    }
    | prompt
    | llm
    | StrOutputParser()
)

# Query
query = "What is the groundwater availability in Patna district?"
answer = rag_chain.invoke(query)

print("Answer:\n", answer)
