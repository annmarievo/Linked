from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import openai

# Initialize Flask app
app = Flask(__name__)

# Set up OpenAI
openai.api_key = "your_openai_api_key_here"

# Configure Selenium
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
service = Service("path/to/chromedriver")  # Update to the correct path for your system

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Use Selenium to scrape webpage
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get(url)

        # Extract content (modify for better results if needed)
        paragraphs = driver.find_elements(By.TAG_NAME, "p")
        content = " ".join([p.text for p in paragraphs if p.text.strip()])
        driver.quit()

        if not content.strip():
            return jsonify({"summary": "No content available"}), 200

        # Summarize content using OpenAI
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Summarize this text: {content}",
            max_tokens=60,
            temperature=0.7
        )

        summary = response["choices"][0]["text"].strip()
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
