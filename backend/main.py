from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from spleeter.separator import Separator
import os, shutil, uuid, traceback

app = FastAPI(title="Vocal Remover API")

# --------------------
# CORS settings
# --------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Directories
# --------------------
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "output"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --------------------
# Spleeter separator
# --------------------
separator = Separator("spleeter:2stems")  # vocals + accompaniment

# --------------------
# Upload & separate endpoint
# --------------------
@app.post("/separate")
async def separate_audio(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
        output_path = os.path.join(OUTPUT_DIR, file_id)

        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Separate stems
        separator.separate_to_file(input_path, output_path)

        # Detect the folder Spleeter created
        subfolders = [f for f in os.listdir(output_path) if os.path.isdir(os.path.join(output_path, f))]
        if not subfolders:
            return JSONResponse({"error": "Separation failed"}, status_code=500)
        actual_folder = os.path.join(output_path, subfolders[0])

        return JSONResponse({
            "vocals": f"/download/{file_id}/vocals",
            "instrumental": f"/download/{file_id}/instrumental"
        })

    except Exception as e:
        print(traceback.format_exc())
        return JSONResponse({"error": str(e)}, status_code=500)


# --------------------
# Download stems endpoint
# --------------------
@app.get("/download/{file_id}/{stem}")
def download_stem(file_id: str, stem: str):
    stem_map = {
        "vocals": "vocals.wav",
        "instrumental": "accompaniment.wav",
    }

    file_dir = os.path.join(OUTPUT_DIR, file_id)
    if not os.path.exists(file_dir):
        return JSONResponse({"error": "File not found"}, status_code=404)

    subfolders = [f for f in os.listdir(file_dir) if os.path.isdir(os.path.join(file_dir, f))]
    if not subfolders:
        return JSONResponse({"error": "File not found"}, status_code=404)

    actual_folder = os.path.join(file_dir, subfolders[0])
    output_path = os.path.join(actual_folder, stem_map[stem])

    if os.path.exists(output_path):
        return FileResponse(output_path, filename=f"{stem}.wav")
    return JSONResponse({"error": "File not found"}, status_code=404)


# --------------------
# Root test endpoint
# --------------------
@app.get("/")
def home():
    return {"message": "✅ Vocal Remover API is running"}
