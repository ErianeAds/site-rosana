# functions/main.py
from firebase_functions import https_fn
from firebase_admin import initialize_app
import spacy
import joblib
import os
import sys
import json

# Inicializa o app do Firebase
initialize_app()

print("Inicializando Ambiente de Classificação...")

# Carregamento do modelo (fora da função para otimizar cold starts)
nlp = None
model = None

def load_models():
    global nlp, model
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except:
            print("Baixando modelo spacy...")
            import subprocess
            subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            nlp = spacy.load("en_core_web_sm")
    
    if model is None:
        model_path = os.path.join(os.path.dirname(__file__), "sentiment_model.pkl")
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            print("Modelo de ML carregado!")
        else:
            print("ERRO: Modelo .pkl não encontrado!")

def preprocess_text(text):
    load_models()
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_punct]
    return " ".join(tokens)

@https_fn.on_request(cors=https_fn.CorsOptions(origins="*", methods=["POST"]))
def analyze(req: https_fn.Request) -> https_fn.Response:
    """Função que recebe o texto e retorna a classificação de sentimento."""
    try:
        # Extrai o texto do corpo da requisição
        data = req.get_json()
        text = data.get('text', '')
        
        if not text:
            return https_fn.Response('{"error": "Texto não fornecido"}', status=400, mimetype='application/json')

        load_models()
        if model is None:
             return https_fn.Response('{"error": "Modelo não carregado"}', status=500, mimetype='application/json')

        # Processamento e Predição
        processed_text = preprocess_text(text)
        prediction = model.predict([processed_text])[0]
        probabilities = model.predict_proba([processed_text])[0]
        confidence = float(max(probabilities))

        result = {
            "text": text,
            "emotion": prediction,
            "confidence": confidence
        }
        
        return https_fn.Response(json.dumps(result), mimetype='application/json')
        
    except Exception as e:
        print(f"Erro na função: {str(e)}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')
