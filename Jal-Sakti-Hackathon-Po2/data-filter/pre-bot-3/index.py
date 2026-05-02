import pandas as pd

# -----------------------------
# 1. Load Excel files
# -----------------------------
files = [
    "2012-2013.xlsx",
    "2016-2017.xlsx",
    "2019-2020.xlsx",
    "2021-2022.xlsx",
    "2022-2023.xlsx",
    "2023-2024.xlsx",
    "2024-2025.xlsx"
]

dfs = [pd.read_excel(f) for f in files]
df = pd.concat(dfs, ignore_index=True)
df = df.fillna("")

# -----------------------------
# 2. Create LangChain Documents
# -----------------------------
from langchain_core.documents import Document

documents = []
for _, row in df.iterrows():
    text = " | ".join(f"{col}: {row[col]}" for col in df.columns)
    documents.append(Document(page_content=text))

print(f"Total documents: {len(documents)}")

# -----------------------------
# 3. Embeddings (FIXED)
# -----------------------------
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}  # 🔴 VERY IMPORTANT (prevents segfault)
)

# -----------------------------
# 4. Vector Store (FAISS)
# -----------------------------
from langchain_community.vectorstores import FAISS

# ⚠️ Batch processing to avoid crash
batch_size = 500
vectorstore = None

for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    if vectorstore is None:
        vectorstore = FAISS.from_documents(batch, embeddings)
    else:
        vectorstore.add_documents(batch)

vectorstore.save_local("excel_rag_index")

# -----------------------------
# 5. Ollama LLM
# -----------------------------
from langchain_ollama import OllamaLLM

llm = Ollama(
    model="llama3.1",   # or qwen2.5
    temperature=0.2
)

# -----------------------------
# 6. Retrieval QA (CORRECT IMPORT)
# -----------------------------
from langchain.chains import RetrievalQA

qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    chain_type="stuff"
)

# -----------------------------
# 7. Chat Loop
# -----------------------------
print("\nExcel RAG Chatbot Ready (type 'exit' to quit)\n")

while True:
    query = input("Ask: ")
    if query.lower() == "exit":
        break
    answer = qa.run(query)
    print("\nAnswer:", answer, "\n")
