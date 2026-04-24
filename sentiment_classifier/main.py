from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import joblib
import os
import sys

app = FastAPI(title="Analisador de Sentimentos API")

# Configuração de CORS para permitir que o frontend (qualquer origem) faça requisições
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Inicializando API e carregando modelos...")
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Modelo 'en_core_web_sm' não encontrado. Baixando agora...")
    import subprocess
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")


# Carregar o modelo treinado
model_path = os.path.join(os.path.dirname(__file__), "sentiment_model.pkl")
if os.path.exists(model_path):
    model = joblib.load(model_path)
    print("Modelo de Machine Learning carregado com sucesso!")
else:
    model = None
    print("AVISO: Modelo não encontrado. Treine o modelo primeiro executando train_model.py")

class TextInput(BaseModel):
    text: str

def preprocess_text(text: str) -> str:
    """Mesma função de pré-processamento usada no treinamento."""
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_punct]
    return " ".join(tokens)

@app.post("/analyze")
async def analyze_sentiment(input_data: TextInput):
    if not model:
        return {"error": "Modelo não treinado. Por favor contate o administrador."}
        
    # Processa o texto recebido
    processed_text = preprocess_text(input_data.text)
    
    # Faz a predição (retorna uma lista, pegamos o primeiro item)
    prediction = model.predict([processed_text])[0]
    
    # Pega as probabilidades de cada classe
    probabilities = model.predict_proba([processed_text])[0]
    max_prob = max(probabilities)
    
    return {
        "text": input_data.text,
        "emotion": prediction,
        "confidence": float(max_prob)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
