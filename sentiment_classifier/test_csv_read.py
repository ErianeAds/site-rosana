import pandas as pd
import os

files = [
    r"c:\Users\Gustavo\Documents\GitHub\Classificador_Sentimentos\backend\data\twitter_training.csv",
    r"c:\Users\Gustavo\Documents\GitHub\Classificador_Sentimentos\backend\data\twitter_validation.csv"
]

for file_path in files:
    print(f"\n--- Testing {os.path.basename(file_path)} ---")
    try:
        # Tentar ler com cabeçalho padrão
        df = pd.read_csv(file_path, on_bad_lines='skip')
        print("Columns found (default):", df.columns.tolist())
        print("Shape:", df.shape)
        print("First 5 rows:")
        print(df.head())
        
        # Se as colunas parecerem erradas (por causa dos semicolons no cabeçalho)
        # Vamos tentar ler especificando as colunas se soubermos quais são
        
    except Exception as e:
        print(f"Error reading with default: {e}")

    try:
        # Tentar ler sem cabeçalho e atribuir nomes se o cabeçalho estiver quebrado
        df2 = pd.read_csv(file_path, header=None, names=["tweet_id", "entity", "sentiment", "tweet_content"], usecols=[0,1,2,3], on_bad_lines='skip')
        print("\nRead with explicit columns [0,1,2,3]:")
        print("Shape:", df2.shape)
        print(df2.head())
    except Exception as e:
        print(f"Error reading with explicit: {e}")
