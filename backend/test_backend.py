import requests

# Change this to your local backend URL
BASE_URL = "http://127.0.0.1:8000"

# Path to your audio file
AUDIO_FILE = "local path for audio to test "


def test_vocal_remover():
    # Upload file
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": f}
        response = requests.post(f"{BASE_URL}/separate", files=files)

    if response.status_code == 200:
        data = response.json()
        print("Separation successful!")
        print("Vocals URL:", data["vocals"])
        print("Instrumental URL:", data["instrumental"])

        # Download vocals
        vocals_resp = requests.get(f"{BASE_URL}{data['vocals']}")
        with open("vocals.wav", "wb") as vf:
            vf.write(vocals_resp.content)
        print("Vocals downloaded as vocals.wav")

        # Download instrumental
        instr_resp = requests.get(f"{BASE_URL}{data['instrumental']}")
        with open("instrumental.wav", "wb") as inf:
            inf.write(instr_resp.content)
        print("Instrumental downloaded as instrumental.wav")
    else:
        print("Error:", response.status_code, response.text)

if __name__ == "__main__":
    test_vocal_remover()
