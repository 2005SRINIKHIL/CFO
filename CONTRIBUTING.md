# Contributing to CFO Helper

Thank you for your interest in contributing to CFO Helper! We welcome contributions from everyone.

## 🤝 How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Include detailed information about the problem
- Provide steps to reproduce the issue
- Include relevant error messages and logs

### Pull Requests
1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🛠 Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/cfo-helper.git
   cd cfo-helper
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

## 📝 Code Style

- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add comments for complex logic
- Write docstrings for functions and classes

## 🧪 Testing

- Test your changes with different scenarios
- Ensure all AI models work correctly
- Check the web interface on different browsers
- Verify API endpoints return expected responses

## 🌟 Areas for Contribution

### High Priority
- **New AI Models**: Add support for additional LLM providers
- **Performance**: Optimize response times and memory usage
- **Testing**: Add unit tests and integration tests
- **Documentation**: Improve API documentation and examples

### Medium Priority
- **UI/UX**: Enhance the frontend interface
- **Features**: Add new financial analysis capabilities
- **Security**: Improve API key handling and validation
- **Monitoring**: Add logging and analytics

### Low Priority
- **Mobile**: Improve mobile responsiveness
- **Themes**: Add dark mode and custom themes
- **Localization**: Support multiple languages
- **Export**: Add PDF/Excel export features

## 🚀 Feature Requests

When requesting new features:
1. Check if the feature already exists
2. Describe the use case clearly
3. Explain the expected behavior
4. Consider implementation complexity

## 🐛 Bug Reports

Include in bug reports:
- Operating system and Python version
- Steps to reproduce the issue
- Expected vs actual behavior
- Error messages and stack traces
- Screenshots if applicable

## 📞 Questions?

- Open a GitHub Discussion for general questions
- Use GitHub Issues for specific bugs or features
- Check existing issues before creating new ones

## 🙏 Recognition

All contributors will be recognized in the project README. Thank you for making CFO Helper better!

---

By contributing, you agree that your contributions will be licensed under the MIT License.