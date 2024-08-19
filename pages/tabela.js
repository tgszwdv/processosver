import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Tabela() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/processosAbertos');
        setData(response.data.processos);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Processos Seletivos</h1>
      <table className="min-w-full divide-y divide-gray-200 bg-gray-800 rounded-lg">
        <thead className="bg-gray-700 text-gray-400">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Descrição</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Período</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((processo, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-white">
                <a href={processo.url}  rel="noopener noreferrer" className="block w-full h-full">
                  {processo.titulo}
                </a>
              </td>
              <td className="px-4 py-2 text-white">
                <a href={processo.url} rel="noopener noreferrer" className="block w-full h-full">
                  {processo.periodo}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
