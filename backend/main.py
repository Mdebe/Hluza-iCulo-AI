from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from spleeter.separator import Separator
import os, shutil, uuid, traceback, time, threading

app = FastAPI(title="Vocal Remover API - 4 Stems")

# --------------------
# CORS
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
# Spleeter (4 stems)
# --------------------
separator = Separator("spleeter:4stems")

# --------------------
# Cleanup
# --------------------
CLEANUP_AGE = 1200  # 20 mins

def cleanup_old_files():
    while True:
        now = time.time()
        for folder in os.listdir(OUTPUT_DIR):
            folder_path = os.path.join(OUTPUT_DIR, folder)
            if os.path.isdir(folder_path):
                if now - os.path.getmtime(folder_path) > CLEANUP_AGE:
                    shutil.rmtree(folder_path, ignore_errors=True)

        for file in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, file)
            if os.path.isfile(file_path):
                if now - os.path.getmtime(file_path) > CLEANUP_AGE:
                    os.remove(file_path)

        time.sleep(300)

threading.Thread(target=cleanup_old_files, daemon=True).start()

# --------------------
# Upload & Separate
# --------------------
@app.post("/separate")
async def separate_audio(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
        output_path = os.path.join(OUTPUT_DIR, file_id)

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        separator.separate_to_file(input_path, output_path)

        subfolders = [
            f for f in os.listdir(output_path)
            if os.path.isdir(os.path.join(output_path, f))
        ]
        if not subfolders:
            return JSONResponse({"error": "Separation failed"}, status_code=500)

        return JSONResponse({
            "vocals": f"/download/{file_id}/vocals",
            "drums": f"/download/{file_id}/drums",
            "bass": f"/download/{file_id}/bass",
            "other": f"/download/{file_id}/other",
        })

    except Exception as e:
        print(traceback.format_exc())
        return JSONResponse({"error": str(e)}, status_code=500)

# --------------------
# Download / Stream stems (WaveSurfer FIX)
# --------------------
@app.get("/download/{file_id}/{stem}")
def download_stem(file_id: str, stem: str):
    stem_map = {
        "vocals": "vocals.wav",
        "drums": "drums.wav",
        "bass": "bass.wav",
        "other": "other.wav",
    }

    file_dir = os.path.join(OUTPUT_DIR, file_id)
    if not os.path.exists(file_dir):
        return JSONResponse({"error": "File not found"}, status_code=404)

    subfolders = [
        f for f in os.listdir(file_dir)
        if os.path.isdir(os.path.join(file_dir, f))
    ]
    if not subfolders:
        return JSONResponse({"error": "File not found"}, status_code=404)

    actual_folder = os.path.join(file_dir, subfolders[0])
    filename = stem_map.get(stem)

    if not filename:
        return JSONResponse({"error": "Invalid stem"}, status_code=400)

    output_path = os.path.join(actual_folder, filename)
    if not os.path.exists(output_path):
        return JSONResponse({"error": "File not found"}, status_code=404)

    return FileResponse(
        output_path,
        media_type="audio/wav",
        filename=filename,
        headers={
            "Accept-Ranges": "bytes"
        }
    )

# --------------------
# Root
# --------------------
@app.get("/")
def home():
    return {"message": "🎶 Spleeter API Running (4 stems)"}