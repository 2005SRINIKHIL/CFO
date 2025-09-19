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

def try_pathway_llm():
    """Try to create and test Pathway LLM with proper execution"""
    try:
        import pathway as pw
        from pathway.xpacks.llm.llms import CohereChat
        
        print("🔄 Attempting Pathway LLM setup...")
        
        # Create a simple pathway table for LLM execution
        class InputSchema(pw.Schema):
            prompt: str
        
        # Create LLM model
        llm_model = CohereChat(api_key=PATHWAY_API_KEY)
        
        def get_llm_response(prompt_text):
            # Create a pathway table with the prompt
            input_table = pw.debug.table_from_markdown(f"""
            | prompt
            | {prompt_text}
            """).select(prompt=pw.this.prompt)
            
            # Apply LLM to the table
            result_table = input_table.select(response=llm_model(pw.this.prompt))
            
            # Run the computation and get result
            result = pw.debug.compute_and_print(result_table)
            return result
            
        return get_llm_response
        
    except Exception as e:
        print(f"❌ Pathway LLM setup failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def simple_cohere_api():
    """Fallback to direct Cohere API if Pathway doesn't work"""
    try:
        import cohere
        co = cohere.Client(PATHWAY_API_KEY)
        
        def get_response(prompt):
            response = co.generate(
                model='command-xlarge-nightly',
                prompt=prompt,
                max_tokens=500,
                temperature=0.7
            )
            return response.generations[0].text.strip()
        
        print("✅ Direct Cohere API initialized")
        return get_response
        
    except Exception as e:
        print(f"❌ Direct Cohere API failed: {e}")
        return None

# Try to initialize LLM
print("🚀 Initializing LLM...")
llm_function = try_pathway_llm()

if llm_function is None:
    print("🔄 Trying direct Cohere API...")
    llm_function = simple_cohere_api()

if llm_function is None:
    print("❌ All LLM methods failed")
else:
    print("✅ LLM ready")

@lru_cache(maxsize=100)
def parse_scenario_cached(scenario_text):
    """Cache parsing results for common scenarios"""
    hires = re.findall(r"hire (\d+)", scenario_text.lower())
    marketing = re.findall(r"₹([\d,]+)", scenario_text.replace(",", ""))
    price_change = re.findall(r"(\d+)%", scenario_text)
    
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
    if llm_function is None:
        return jsonify({
            "error": "LLM not available. Please check API configuration.",
            "insights": insights
        })
    
    llm_start_time = time.time()
    try:
        print("🤖 Starting LLM call...")
        future = executor.submit(llm_function, prompt)
        llm_response = future.result(timeout=60)
        llm_time = time.time() - llm_start_time
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
    llm_status = "ready" if llm_function is not None else "unavailable"
    return jsonify({
        "status": "healthy",
        "llm_status": llm_status,
        "timestamp": time.time()
    })

if __name__ == "__main__":
    print("🚀 Starting CFO Helper...")
    print("📊 Financial calculations ready")
    app.run(debug=False, threaded=True)