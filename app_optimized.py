from flask import Flask, request, jsonify, render_template
import os
import re
import time
from dotenv import load_dotenv
import pathway as pw
from pathway.xpacks.llm.llms import CohereChat
from functools import lru_cache
import threading
from concurrent.futures import ThreadPoolExecutor
import asyncio
import pandas as pd
import json
import os
import re
import time
from dotenv import load_dotenv
from pathway.xpacks.llm.llms import CohereChat
from functools import lru_cache
import threading
from concurrent.futures import ThreadPoolExecutor
import asyncio

# Load environment variables
load_dotenv()
PATHWAY_API_KEY = os.getenv("PATHWAY_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

app = Flask(__name__)

# Example company data (for testing)
company_data = {
  "revenue": 300000,
  "expenses": 250000,
  "employees": 10,
  "marketing_budget": 50000,
  "product_price": 1000
}

# Thread pool for async LLM calls
executor = ThreadPoolExecutor(max_workers=3)

def get_llm_response_sync(prompt, model_name="all"):
    """Use multiple Pathway LLM models and return responses from all available models"""
    results = {}
    
    # Define available models with their configurations
    models_config = {
        "OpenAI": {
            "class": "OpenAIChat",
            "api_key": OPENAI_API_KEY,
            "model": "gpt-3.5-turbo"
        },
        "Cohere": {
            "class": "CohereChat", 
            "api_key": COHERE_API_KEY,
            "model": "command"
        },
        "HuggingFace": {
            "class": "HFPipelineChat",
            "api_key": HUGGINGFACE_API_KEY,
            "model": "microsoft/DialoGPT-medium"
        },
        "LiteLLM": {
            "class": "LiteLLMChat",
            "api_key": OPENAI_API_KEY,  # Can use OpenAI key for LiteLLM
            "model": "gpt-3.5-turbo"
        }
    }
    
    if model_name != "all" and model_name in models_config:
        models_to_test = {model_name: models_config[model_name]}
    else:
        models_to_test = models_config
    
    for model_name, config in models_to_test.items():
        try:
            start_time = time.time()
            print(f"🤖 Testing {model_name} model...")
            
            # Skip if no API key available
            if not config["api_key"]:
                results[model_name] = {
                    "response": f"❌ No API key configured for {model_name}",
                    "time": 0,
                    "status": "error"
                }
                continue
            
            response = execute_pathway_llm_subprocess(prompt, config)
            execution_time = time.time() - start_time
            
            results[model_name] = {
                "response": response,
                "time": execution_time,
                "status": "success" if not response.startswith("Pathway execution failed") else "error"
            }
            
        except Exception as e:
            print(f"❌ {model_name} Error: {str(e)}")
            results[model_name] = {
                "response": f"Error: {str(e)}",
                "time": 0,
                "status": "error"
            }
    
    return results

def execute_pathway_llm_subprocess(prompt, model_config):
    """Execute Pathway LLM in subprocess with specified model configuration"""
    try:
        import tempfile
        import subprocess
        import sys
        
        # Create the script content safely
        escaped_prompt = prompt.replace('"', '\\"').replace('\n', '\\n')
        
        # Generate the appropriate import and initialization based on model type
        if model_config["class"] == "HFPipelineChat":
            # For HuggingFace, we might not need an API key for local models
            init_code = f'''
from pathway.xpacks.llm.llms import HFPipelineChat
llm = HFPipelineChat(model="{model_config["model"]}")
'''
        elif model_config["class"] == "LiteLLMChat":
            init_code = f'''
from pathway.xpacks.llm.llms import LiteLLMChat
llm = LiteLLMChat(model="{model_config["model"]}", api_key="{model_config["api_key"]}")
'''
        else:
            # For OpenAI and Cohere
            init_code = f'''
from pathway.xpacks.llm.llms import {model_config["class"]}
llm = {model_config["class"]}(api_key="{model_config["api_key"]}")
'''
        
        script_content = f'''
import pathway as pw
{init_code}

# Create input table with proper message format
messages = [
    {{"role": "user", "content": """{escaped_prompt}"""}}
]

input_data = pw.debug.table_from_pandas(
    __import__("pandas").DataFrame({{"messages": [messages]}})
)

# Apply LLM with proper message format
responses = input_data.select(
    response=llm(pw.this.messages)
)

# Compute and print results
pw.debug.compute_and_print(responses)
'''
        
        # Write script to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(script_content)
            temp_script = f.name
        
        try:
            # Run the script in subprocess to isolate Pathway execution
            print(f"🔍 Executing {model_config['class']} in subprocess...")
            result = subprocess.run(
                [sys.executable, temp_script],
                capture_output=True,
                text=True,
                timeout=120,  # 2 minute timeout
                cwd=os.path.dirname(os.path.abspath(__file__))
            )
            
            stdout = result.stdout
            stderr = result.stderr
            
            if result.returncode == 0 and stdout:
                # Extract the LLM response from the table output
                lines = stdout.strip().split('\n')
                for line in lines:
                    # Look for table rows with response data
                    if '|' in line and 'response' not in line and line.strip() and not line.startswith('|-'):
                        parts = line.split('|')
                        if len(parts) >= 2:
                            response = parts[-1].strip()
                            # Check if this looks like an actual response
                            if response and len(response) > 10 and 'query' not in response.lower():
                                return response
                
                # If no response found in table, return the full output
                return f"Model executed successfully. Output: {stdout.strip()[:500]}..."
            else:
                error_msg = f"Execution failed. Return code: {result.returncode}"
                if stderr:
                    error_msg += f". Error: {stderr[:500]}..."
                return error_msg
                
        finally:
            # Clean up temp file
            try:
                os.unlink(temp_script)
            except:
                pass
        
    except Exception as e:
        print(f"❌ Subprocess execution error: {str(e)}")
        import traceback
        traceback.print_exc()
        return f"Subprocess Error: {str(e)}"

# Initialize LLM with lazy loading and connection pooling
class MultiModelLLMManager:
    def __init__(self):
        self.models = {}
        self.initialization_attempted = {}
        self.lock = threading.Lock()
    
    def get_available_models(self):
        """Get list of models that have API keys configured"""
        available = []
        if OPENAI_API_KEY:
            available.append("OpenAI")
        if COHERE_API_KEY:
            available.append("Cohere") 
        if HUGGINGFACE_API_KEY:
            available.append("HuggingFace")
        # LiteLLM can use OpenAI key
        if OPENAI_API_KEY:
            available.append("LiteLLM")
        
        # Always include HuggingFace as it can work with local models
        if "HuggingFace" not in available:
            available.append("HuggingFace")
            
        return available
    
    def initialize_models(self):
        """Initialize all available models"""
        try:
            print("🔄 Initializing multiple LLM models...")
            start_time = time.time()
            
            available_models = self.get_available_models()
            print(f"📋 Available models: {', '.join(available_models)}")
            
            for model_name in available_models:
                try:
                    # We'll initialize them lazily when needed
                    self.initialization_attempted[model_name] = False
                    print(f"✓ {model_name} ready for initialization")
                except Exception as e:
                    print(f"⚠ {model_name} setup failed: {e}")
            
            init_time = time.time() - start_time
            print(f"✓ Multi-model LLM manager ready in {init_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"⚠ Multi-model LLM initialization failed: {e}")
            import traceback
            traceback.print_exc()
            return False

llm_manager = MultiModelLLMManager()

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
    
    # Initialize LLM manager
    if not llm_manager.initialize_models():
        print("⚠ LLM initialization failed, continuing without AI analysis")
        return jsonify({
            "insights": {
                **insights,
                "timing": {"calculation_time": calc_time}
            },
            "llm_responses": {"Error": {"response": "LLM initialization failed", "time": 0, "status": "error"}}
        })
    
    # Prepare prompt for LLM
    prompt = f"""As a financial advisor, analyze this business scenario:

Current Situation:
- Revenue: ₹{company_data['revenue']:,}
- Expenses: ₹{company_data['expenses']:,}
- Net Profit: ₹{company_data['revenue'] - company_data['expenses']:,}

Proposed Changes: {user_scenario}

New Projections:
- Revenue: ₹{insights['scenario']['revenue']:,}
- Expenses: ₹{insights['scenario']['expenses']:,}
- Net Profit: ₹{insights['scenario']['net']:,}

Please provide:
1. Brief analysis of the financial impact
2. 2-3 specific recommendations
3. Any risks or opportunities to consider

Keep response concise and actionable."""
    
    # Get responses from all available models
    llm_start_time = time.time()
    try:
        print("🤖 Starting multi-model LLM analysis...")
        future = executor.submit(get_llm_response_sync, prompt, "all")
        llm_responses = future.result(timeout=180)  # 3 minute timeout for all models
        llm_time = time.time() - llm_start_time
        print(f"✅ Multi-model LLM analysis completed in {llm_time:.2f}s")
    except Exception as e:
        llm_time = time.time() - llm_start_time
        print(f"❌ Multi-model LLM analysis failed after {llm_time:.2f}s: {e}")
        llm_responses = {"Error": {"response": f"Multi-model analysis failed: {str(e)}", "time": llm_time, "status": "error"}}
    
    total_time = time.time() - start_time
    print(f"🎯 Total request time: {total_time:.3f}s")
    
    return jsonify({
        "insights": {
            **insights,
            "timing": {"calculation_time": calc_time, "total_time": total_time}
        },
        "llm_responses": llm_responses,
        "performance": {
            "calculation_time": f"{calc_time:.3f}s",
            "llm_time": f"{llm_time:.2f}s",
            "total_time": f"{total_time:.3f}s"
        }
    })

@app.route("/health")
def health():
    """Health check endpoint"""
    available_models = llm_manager.get_available_models()
    return jsonify({
        "status": "healthy",
        "available_models": available_models,
        "total_models": len(available_models),
        "timestamp": time.time()
    })

@app.route("/debug")
def debug():
    """Debug endpoint to understand available models"""
    available_models = llm_manager.get_available_models()
    api_keys_status = {
        "OPENAI_API_KEY": "✓ Set" if OPENAI_API_KEY else "❌ Missing",
        "COHERE_API_KEY": "✓ Set" if COHERE_API_KEY else "❌ Missing", 
        "HUGGINGFACE_API_KEY": "✓ Set" if HUGGINGFACE_API_KEY else "❌ Missing",
        "PATHWAY_API_KEY": "✓ Set" if PATHWAY_API_KEY else "❌ Missing"
    }
    
    return jsonify({
        "available_models": available_models,
        "api_keys_status": api_keys_status,
        "models_config": {
            "OpenAI": "GPT-3.5-turbo via OpenAI API",
            "Cohere": "Command via Cohere API", 
            "HuggingFace": "Local/Cloud models via HuggingFace",
            "LiteLLM": "Universal interface (using OpenAI key)"
        }
    })

if __name__ == "__main__":
    print("🚀 Starting CFO Helper...")
    print("📊 Financial calculations ready")
    print("🤖 LLM will initialize on first use")
    app.run(debug=False, threaded=True)