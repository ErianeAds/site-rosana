import pandas as pd
import re
import os

def clean_twitter_csv(input_path, output_path):
    print(f"Cleaning {input_path}...")
    with open(input_path, 'r', encoding='utf-8', errors='replace') as f_in:
        lines = f_in.readlines()
    
    cleaned_rows = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith(';;') or line == ';;':
            continue
            
        # Remove trailing semicolons
        while line.endswith(';'):
            line = line[:-1]
            
        # Handle the "over-quoting" issue: "ID,Entity,Sentiment,""Content"""
        # If it starts and ends with a quote, it might be an over-quoted row
        if line.startswith('"') and line.endswith('"'):
            # Check if it looks like a full row inside
            inner = line[1:-1]
            # Replace double quotes with single ones (standard unescaping)
            line = inner.replace('""', '"')
        
        cleaned_rows.append(line)
        
    # Join everything back and use StringIO to read it with pandas
    # Or just write to a temporary file
    with open(output_path, 'w', encoding='utf-8') as f_out:
        for row in cleaned_rows:
            f_out.write(row + '\n')

def train_new_model():
    data_dir = r"c:\Users\Gustavo\Documents\GitHub\Classificador_Sentimentos\backend\data"
    train_raw = os.path.join(data_dir, "twitter_training.csv")
    valid_raw = os.path.join(data_dir, "twitter_validation.csv")
    
    train_clean = os.path.join(data_dir, "train_cleaned.csv")
    valid_clean = os.path.join(data_dir, "valid_cleaned.csv")
    
    clean_twitter_csv(train_raw, train_clean)
    clean_twitter_csv(valid_raw, valid_clean)
    
    # Now read with pandas
    # Since the structure is still a bit risky, we read manually and then convert to DF
    # to handle the 4 columns correctly.
    
    def load_cleaned_df(path):
        # We try to read with comma sep, but some lines might still be messy
        # We'll use skip_blank_lines and handle bad lines
        try:
            # The columns are: tweet_id, entity, sentiment, tweet_content
            # We skip the first line (header) if it exists
            df = pd.read_csv(path, sep=',', on_bad_lines='skip', quotechar='"', escapechar='\\', names=["tweet_id", "entity", "sentiment", "tweet_content"], header=0)
            return df
        except Exception as e:
            print(f"Error loading {path}: {e}")
            return None

    df_train = load_cleaned_df(train_clean)
    df_valid = load_cleaned_df(valid_clean)
    
    if df_train is not None:
        print(f"Train set loaded. Shape: {df_train.shape}")
        # Show some stats
        print(df_train['sentiment'].value_counts())
        
    if df_valid is not None:
        print(f"Valid set loaded. Shape: {df_valid.shape}")
        print(df_valid['sentiment'].value_counts())

if __name__ == "__main__":
    train_new_model()
