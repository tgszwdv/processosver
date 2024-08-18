import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

const processoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  periodo: String,
  url: String,
  edital: String
});

const Processo = mongoose.models.Processo || mongoose.model('Processo', processoSchema);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    const processosAtualizados = req.body;

    if (!Array.isArray(processosAtualizados)) {
      return res.status(400).send('Dados inválidos.');
    }

    await Processo.deleteMany({});
    await Processo.insertMany(processosAtualizados);

    res.status(200).send('Dados atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar os dados na API:', error.message);
    res.status(500).send('Erro ao atualizar os dados na API');
  }
};
