# CleanTrack

CleanTrack is a simple, clean, and practical MVP for a dry-cleaning order tracking app.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.9+ and pip
- A running MongoDB instance

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory by copying the example:
    ```bash
    cp .env.example .env
    ```
    Update the `MONGO_DETAILS` in the `.env` file with your MongoDB connection string if it's different from the default. You will also need to add your `TELEGRAM_BOT_TOKEN`.

5.  **Seed the database:**

    Run the seed script to populate the database with initial data (services and an admin user).
    ```bash
    python seed.py
    ```
    The default admin user is:
    - **Email:** `admin@example.com`
    - **Password:** `password`

6.  **Run the backend server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will be running at `http://localhost:8000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

## Application Usage

-   Open your browser and go to `http://localhost:3000/login`.
-   Log in with the admin credentials provided above.
-   You will be redirected to the dashboard.
-   From there you can create new orders and view existing ones.

## Next Steps

-   **QR Code Scanning:** Implement a proper QR code scanning feature using a library like `react-qr-reader`.
-   **Telegram Notifications:** Set up a Telegram bot and integrate its API to send notifications when an order's status changes.
-   **Full CRUD for Users and Services:** Implement the remaining CRUD operations for managing users and services.
-   **Testing:** Add unit and integration tests for both the frontend and backend.
-   **Deployment:** Prepare the application for production deployment.
