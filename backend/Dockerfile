# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file from the root into the container
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the application code from the backend and process_gwas directories
COPY ./backend /app/backend
COPY ./process_gwas /app/process_gwas

# Set the python path to include the root directory so modules can be found
ENV PYTHONPATH="/app"

# Expose the port the app runs on
EXPOSE 8000

# Run the app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
