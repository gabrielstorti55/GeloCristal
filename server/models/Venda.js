import mongoose from 'mongoose';

const vendaSchema = new mongoose.Schema(
  {
    clienteId: { type: String, required: true, trim: true, index: true },
    pedido: { type: String, required: true, trim: true },
    valor: { type: Number, default: 0 },
    formaPagamento: { type: String, default: '', trim: true },
    dataPedido: { type: String, required: true, trim: true },
    dataEntrega: { type: String, required: true, trim: true },
    horaEntrega: { type: String, default: '', trim: true },
    enderecoEntrega: { type: String, default: '', trim: true },
    entregue: { type: Boolean, default: false },
    pago: { type: Boolean, default: false },
    obs: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Venda || mongoose.model('Venda', vendaSchema);
