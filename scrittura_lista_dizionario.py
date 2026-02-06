# Chiede all'utente di incollare il testo copiato dal sito
testo = input("Incolla qui il testo con tutte le parole: ")

# Divide il testo in parole usando gli spazi come separatori
parole = testo.split()

# Scrive ogni parola su una riga nel file di output
with open("dizionario.txt", "a", encoding="utf-8") as f:
    for p in parole:
        f.write(p.strip() + "\n")

import os
print("Sto scrivendo il file in:", os.getcwd())


print("File 'dizionario.txt' creato con successo!")
