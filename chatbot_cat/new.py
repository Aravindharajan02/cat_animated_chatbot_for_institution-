from flask import Flask, request, jsonify, render_template
import json
import numpy as np
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# Load dataset
with open("institutional-chatbot-training-data.json", "r") as f:
    data = json.load(f)

# Extract questions and responses
questions = []
responses = []
for category in data:
    for convo in category["conversations"]:
        questions.append(convo["query"])
        responses.append(convo["response"])

# Load Sentence Transformer Model
model = SentenceTransformer("all-MiniLM-L6-v2")
question_embeddings = model.encode(questions, convert_to_tensor=True)

# Function to find the best response
def get_best_response(user_query):
    user_embedding = model.encode(user_query, convert_to_tensor=True)
    similarity_scores = util.pytorch_cos_sim(user_embedding, question_embeddings)
    best_match_idx = similarity_scores.argmax().item()
    return responses[best_match_idx]

# API route for chatbot
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("query")
    if not user_input:
        return jsonify({"error": "No query provided"}), 400
    response = get_best_response(user_input)
    return jsonify({"response": response})

# Serve frontend
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
