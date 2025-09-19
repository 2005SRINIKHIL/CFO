import pathway as pw
from pathway.xpacks.llm.llms import CohereChat
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()
PATHWAY_API_KEY = os.getenv("PATHWAY_API_KEY")

print("=== Testing Pathway LLM Properly ===")

try:
    # Initialize LLM
    llm = CohereChat(api_key=PATHWAY_API_KEY)
    print(f"✅ LLM created: {type(llm)}")
    
    # The correct way according to Pathway docs should be:
    # 1. Create input connector or table
    # 2. Apply LLM transformation
    # 3. Run the pipeline
    
    # Method 1: Using connectors (streaming)
    print("\n--- Method 1: Input Connector ---")
    
    # Create a simple input table
    input_data = pw.Table.from_markdown('''
    | query
    | Hello, say "Working" in response
    ''')
    
    # Apply LLM
    responses = input_data.select(
        query=pw.this.query,
        response=llm(pw.this.query)
    )
    
    # Try to run and get output
    pw.debug.compute_and_print(responses)
    
except Exception as e:
    print(f"❌ Method 1 failed: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\n--- Method 2: JSON Messages Format ---")
    
    import json
    
    # Try with proper message format
    messages = [{"role": "user", "content": "Say 'Hello from Pathway'"}]
    message_json = json.dumps(messages)
    
    input_data = pw.Table.from_markdown(f'''
    | messages
    | {message_json}
    ''')
    
    llm = CohereChat(api_key=PATHWAY_API_KEY)
    responses = input_data.select(
        response=llm(pw.this.messages)
    )
    
    pw.debug.compute_and_print(responses)
    
except Exception as e:
    print(f"❌ Method 2 failed: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Test Complete ===")