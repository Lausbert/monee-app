---
title: "Conviene comprare un’estensione di garanzia? Un test di pareggio"
excerpt: "Usa un semplice test di pareggio per decidere se l’estensione di garanzia ha senso: confronta costo e probabilità di guasto attesa. Scopri quando la regola fallisce e la versione più prudente."
keywords: "estensione di garanzia, garanzia estesa, assicurazione guasti, test di pareggio, costo riparazione, probabilità guasto, elettronica, elettrodomestici, rischio, franchigia"
---
La regola in una frase: **compra l’estensione di garanzia solo se la probabilità di un guasto coperto, moltiplicata per il costo di riparazione, supera il costo dell’estensione (meglio con un margine di sicurezza).**

Io la chiamo **Test di Pareggio “P×D”**:

- `P` = probabilità stimata di un guasto coperto nel periodo extra (in %)
- `D` = danno economico se succede (riparazione o sostituzione non coperta, in % del valore del bene o come “unità” astratte)
- `C` = costo dell’estensione (in % del valore del bene o in unità astratte)

**Decisione base:** compra se `P × D ≥ C`.  
**Decisione più prudente:** compra solo se `P × D ≥ 1,5 × C`.

Perché funziona? Perché un’estensione di garanzia, di solito, è un “prezzo fisso” contro un evento incerto. Se l’aspettativa di perdita (`P×D`) non batte il prezzo (`C`), stai pagando più di quanto “valga” statisticamente.

## Come stimare P senza impazzire

Non servono formule eleganti. Ti bastano tre domande semplici:

1. **Quanto è delicato l’oggetto?**  
   Alta complessità + uso intenso + componenti elettroniche = `P` più alto.
2. **Quanto è lungo il periodo extra?**  
   Più tempo = `P` più alto. Periodi brevi spesso non cambiano molto.
3. **Quanto sei “sfortunato” in media?**  
   Se nella tua esperienza i guasti sono rari, non forzare `P` verso l’alto solo per paura.

Default pratico (solo come punto di partenza):
- Beni semplici e robusti: `P` basso (pochi punti percentuali).
- Beni complessi e usati ogni giorno: `P` medio.
- Dispositivi molto complessi o sottoposti a stress: `P` più alto.

Poi fai il test. Se il risultato è lontano dal pareggio, la decisione è facile. Se è vicino, usa la versione prudente.

## Mini-scenari (senza valuta, solo percentuali)

### Scenario 1: dispositivo complesso, riparazione costosa
- Costo estensione: `C = 12%` del valore del bene
- Se guasta: `D = 45%` (riparazione importante o sostituzione parziale)
- Stima guasto coperto: `P = 30%`

Calcolo: `P×D = 0,30 × 0,45 = 0,135` → **13,5%**.  
Qui `13,5% ≥ 12%`: **passa il pareggio**.  
Versione prudente: `1,5×C = 18%`: **non la passa**. Se sei indeciso, la scelta prudente è non comprarla.

### Scenario 2: bene robusto, riparazione moderata
- `C = 10%`
- `D = 25%`
- `P = 10%`

`P×D = 0,10 × 0,25 = 0,025` → **2,5%**.  
Molto sotto `10%`: **non conviene**. Qui la paura è solo rumore.

### Scenario 3: costo basso ma copertura “stretta”
- `C = 6%`
- `D = 35%` (se succede, pesa)
- `P = 20%` ma solo metà dei guasti tipici è coperta davvero

Correzione copertura: `P_eff = P × copertura = 20% × 50% = 10%`.  
`P_eff×D = 0,10 × 0,35 = 0,035` → **3,5%**.  
Sotto `6%`: **non conviene**. Le clausole contano più del prezzo.

## Dove la regola si rompe (e cosa fare)

Il Test “P×D” è buono, ma non è magico. Si rompe in tre casi comuni:

1. **Tu non puoi assorbire il colpo**  
   Anche se `P×D < C`, un guasto potrebbe metterti in difficoltà operativa (lavoro, studio, salute). Qui non stai comprando “valore atteso”: stai comprando stabilità.
2. **D è molto più alto di quanto pensi**  
   Se il bene è essenziale e la sostituzione rapida è l’unica opzione, `D` include anche costi indiretti (tempo perso, fermo attività). Se questi dominano, il pareggio cambia.
3. **Copertura opaca**  
   Franchigie, esclusioni, “usura”, limiti per singolo intervento: tutto questo abbassa `P` e spesso aumenta la tua parte di `D`.

### Variante più sicura (quando vuoi dormire tranquillo)
Usa questa regola di sicurezza:

- Compra solo se **(a)** `P×D ≥ 1,5×C` **oppure** **(b)** il bene è essenziale *e* hai un piano B insufficiente.

In pratica: o l’affare è chiaramente a tuo favore, oppure stai pagando per continuità, non per “convenienza”.

## Common mistakes (errori tipici)

- **Confondere “mi darebbe fastidio” con “non potrei gestirlo”.** Fastidio non è rischio non gestibile.
- **Ignorare esclusioni e franchigie.** Se non leggi cosa non è coperto, `P` è fantasia.
- **Usare P troppo emotivo.** “Ho paura che si rompa” non è una percentuale.
- **Dimenticare che il primo periodo è già coperto.** Il test vale solo per il periodo extra.
- **Non considerare alternative semplici.** A volte la strategia migliore è mettere da parte un “fondo guasti” in percentuale regolare del valore dei beni che usi.

## Pocket-card (da tenere in mente)

> **Regola:** compra se `P×D ≥ C` (meglio: `P×D ≥ 1,5×C`)  
> **Quando usarla:** beni non essenziali, copertura chiara, stime ragionevoli di guasto e riparazione  
> **Quando NON usarla:** bene essenziale senza piano B, copertura opaca, danni indiretti dominanti  
> **Come adattarla:** usa `P_eff = P × % copertura reale`; se l’impatto ti mette in crisi, applica la variante “stabilità” anche se il pareggio non torna

Alla fine è tutto qui: **se non passa un pareggio semplice, di solito stai comprando tranquillità a caro prezzo.** Se invece passa *anche* con margine, allora non è superstizione: è un test che regge.