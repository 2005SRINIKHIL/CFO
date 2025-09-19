from flask import Flask, request, jsonify, render_template
import os
import re
from dotenv import load_dotenv
from pathway.xpacks.llm.llms import CohereChat  # corrected import

# Load environment variables
load_dotenv()
PATHWAY_API_KEY = os.getenv("PATHWAY_API_KEY")

app = Flask(__name__)

# Example company data (for testing)
company_data = {
  "revenue": 300000,
  "expenses": 250000,
  "employees": 10,
  "marketing_budget": 50000,
  "product_price": 1000
}

# Initialize LLM once at startup with error handling
try:
    llm_model = CohereChat(api_key=PATHWAY_API_KEY)
    print("✓ LLM initialized successfully")
except Exception as e:
    print(f"⚠ LLM initialization failed: {e}")
    llm_model = None

@app.route("/")
def index():
    return render_template("index.html")  # frontend form

@app.route("/forecast", methods=["POST"])
def forecast():
    data = request.get_json()
    user_scenario = data.get("scenario", "")

    # Parse numbers from user scenario
    hires = re.findall(r"hire (\d+)", user_scenario.lower())
    marketing = re.findall(r"₹([\d,]+)", user_scenario.replace(",", ""))
    price_change = re.findall(r"(\d+)%", user_scenario)

    hires = int(hires[0]) if hires else 0
    marketing_delta = int(marketing[0]) if marketing else 0
    price_change_pct = float(price_change[0]) / 100 if price_change else 0.0

    # Compute new forecast
    new_revenue = company_data["revenue"] * (1 + price_change_pct)
    new_expenses = company_data["expenses"] + (hires * 50000) + marketing_delta
    new_net = new_revenue - new_expenses

    insights = {
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

    # Prepare prompt for LLM
    prompt = f"""
User scenario: {user_scenario}
Baseline: Revenue ₹{company_data['revenue']}, Expenses ₹{company_data['expenses']}.
Scenario: Revenue ₹{new_revenue}, Expenses ₹{new_expenses}, Net Profit ₹{new_net}.
Provide a clear summary and actionable recommendations for the user.
"""

    # Use the pre-initialized LLM instance with proper error handling
    try:
        if llm_model is None:
            llm_response = f"AI analysis unavailable. Financial impact: Revenue ₹{new_revenue:.0f}, Expenses ₹{new_expenses:.0f}, Net Profit ₹{new_net:.0f}"
        else:
            # Try different possible method names for CohereChat
            if hasattr(llm_model, '__call__'):
                llm_response = llm_model(prompt)
            elif hasattr(llm_model, 'invoke'):
                llm_response = llm_model.invoke(prompt)
            elif hasattr(llm_model, 'generate'):
                llm_response = llm_model.generate(prompt)
            elif hasattr(llm_model, 'complete'):
                llm_response = llm_model.complete(prompt)
            else:
                llm_response = "LLM service temporarily unavailable. Based on the numbers: Revenue changed to ₹{:.0f}, Expenses to ₹{:.0f}, resulting in net profit of ₹{:.0f}.".format(new_revenue, new_expenses, new_net)
    except Exception as e:
        print(f"LLM Error: {e}")
        llm_response = f"AI analysis unavailable. Financial impact: Net profit changed to ₹{new_net:.0f}"

    return jsonify({
        "insights": insights,
        "llm_response": llm_response
    })

if __name__ == "__main__":
    app.run(debug=False)  # use False to avoid Flask reloads in dev mode
