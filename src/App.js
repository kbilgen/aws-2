import React, { useState } from 'react';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js modüllerini kaydet
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function App() {
  const [fonKodu, setFonKodu] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [chartData, setChartData] = useState({});

  const formatNumber = (numberString) => {
    let number = parseFloat(numberString.replace(/\./g, '').replace(',', '.'));
    return number.toFixed(3);
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://5ygl1p232h.execute-api.eu-west-3.amazonaws.com/test/yatirimci?FonKodu=${fonKodu}`, {
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
            data: data.map(item => formatNumber(item["Kişi Sayısı"])),
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
