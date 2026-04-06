import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    cpf: { type: String, default: '', trim: true },
    tipo: { type: String, enum: ['pessoa_fisica', 'pessoa_juridica'], default: 'pessoa_fisica' },
    cep: { type: String, default: '', trim: true },
    rua: { type: String, default: '', trim: true },
    numero: { type: String, default: '', trim: true },
    complemento: { type: String, default: '', trim: true },
    bairro: { type: String, default: '', trim: true },
    cidade: { type: String, default: '', trim: true },
    estado: { type: String, default: '', trim: true },
    obs: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('Cliente', clienteSchema);
