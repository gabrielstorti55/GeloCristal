import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Cliente from './models/Cliente.js';
import Venda from './models/Venda.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Defina MONGODB_URI no arquivo .env');
}

app.use(cors());
app.use(express.json());

function toApiModel(doc) {
  const raw = doc.toObject();
  return {
    ...raw,
    id: raw._id.toString(),
    criadoEm: new Date(raw.createdAt).getTime(),
    atualizadoEm: new Date(raw.updatedAt).getTime(),
    _id: undefined,
    __v: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/clientes', async (_req, res, next) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes.map(toApiModel));
  } catch (error) {
    next(error);
  }
});

app.post('/api/clientes', async (req, res, next) => {
  try {
    const created = await Cliente.create(req.body);
    res.status(201).json(toApiModel(created));
  } catch (error) {
    next(error);
  }
});

app.put('/api/clientes/:id', async (req, res, next) => {
  try {
    const updated = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Cliente nao encontrado.' });
    res.json(toApiModel(updated));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/clientes/:id', async (req, res, next) => {
  try {
    const deleted = await Cliente.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cliente nao encontrado.' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/vendas', async (_req, res, next) => {
  try {
    const vendas = await Venda.find().sort({ createdAt: -1 });
    res.json(vendas.map(toApiModel));
  } catch (error) {
    next(error);
  }
});

app.post('/api/vendas', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      valor: Number(req.body.valor || 0),
    };
    const created = await Venda.create(payload);
    res.status(201).json(toApiModel(created));
  } catch (error) {
    next(error);
  }
});

app.put('/api/vendas/:id', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      valor: Number(req.body.valor || 0),
    };
    const updated = await Venda.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Venda nao encontrada.' });
    res.json(toApiModel(updated));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/vendas/:id', async (req, res, next) => {
  try {
    const deleted = await Venda.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Venda nao encontrada.' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Dados invalidos.', details: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Identificador invalido.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API Gelo Cristal rodando em http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar API:', error);
  process.exit(1);
});
