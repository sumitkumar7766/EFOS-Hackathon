from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain_ollama import ChatOllama
import pandas as pd

# 1. Load Data
try:
    df = pd.read_csv("final_groundwater_data.csv", low_memory=False)
except FileNotFoundError:
    print("Error: CSV file not found.")
    exit()

# 2. Setup LLM (Ollama)
llm = ChatOllama(
    model="llama3.1", 
    temperature=0,
)

# 3. Create Agent with ERROR HANDLING and CUSTOM INSTRUCTIONS
# We add a 'prefix' to force the model to understand it has the data.
custom_prefix = """
You are working with a pandas dataframe in Python. The name of the dataframe is `df`.
You should use the tools below to answer the question posed of you.
If the user asks to compare data, you MUST write python code to filter the dataframe and print the results.
Do not say "I cannot do this". You have the data right here.
"""

agent = create_pandas_dataframe_agent(
    llm,
    df,
    verbose=True,
    allow_dangerous_code=True,
    prefix=custom_prefix,       # <--- Added this to stop refusal
    handle_parsing_errors=True  # <--- Added this to stop the crash
)

# 4. Define Query
query = """
Compare the groundwater levels of Bhopal and Indore for the year 2024.
1. Filter the df for District 'Bhopal' and 'Indore'.
2. Print the relevant rows to see the values.
3. Then output the final answer in text and markdown table format.
"""

# 5. Run
print("Analyzing...")
try:
    response = agent.invoke(query)
    print("\nFINAL OUTPUT:\n", response['output'])
except Exception as e:
    print(f"Error: {e}")