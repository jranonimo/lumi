# Projeto LUMI

Este projeto é um sistema para visualização de dados de consumo energético, com a possibilidade de baixar faturas em PDF e visualizar gráficos detalhados.

## Funcionalidades

- **Visualização de Consumo Energético**: Interface para visualizar os dados de consumo energético por cliente.
- **Dashboard**: Painel detalhado para cada cliente mostrando gráficos de consumo e economia.
- **Download de Faturas**: Permite baixar faturas em PDF diretamente pelo dashboard.
- **Pesquisa de Clientes**: Ferramenta de busca para encontrar rapidamente os dados de um cliente específico.

## Tecnologias Utilizadas

- **Frontend**:
  - React
  - Axios
  - React Icons
  - React Google Charts

- **Backend**:
  - Node.js
  - Express
  - Prisma (ORM)
  - CORS
 
  - ## Como Executar o Projeto

### Pré-requisitos

- Node.js
- npm 
- Prisma Client

 Clone o repositório:
```sh
   git clone https://github.com/seu-usuario/lumi-projeto.git
```
### Backend
```sh
   cd lumi-projeto/back
   npm install
   npm run dev
```
### Frontend
```sh
cd lumi-projeto/front
npm install
npm start
```
### Extração de Dados
```sh
cd lumi-projeto/back/extracaoPdf
npm npm install pdf-parse
node index.js
```


### OBS:

- Para rodar local, irá preciar fazar um ajuste no back e front

  **Frontend**:
  - Caminho: front/src/app.js
  - Linha: 158
  - Alterar para o seu localhost com a port e caminho definido, exemplo abaixo:
```sh
      const response = await axios.get(
        "http://localhost:4000/lumi"
      );
```

  **Backend**:
  - Caminho: back/src/server.js
  - Linha: 8
  - Alterar para o seu localhost, exemplo abaixo:
```sh
     app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
