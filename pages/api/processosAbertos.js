import mongoose from 'mongoose';
import Cors from 'cors';

// Configuração CORS
const cors = Cors({
  origin: '*', // Permite todas as origens
  methods: ['GET'], // Permite apenas GET
  allowedHeaders: ['Content-Type'], // Permite cabeçalhos específicos
});

// Função para executar middlewares em Next.js
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const mongoURI = process.env.MONGO_URI;

const connectToMongoDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado ao MongoDB Atlas com sucesso');
  } catch (err) {
    console.error('Erro de conexão com o MongoDB:', err);
  }
};

const processoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  periodo: String,
  url: String,
  edital: String
});

const Processo = mongoose.models.Processo || mongoose.model('Processo', processoSchema);

export default async function handler(req, res) {
  await runMiddleware(req, res, cors); // Aplica CORS

  if (req.method === 'GET') {
    try {
      await connectToMongoDB();
      const processos = await Processo.find({});
      res.status(200).json({ processos });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
