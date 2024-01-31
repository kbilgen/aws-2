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
    let formattedString = numberString.replace(/\./g, '').replace(',', '.');
    let number = parseFloat(formattedString);
    // Eğer sayının ondalık kısmı iki basamaklıysa ve sayı 1000'den küçükse, sonuna '0' ekleyin
    return number < 1000 && formattedString.includes('.') && formattedString.split('.')[1].length === 2
      ? (number.toFixed(2) + '0')
      : number.toString();
  };

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
