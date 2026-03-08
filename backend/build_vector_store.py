# build_vector_store.py
import os
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DATA_PATH = "data/"
DB_FAISS_PATH = "vectorstore/db_faiss"

def create_vector_store():
    """Loads docs, splits them, creates embeddings, and saves them to a FAISS vector store."""
    print("Loading documents...")
    loader = DirectoryLoader(DATA_PATH, glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    if not documents:
        print("No documents found in the 'data' folder.")
        return

    print(f"Loaded {len(documents)} documents.")

    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    docs = text_splitter.split_documents(documents)
    print(f"Split into {len(docs)} chunks.")

    print("Creating embeddings and building FAISS index...")
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2',
        model_kwargs={'device': 'cpu'}
    )
    
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(DB_FAISS_PATH)
    print(f"Vector store created and saved at {DB_FAISS_PATH}")

if __name__ == '__main__':
    if not os.path.exists(DATA_PATH) or not os.listdir(DATA_PATH):
        print(f"The '{DATA_PATH}' directory is empty or does not exist.")
        print("Please add your PDF or text files and run again.")
    else:
        create_vector_store()