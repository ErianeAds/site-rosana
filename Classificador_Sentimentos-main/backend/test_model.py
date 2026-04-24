import joblib
import spacy

print("Carregando modelo...")
nlp = spacy.load("pt_core_news_sm")
model = joblib.load("sentiment_model.pkl")

def predict_sentiment(text):
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_punct]
    processed_text = " ".join(tokens)
    prediction = model.predict([processed_text])[0]
    return prediction

phrases = [
    # English phrases (Should work)
    ("I love this!", "Positive"),
    ("This is terrible.", "Negative"),
    
    # Portuguese phrases (User's problem)
    ("Eu amo isso!", "Positive"),
    ("O serviço foi horrível.", "Negative"),
    ("Estou muito triste com o resultado.", "Negative"),
    ("Que comida nojenta e ruim.", "Negative"),
    ("Eu odeio esse produto.", "Negative"),
    ("Péssimo atendimento.", "Negative"),
    ("Foi uma experiência maravilhosa.", "Positive")
]

print("\n--- RESULTADOS DOS TESTES ---")
for text, expected in phrases:
    result = predict_sentiment(text)
    match = "CORRETO" if result == expected else "ERRO"
    print(f"Texto: '{text}' | Esperado: {expected} | Modelo: {result} {match}")
