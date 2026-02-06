def aggiungi_parola(file_path, parola):
    parola = parola.strip().upper()

    # Leggi il file
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            parole = {line.strip().upper() for line in f}
    except FileNotFoundError:
        parole = set()

    # Controlla duplicati
    if parola in parole:
        print(f"La parola '{parola}' è già presente.")
        return

    # Aggiungi la parola
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(parola + "\n")

    print(f"Parola '{parola}' aggiunta correttamente.")


# Esempio d’uso
aggiungi_parola("dizionario.txt", "pizza")
aggiungi_parola("parole_segrete.txt", "cane")
