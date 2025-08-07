# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend and process_gwas directories into the container
COPY ./backend /app/backend
COPY ./process_gwas /app/process_gwas

# Set the python path to include the root directory
ENV PYTHONPATH="/app"

# Run the app. The --host 0.0.0.0 makes the app accessible from outside the container
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

