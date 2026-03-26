> 🇺🇸 [English Version](./README.md)

# 🌌 NASA APOD Viewer

> Um pequeno projeto focado em **gerenciamento de estados da UI, tratamento de edge cases de API e experiência de usuário resiliente**.

---

## 🔗 Demo Online

👉 https://your-vercel-link.vercel.app

---

## 🖼️ Preview

![Welcome](./screenshots/welcome.png)

![Result](./screenshots/result.png)

![Video Unavailable](./screenshots/video-unavailable.png)

---

## 🎯 Sobre o Projeto

Esta aplicação consome a API APOD da NASA e permite que o usuário explore conteúdos espaciais por data.

O foco do projeto não foi apenas exibir dados, mas lidar com **inconsistências reais da API**, mantendo uma interface previsível e bem estruturada.

---

## 🛰️ API NASA APOD

Este projeto utiliza a API *Astronomy Picture of the Day (APOD)* para obter imagens, vídeos e descrições do espaço.

**Principais características:**

* Endpoint REST com parâmetros (`date`, `api_key`)
* Retorna diferentes tipos de mídia (`image`, `video`)
* Alguns vídeos **não podem ser incorporados** (`iframe`) por restrições do navegador (X-Frame-Options)
* Exige tratamento defensivo para dados ausentes ou inconsistentes

**Endpoint:**

```
https://api.nasa.gov/planetary/apod
```

Para fins de desenvolvimento e portfólio, é utilizada a chave pública `DEMO_KEY`.

> ⚠️ Em aplicações reais, a API key nunca deve ficar exposta no front-end. O ideal é usar um backend intermediário ou variáveis de ambiente.

---

## ⚙️ Tecnologias

* HTML5
* CSS3 (Mobile-first, Grid/Flexbox)
* JavaScript Vanilla (ES6+)
* Fetch API

---

## 🧠 Destaques Técnicos

### 1. Gerenciamento explícito de estados da UI

A aplicação foi estruturada em estados bem definidos:

* `welcome`
* `loading`
* `result`
* `error`
* `video-unavailable`

Cada estado é controlado de forma explícita para evitar conflitos visuais e garantir previsibilidade.

---

### 2. Tratamento de edge cases da API (fallback de vídeo)

A API da NASA pode retornar vídeos que **não podem ser exibidos dentro da aplicação**.

Ao invés de falhar silenciosamente, o app:

* Detecta URLs que podem ou não ser incorporadas
* Exibe uma mensagem de fallback
* Oferece um link direto para visualizar o conteúdo externamente

---

### 3. Tratamento de tipos de mídia

* Imagens → renderizadas com `<img>`
* Vídeos → renderizados com `<iframe>`
* Vídeos não suportados → fallback com link externo

Antes de qualquer renderização, a interface é limpa para evitar resíduos de estado (`clearResult`).

---

### 4. Programação defensiva

* Impede datas futuras
* Impede datas anteriores ao início do APOD (16 de junho de 1995)
* Trata falhas da API de forma segura
* Garante feedback claro ao usuário

---

### 5. Separação de responsabilidades

O código foi organizado em responsabilidades bem definidas:

* Requisição de dados → `fetchApod`
* Renderização → `showResult`, `showError`
* Controle de estado → `setLoading`, `resetUI`
* Tratamento de edge cases → `showVideoUnavailable`

---

## 🚀 Como rodar o projeto

Clone o repositório:

```
git clone https://github.com/douglas-andre/apod-viewer.git
```

Abra o arquivo:

```
index.html
```

---

## 📌 Melhorias futuras

* Persistir última data selecionada (localStorage)
* Adicionar botão “Hoje”
* Melhorar normalização de URLs de vídeo (YouTube, etc.)
* Adicionar animações/transições

---

## 👨‍💻 Autor

Douglas André

---

## 📄 Licença

Projeto educacional
