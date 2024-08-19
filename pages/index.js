import { useState } from 'react';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMongoData, setShowMongoData] = useState(false);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/api/auth/signin');
    return null;
  }

  // Verifica se o usuário tem permissão para acessar a página
  // A validação foi movida para a configuração do NextAuth
  // e não é mais necessária aqui.

  const scrapeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/scrape');
      setData(response.data.processos);
    } catch (error) {
      console.error('Erro ao baixar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleRemove = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const saveData = async () => {
    setLoading(true);
    try {
      await axios.post('/api/saveData', data);
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/getData');
      setMongoData(response.data.processos);
      setShowMongoData(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">Atualizar Tabela</h1>
            <p className="text-lg">Olá, {session.user.name}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}
        <div className="mb-4">
          <button
            onClick={scrapeData}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Baixando dados...' : 'Baixar dados do Sistema'}
          </button>
          <button
            onClick={saveData}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Carregando' : 'Atualizar dados'}
          </button>
          <button
            onClick={fetchData}
            className={`bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded ml-2 ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Carregando' : 'Mostrar dados da Página'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Período</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Edital</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.map((processo, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4">
                      <ContentEditable
                        html={processo.titulo}
                        className="bg-gray-900 p-2 rounded text-white border border-gray-700"
                        onChange={(e) => handleEdit(index, 'titulo', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <ContentEditable
                        html={processo.descricao}
                        className="bg-gray-900 p-2 rounded text-white border border-gray-700"
                        onChange={(e) => handleEdit(index, 'descricao', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <ContentEditable
                        html={processo.periodo}
                        className="bg-gray-900 p-2 rounded text-white border border-gray-700"
                        onChange={(e) => handleEdit(index, 'periodo', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <a href={processo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {processo.url}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <a href={processo.edital} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {processo.edital}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleRemove(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showMongoData && (
          <div className="overflow-x-auto mt-6">
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Dados do BD</h2>
              <table className="w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Descrição</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Período</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">URL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Edital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mongoData.map((processo, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">{processo.titulo}</td>
                      <td className="px-4 py-4">{processo.descricao}</td>
                      <td className="px-4 py-4">{processo.periodo}</td>
                      <td className="px-4 py-4">
                        <a href={processo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {processo.url}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <a href={processo.edital} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {processo.edital}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
