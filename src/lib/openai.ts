interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  cashBurn: number;
  runway: number;
  growthRate: number;
  revenueStreams: Array<{
    name: string;
    amount: number;
    type: string;
  }>;
  teamSize: number;
  companyName?: string;
  industry?: string;
}

interface ReportOptions {
  type: 'executive' | 'detailed';
  includeCharts?: boolean;
  period?: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.openai.com/v1';
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, response.statusText, errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      throw error;
    }
  }

  async generateExecutiveSummary(financialData: FinancialSummary): Promise<string> {
    const prompt = `
You are a senior financial analyst. Generate a concise executive summary for the following company financial data:

Company: ${financialData.companyName || 'Company'}
Industry: ${financialData.industry || 'Technology'}
Team Size: ${financialData.teamSize} employees

Financial Metrics:
- Monthly Revenue: $${financialData.totalRevenue.toLocaleString()}
- Monthly Expenses: $${financialData.totalExpenses.toLocaleString()}
- Cash Burn Rate: $${financialData.cashBurn.toLocaleString()}/month
- Runway: ${financialData.runway} months
- Growth Rate: ${financialData.growthRate}%

Revenue Streams:
${financialData.revenueStreams.map(stream => 
  `- ${stream.name}: $${stream.amount.toLocaleString()} (${stream.type})`
).join('\n')}

Please provide:
1. A 2-3 sentence overall financial health assessment
2. Key strengths and opportunities
3. Top 2-3 recommendations for improvement
4. Risk factors to monitor

Keep it executive-level (high-level insights, not tactical details) and limit to 300 words.
    `;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CFO and financial analyst with 20+ years of experience in startup and growth company finance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || 'Unable to generate executive summary.';
    } catch (error) {
      console.error('Failed to generate executive summary:', error);
      return this.getFallbackExecutiveSummary(financialData);
    }
  }

  async generateDetailedAnalysis(financialData: FinancialSummary): Promise<string> {
    const prompt = `
As a senior financial analyst, provide a detailed financial analysis for this company:

Company: ${financialData.companyName || 'Company'}
Industry: ${financialData.industry || 'Technology'}
Team Size: ${financialData.teamSize} employees

Current Financial Position:
- Monthly Revenue: $${financialData.totalRevenue.toLocaleString()}
- Monthly Expenses: $${financialData.totalExpenses.toLocaleString()}
- Cash Burn Rate: $${financialData.cashBurn.toLocaleString()}/month
- Runway: ${financialData.runway} months
- Growth Rate: ${financialData.growthRate}%

Revenue Breakdown:
${financialData.revenueStreams.map(stream => 
  `- ${stream.name}: $${stream.amount.toLocaleString()} (${stream.type})`
).join('\n')}

Please provide a comprehensive analysis including:

1. **Financial Health Assessment**
   - Current financial position analysis
   - Cash flow trends and sustainability
   - Revenue diversification assessment

2. **Growth Analysis**
   - Revenue growth trajectory evaluation
   - Market position and competitive outlook
   - Scalability assessment

3. **Risk Analysis**
   - Cash flow risks and runway concerns
   - Revenue concentration risks
   - Market and operational risks

4. **Strategic Recommendations**
   - Immediate actions (next 30-90 days)
   - Medium-term strategy (3-12 months)
   - Long-term positioning (1-2 years)

5. **Financial Projections**
   - 6-month outlook based on current trends
   - Best and worst-case scenarios
   - Key metrics to monitor

Provide specific, actionable insights with quantitative backing where possible. Target 800-1000 words.
    `;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CFO and financial analyst specializing in startup and growth company financial analysis. Provide detailed, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      });

      return response.choices[0]?.message?.content || 'Unable to generate detailed analysis.';
    } catch (error) {
      console.error('Failed to generate detailed analysis:', error);
      return this.getFallbackDetailedAnalysis(financialData);
    }
  }

  async generateScenarioAnalysis(
    baselineData: FinancialSummary,
    scenarios: Array<{
      name: string;
      assumptions: string;
      projections: any;
    }>
  ): Promise<string> {
    const prompt = `
Analyze these financial scenarios for ${baselineData.companyName || 'the company'}:

Baseline Financial Data:
- Monthly Revenue: $${baselineData.totalRevenue.toLocaleString()}
- Monthly Expenses: $${baselineData.totalExpenses.toLocaleString()}
- Current Runway: ${baselineData.runway} months

Scenarios to Analyze:
${scenarios.map((scenario, index) => 
  `${index + 1}. ${scenario.name}
     Assumptions: ${scenario.assumptions}
     Key Changes: ${JSON.stringify(scenario.projections, null, 2)}`
).join('\n\n')}

Please provide:
1. Comparative analysis of each scenario vs. baseline
2. Risk assessment for each scenario
3. Recommended scenario ranking with rationale
4. Key decision points and triggers
5. Contingency planning recommendations

Focus on actionable insights for strategic decision-making.
    `;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic financial analyst specializing in scenario planning and risk assessment for growing companies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || 'Unable to generate scenario analysis.';
    } catch (error) {
      console.error('Failed to generate scenario analysis:', error);
      return this.getFallbackScenarioAnalysis(scenarios);
    }
  }

  private getFallbackExecutiveSummary(data: FinancialSummary): string {
    const burnRatio = data.cashBurn / data.totalRevenue;
    const healthStatus = burnRatio < 0.5 ? 'strong' : burnRatio < 0.8 ? 'moderate' : 'concerning';
    
    return `
**Executive Summary**

The company shows ${healthStatus} financial health with ${data.runway} months of runway and ${data.growthRate}% growth rate. 

**Key Strengths:**
- ${data.revenueStreams.length} revenue streams generating $${data.totalRevenue.toLocaleString()} monthly
- ${data.revenueStreams.length > 1 ? 'Diversified revenue portfolio' : 'Focused revenue model'}

**Recommendations:**
1. ${data.runway < 12 ? 'Prioritize fundraising or cost reduction' : 'Focus on sustainable growth'}
2. ${data.growthRate < 10 ? 'Investigate growth acceleration opportunities' : 'Maintain current growth trajectory'}
3. Monitor cash burn and optimize operational efficiency

**Risk Factors:**
- ${data.runway < 6 ? 'Critical runway situation requiring immediate action' : 'Standard cash flow monitoring needed'}
- Market conditions and competitive landscape changes
    `.trim();
  }

  private getFallbackDetailedAnalysis(data: FinancialSummary): string {
    return `
**Detailed Financial Analysis**

**Financial Health Assessment:**
Current monthly revenue of $${data.totalRevenue.toLocaleString()} against expenses of $${data.totalExpenses.toLocaleString()} results in a ${data.runway}-month runway. The company maintains a ${data.growthRate}% growth rate.

**Revenue Analysis:**
${data.revenueStreams.map(stream => 
  `- ${stream.name}: Contributing $${stream.amount.toLocaleString()} (${((stream.amount / data.totalRevenue) * 100).toFixed(1)}% of total revenue)`
).join('\n')}

**Strategic Recommendations:**
1. Cash Flow Management: ${data.runway < 12 ? 'Immediate focus required on extending runway' : 'Maintain current burn rate monitoring'}
2. Growth Strategy: ${data.growthRate < 10 ? 'Explore growth acceleration tactics' : 'Sustain current growth momentum'}
3. Revenue Optimization: Evaluate highest-performing revenue streams for scaling opportunities

**Risk Mitigation:**
- Establish cash flow forecasting and scenario planning
- Develop contingency plans for various market conditions
- Monitor key performance indicators monthly
    `.trim();
  }

  private getFallbackScenarioAnalysis(scenarios: any[]): string {
    return `
**Scenario Analysis Summary**

${scenarios.map((scenario, index) => 
  `**Scenario ${index + 1}: ${scenario.name}**
   - Assumptions: ${scenario.assumptions}
   - Risk Level: Medium
   - Recommendation: Monitor key metrics and adjust strategy as needed`
).join('\n\n')}

**Overall Recommendations:**
1. Diversify scenarios to include best, worst, and most likely cases
2. Establish trigger points for strategy pivots
3. Maintain flexible cost structure for rapid adjustment
4. Regular scenario review and updates based on market conditions
    `.trim();
  }
}

// Singleton instance
let openAIInstance: OpenAIService | null = null;

export const getOpenAIService = (): OpenAIService | null => {
  if (!openAIInstance) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not configured. AI-powered reports will use fallback content.');
      return null;
    }
    
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format. Key should start with "sk-"');
      return null;
    }
    
    openAIInstance = new OpenAIService({ apiKey });
  }
  return openAIInstance;
};

export default OpenAIService;
