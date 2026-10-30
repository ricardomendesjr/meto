# METO — Movimento Ética para Todos

Site oficial do **Movimento Ética para Todos (METO)** — uma iniciativa direta, ácida e sem burocracia para conscientizar motoristas que estacionam em vagas especiais sem autorização.

🔗 ** Produção (Netlify):** [https://movimento-meto.netlify.app](https://movimento-meto.netlify.app)

---

## 🎯 Objetivo do Projeto

O portal foi criado com dois objetivos principais:
1. **Neste primeiro momento disponibilizar o aviso oficial de Estacionamento Irregular** (diagramado em formato **A5 Paisagem** de alto contraste P&B) para download imediato em PDF ou impressão direta pelo navegador.
2. **Permitir a inscrição rápida e anônima de agentes do movimento**, sem exigir dados pessoais sensíveis (sem CPF, RG ou e-mail) — apenas um **Apelido/Codinome** e **Cidade/UF**, emitindo na hora uma **Carteirinha Oficial numerada sequencialmente** (`Nº 0001`, `Nº 0002`, `Nº 0003`...).

---

## ✨ Funcionalidades

- **Prévia Fiel do Documento Oficial (A5 Paisagem):**
  - Visual minimalista em preto e branco replicando exatamente a tipografia e as proporções do panfleto oficial em PDF.
  - Folha de estilo de impressão dedicada (`@media print` em formato `A5 landscape`) para imprimir apenas o aviso diretamente pelo navegador.
- **Download Direto do PDF:**
  - Download com 1 clique do arquivo oficial `aviso_estacionamento_A5_paisagem_METO_corrigido.pdf` ou abertura em nova aba.
- **Inscrição Rápida e Emissão de Carteirinha Sequencial:**
  - Cadastro simplificado com **Apelido/Codinome** e **Cidade/UF**.
  - **Filtro inteligente contra CAIXA ALTA:** converte automaticamente nomes e cidades digitados em letras maiúsculas para *Title Case* (ex.: `JOÃO DA SILVA` → `João da Silva`, `SÃO JOSÉ DOS CAMPOS` → `São José dos Campos`), preservando preposições em português.
  - **Numeração Sequencial Persistente:** gera matrícula única (`METO-0001/UF`) e número de carteirinha sequencial (`Nº 0001`, `Nº 0002`...).
- **Download da Carteirinha:**
  - **Exportação em PNG de alta resolução (1000×630 px):** gerada dinamicamente via HTML5 `<canvas>` (`carteirinha_METO_0001.png`).
  - **Exportação em PDF / Impressão:** janela dedicada formatada em `A6 landscape` pronta para salvar como PDF.
- **Lista Pública de Agentes Credenciados:**
  - Histórico sequencial de todos os agentes alistados com botão rápido para reemitir/baixar qualquer carteirinha.

---

## 🛠️ Tecnologias Utilizadas

- **[Astro 4](https://astro.build/):** Geração estática ultrarrápida (`output: 'static'`).
- **HTML5 Canvas & CSS Print Media:** Renderização da carteirinha em PNG e impressão nativa em A5/A6 sem dependências pesadas no cliente.
- **[Netlify Functions](https://docs.netlify.com/functions/overview/) + [@netlify/blobs](https://docs.netlify.com/blobs/overview/):** Persistência serverless da contagem sequencial e da lista de agentes em produção, com *fallback* automático para `localStorage` quando executado offline/localmente.

---

## 📂 Estrutura do Projeto

```text
├── data/
│   └── agentes.json                                      # Base inicial de agentes
├── netlify/
│   └── functions/
│       └── inscricao.mjs                                 # Serverless function (GET/POST sequencial via Netlify Blobs)
├── public/
│   ├── aviso_estacionamento_A5_paisagem_METO_corrigido.pdf # Arquivo PDF oficial para download
│   └── favicon.svg                                       # Ícone P&B do movimento
├── src/
│   └── pages/
│       └── index.astro                                   # Página principal, formulário e gerador de carteirinha
├── astro.config.mjs                                      # Configuração do Astro
├── netlify.toml                                          # Configuração de build e redirects do Netlify
└── package.json                                          # Manifesto e scripts do projeto
```

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ricardomendesjr/meto.git
   cd meto
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O site estará disponível em `http://localhost:4321/`.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença

Este projeto e seu material gráfico são disponibilizados sob a licença **[CC0 1.0 Universal (Domínio Público)](./LICENSE)** — totalmente livre para copiar, imprimir, modificar, distribuir e espalhar pelos para-brisas que merecem, sem necessidade de pedir permissão.

Movimento Ética para Todos — **METO**. A ética começa na vaga.
