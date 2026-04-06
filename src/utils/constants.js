export const CLIENTES_KEY = 'gc_clientes';
export const VENDAS_KEY = 'gc_vendas';

export const sectionTitleMap = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  vendas: 'Vendas',
};

export const paymentMethodLabelMap = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  cartao_debito: 'Cartão Débito',
  cartao_credito: 'Cartão Crédito',
  boleto: 'Boleto',
  a_prazo: 'A Prazo',
};

export const emptyCliente = {
  nome: '',
  telefone: '',
  email: '',
  cpf: '',
  tipo: 'pessoa_fisica',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  obs: '',
};

export const emptyVenda = {
  clienteId: '',
  pedido: '',
  valor: '',
  formaPagamento: '',
  dataPedido: '',
  dataEntrega: '',
  horaEntrega: '',
  enderecoEntrega: '',
  entregue: false,
  pago: false,
  obs: '',
};
