import io
import zipfile
import gzip
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import sys
import os

# Add the parent directory to the Python path to find the process_gwas module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from process_gwas.process_gwas import standardize_header

app = FastAPI()

# Allow all origins for simplicity, especially for deployment.
# For production, you might want to restrict this to your frontend's domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_file_content(file: UploadFile):
    """
    Reads the content of an uploaded file, handling different compression types.
    Returns the decoded content as a string and the original filename.
    """
    filename = file.filename
    content = file.file.read()

    try:
        if filename.endswith('.zip'):
            with zipfile.ZipFile(io.BytesIO(content)) as z:
                if not z.namelist():
                    raise ValueError("The provided zip file is empty.")
                # Process the first file in the zip archive
                first_file_name = z.namelist()[0]
                with z.open(first_file_name) as f:
                    # Assuming the file is text-based
                    return f.read().decode('utf-8', errors='ignore'), first_file_name
        elif filename.endswith('.gz'):
            with gzip.GzipFile(fileobj=io.BytesIO(content)) as gz:
                return gz.read().decode('utf-8', errors='ignore'), filename
        else:
            # For .txt, .csv, .tsv
            return content.decode('utf-8', errors='ignore'), filename
    except Exception as e:
        raise ValueError(f"Could not read file {filename}: {e}")


@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Accepts up to 3 files, reads their headers and first 6 rows,
    and returns a standardized header mapping for each.
    """
    if len(files) > 3:
        raise HTTPException(status_code=400, detail="Maximum of 3 files can be uploaded at once.")

    results = []
    for file in files:
        try:
            content, original_filename = read_file_content(file)
            
            # Use a string buffer for pandas
            string_io = io.StringIO(content)
            
            # Read header by getting the columns from an empty chunk
            header = pd.read_csv(io.StringIO(content), sep=None, engine='python', nrows=0).columns.tolist()
            
            # Reset buffer and read the first 6 rows for preview
            string_io.seek(0)
            preview_df = pd.read_csv(string_io, sep=None, engine='python', nrows=6)
            rows = preview_df.values.tolist()

            # Call the header standardization logic
            column_mapping, warnings, errors = standardize_header(header)

            results.append({
                "fileName": original_filename,
                "header": header,
                "rows": rows,
                "column_mapping": column_mapping,
                "warnings": warnings,
                "errors": errors
            })

        except Exception as e:
            results.append({
                "fileName": file.filename,
                "header": [],
                "rows": [],
                "column_mapping": {},
                "warnings": [],
                "errors": [f"Failed to process file: {str(e)}"]
            })

    return results

