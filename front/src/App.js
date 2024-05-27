import { useEffect, useState } from "react";
import "./App.css";
import { MdVisibility } from "react-icons/md";
import axios from "axios";
import { Chart } from "react-google-charts";

const Painel = ({ valores, onHidePainel, onShowDashboard }) => {
  const handleVisibilityClick = (numeroCliente) => {
    onHidePainel();
    onShowDashboard(numeroCliente);
  };

  return (
    <div className="painel">
      <div className="valores">
        <table>
          <thead>
            <tr>
              <th>Número Cliente</th>
              <th>Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {valores.map((valor) => {
              return (
                <tr key={valor.numerocliente}>
                  <td>{valor.numerocliente}</td>
                  <td>
                    <button
                      onClick={() => handleVisibilityClick(valor.numerocliente)}
                    >
                      <MdVisibility size={20} color={"#0f3523"} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = ({ onHideDashboard, valores }) => {
  const handleDownload = (mesanoreferencia) => {
    
    const link = document.createElement("a");
    link.href = process.env.PUBLIC_URL + `/${mesanoreferencia}`; 
    link.download = `${mesanoreferencia}.pdf`; 
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
  };
  // Calcular o somatório de energiaeletricaqnt e energiasceeqnt
  const totalEnergiaEletricaQnt = valores.reduce(
    (acc, valor) => acc + valor.energiaeletricaqnt,
    0
  );
  const totalEnergiaSCEEQnt = valores.reduce(
    (acc, valor) => acc + valor.energiasceeqnt,
    0
  );
  const totalEnergiaCompensada = valores.reduce(
    (acc, valor) => acc + valor.energiacompensadaqnt,
    0
  );
  const totalContribPublicaMunicipalValor = valores.reduce(
    (acc, valor) => acc + parseFloat(valor.contribmunicipalvalor),
    0
  );

  const totalEnergiaEletricaQntValor = valores.reduce(
    (acc, valor) => acc + parseFloat(valor.energiaeletricavalor),
    0
  );
  const totalEnergiaSCEEQntValor = valores.reduce(
    (acc, valor) => acc + parseFloat(valor.energiasceevalor),
    0
  );
  const totalEconomiaGD = valores.reduce(
    (acc, valor) => acc + parseFloat(valor.energiacompensadavalor),
    0
  );

  const valorTotalGD = (
    totalContribPublicaMunicipalValor +
    totalEnergiaEletricaQntValor +
    totalEnergiaSCEEQntValor
  ).toFixed(2);
  const consumoEnergiaEletricaTotal =
    parseInt(totalEnergiaEletricaQnt) + parseInt(totalEnergiaSCEEQnt);

  let dataQtd = [
    ["Element", "Indice", { role: "style" }],
    ["Consumo de Energia Elétrica KWh", consumoEnergiaEletricaTotal, "#b87333"],
    ["Energia Compensada kWh", totalEnergiaCompensada, "#b833b0"],
  ];
  let dataValor = [
    ["Element", "Indice", { role: "style" }],
    ["Valor Total sem GD", parseInt(valorTotalGD), "#b90333"],
    ["Economia GD", parseInt(totalEconomiaGD * -1), "#4ecb31"],
  ];

  return (
    <div className="dashboard">
      <div>
        <h2>Dashboard</h2>
        <p>Numero Cliente: {valores[0]?.numerocliente}</p>
        <div className="componentePdf">
          <label>Baixar 2 via Fatura: </label>
          <select
            onChange={(e) => handleDownload(e.target.value)}
            defaultValue={"DEFAULT"}
          >
            <option value="DEFAULT" disabled>
              Selecione
            </option>
            {valores.map((valor, index) => (
              <option value={valor.nomepdf} key={index}>
                {valor.mesanoreferencia}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={onHideDashboard}>
          Voltar
        </button>
        <div className="graficos">
          <Chart
            chartType="ColumnChart"
            width="80%"
            height="300px"
            data={dataQtd}
          />
          <Chart
            chartType="ColumnChart"
            width="80%"
            height="300px"
            data={dataValor}
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [valores, setValores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredValores, setFilteredValores] = useState([]);
  const [isVisiblePainel, setIsVisiblePainel] = useState(true);
  const [isVisibleDashboard, setIsVisibleDashboard] = useState(false);
  const [selectedValores, setSelectedValores] = useState([]);

  useEffect(() => {
    async function getValores() {
      const response = await axios.get(
        "https://lumi-api-vbjt.onrender.com/lumi"
      );
      const valores = response.data;

      // Criar um conjunto (Set) para armazenar valores únicos de numerocliente
      const uniqueNumerosCliente = Array.from(
        new Set(valores.map((valor) => valor.numerocliente))
      ).map((numerocliente) =>
        valores.find((valor) => valor.numerocliente === numerocliente)
      );

      
      setValores(valores);
      setFilteredValores(uniqueNumerosCliente);
    }

    getValores();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      const uniqueNumerosCliente = Array.from(
        new Set(valores.map((valor) => valor.numerocliente))
      ).map((numerocliente) =>
        valores.find((valor) => valor.numerocliente === numerocliente)
      );
      setFilteredValores(uniqueNumerosCliente);
    } else {
      const result = valores.filter(
        (valor) => valor.numerocliente.toString() === searchTerm
      );
      const uniqueResult = Array.from(
        new Set(result.map((valor) => valor.numerocliente))
      ).map((numerocliente) =>
        result.find((valor) => valor.numerocliente === numerocliente)
      );
      setFilteredValores(uniqueResult);
    }
  };

  const handleHidePainel = () => {
    setIsVisiblePainel(false);
  };

  const handleShowDashboard = (numeroCliente) => {
    const selectedValores = valores.filter(
      (valor) => valor.numerocliente === numeroCliente
    );
    setSelectedValores(selectedValores);
    setIsVisibleDashboard(true);
  };

  const handleHideDashboard = () => {
    setIsVisiblePainel(true);
    setIsVisibleDashboard(false);
  };

  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1>LUMI</h1>
        </div>
        {isVisiblePainel && (
          <div className="search">
            <input
              className="inputSearch"
              type="number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o número do cliente"
            />
            <button className="btn" onClick={handleSearch}>
              Pesquisar
            </button>
          </div>
        )}
        {isVisiblePainel && (
          <Painel
            valores={filteredValores}
            onHidePainel={handleHidePainel}
            onShowDashboard={handleShowDashboard}
          />
        )}
        {isVisibleDashboard && (
          <Dashboard
            valores={selectedValores}
            onHideDashboard={handleHideDashboard}
          />
        )}
      </header>
    </div>
  );
}

export default App;
