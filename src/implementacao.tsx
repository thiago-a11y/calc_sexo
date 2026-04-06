import tkinter as tk
from random import choice

class CalculadoraAdulta:
    def __init__(self):
        self.janela = tk.Tk()
        self.janela.title("Calculadora Adulta")
        self.janela.geometry("300x200")

        self.entry = tk.Entry(self.janela)
        self.entry.pack()

        self.botao_somar = tk.Button(self.janela, text="Somar", command=self.somar)
        self.botao_somar.pack()

        self.botao_subtrair = tk.Button(self.janela, text="Subtrair", command=self.subtrair)
        self.botao_subtrair.pack()

        self.botao_multiplicar = tk.Button(self.janela, text="Multiplicar", command=self.multiplicar)
        self.botao_multiplicar.pack()

        self.botao_dividir = tk.Button(self.janela, text="Dividir", command=self.dividir)
        self.botao_dividir.pack()

        self.label_resultado = tk.Label(self.janela, text="")
        self.label_resultado.pack()

        self.label_sugestao = tk.Label(self.janela, text="")
        self.label_sugestao.pack()

        self.sugestoes = [
            "Beijar alguém que você ama",
            "Fazer amor ao ar livre",
            "Ter um relacionamento aberto",
            "Experimentar novas posições",
            "Fazer um striptease para alguém"
        ]

    def somar(self):
        try:
            num1, num2 = map(float, self.entry.get().split(","))
            resultado = num1 + num2
            self.label_resultado.config(text=f"Resultado: {resultado}")
            self.label_sugestao.config(text=choice(self.sugestoes))
        except ValueError:
            self.label_resultado.config(text="Erro: entrada inválida")
            self.label_sugestao.config(text="")

    def subtrair(self):
        try:
            num1, num2 = map(float, self.entry.get().split(","))
            resultado = num1 - num2
            self.label_resultado.config(text=f"Resultado: {resultado}")
            self.label_sugestao.config(text=choice(self.sugestoes))
        except ValueError:
            self.label_resultado.config(text="Erro: entrada inválida")
            self.label_sugestao.config(text="")

    def multiplicar(self):
        try:
            num1, num2 = map(float, self.entry.get().split(","))
            resultado = num1 * num2
            self.label_resultado.config(text=f"Resultado: {resultado}")
            self.label_sugestao.config(text=choice(self.sugestoes))
        except ValueError:
            self.label_resultado.config(text="Erro: entrada inválida")
            self.label_sugestao.config(text="")

    def dividir(self):
        try:
            num1, num2 = map(float, self.entry.get().split(","))
            if num2 != 0: