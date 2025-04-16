
[![Continuous Integration](https://github.com/SweeTenTeam/BuddyBot/blob/main/.github/workflows/CI.svg)](https://github.com/SweeTenTeam/Docs/actions)
[![Code Coverage](https://github.com/SweeTenTeam/BuddyBot/blob/main/.github/workflows/Coverage.svg)](https://github.com/SweeTenTeam/Docs/actions)
# BuddyBot

## Scopo del prodotto
L'obiettivo del progetto è la realizzazione di un `chatbot` sotto forma di `Web App` atto a fornire un supporto al team di `AzzurroDigitale` nella gestione delle attività di un progetto in corso di sviluppo. Nella fattispecie, il chatbot utilizza delle `API` e un modello di `LLM` per, rispettivamente, reperire informazioni da sistemi esterni utilizzati dall'azienda (più specificatamente, Jira, GitHub e Confluence) e elaborare una risposta. Questa risposta può contenere del semplice testo o un `code block`. Il `chatbot` ha una singola sessione per ogni utente, e può essere utilizzato da più utenti contemporaneamente.

Il team è confidente che questo genere di prodotto migliorerà il workflow del team di `AzzurroDigitale`, riducendo i tempi di risposta e migliorando la qualità del lavoro svolto.
<br></br>

## Requisiti hardware
Dato che non sono stati specificati requisiti hardware da capitolato o da progetto, i seguenti requisiti sono stati decisi dal team di sviluppo e sono da considerarsi sufficienti per l'installazione e l'utilizzo del prodotto:

<div align="center">

| Componente | Requisito |
| ---------------------- | --------- |
| CPU | 2,5GHz Dual Core o superiore |
| RAM | 8GB DDR4 o superiore |
| Connessione | Connessione ad internet stabile |
| Sistema Operativo | Windows 10 o superiore, Linux, MacOS |

</div>
<br></br>

## Requisiti di browser
Dato che il prodotto è una `Web App`, è necessario un browser per l'utilizzo. I requisiti di browser sono stati decisi dal team di sviluppo e sono da considerarsi sufficienti per l'installazione e l'utilizzo del prodotto:

<div align="center">

| Browser | Versione |
| ---------------------- | --------- |
| Google Chrome | 135.0.7049.42 o superiore |
| Mozilla Firefox | 137.0.1 o superiore |
| Microsoft Edge | 134.0.3124.83 o superiore |
| Safari | 18.3 o superiore |

</div>
<br></br>

## Installazione
In questo paragrafo verrà spiegato come installare il prodotto sulla propria macchina in modo da poterne usufruire in locale. Si ricorda che il progetto è stato concepito per essere consegnato al proponente e che venga fatto operare sui loro server dedicati. L'installazione in locale è da considerarsi un'operazione non necessaria e non richiesta, ma è stata comunque implementata per facilitare lo sviluppo e il testing del prodotto.

### Strumenti e tecnologie necessarie

- __`Brew`__ se la propria macchina è un sistema UNIX based: un gestore di pacchetti per macOS e Linux, che permette di installare facilmente software e librerie. È possibile installarlo con il comando:
  ```bash 
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- __`Choco`__ se la propria macchina è un sistema Windows based: un gestore di pacchetti per Windows, che permette di installare facilmente software e librerie. È possibile installarlo aprendo il terminale in modalità amministratore e copiando il comando:
  ```bash
    @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
  ```
- __`Docker`__: un software che permette di eseguire applicazioni in container, isolando le dipendenze e le librerie necessarie per il loro funzionamento. È possibile installarlo con il comando:
  ```bash
    brew install docker
  ```
  oppure
  ```bash
    choco install docker-desktop
  ```
- __`Git`__: un sistema di controllo versione distribuito, che permette di tenere traccia delle modifiche apportate al codice sorgente. È possibile installarlo con il comando:
  ```bash
    brew install git
  ```
  oppure
  ```bash
    choco install git
  ```
- Node.js: un ambiente di esecuzione JavaScript, che permette di eseguire codice JavaScript al di fuori del browser. È possibile installarlo con il comando:
  ```bash
    brew install node
  ```
  oppure
  ```bash
    choco install nodejs
  ```
- `npm`: un gestore di pacchetti per Node.js, che permette di installare facilmente librerie e dipendenze. È incluso nell'installazione di Node.js, quindi non è necessario installarlo separatamente.
<br></br>

### Creazione delle API Key
Per utilizzare il prodotto, è necessario creare delle API Key per i servizi esterni utilizzati dal chatbot. Le API Key sono delle chiavi univoche che permettono di autenticarsi e accedere ai servizi esterni. Per creare l'Api key, è necessario creare un account per ogni servizio, e navigare nella pagina dedicata alle API Key nelle impostazioni dell'account. Di seguito sono riportati i link per creare le API Key per i servizi esterni utilizzati dal chatbot:

- https://nomic.ai
- https://console.groq.com/keys
- https://www.atlassian.com/software/jira
- https://www.atlassian.com/software/confluence
- https://github.com/settings/tokens


### Installazione del prodotto
Per installare il prodotto, è necessario clonare il repository Git del progetto e installare le dipendenze necessarie. La cartella del prodotto è scaricabile anche in formato `.zip` da Github e può essere scompattata in una cartella a piacere. In tal caso, non è necessario Git.

Per installare il prodotto, è necessario eseguire i seguenti comandi:

- Aprire il terminale e navigare nella cartella in cui si desidera installare il prodotto (o navigare nella cartella in cui è stato scompattato il file `.zip`) con il comando:
  ```bash
    cd /percorso/della/cartella
  ```
- Clonare il repository Git del progetto con il comando (passaggio opzionale se si è scaricato il progetto da GitHub):
  ```bash
    git clone git@github.com:SweeTenTeam/BuddyBot.git
  ```
- Navigare nella cartella del progetto con il comando:
  ```bash
    cd BuddyBot
  ```
- A partire dai file `.env.example` presenti nella cartella del progetto, è necessario creare i file `.env`. I file `.env` contengono le variabili di ambiente necessarie per il corretto funzionamento del prodotto. Per farlo è possibile eseguire il comando:
  ```bash
    cp .env.example .env
  ```
  Una volta fatto, basta inserire le API Key create in precedenza nei file `.env` e il prodotto sarà pronto per essere utilizzato.
  
  Questo passaggio va ripetuto per ogni microservizio del prodotto.

- Impostare la repositorye la branch da tracciare nel file `.env` del microservizio `apiGateway`;

- Far partire il container di Docker con il seguente comando se è la prima volta:
  ```bash
    docker-compose up --build
  ```
  In caso contrario, è possibile eseguire il comando:
  ```bash
    docker-compose up
  ```
  A questo punto, basterà aprire il browser preferito e recarsi all'indirizzo `http://localhost:3000` per visualizzare l'applicazione.
