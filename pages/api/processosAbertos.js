// pages/api/getMongoData.js
import mongoose from 'mongoose';

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
  await connectToMongoDB();

  if (req.method === 'GET') {
    try {
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
