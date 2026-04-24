# 🧠 Analisador de Sentimentos Web

Este é um projeto de Processamento de Linguagem Natural (NLP) que utiliza Machine Learning para classificar o sentimento de mensagens do Twitter (em Inglês). O sistema conta com uma API robusta em **FastAPI**, um modelo treinado com **Scikit-Learn** e uma interface web moderna e responsiva.

## 📊 Performance do Modelo

O modelo foi treinado utilizando uma base de dados do Kaggle com mais de **74.000 mensagens**. Abaixo estão as métricas de performance detalhadas do modelo atual.

### 📈 Relatório de Classificação

| Categoria | Precisão | Recall | F1-Score | Exemplos (Suporte) |
| :--- | :---: | :---: | :---: | :---: |
| **Positivo** | 77% | 89% | **83%** | 277 |
| **Negativo** | 73% | 87% | **79%** | 266 |
| **Neutro** | 85% | 73% | **78%** | 284 |
| **Irrelevante** | 93% | 64% | **76%** | 172 |
| **Média Ponderada** | **81%** | **80%** | **79%** | **1000** |

> **Acurácia Total: 80%**

### 🧩 Matriz de Confusão

A matriz abaixo mostra como o modelo classifica cada mensagem em comparação com a realidade (Ground Truth).

```text
               Previsto: Irrelevante | Negativo | Neutro | Positivo
Real: Irrelevante        110         |    28    |    6   |    28
      Negativo           0           |   232    |   17   |    17
      Neutro             6           |    43    |   206  |    29
      Positivo           2           |    14    |   14   |   247
```

*Interpretando a Matriz:*
- O modelo é excelente em identificar **Sentimentos Positivos** (247 acertos).
- Há uma pequena confusão entre **Neutro** e **Negativo** (43 casos), o que é comum em textos curtos do Twitter onde o sarcasmo pode ser difícil de detectar.

## 🚀 Tecnologias Utilizadas

- **Backend:** Python, FastAPI, Scikit-Learn, SpaCy, Joblib, Pandas.
- **Frontend:** HTML5, CSS3 (Glassmorphism & Blobs), JavaScript Vanilla.
- **Processamento:** TF-IDF Vectorizer + Naive Bayes Classifier.

## 🛠️ Como Executar o Projeto

1. **Backend:**
   Certifique-se de ter as dependências instaladas (`pip install -r backend/requirements.txt`) e as bibliotecas do spaCy (`python -m spacy download en_core_web_sm`).
   ```bash
   cd backend
   python main.py
   ```

2. **Frontend:**
   Basta abrir o arquivo `frontend/index.html` em qualquer navegador moderno.

## 📝 Observações
O modelo atual foi otimizado para o idioma **Inglês**, dado a natureza do dataset do Twitter utilizado. Para análises em Português, o modelo deve ser retreinado com uma base de dados local.
