# VerdexAI

![CI](https://github.com/ehte-01/VerdexAI/actions/workflows/ci.yml/badge.svg)

AI-powered legal assistant for Indian citizens: situation analysis, document analysis, document drafting, NGO and court locator, and a whistleblower mode.

**Live:** https://52-62-165-165.sslip.io

## Stack
- Backend: Spring Boot 3 (Java 21), Spring Data JPA, PostgreSQL, Redis (rate limiting), Groq LLM API
- Frontend: Next.js (static export), Tailwind CSS
- Infrastructure: AWS EC2 (Docker Compose), Caddy (automatic HTTPS), S3 backups via an IAM instance role, CloudWatch alarms with SNS email alerts
- Delivery: GitHub Actions CI (backend build, frontend build, compose validation). The server pulls `main` and redeploys automatically.

## Run locally
1. `cd Verdex-Frontend-Fixed`
2. Copy `.env.example` to `.env` and fill in the values
3. `docker compose up --build`