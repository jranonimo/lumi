const fs = require("fs");
const pdf = require("pdf-parse");
const { PrismaClient } = require("@prisma/client");
const { exit } = require("process");

const prisma = new PrismaClient();

// Array de caminhos de arquivos PDF
const pdfFiles = [
  "faturas/3000055479-01-2023.pdf",
  "faturas/3000055479-02-2023.pdf",
  "faturas/3000055479-03-2023.pdf",
  "faturas/3000055479-04-2023.pdf",
  "faturas/3000055479-05-2023.pdf",
  "faturas/3000055479-06-2023.pdf",
  "faturas/3000055479-07-2023.pdf",
  "faturas/3000055479-08-2023.pdf",
  "faturas/3000055479-09-2023.pdf",
  "faturas/3000055479-10-2023.pdf",
  "faturas/3000055479-11-2023.pdf",
  "faturas/3000055479-12-2023.pdf",
  "faturas/3004298116-01-2023.pdf",
  "faturas/3004298116-02-2023.pdf",
  "faturas/3004298116-03-2023.pdf",
  "faturas/3004298116-04-2023.pdf",
  "faturas/3004298116-05-2023.pdf",
  "faturas/3004298116-06-2023.pdf",
  "faturas/3004298116-07-2023.pdf",
  "faturas/3004298116-08-2023.pdf",
  "faturas/3004298116-09-2023.pdf",
  "faturas/3004298116-10-2023.pdf",
  "faturas/3004298116-11-2023.pdf",
  "faturas/3004298116-12-2023.pdf",
];

// Mapeamento de meses em português para números
const meses = {
  JAN: 1,
  FEV: 2,
  MAR: 3,
  ABR: 4,
  MAI: 5,
  JUN: 6,
  JUL: 7,
  AGO: 8,
  SET: 9,
  OUT: 10,
  NOV: 11,
  DEZ: 12,
};

// Função para conectar-se ao banco de dados
async function conectarBanco() {
  await prisma.$connect();
  console.log("Conexão com o banco de dados estabelecida.");
}

// Função para desconectar do banco de dados
async function desconectarBanco() {
  await prisma.$disconnect();
  console.log("Conexão com o banco de dados encerrada.");
}

// Função para deletar todos os registros da tabela antes de inserir novos dados
async function deletarRegistrosExistentes() {
  try {
    await prisma.lumi.deleteMany();
    console.log("Registros existentes deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar registros existentes:", error.message);
  }
}

// Função para inserir os dados de uma fatura no banco de dados
async function inserirDadosFatura(
  numerocliente,
  mesanoreferencia,
  mesreferencia,
  anoreferencia,
  energiaeletricaqnt,
  energiaeletricavalor,
  energiasceeqnt,
  energiasceevalor,
  energiacompensadaqnt,
  energiacompensadavalor,
  contribmunicipalvalor,
  nomepdf
) {
  // Log para depuração
  console.log({
    numerocliente,
    mesanoreferencia,
    mesreferencia,
    anoreferencia,
    energiaeletricaqnt,
    energiaeletricavalor,
    energiasceeqnt,
    energiasceevalor,
    energiacompensadaqnt,
    energiacompensadavalor,
    contribmunicipalvalor,
    nomepdf,
  });

  try {
    const novaFatura = await prisma.lumi.create({
      data: {
        numerocliente: numerocliente || null,
        mesanoreferencia: mesanoreferencia || null,
        mesreferencia:
          mesreferencia !== null ? parseInt(mesreferencia, 10) : null,
        anoreferencia:
          anoreferencia !== null ? parseInt(anoreferencia, 10) : null,
        energiaeletricaqnt:
          energiaeletricaqnt !== null
            ? parseFloat(energiaeletricaqnt.replace(",", "."))
            : 0,
        energiaeletricavalor:
          energiaeletricavalor !== null
            ? parseFloat(energiaeletricavalor.replace(",", "."))
            : 0,
        energiasceeqnt:
          energiasceeqnt !== null
            ? parseFloat(energiasceeqnt.replace(",", "."))
            : 0,
        energiasceevalor:
          energiasceevalor !== null
            ? parseFloat(energiasceevalor.replace(",", "."))
            : 0,
        energiacompensadaqnt:
          energiacompensadaqnt !== null
            ? parseFloat(energiacompensadaqnt.replace(",", "."))
            : 0,
        energiacompensadavalor:
          energiacompensadavalor !== null
            ? parseFloat(energiacompensadavalor.replace(",", "."))
            : 0,
        contribmunicipalvalor:
          contribmunicipalvalor !== null
            ? parseFloat(contribmunicipalvalor.replace(",", "."))
            : 0,
        nomepdf,
      },
    });
    console.log("Dados da fatura inseridos no banco de dados:", novaFatura);
  } catch (error) {
    console.error(
      "Erro ao inserir dados da fatura no banco de dados:",
      error.message
    );
    console.error(error.meta); // Adicionar metadados do erro para ajudar na depuração
  }
}

// Função para processar múltiplos arquivos PDF e inserir os dados no banco de dados
async function processarPDFsEInserirNoBanco(pdfFiles) {
  for (const filePath of pdfFiles) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const texto = data.text;
      const referencia = obterReferenciaNumeroCliente(texto, "Referente a");
      const numeroCliente = obterReferenciaNumeroCliente(
        texto,
        "Nº DO CLIENTE"
      );
      const energiaEletrica = obterValoreEnergiaEletrica(
        texto,
        "Energia ElétricakWh",
        -4,
        -2
      );
      let energiaScee = obterValoreEnergiaEletrica(
        texto,
        "Energia SCEE s/ ICMSkWh",
        -4,
        -2
      );
      if (energiaScee == null) {
        energiaScee = obterValoreEnergiaEletrica(
          texto,
          "Energia SCEE ISENTA",
          -4,
          -2
        );
      }
      const energiaCompensada = obterValoreEnergiaEletrica(
        texto,
        "Energia compensada GD IkWh",
        -4,
        -2
      );
      const contribPublicaMunicipal = obterValoreEnergiaEletrica(
        texto,
        "Contrib Ilum Publica Municipal",
        -1,
        -1
      );

      // Extraindo mês e ano de referência do campo "Referente a" (exemplo: "FEV/2023")
      const [mesTexto, anoTexto] = referencia
        ? referencia.split("/")
        : [null, null];
      const mesanoreferencia = referencia || null;
      const mesreferencia = mesTexto ? meses[mesTexto.toUpperCase()] : null;
      const anoreferencia = anoTexto ? parseInt(anoTexto, 10) : null;

      await inserirDadosFatura(
        numeroCliente,
        mesanoreferencia,
        mesreferencia,
        anoreferencia,
        energiaEletrica ? energiaEletrica.primeiroValor : null,
        energiaEletrica ? energiaEletrica.segundoValor : null,
        energiaScee ? energiaScee.primeiroValor : null,
        energiaScee ? energiaScee.segundoValor : null,
        energiaCompensada ? energiaCompensada.primeiroValor : null,
        energiaCompensada ? energiaCompensada.segundoValor : null,
        contribPublicaMunicipal ? contribPublicaMunicipal.primeiroValor : null,
        filePath
      );
    } catch (error) {
      console.error(
        `Erro ao processar o arquivo ${filePath} e inserir os dados no banco de dados:`,
        error.message
      );
    }
  }
}

// Função para localizar a sequência "Referente a" e retornar a próxima linha
function obterReferenciaNumeroCliente(texto, busca) {
  const linhas = texto.split("\n");
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].includes(busca)) {
      if (i + 1 < linhas.length) {
        const proximaLinha = linhas[i + 1].trim();
        const referencia = proximaLinha.split(/\s+/)[0];
        if (referencia) {
          return referencia;
        }
      }
    }
  }
  return null;
}

function obterValoreEnergiaEletrica(texto, busca, iv1, iv2) {
  const linhas = texto.split("\n");
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].includes(busca)) {
      const linha = linhas[i].trim();
      const partes = linha.split(/\s+/);
      if (partes.length >= 4) {
        const primeiroValor = partes[partes.length + iv1];
        const segundoValor = partes[partes.length + iv2];
        return { primeiroValor, segundoValor };
      }
    }
  }
  return null;
}

// Chamada das funções para conectar-se ao banco de dados, deletar registros existentes e processar os PDFs
async function main() {
  await conectarBanco();
  await deletarRegistrosExistentes();
  await processarPDFsEInserirNoBanco(pdfFiles);
  await desconectarBanco();
}

main();
