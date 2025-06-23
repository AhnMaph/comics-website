# CNA Platform

A full-featured website for Comics, Novels, and Audio Books.

---

## Features
- 📚 Comics (manga-style graphic stories)
- 📖 Novels (text-based stories)
- 🎧 Audio Books (listen to narrated stories)
- 👤 User accounts with VIP membership and premium content

---

## Project Structure
```
├── backend/      # Django backend
├── frontend/     # React/TypeScript frontend
├── docker-compose.yml
├── Makefile      # Automation for local & Docker workflows
└── README.md
```

---

## 1. Environment Setup

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) (recommended)
- Or: Python 3.8+, Node.js 18+, npm 9+ (for local development)

### Clone the Repository
```bash
git clone https://github.com/AhnMaph/comics-website.git
cd comics-website
```

### Environment Variables

#### a. Local demo

Create a `.env` file in the backend directory for a local demo with at least:
```
SUPERUSER_USERNAME=your_username
SUPERUSER_EMAIL=your_email
SUPERUSER_PASSWORD=your_password
```

Create a `.env` file in the frontend directory for a local demo with at least:
```
VITE_ADMIN_URL=http://localhost:8000
VITE_FRONTEND_URL=http://localhost:5174
```
#### b. Docker demo

Add a another `.env` file in the project root (for Docker) with at least:
```
SUPERUSER_USERNAME=your_username
SUPERUSER_EMAIL=your_email
SUPERUSER_PASSWORD=your_password
VITE_ADMIN_URL=http://localhost:8000
VITE_FRONTEND_URL=http://localhost:5174
```
---

## 2. Usage with Makefile

All common tasks are automated via the `Makefile`. Run `make help` to see all commands.

### Local Development (without Docker)
- **Start backend:**
  ```bash
  make run-backend
  ```
  Runs Django at http://127.0.0.1:8000/
- **Start frontend:**
  ```bash
  make run-frontend
  ```
  Runs React app at http://127.0.0.1:5174/
- **Migrate database:**
  ```bash
  make migrate
  ```
- **Create migrations:**
  ```bash
  make makemigrations
  ```
- **Add demo data:**
  ```bash
  make add-demo-data
  ```

> **Note:** For local dev, install dependencies first:
> - Backend: `pip install -r backend/requirements.txt`
> - Frontend: `cd frontend && npm install`

### Docker-based Development
- **Start all services (build if needed):**
  ```bash
  make up
  ```
- **Stop and remove containers/volumes:**
  ```bash
  make down
  ```
- **Restart services:**
  ```bash
  make restart
  ```
- **View logs:**
  ```bash
  make logs
  ```
- **Open shell in backend container:**
  ```bash
  make shell-backend
  ```
- **Open shell in frontend container:**
  ```bash
  make shell-frontend
  ```
- **Clean up everything:**
  ```bash
  make clean
  ```
- **Rebuild everything:**
  ```bash
  make rebuild
  ```

---

## 3. Accessing the Website
- **Backend:** http://127.0.0.1:8000/
- **Frontend:** http://127.0.0.1:5174/

---

## 4. Troubleshooting
- Use `make logs` to check logs.
- Use `make clean-port` if ports 8000/5174 are in use.
- Use `make prune` to remove all unused Docker data.

---

## 5. Additional Notes
- For more commands, run `make help`.
- Ensure your `.env` file is set up for admin creation.
- For production, review Docker and environment settings.

---

Happy reading and listening!




