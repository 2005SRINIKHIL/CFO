# 🏢 CFO Helper - Multi-Model AI Financial Analysis

> **AI-powered financial scenario analysis with multiple language models providing comprehensive business insights**

![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Model Comparison](#model-comparison)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CFO Helper is an intelligent financial analysis tool that leverages multiple AI models to provide comprehensive business scenario analysis. Input your business scenarios (hiring, marketing spend, pricing changes) and get instant financial projections plus insights from multiple AI models including OpenAI GPT, HuggingFace models, and more.

### 🌟 Key Highlights

- **Multi-Model AI Analysis**: Compare insights from OpenAI, HuggingFace, Cohere, and LiteLLM
- **Real-time Financial Calculations**: Instant revenue, expense, and profit projections
- **Beautiful Modern UI**: Responsive design with gradient themes and animations
- **Performance Optimized**: Parallel model execution with caching and async processing
- **Production Ready**: Comprehensive error handling, health checks, and monitoring

## ✨ Features

### 🤖 AI Models Supported
- **OpenAI GPT-3.5/4** - Advanced reasoning and business analysis
- **HuggingFace Models** - Local and cloud-based transformers
- **Cohere Command** - Enterprise-grade language understanding
- **LiteLLM** - Universal interface for multiple providers

### 💰 Financial Analysis
- **Scenario Modeling**: Hiring, marketing spend, pricing changes
- **Real-time Calculations**: Revenue, expenses, net profit projections
- **Performance Metrics**: Execution timing and optimization stats
- **Caching System**: Fast response times for repeated queries

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading Animations**: Real-time progress indicators
- **Model Comparison**: Side-by-side AI response analysis
- **Performance Dashboard**: Timing and status for each model

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python 3.8+, Flask 2.0+ |
| **AI Framework** | Pathway LLM, Transformers |
| **AI Models** | OpenAI API, HuggingFace, Cohere, LiteLLM |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Data Processing** | Pandas, NumPy |
| **Async Processing** | ThreadPoolExecutor, asyncio |
| **Environment** | python-dotenv, virtual environments |

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cfo-helper.git
   cd cfo-helper
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Run the application**
   ```bash
   python app_optimized.py
   ```

6. **Open your browser**
   ```
   http://127.0.0.1:5000
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI Model API Keys
OPENAI_API_KEY=your_openai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Pathway API Key
PATHWAY_API_KEY=your_pathway_api_key_here

# Optional: Other services
FLEXPRICE_API_KEY=your_flexprice_api_key_here
```

### API Key Setup

| Provider | Required | Purpose | Get Key |
|----------|----------|---------|---------|
| **OpenAI** | Recommended | GPT models, LiteLLM | [OpenAI Platform](https://platform.openai.com/) |
| **HuggingFace** | Optional | Local/cloud models | [HuggingFace](https://huggingface.co/settings/tokens) |
| **Cohere** | Optional | Command models | [Cohere Dashboard](https://dashboard.cohere.ai/) |

> **Note**: The application gracefully handles missing API keys and will use available models only.

## 📖 Usage

### Basic Scenario Analysis

1. **Enter your business scenario** in the text area:
   ```
   If I hire 3 more engineers and spend ₹60,000 extra on marketing and raise product price by 20%, what happens?
   ```

2. **Click "Analyze with All AI Models"** to get:
   - Instant financial calculations
   - AI insights from multiple models
   - Performance metrics and timing

3. **Compare model responses** side-by-side:
   - Each model provides unique perspectives
   - Status indicators show success/failure
   - Response times help evaluate performance

### Advanced Usage

- **Health Check**: Visit `/health` for system status
- **Debug Info**: Visit `/debug` for model configuration
- **Custom Scenarios**: Mix and match hiring, marketing, pricing changes

## 🔌 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application interface |
| `/forecast` | POST | Financial scenario analysis |
| `/health` | GET | System health and model status |
| `/debug` | GET | Development and debugging info |

### Example API Usage

```bash
# Forecast Analysis
curl -X POST http://localhost:5000/forecast \
  -H "Content-Type: application/json" \
  -d '{"scenario": "hire 2 engineers, spend 50000 on marketing"}'

# Health Check
curl http://localhost:5000/health
```

### Response Format

```json
{
  "insights": {
    "scenario": {
      "revenue": 360000,
      "expenses": 460000,
      "net": -100000
    },
    "timing": {
      "calculation_time": 0.001,
      "total_time": 15.234
    }
  },
  "llm_responses": {
    "OpenAI": {
      "response": "Based on the analysis...",
      "time": 2.45,
      "status": "success"
    },
    "HuggingFace": {
      "response": "The financial impact...",
      "time": 8.12,
      "status": "success"
    }
  }
}
```

## 🤖 Model Comparison

| Model | Strengths | Use Case | Response Time |
|-------|-----------|----------|---------------|
| **OpenAI GPT** | Advanced reasoning, business context | Strategic analysis, detailed recommendations | ~2-5s |
| **HuggingFace** | Local execution, customizable | Privacy-focused, offline scenarios | ~5-15s |
| **Cohere** | Enterprise features, reliability | Professional analysis, compliance | ~3-8s |
| **LiteLLM** | Universal interface, fallback | Multi-provider redundancy | ~2-6s |

## 📷 Screenshots

### Main Interface
![Main Interface](docs/images/main-interface.png)

### Multi-Model Results
![Multi-Model Results](docs/images/multi-model-results.png)

### Performance Dashboard
![Performance Dashboard](docs/images/performance-dashboard.png)

## 📁 Project Structure

```
cfo-helper/
├── app_optimized.py          # Main Flask application
├── llm.py                    # LLM testing utilities
├── finance.csv               # Sample financial data
├── working.txt              # Development notes
├── templates/
│   └── index.html           # Frontend interface
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🔧 Development

### Setting up Development Environment

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Code formatting
black app_optimized.py
isort app_optimized.py

# Linting
flake8 app_optimized.py
```

### Adding New Models

1. Update `models_config` in `app_optimized.py`
2. Add model-specific initialization logic
3. Update frontend icons and styling
4. Test with sample scenarios

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pathway AI** for the excellent LLM framework
- **OpenAI** for GPT model access
- **HuggingFace** for transformer models and infrastructure
- **Cohere** for enterprise-grade language models
- **Flask** community for the lightweight web framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/cfo-helper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cfo-helper/discussions)
- **Email**: support@cfo-helper.com

---

**Built with ❤️ for the finance and AI community**

⭐ **Star this repo** if you find it useful!