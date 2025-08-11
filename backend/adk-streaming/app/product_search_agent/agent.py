

from google.adk.agents import Agent
from product_search_agent.prompt import chat_agent_prompt
from product_search_agent.tools import load_products_details, format_product_response
from google.adk.tools import load_artifacts

root_agent = Agent(
   # A unique name for the agent.
   name="product_search_agent",
   # The Large Language Model (LLM) that agent will use.
   model="gemini-2.0-flash-exp", # if this model does not work, try below
   #model="gemini-2.0-flash-live-001",
   # A short description of the agent's purpose.
   description="Agent to answer questions.",
   # Instructions to set the agent's behavior.
   instruction=chat_agent_prompt,
   tools=[load_artifacts, load_products_details, format_product_response],
)
