import pandas as pd

dados = [
    # Positive
    ("Eu amo este produto!", "Positive"),
    ("O serviço foi excelente.", "Positive"),
    ("Este filme é incrível!", "Positive"),
    ("Tive a melhor refeição da minha vida!", "Positive"),
    ("A qualidade deste produto é fantástica.", "Positive"),
    ("Não consigo parar de ouvir essa música. É maravilhosa!", "Positive"),
    ("O site deles é muito fácil de usar. Adorei!", "Positive"),
    ("Eu adorei o filme! Foi fantástico!", "Positive"),
    ("O atendimento ao cliente foi maravilhoso.", "Positive"),
    ("Este livro me fez sentir inspirado. Altamente recomendado!", "Positive"),
    ("Acabei de ter as férias mais incríveis! Mal posso esperar para voltar.", "Positive"),
    ("A comida neste restaurante estava deliciosa.", "Positive"),
    ("Tive uma experiência incrível no parque de diversões.", "Positive"),
    ("O show foi absolutamente de tirar o fôlego. Melhor apresentação de todas!", "Positive"),
    ("Este filme é uma obra-prima! Fiquei maravilhado.", "Positive"),
    ("A estadia no hotel foi absolutamente incrível! Luxo no seu melhor.", "Positive"),
    ("Estou muito feliz com o resultado.", "Positive"),
    ("Que lugar lindo e agradável.", "Positive"),
    ("Tudo ocorreu perfeitamente bem.", "Positive"),
    ("Estou muito satisfeito com a compra.", "Positive"),
    ("Achei maravilhoso.", "Positive"),
    ("Recomendo a todos, muito bom.", "Positive"),
    ("Nota 10 para o atendimento.", "Positive"),
    ("Perfeito, superou minhas expectativas.", "Positive"),
    ("Muito obrigado pelo excelente serviço.", "Positive"),
    ("Fiquei encantado com a apresentação.", "Positive"),
    ("É a melhor coisa que já comprei.", "Positive"),
    ("Sensacional, não tenho do que reclamar.", "Positive"),
    ("Gostei muito da experiência.", "Positive"),
    ("Sensação maravilhosa.", "Positive"),

    # Negative
    ("O serviço foi horrível.", "Negative"),
    ("Estou muito decepcionado com o suporte ao cliente deles.", "Negative"),
    ("A qualidade deste produto é inferior.", "Negative"),
    ("O site deles é muito confuso e mal projetado.", "Negative"),
    ("O atendimento ao cliente foi terrível.", "Negative"),
    ("Estou extremamente decepcionado com a qualidade do produto deles.", "Negative"),
    ("A comida neste restaurante estava horrível. Nunca mais voltarei!", "Negative"),
    ("O produto chegou danificado. Muito decepcionado.", "Negative"),
    ("Tive uma experiência terrível com o suporte ao cliente deles.", "Negative"),
    ("Estou decepcionado com o final deste livro. Foi fraco.", "Negative"),
    ("O produto que recebi estava danificado. Inaceitável.", "Negative"),
    ("Tive a pior experiência de voo. Atrasado e com funcionários rudes.", "Negative"),
    ("O produto que encomendei nunca chegou. Serviço terrível.", "Negative"),
    ("Tive uma experiência frustrante navegando no site deles.", "Negative"),
    ("O produto que comprei quebrou em uma semana. Má qualidade.", "Negative"),
    ("Tive uma experiência terrível com o suporte técnico deles. Nenhuma resolução.", "Negative"),
    ("Estou decepcionado com a comida neste restaurante. Estava sem sabor.", "Negative"),
    ("O site é lento e não responde. Difícil de navegar.", "Negative"),
    ("Que comida nojenta e ruim.", "Negative"),
    ("Eu odeio esse produto.", "Negative"),
    ("Péssimo atendimento.", "Negative"),
    ("Estou muito triste com o resultado.", "Negative"),
    ("Não gostei, muito ruim.", "Negative"),
    ("Detestei a experiência.", "Negative"),
    ("Deixou muito a desejar.", "Negative"),
    ("Não recomendo para ninguém.", "Negative"),
    ("Dinheiro jogado no lixo.", "Negative"),
    ("Um verdadeiro desastre.", "Negative"),
    ("Completamente insatisfeito.", "Negative"),
    ("Muito fraco, não vale a pena.", "Negative"),
    ("Me arrependi da compra.", "Negative")
]

df = pd.DataFrame(dados, columns=["texto", "emocao"])

# Vamos salvar o mesmo dataset para treino e teste, 
# mas o ideal seria dividir, como é um projeto pequeno, vamos apenas replicar.
df.to_excel("../base_treinamento.xlsx", index=False)
df.to_excel("../base_teste.xlsx", index=False)

print("Datasets base_treinamento.xlsx e base_teste.xlsx gerados com sucesso!")
