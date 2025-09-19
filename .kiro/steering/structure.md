# Project Structure

## Root Directory Layout
```
├── .env                    # Environment variables and API keys
├── .kiro/                  # Kiro IDE configuration and steering rules
├── .venv/                  # Python virtual environment
├── templates/              # Flask HTML templates
│   └── index.html         # Main web interface
├── app.py                 # Primary Flask application
├── llm.py                 # LLM module exploration utility
├── debug_llm.py           # LLM integration debugging
├── test_pathway_simple.py # Pathway framework testing
├── finance.csv            # Sample financial data
└── working.txt            # Development notes/scratch file
```

## Application Variants
The project contains multiple application files representing different implementation approaches:

- **app.py**: Main production application with error handling
- **app_optimized.py**: Performance-optimized version
- **app_pathway_fixed.py**: Pathway integration fixes
- **app_subprocess.py**: Alternative subprocess-based approach

## Key Architectural Patterns

### Flask Application Structure
- Single-file Flask app with route-based organization
- Template rendering for frontend
- JSON API endpoints for data exchange
- Global application state for LLM instances

### Error Handling Strategy
- Graceful degradation when LLM services are unavailable
- Try-catch blocks around external API calls
- Fallback responses when AI models fail
- Multiple method attempts for LLM invocation

### Data Flow
1. User input via web form
2. Regex parsing for scenario extraction
3. Financial calculations using company baseline data
4. LLM prompt generation and API calls
5. Response formatting and frontend display

### Configuration Management
- Environment variables for sensitive API keys
- Hardcoded company data for demo purposes
- Runtime LLM initialization with error handling

## Development Conventions
- Use descriptive variable names (e.g., `new_revenue`, `marketing_delta`)
- Include print statements for debugging LLM initialization
- Maintain multiple app variants for testing different approaches
- Keep financial calculations separate from AI processing