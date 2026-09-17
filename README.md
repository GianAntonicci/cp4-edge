# CP4 Edge - Smart Lamp com ESP32 e FIWARE

## Descricao do Projeto

Sistema IoT que utiliza um ESP32 DevKit para controlar um LED RGB e monitorar a luminosidade ambiente atraves da plataforma FIWARE, com uma dashboard web em React para interacao remota.

## Componentes de Hardware

- **ESP32 DevKit V1**: Microcontrolador principal com WiFi e Bluetooth integrados
- **LED RGB (modulo KY-016)**: LED controlado por PWM nos pinos GPIO18 (vermelho), GPIO19 (verde) e GPIO23 (azul)
- **Sensor LDR**: Sensor de luminosidade conectado ao pino GPIO34 (entrada analogica)
- **Display OLED 1.3" SH1106 (128x64)**: Exibe o status de conexao WiFi, MQTT e um bitmap de carinha feliz

## Arquitetura do Sistema

```
[ESP32 + Sensores]
       |
       | MQTT (porta 1883)
       v
[Eclipse Mosquitto] <---> [IoT Agent MQTT] <---> [Orion Context Broker]
   (Broker MQTT)          (porta 4041)            (porta 1026)
                                                       ^
                                                       |
                                                  HTTP REST
                                                       |
                                                       v
                                              [Dashboard React]
                                              (Vercel / Browser)
```

## Plataforma FIWARE (AWS EC2)

O backend roda em uma instancia EC2 na AWS com os seguintes servicos em containers Docker:

| Servico              | Porta | Funcao                                                    |
|----------------------|-------|-----------------------------------------------------------|
| Orion Context Broker | 1026  | Gerencia entidades e seus atributos via API REST (NGSIv2) |
| IoT Agent MQTT       | 4041  | Traduz mensagens MQTT para o formato NGSI do Orion        |
| Eclipse Mosquitto    | 1883  | Broker MQTT que recebe e distribui mensagens do ESP32     |
| MongoDB              | 27017 | Banco de dados utilizado pelo Orion e IoT Agent           |

### Headers FIWARE

Todas as requisicoes ao Orion utilizam os headers:

```
fiware-service: smart
fiware-servicepath: /
```

### Entidade

- **ID**: `urn:ngsi-ld:Lamp:001`
- **Tipo**: `Lamp`
- **Device ID**: `lamp001`
- **API Key**: `TEF`

## Comunicacao MQTT

O ESP32 se comunica com o FIWARE atraves do protocolo MQTT usando o formato Ultralight 2.0.

### Topicos

| Topico                    | Direcao         | Funcao                                    |
|---------------------------|-----------------|-------------------------------------------|
| `/TEF/lamp001/cmd`        | Broker -> ESP32 | Recebe comandos para trocar cor do LED    |
| `/TEF/lamp001/attrs`      | ESP32 -> Broker | Publica o estado atual do LED             |
| `/TEF/lamp001/attrs/l`    | ESP32 -> Broker | Publica o valor de luminosidade do LDR    |

### Comandos disponiveis

O LED RGB aceita os seguintes comandos via MQTT:

| Comando   | Cor resultante | PWM (R, G, B)     |
|-----------|----------------|--------------------|
| `red`     | Vermelho       | (255, 0, 0)       |
| `green`   | Verde          | (0, 255, 0)       |
| `blue`    | Azul           | (0, 0, 255)       |
| `yellow`  | Amarelo        | (255, 50, 0)      |
| `cyan`    | Ciano          | (0, 255, 80)      |
| `magenta` | Magenta        | (255, 0, 100)     |
| `white`   | Branco         | (255, 180, 120)   |
| `off`     | Desligado      | (0, 0, 0)         |

### Formato das mensagens

- **Comando recebido**: `lamp001@red|`
- **Resposta publicada**: `lamp001@red|` (no topico de attrs)
- **Luminosidade publicada**: valor de 0 a 100 (no topico de attrs/l)

O valor de luminosidade e invertido no mapeamento (`map(analogRead, 0, 4095, 100, 0)`) para que valores maiores representem mais luz e valores menores representem menos luz.

## Display OLED

O display mostra em tempo real:

- **Lado esquerdo**: Status da conexao WiFi (Conectado/Desconectado) e status da conexao MQTT (Conectado/Desconectado)
- **Lado direito**: Bitmap de uma carinha feliz (smiley)

## Dashboard Web (React)

A dashboard foi desenvolvida com React + Vite + Tailwind CSS e permite controlar o LED e monitorar a luminosidade pelo navegador.

### Funcionalidades

- Botoes coloridos para enviar comandos de cor ao LED RGB
- Barra de progresso exibindo o valor de luminosidade em tempo real
- Indicador de status de conexao com o Orion Context Broker
- Atualizacao automatica a cada 2 segundos

### Comunicacao com o FIWARE

A dashboard se comunica com o Orion Context Broker via API REST (HTTP):

- **Ler estado do LED e luminosidade**: `GET /v2/entities/urn:ngsi-ld:Lamp:001`
- **Enviar comando de cor**: `PATCH /v2/entities/urn:ngsi-ld:Lamp:001/attrs` com body `{ "<comando>": { "type": "command", "value": "" } }`

### Proxy e CORS

O navegador nao consegue fazer requisicoes diretamente ao Orion por causa da politica de CORS. Para resolver isso:

- **Desenvolvimento**: O Vite proxy redireciona `/v2/*` para `http://<IP_DO_SERVIDOR>:1026/v2/*`
- **Producao (Vercel)**: O arquivo `vercel.json` configura rewrites para o mesmo redirecionamento

### Deploy

A dashboard esta hospedada na Vercel, conectada ao repositorio GitHub. Todo push na branch main gera um redeploy automatico.

Arquivo `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/v2/(.*)", "destination": "http://<IP_DO_SERVIDOR>:1026/v2/$1" }
  ]
}
```

## Simulacao no Wokwi

O projeto possui uma versao adaptada para simulacao no Wokwi com as seguintes diferencas:

https://wokwi.com/projects/475180427193972737

| Componente | Hardware fisico          | Wokwi                          |
|------------|--------------------------|----------------------------------|
| Display    | OLED 1.3" SH1106         | OLED 0.96" SSD1306              |
| LED RGB    | Modulo KY-016 (PWM)      | LED RGB catodo comum (digital)  |
| WiFi SSID  | Rede local               | `Wokwi-GUEST`                   |
| Controle   | `analogWrite` (PWM)      | `digitalWrite` (HIGH/LOW)       |

## Estrutura do Projeto React

```
fiware-dashboard/
  src/
    components/
      ColorButton.jsx      -- Botao individual de cor
      ColorPanel.jsx        -- Painel com todos os botoes de cor
      LuminosityDisplay.jsx -- Barra de luminosidade
    services/
      fiwareApi.js          -- Funcoes de comunicacao com o Orion
    App.jsx                 -- Componente principal
    index.css               -- Importacao do Tailwind CSS
  vercel.json               -- Configuracao de rewrites para deploy
  vite.config.js            -- Configuracao do Vite com proxy
```

## Tecnologias Utilizadas

- Arduino (C++) com PlatformIO
- ESP32 DevKit V1
- FIWARE (Orion Context Broker, IoT Agent UltraLight MQTT)
- Eclipse Mosquitto (MQTT Broker)
- Docker e Docker Compose
- React + Vite + Tailwind CSS
- Vercel (hospedagem da dashboard)
- AWS EC2 (hospedagem do FIWARE)

## Membros da equipe

| Nome | RM |
|------|----|
|  *Gianluca Antonicci*         |  *570081* |
|  *Matheus Marcondes Araújo*   |  *573152* |
|  *Enzo Vieira Provenzano*     |  *569696* |
|  *João Vitor Rodrigues Costa* |  *569510* |