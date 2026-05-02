from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain_google_genai import ChatGoogleGenerativeAI
import pandas as pd

# Load Data
df = pd.read_csv("final_groundwater_data.csv", low_memory=False)

# Setup LLM (Free Gemini API use kar sakte ho)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key="AIzaSyBtlgYTVGhNlSm8DfOZJ984Gi2J2oALZ5A")

# Create Agent
agent = create_pandas_dataframe_agent(
    llm,
    df,
    verbose=True,
    allow_dangerous_code=True # Hackathon ke liye okay hai
)

# 4. Ask query
# query = "भोपाल और इंदौर के जल स्तर की तुलना करो। 2025 में कौन सा शहर बेहतर स्थिति में है?"
# response = agent.run(query)
# print(response)

query = """
You are a groundwater data analysis engine. You do not chat. You only output raw JSON.

When a user asks a query (e.g., "Bhopal vs Indore"), you must:
1. Analyze the location and data requested.
2. Generate realistic or retrieved data for Groundwater Extraction vs Recharge.
3. Return ONLY a valid JSON object with no markdown formatting (no ```json).

The JSON must follow this exact schema:
{
  "content": "A short 1-2 sentence analysis of the data.",
  "table": "A Markdown formatted table string showing columns: District, Extraction (BCM), Recharge (BCM), Status.",
  "chartData": [
    { "name": "DistrictName", "Extraction": number, "Recharge": number }
  ],
  "chartType": "bar"
}

Do not include "id" or "role" in your output. Return only the JSON.
"""

# 5. Run and Print
try:
    response = agent.invoke(query)
    print("\n" + "="*40)
    print("       FINAL ANALYSIS REPORT")
    print("="*40 + "\n")
    print(response['output'])
except Exception as e:
    print(f"Error: {e}")