import pathway.xpacks.llm.llms as llms
from pathway.xpacks.llm.llms import CohereChat
import pathway as pw
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()
PATHWAY_API_KEY = os.getenv("PATHWAY_API_KEY")

print("=== Pathway LLM Debug ===")

# Check CohereChat class
print(f"CohereChat class: {CohereChat}")
print(f"CohereChat methods: {[m for m in dir(CohereChat) if not m.startswith('_')]}")

# Try to create instance
try:
    llm = CohereChat(api_key=PATHWAY_API_KEY)
    print(f"✅ CohereChat instance created: {type(llm)}")
    print(f"Instance methods: {[m for m in dir(llm) if not m.startswith('_')]}")
    
    # Check if it has __call__
    if hasattr(llm, '__call__'):
        print("✅ Has __call__ method")
        
        # Get function signature
        import inspect
        try:
            sig = inspect.signature(llm.__call__)
            print(f"__call__ signature: {sig}")
        except:
            print("Could not get signature")
    
    # Check documentation or docstring
    if hasattr(llm, '__doc__'):
        print(f"Docstring: {llm.__doc__}")
        
except Exception as e:
    print(f"❌ Error creating CohereChat: {e}")

# Try simple pathway example
try:
    print("\n=== Simple Pathway Test ===")
    import pandas as pd
    
    # Test with a simple string prompt
    df = pd.DataFrame({'prompt': ['Hello, respond with just "Working"']})
    table = pw.debug.table_from_pandas(df)
    
    llm_instance = CohereChat(api_key=PATHWAY_API_KEY)
    result_table = table.select(response=llm_instance(pw.this.prompt))
    
    print("Table created successfully, trying to compute...")
    
except Exception as e:
    print(f"❌ Simple test failed: {e}")
    import traceback
    traceback.print_exc()