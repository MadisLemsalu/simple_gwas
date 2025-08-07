# GWAS File Header Standardization App

This is a full-stack web application designed to standardize the headers of GWAS summary statistic files. It provides a clean, user-friendly interface for researchers to upload their data, preview it, and receive a standardized header mapping based on fuzzy matching.

The application is structured as a monorepo, with separate directories for the frontend and backend, making it easy to develop, manage, and deploy.

## Core Features

- **File Upload**: Supports up to 3 files at once (`.txt`, `.csv`, `.tsv`, `.gz`, `.zip`).
- **Drag & Drop**: Modern drag-and-drop interface for file selection.
- **Data Preview**: Displays the header and the first 6 rows of each uploaded file.
- **Header Standardization**: Automatically maps input column names to a standard set of GWAS headers.
- **Instant Feedback**: Shows mapping scores, warnings for unmapped columns, and errors for missing required columns.
- **Deploy-Ready**: Configured for seamless deployment on Railway.

## Folder Structure

- `frontend/`: A Next.js application that provides the user interface.
- `backend/`: A Python FastAPI application that handles file processing and header standardization.
- `process_gwas/`: A dedicated Python module containing the core GWAS standardization logic, ensuring it is decoupled from the backend API.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer) and npm
- [Python](https://www.python.org/) (v3.8 or newer) and pip

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the backend server**:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the frontend development server**:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

### Testing the API with `curl`

You can send a test file to the backend using the following `curl` command:

```bash
# Replace /path/to/your/gwas_file.txt with the actual file path
curl -X POST -F "files=@/path/to/your/gwas_file.txt" http://127.0.0.1:8000/upload/
```

## Deployment on Railway

This application is optimized for deployment on Railway. Follow these steps to get it live:

1.  **Fork this repository** to your GitHub account.
2.  **Create a new project** on Railway and link it to your forked repository.
3.  **Configure the services**: Railway will detect the `Dockerfile` in the repository root and set it up as the backend service. You will need to add a second service for the frontend.

    -   **Backend Service (`backend`)**:
        -   **Build Method**: `Dockerfile`
        -   **Dockerfile Path**: `./backend/Dockerfile`
        -   **Root Directory**: `.`
        -   Railway should handle the rest automatically. It will expose the service on a public URL.

    -   **Frontend Service (`frontend`)**:
        -   **Build Method**: `Nixpacks` (or `npm`)
        -   **Root Directory**: `./frontend`
        -   **Build Command**: `npm install && npm run build`
        -   **Start Command**: `npm start`
        -   You will need to set the `NEXT_PUBLIC_API_URL` environment variable to the public URL of your backend service provided by Railway.

4.  **Deploy**: Once both services are configured, Railway will automatically build and deploy them.

