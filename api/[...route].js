import 'dotenv/config';
import mongoose from 'mongoose';
import Cliente from '../server/models/Cliente.js';
import Venda from '../server/models/Venda.js';

let cachedConnection = null;

async function ensureConnection() {
  if (cachedConnection) return cachedConnection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Defina MONGODB_URI nas variaveis de ambiente do deploy.');
  }

  cachedConnection = await mongoose.connect(uri);
  return cachedConnection;
}

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

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function getRouteParts(req) {
  const route = req.query?.route;
  if (Array.isArray(route)) return route;
  if (typeof route === 'string' && route.length) return [route];
  return [];
}

function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await ensureConnection();
      await handler(req, res);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return sendJson(res, 400, { message: 'Dados invalidos.', details: error.message });
      }

      if (error instanceof mongoose.Error.CastError) {
        return sendJson(res, 400, { message: 'Identificador invalido.' });
      }

      console.error(error);
      return sendJson(res, 500, { message: 'Erro interno do servidor.' });
    }
  };
}

const handler = withErrorHandling(async (req, res) => {
  const [resource, id] = getRouteParts(req);

  if (!resource) {
    if (req.method === 'GET') return sendJson(res, 200, { ok: true });
    return sendJson(res, 405, { message: 'Metodo nao permitido.' });
  }

  if (resource === 'health') {
    if (req.method !== 'GET') return sendJson(res, 405, { message: 'Metodo nao permitido.' });
    return sendJson(res, 200, { ok: true });
  }

  if (resource === 'clientes') {
    if (req.method === 'GET' && !id) {
      const clientes = await Cliente.find().sort({ createdAt: -1 });
      return sendJson(res, 200, clientes.map(toApiModel));
    }

    if (req.method === 'POST' && !id) {
      const created = await Cliente.create(req.body || {});
      return sendJson(res, 201, toApiModel(created));
    }

    if (req.method === 'PUT' && id) {
      const updated = await Cliente.findByIdAndUpdate(id, req.body || {}, { new: true, runValidators: true });
      if (!updated) return sendJson(res, 404, { message: 'Cliente nao encontrado.' });
      return sendJson(res, 200, toApiModel(updated));
    }

    if (req.method === 'DELETE' && id) {
      const deleted = await Cliente.findByIdAndDelete(id);
      if (!deleted) return sendJson(res, 404, { message: 'Cliente nao encontrado.' });
      return res.status(204).end();
    }

    return sendJson(res, 405, { message: 'Metodo nao permitido.' });
  }

  if (resource === 'vendas') {
    if (req.method === 'GET' && !id) {
      const vendas = await Venda.find().sort({ createdAt: -1 });
      return sendJson(res, 200, vendas.map(toApiModel));
    }

    if (req.method === 'POST' && !id) {
      const payload = {
        ...(req.body || {}),
        valor: Number(req.body?.valor || 0),
      };
      const created = await Venda.create(payload);
      return sendJson(res, 201, toApiModel(created));
    }

    if (req.method === 'PUT' && id) {
      const payload = {
        ...(req.body || {}),
        valor: Number(req.body?.valor || 0),
      };
      const updated = await Venda.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!updated) return sendJson(res, 404, { message: 'Venda nao encontrada.' });
      return sendJson(res, 200, toApiModel(updated));
    }

    if (req.method === 'DELETE' && id) {
      const deleted = await Venda.findByIdAndDelete(id);
      if (!deleted) return sendJson(res, 404, { message: 'Venda nao encontrada.' });
      return res.status(204).end();
    }

    return sendJson(res, 405, { message: 'Metodo nao permitido.' });
  }

  return sendJson(res, 404, { message: 'Rota nao encontrada.' });
});

export default handler;
