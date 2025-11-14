# Hluza-iCulo-AI 🎵🎤

**Hluza-iCulo-AI** is a vocal separation project built with **Python (Spleeter)**.  
It allows you to split audio tracks into **vocals** and **accompaniment** using AI models. The project includes a **frontend** and a **backend**.

---

## 🗂 Project Structure

Hluza-iCulo-AI/
│
├── frontend/ # Frontend code (React Native / Flutter)
├── backend/ # Backend code (Python + Spleeter)
│ ├── Vocal_splitter/ # Vocal separation scripts
│ └── main.py # Backend entry point
├── .gitignore # Ignored files
└── README.md

yaml
Copy code

---

## ⚙️ Installation (Backend)

1. **Clone the repository**
```bash
git clone https://github.com/Mdebe/Hluza-iCulo-AI.git
cd Hluza-iCulo-AI/backend
Create a Python virtual environment

bash
Copy code
python -m venv venv
Activate the virtual environment

Windows:

bash
Copy code
venv\Scripts\activate
macOS/Linux:

bash
Copy code
source venv/bin/activate
Upgrade pip

bash
Copy code
pip install --upgrade pip setuptools wheel
Install dependencies

bash
Copy code
pip install spleeter flask
Run the backend

bash
Copy code
python main.py
On first run, Spleeter will automatically download the required models (~50 MB) to ~/.cache/spleeter/.

🏗 Usage
Upload an audio file (supported formats: .mp3, .wav) via the backend endpoint or frontend UI.

The backend will process the file and separate it into:

vocals/ folder

accompaniment/ folder

Access the separated audio files from the output folder.

❗ Notes
Do NOT commit the venv/ or Spleeter model cache — they are large and should stay local.

Backend works with Python 3.9–3.10.

Keep audio files under ~100MB for faster processing.

📁 Recommended .gitignore
bash
Copy code
# Python
venv/
__pycache__/
*.pyc

# Spleeter model cache
.cache/
spleeter/

# Node / Flutter
node_modules/
.build/
.dart_tool/

# Common
.env
.DS_Store
🌐 Frontend
Frontend code is located in frontend/.
Follow the usual framework instructions to install dependencies and run the frontend.

💡 Credits
Spleeter by Deezer for AI-based vocal separation

Built and maintained by Mdebe
