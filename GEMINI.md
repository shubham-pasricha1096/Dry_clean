# Project: CleanTrack - Dry Cleaning Order Tracker

This document provides a high-level overview of the CleanTrack application, its architecture, and key development workflows.

## 1. Project Overview

CleanTrack is a full-stack web application designed as a Minimum Viable Product (MVP) for tracking dry-cleaning orders. It features a modern web interface for managing customers and orders, and a backend API to handle business logic and data persistence.

### Architecture & Tech Stack

The project follows a decoupled, two-part architecture:

*   **Frontend:** A Next.js (React) application built with TypeScript and styled with Tailwind CSS. It is responsible for all user interface elements and client-side interactions.
*   **Backend:** An asynchronous API built with Python and the FastAPI framework. It handles all business logic, data validation, and communication with the database.
*   **Database:** MongoDB is used as the data store, accessed from the backend via the `motor` asynchronous driver.

## 2. Getting Started & Development

### Backend

The backend is a Python project.

*   **Setup:**
    1.  Create and activate a Python virtual environment in the `backend` directory.
    2.  Install dependencies: `pip install -r backend/requirements.txt`
    3.  Configure the environment by creating a `.env` file from `.env.example` and filling in your `MONGO_DETAILS` and `TELEGRAM_BOT_TOKEN`.
    4.  Seed the database with initial data: `python backend/seed.py`.

*   **Running:**
    *   To run the development server, execute the following from the `backend` directory:
        ```bash
        uvicorn app.main:app --reload
        ```
    *   The API will be available at `http://localhost:8000`.

### Frontend

The frontend is a Node.js-based project.

*   **Setup:**
    1.  Navigate to the `frontend` directory.
    2.  Install dependencies: `npm install`

*   **Running:**
    *   To run the development server:
        ```bash
        npm run dev
        ```
    *   The application will be available at `http://localhost:3000`.

## 3. Development Conventions

*   **API Versioning:** The backend API is versioned under the `/api/v1` prefix.
*   **Styling:** The frontend uses Tailwind CSS for styling.
*   **Linting:** The frontend uses ESLint for code quality. Run `npm run lint` in the `frontend` directory to check for issues.
*   **Static Files:** The backend serves static files (like QR codes) from the `backend/static` directory.
*   **CORS:** The backend is configured with a permissive CORS policy for development. This should be locked down to the frontend's specific domain in a production environment.
