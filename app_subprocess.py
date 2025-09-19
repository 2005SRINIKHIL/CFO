from flask import Flask, request, jsonify, render_template
import os
import re
import time
from dotenv import load_dotenv
from functools import lru_cache
import threading
from concurrent.futures import ThreadPoolExecutor

# Load environment variables
load_dotenv()
PATHWAY_API_KEY = os.getenv("PATHWAY_API_KEY")

app = Flask(__name__)

# Example company data (for testing)
company_data = {
    "revenue": 300000,
    "expenses": 250000,
    "employees": 5,
    "marketing_budget": 20000,
    "product_price": 500
}

# Thread pool for async LLM calls
executor = ThreadPoolExecutor(max_workers=3)

def execute_pathway_llm(prompt):
    """Execute Pathway LLM in isolated function"""
    try:
        import pathway as pw
        from pathway.xpacks.llm.llms import CohereChat
        import pandas as pd
        import tempfile
        import sys
        import subprocess
        
        print(f"🤖 Executing Pathway LLM...")
        
        # Create a temporary Python script to run Pathway in isolation
        script_content = f'''
import pathway as pw
from pathway.xpacks.llm.llms import CohereChat
import pandas as pd
import sys

# Initialize LLM
api_key = "{PATHWAY_API_KEY}"
llm = CohereChat(api_key=api_key)

# Create table with prompt
df = pd.DataFrame({{'prompt': ["""{prompt}"""]}} )
table = pw.debug.table_from_pandas(df)

# Apply LLM
result_table = table.select(response=llm(pw.this.prompt))

# Compute and print result
pw.debug.compute_and_print(result_table)
'''
        
        # Write to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(script_content)
            temp_file = f.name
        
        try:
            # Execute the script in a subprocess
            result = subprocess.run([
                sys.executable, temp_file
            ], capture_output=True, text=True, timeout=60)
            
            output = result.stdout
            error = result.stderr
            
            print(f"🔍 Subprocess output: {output[:300]}...")
            if error:
                print(f"🔍 Subprocess error: {error[:300]}...")
            
            # Extract response from output
            if output:
                lines = output.strip().split('\\n')
                for line in lines:
                    if '|' in line and 'response' not in line and line.strip() and not line.startswith('|-'):
                        parts = line.split('|')
                        if len(parts) >= 2:
                            response = parts[-1].strip()
                            if response and len(response) > 10:
                                print(f"✅ Extracted: {response[:100]}...")
                                return response
            
            return f"LLM execution completed but no response extracted. Output: {output[:200]}"
            
        finally:
            # Clean up temp file
            import os
            try:
                os.unlink(temp_file)
            except:
                pass
                
    except Exception as e:
        print(f"❌ Pathway LLM Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return f"Pathway LLM Error: {str(e)}"

# Initialize LLM manager
class LLMManager:
    def __init__(self):
        self.llm_available = PATHWAY_API_KEY is not None
        self.lock = threading.Lock()
    
    def get_response(self, prompt):
        if not self.llm_available:
            return None
        
        try:
            return execute_pathway_llm(prompt)
        except Exception as e:
            print(f"LLM Manager Error: {e}")
            return None

llm_manager = LLMManager()

@lru_cache(maxsize=100)
def parse_scenario_cached(scenario_text):
    """Cache parsing results for common scenarios"""
    hires = re.findall(r"hire (\\d+)", scenario_text.lower())
    marketing = re.findall(r"₹([\\d,]+)", scenario_text.replace(",", ""))
    price_change = re.findall(r"(\\d+)%", scenario_text)
    
    hires = int(hires[0]) if hires else 0
    marketing_delta = int(marketing[0]) if marketing else 0
    price_change_pct = float(price_change[0]) / 100 if price_change else 0.0
    
    return hires, marketing_delta, price_change_pct

def calculate_forecast(hires, marketing_delta, price_change_pct):
    """Fast financial calculations"""
    new_revenue = company_data["revenue"] * (1 + price_change_pct)
    new_expenses = company_data["expenses"] + (hires * 50000) + marketing_delta
    new_net = new_revenue - new_expenses
    
    return {
        "baseline": {
            "revenue": company_data["revenue"],
            "expenses": company_data["expenses"],
            "net": company_data["revenue"] - company_data["expenses"]
        },
        "scenario": {
            "revenue": new_revenue,
            "expenses": new_expenses,
            "net": new_net
        }
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/forecast", methods=["POST"])
def forecast():
    start_time = time.time()
    
    data = request.get_json()
    user_scenario = data.get("scenario", "")
    
    # Fast scenario parsing with caching
    hires, marketing_delta, price_change_pct = parse_scenario_cached(user_scenario)
    
    # Fast financial calculations
    insights = calculate_forecast(hires, marketing_delta, price_change_pct)
    
    calc_time = time.time() - start_time
    print(f"⚡ Financial calculations completed in {calc_time:.3f}s")
    
    # Prepare prompt for LLM
    prompt = f"""
User scenario: {user_scenario}
Baseline: Revenue ₹{company_data['revenue']}, Expenses ₹{company_data['expenses']}.
Scenario: Revenue ₹{insights['scenario']['revenue']}, Expenses ₹{insights['scenario']['expenses']}, Net Profit ₹{insights['scenario']['net']}.
Provide a clear summary and actionable recommendations for the user.
"""
    
    # Get LLM response
    llm_start_time = time.time()
    try:
        print("🤖 Starting LLM call...")
        future = executor.submit(llm_manager.get_response, prompt)
        llm_response = future.result(timeout=90)  # 90 second timeout
        llm_time = time.time() - llm_start_time
        
        if llm_response is None:
            return jsonify({
                "error": "LLM not available. Please check API configuration.",
                "insights": insights
            })
        
        print(f"✅ LLM call completed in {llm_time:.2f}s")
        
    except Exception as e:
        llm_time = time.time() - llm_start_time
        print(f"❌ LLM call failed after {llm_time:.2f}s: {e}")
        return jsonify({
            "error": f"LLM call failed: {str(e)}",
            "insights": insights
        })
    
    total_time = time.time() - start_time
    print(f"🎯 Total request time: {total_time:.3f}s")
    
    return jsonify({
        "insights": insights,
        "llm_response": llm_response,
        "performance": {
            "calculation_time": f"{calc_time:.3f}s",
            "total_time": f"{total_time:.3f}s"
        }
    })

@app.route("/health")
def health():
    """Health check endpoint"""
    llm_status = "ready" if llm_manager.llm_available else "unavailable"
    return jsonify({
        "status": "healthy",
        "llm_status": llm_status,
        "timestamp": time.time()
    })

if __name__ == "__main__":
    print("🚀 Starting CFO Helper...")
    print("📊 Financial calculations ready")
    print(f"🤖 LLM status: {'Ready' if llm_manager.llm_available else 'Not configured'}")
    app.run(debug=False, threaded=True)