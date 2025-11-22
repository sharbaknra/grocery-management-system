# Contributing to Grocery Management System

Thank you for your interest in contributing to the Grocery Management System! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/grocery-management-system.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database credentials and JWT secret

3. Set up the database:
   - Run `reset-db.bat` (Windows) or import `database/grocery_db.sql` manually

4. Start the server:
   ```bash
   npm start
   ```

## Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow existing code style and patterns
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

## Testing

- Write tests for new features
- Ensure all existing tests pass
- Test edge cases and error handling
- Run the comprehensive test suite: `node test-backend-comprehensive-final.js`

## Commit Messages

Use clear, descriptive commit messages:
- `Add: feature description` - for new features
- `Fix: bug description` - for bug fixes
- `Update: change description` - for updates
- `Refactor: refactoring description` - for code refactoring
- `Docs: documentation update` - for documentation changes

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Create a clear PR description explaining your changes
6. Reference any related issues

## Questions?

If you have questions, please open an issue with the `question` label.

Thank you for contributing! 🎉

