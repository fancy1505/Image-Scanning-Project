# Contributing Guide

## ScanGuard AI – DevSecOps Security Command Center

Thank you for your interest in contributing to ScanGuard AI.

This document provides guidelines for contributing to the project, reporting issues, and submitting improvements.

---

# Table of Contents

- Code of Conduct
- Getting Started
- Development Environment
- Repository Structure
- Branching Strategy
- Coding Standards
- Commit Guidelines
- Pull Request Process
- Issue Reporting
- Documentation Standards
- Testing
- Security Reporting

---

# Code of Conduct

We are committed to providing a welcoming, respectful, and collaborative environment for everyone.

Contributors are expected to:

- Be respectful and professional.
- Provide constructive feedback.
- Focus discussions on improving the project.
- Respect different opinions and approaches.

---

# Getting Started

## 1. Fork the Repository

Create your own copy of the repository.

## 2. Clone

```bash
git clone https://github.com/<your-username>/ScanGuard-AI.git
```

## 3. Create a Branch

```bash
git checkout -b feature/my-feature
```

---

# Development Environment

Before contributing, ensure the following tools are installed:

- Git
- Node.js
- npm
- Python 3.x
- Docker Desktop
- Trivy
- GitLeaks
- Java 17 (for SonarScanner if used locally)

Refer to **INSTALLATION.md** for detailed setup instructions.

---

# Repository Structure

```
ScanGuard-AI/
│
├── dashboard/
├── docs/
├── metrics/
├── monitoring/
├── reports/
├── scripts/
├── shopNow/
├── .github/
├── README.md
├── SECURITY.md
├── API.md
└── ROADMAP.md
```

---

# Branching Strategy

Use descriptive branch names.

Examples:

```
feature/dashboard-improvements
feature/security-enhancement
feature/trivy-upgrade

bugfix/report-parser
bugfix/dashboard-loading

docs/update-readme
docs/security-guide
```

Avoid committing directly to the main branch.

---

# Coding Standards

## Python

- Follow PEP 8
- Use meaningful variable names
- Add comments where logic is complex
- Keep functions focused on a single responsibility

## JavaScript / React

- Use functional components
- Keep components modular
- Use descriptive naming
- Avoid duplicate code

---

# Commit Message Guidelines

Recommended format:

```
type(scope): short description
```

Examples:

```
feat(dashboard): add severity trend chart

fix(metrics): resolve exporter parsing issue

docs(api): update metrics endpoint

refactor(reports): simplify JSON parser
```

Common commit types:

- feat
- fix
- docs
- refactor
- test
- chore

---

# Pull Request Process

Before submitting a Pull Request:

- Verify the project builds successfully.
- Run security scans if applicable.
- Update documentation for user-facing changes.
- Keep changes focused on a single feature or fix.
- Provide a clear description of the purpose of the PR.

---

# Issue Reporting

When reporting an issue, include:

- Operating system
- Tool versions
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error logs (if available)
- Screenshots (if applicable)

---

# Documentation Standards

Documentation should:

- Use clear headings
- Include code examples where useful
- Be technically accurate
- Reflect implemented functionality
- Clearly distinguish future enhancements from current features

---

# Testing Checklist

Before creating a Pull Request, verify:

- Project builds successfully
- Dashboard loads correctly
- Security reports are generated
- Metrics exporter starts successfully
- Prometheus collects metrics
- Grafana dashboard displays data

---

# Security Reporting

If you discover a security issue:

- Do not publish sensitive information publicly.
- Report the issue privately to the project maintainer.
- Include enough information to reproduce the issue.
- Allow time for investigation before public disclosure.

---

# Ways to Contribute

Contributions are welcome in areas such as:

- Dashboard improvements
- Documentation
- Security tool integrations
- Performance optimization
- Bug fixes
- Testing
- UI/UX enhancements
- Monitoring improvements

---

# Acknowledgements

Thank you to everyone who contributes to making ScanGuard AI more secure, reliable, and maintainable.
