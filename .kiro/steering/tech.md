# Technology Stack

## Backend Framework
- **Flask**: Python web framework for API endpoints and template rendering
- **Python 3.x**: Core runtime environment

## AI/ML Integration
- **Pathway**: Primary LLM integration framework with xpacks.llm module
- **Cohere**: Chat model integration via CohereChat class
- **OpenAI API**: GPT model integration (configured but not actively used)
- **HuggingFace**: Model integration capability

## Frontend
- **HTML/CSS/JavaScript**: Vanilla web technologies
- **Responsive design**: Grid-based layout with mobile support
- **Real-time updates**: Async fetch API for backend communication

## Data & Configuration
- **python-dotenv**: Environment variable management
- **CSV**: Simple data storage format
- **JSON**: API request/response format

## Development Dependencies
- **pandas**: Data manipulation (used in testing)
- **re**: Regex pattern matching for scenario parsing

## Common Commands

### Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install flask python-dotenv pathway pandas
```

### Running the Application
```bash
# Start Flask development server
python app.py

# Run with debug mode (if needed)
python -c "from app import app; app.run(debug=True)"
```

### Testing & Debugging
```bash
# Test LLM integration
python debug_llm.py

# Test Pathway functionality
python test_pathway_simple.py

# Run specific app variants
python app_optimized.py
python app_pathway_fixed.py
python app_subprocess.py
```

## Environment Variables Required
- `PATHWAY_API_KEY`: Primary API key for Pathway/Cohere integration
- `OPENAI_API_KEY`: OpenAI API access (optional)
- `COHERE_API_KEY`: Direct Cohere API access (optional)
- `HUGGINGFACE_API_KEY`: HuggingFace model access (optional)
- `FLEXPRICE_API_KEY`: Additional service integration