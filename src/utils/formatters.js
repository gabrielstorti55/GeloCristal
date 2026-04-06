export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function fmtDate(d) {
  if (!d) return '–';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

export function initials(nome) {
  return (nome || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function moneyBR(value) {
  if (!value && value !== 0) return '–';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}
