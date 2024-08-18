import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

const processoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  periodo: String,
  url: String,
  edital: String,
});

const Processo = mongoose.models.Processo || mongoose.model('Processo', processoSchema);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Conectar ao MongoDB
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      }

      // Buscar todos os processos
      const processos = await Processo.find({});
      
      res.status(200).json({ processos });
    } catch (error) {
      console.error('Erro ao buscar os dados na API:', error);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
