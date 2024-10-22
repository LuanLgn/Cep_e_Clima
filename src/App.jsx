import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [cep, setCep] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarDadosCep = async () => {
    if (!cep) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`); // Correção aqui
      const cepData = await response.json();

      if (cepData.erro) {
        alert('CEP inválido');
        setLoading(false);
        return;
      }

      const cidade = cepData.localidade;
      const climaResponse = await fetch(`https://wttr.in/${cidade}?format=j1&lang=pt`); // Correção aqui
      const climaData = await climaResponse.json();

      // Verificações de segurança
      if (!climaData.current_condition || !climaData.weather) {
        throw new Error('Dados climáticos não disponíveis.');
      }

      const info = {
        cidade: cepData.localidade,
        logradouro: cepData.logradouro,
        bairro: cepData.bairro,
        estado: cepData.uf,
        temperaturaMinima: climaData.current_condition[0]?.temp_C || 'N/A',
        temperaturaMaxima: climaData.current_condition[0]?.temp_C || 'N/A',
        chanceChuva: climaData.current_condition[0]?.chanceofrain || 'N/A',
        dataAtual: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        descricaoAtual: climaData.current_condition[0]?.lang_pt[0]?.value || 'Descrição não disponível',
        previsao: climaData.weather
          .slice(1, 6) // Começa a partir do próximo dia, limitando a 5 dias
          .map((dia) => ({
            data: dia.date,
            descricao: dia.lang_pt && dia.lang_pt[0] ? dia.lang_pt[0].value : 'Descrição não disponível',
            temperaturaMinima: dia.mintempC,
            temperaturaMaxima: dia.maxtempC,
            chanceChuva: dia.hourly[0]?.chanceofrain || 'N/A',
          })),
      };

      setData(info);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error); // Registro no console para depuração
      alert(`Erro ao buscar os dados: ${error.message}`); // Correção aqui
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Consulta CEP e Clima</h1>
      <input
        type="text"
        placeholder="Digite o CEP"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        className="input"
      />
      <button onClick={buscarDadosCep} disabled={loading}>
        Buscar
      </button>

      {loading && <p>Carregando...</p>}

      {data && (
        <div className="results">
          <h2>Previsão do tempo para {data.cidade}</h2>
          <p>{data.logradouro}, {data.bairro} - {data.estado}</p>
          {data.previsao.map((dia, index) => (
            <div key={index} className="weather-day">
              <h4>{new Date(dia.data).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
              <p>Descrição: {data.descricaoAtual}</p>
              <p>Temperatura Mínima: {dia.temperaturaMinima} °C | Temperatura Máxima: {dia.temperaturaMaxima} °C</p>
              <p>Chance de Chuva: {dia.chanceChuva}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
