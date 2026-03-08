# app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- Import the correct LangChain components ---
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import SystemMessage, HumanMessage

# --- Configuration ---
load_dotenv()
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
# Using a conversational model, as required
REPO_ID = "moonshotai/Kimi-K2-Instruct"
DB_FAISS_PATH = "vectorstore/db_faiss"

# --- RAG Setup (Load components once at startup) ---
try:
    # 1. Load Embeddings Model (no change here)
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2',
        model_kwargs={'device': 'cpu'}
    )
    
    # 2. Load the Vector Store (no change here)
    print("Loading FAISS index...")
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    print("FAISS index loaded.")

    # 3. Initialize the LLM as a CHAT model (This is the key change)
    llm = HuggingFaceEndpoint(
        repo_id=REPO_ID,
        huggingfacehub_api_token=HUGGINGFACE_TOKEN,
        temperature=0.7,
    )
    model = ChatHuggingFace(llm=llm) # Use the Chat wrapper
    print("Chat model loaded successfully.")

except Exception as e:
    print(f"Error loading RAG components: {e}")
    exit()

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)

# --- API Endpoint for Chat ---
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        query = data.get('query')

        if not query:
            return jsonify({"error": "Invalid request. 'query' is required."}), 400

        print(f"Received query: {query}")

        # --- RAG IN ACTION ---
        # 1. Search (Retrieve)
        print("Searching for relevant context...")
        similar_docs = db.similarity_search(query, k=3)
        context = "\n".join([doc.page_content for doc in similar_docs])
        
        # --- NEW CONVERSATIONAL PROMPTING ---
        # 2. Augment: Create a system prompt with context
        system_prompt = f"""
        Use the following pieces of context to answer the user's question.
        If you don't know the answer from the provided context, just say that you don't know.

        Context:
        {context}
        """

        # 3. Generate: Prepare messages and invoke the model
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=query),
        ]
        
        print("Generating response...")
        response = model.invoke(messages)
        
        print(f"Generated response: {response.content}")
        # Send back the content of the AI's message
        return jsonify({'role': 'ai', 'content': response.content})

    except Exception as e:
        print(f"An error occurred during chat processing: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- Health Check Endpoint ---
@app.route('/')
def index():
    return "RAG Chatbot backend is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)