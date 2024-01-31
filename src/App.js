import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function App() {
  const [fonKodu, setFonKodu] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [chartData, setChartData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://4ohlv1rvj8.execute-api.eu-west-3.amazonaws.com/prod/yatirimcilar?FonKodu=${fonKodu}`, {
        headers: {
          'x-api-key': apiKey
        }
      });
      const data = response.data;
      setChartData({
        labels: data.map(item => item.Tarih),
        datasets: [
          {
            label: 'Kişi Sayısı',
            data: data.map(item => parseFloat(item["Kişi Sayısı"].replace(/\./g, '').replace(',', '.'))),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          // Diğer veri setleri burada eklenebilir
        ]
      });
    } catch (error) {
      console.error('Veri çekme hatası', error);
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={fonKodu}
        onChange={(e) => setFonKodu(e.target.value)}
        placeholder="Fon Kodu Girin"
      />
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Anahtarı Girin"
      />
      <button onClick={fetchData}>Veriyi Çek</button>
      {chartData.labels && <Line data={chartData} />}
    </div>
  );
}

export default App;