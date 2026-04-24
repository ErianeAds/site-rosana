import pandas as pd
import spacy
import joblib
import os
import io
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Configurações de caminhos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
TRAIN_FILE = os.path.join(DATA_DIR, "twitter_training.csv")
VALID_FILE = os.path.join(DATA_DIR, "twitter_validation.csv")
MODEL_FILENAME = os.path.join(BASE_DIR, "sentiment_model.pkl")

print("Carregando modelo do spaCy (en_core_web_sm)...")
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Modelo 'en_core_web_sm' não encontrado. Baixando agora...")
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

def clean_twitter_csv_content(input_path):
    """Lê o arquivo e limpa as aspas extras e semicolons de cada linha."""
    cleaned_lines = []
    with open(input_path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith(';;'): continue
            
            # Remove semicolons extras no final
            while line.endswith(';'):
                line = line[:-1]
                
            # Corrige linhas que foram salvas inteiramente entre aspas
            if line.startswith('"') and line.endswith('"'):
                inner = line[1:-1]
                line = inner.replace('""', '"')
            
            cleaned_lines.append(line)
    return "\n".join(cleaned_lines)

def preprocess_text(text):
    if pd.isna(text):
        return ""
    doc = nlp(str(text).lower())
    # Lematização e remoção de pontuação
    tokens = [token.lemma_ for token in doc if not token.is_punct]
    return " ".join(tokens)

def train_and_save_model():
    print("Processando e limpando dados de treinamento...")
    train_data = clean_twitter_csv_content(TRAIN_FILE)
    df_train = pd.read_csv(io.StringIO(train_data), names=["tweet_id", "entity", "sentiment", "tweet_content"], on_bad_lines='skip')

    print("Processando e limpando dados de validação...")
    valid_data = clean_twitter_csv_content(VALID_FILE)
    df_valid = pd.read_csv(io.StringIO(valid_data), names=["tweet_id", "entity", "sentiment", "tweet_content"], on_bad_lines='skip')

    # Remover linhas com colunas vazias críticas
    df_train = df_train.dropna(subset=['sentiment', 'tweet_content'])
    df_valid = df_valid.dropna(subset=['sentiment', 'tweet_content'])

    print(f"Total de linhas para treino: {len(df_train)}")
    print(f"Total de linhas para validação: {len(df_valid)}")

    print("Gerando processamento de texto (isso pode levar alguns minutos)...")
    df_train['processed_content'] = df_train['tweet_content'].apply(preprocess_text)
    df_valid['processed_content'] = df_valid['tweet_content'].apply(preprocess_text)

    X_train = df_train['processed_content']
    y_train = df_train['sentiment']
    X_valid = df_valid['processed_content']
    y_valid = df_valid['sentiment']

    print("Treinando modelo (Pipeline TF-IDF + Naive Bayes)...")
    # Aumentamos o ngram_range para capturar contexto melhor
    model = make_pipeline(
        TfidfVectorizer(ngram_range=(1, 2), max_features=20000),
        MultinomialNB()
    )
    
    model.fit(X_train, y_train)

    accuracy = model.score(X_valid, y_valid)
    print(f"Acurácia na base de validação: {accuracy * 100:.2f}%")

    print(f"Salvando modelo em: {MODEL_FILENAME}")
    joblib.dump(model, MODEL_FILENAME)
    print("Modelo salvo com sucesso!")

if __name__ == "__main__":
    train_and_save_model()

