import { useMemo, useRef, useState } from 'react';

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DeliveryCalendar({ vendas, clientes, today, fmtDate, moneyBR }) {
  const [cursorDate, setCursorDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(today);
  const [showDelivered, setShowDelivered] = useState(false);
  const touchStartX = useRef(null);

  const monthLabel = useMemo(
    () => cursorDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    [cursorDate],
  );

  const calendarMeta = useMemo(() => {
    const year = cursorDate.getFullYear();
    const month = cursorDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    return { cells };
  }, [cursorDate]);

  const deliveriesByDate = useMemo(() => {
    const grouped = {};
    vendas
      .filter((v) => (showDelivered ? true : !v.entregue))
      .forEach((v) => {
        if (!v.dataEntrega) return;
        if (!grouped[v.dataEntrega]) grouped[v.dataEntrega] = [];
        grouped[v.dataEntrega].push(v);
      });
    return grouped;
  }, [vendas, showDelivered]);

  const overdueDates = useMemo(() => {
    const set = new Set();
    vendas
      .filter((v) => !v.entregue && v.dataEntrega && v.dataEntrega < today)
      .forEach((v) => set.add(v.dataEntrega));
    return set;
  }, [vendas, today]);

  const selectedItems = deliveriesByDate[selectedDate] || [];

  function shiftMonth(offset) {
    setCursorDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function goToToday() {
    const now = new Date();
    setCursorDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(toIsoDate(now));
  }

  function handleTouchStart(e) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) shiftMonth(1);
    else shiftMonth(-1);
  }

  function getWeekRange(anchorIso) {
    const anchor = new Date(`${anchorIso}T00:00:00`);
    const mondayOffset = (anchor.getDay() + 6) % 7;
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - mondayOffset);
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      days.push(toIsoDate(current));
    }
    return days;
  }

  async function exportWeekPdf() {
    const { jsPDF } = await import('jspdf');
    const weekDays = getWeekRange(selectedDate);
    const doc = new jsPDF();
    let y = 16;

    doc.setFontSize(16);
    doc.text('Agenda semanal de entregas - Gelo Cristal', 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Periodo: ${fmtDate(weekDays[0])} ate ${fmtDate(weekDays[6])}`, 14, y);
    y += 10;

    weekDays.forEach((iso) => {
      const items = (deliveriesByDate[iso] || []).sort((a, b) => (a.horaEntrega || '99:99').localeCompare(b.horaEntrega || '99:99'));

      if (y > 270) {
        doc.addPage();
        y = 16;
      }

      doc.setFontSize(12);
      doc.text(`${fmtDate(iso)} (${items.length})`, 14, y);
      y += 6;

      if (!items.length) {
        doc.setFontSize(10);
        doc.text('- Sem entregas', 18, y);
        y += 6;
        return;
      }

      items.forEach((v) => {
        if (y > 276) {
          doc.addPage();
          y = 16;
        }
        const cli = clientes.find((c) => c.id === v.clienteId);
        const line = `${v.horaEntrega || '--:--'} | ${cli ? cli.nome : 'Cliente removido'} | ${v.pedido}`;
        const wrapped = doc.splitTextToSize(line, 180);
        doc.setFontSize(10);
        doc.text(wrapped, 18, y);
        y += wrapped.length * 5;
      });

      y += 2;
    });

    const suffix = showDelivered ? 'com-entregues' : 'pendentes';
    doc.save(`agenda-semanal-${selectedDate}-${suffix}.pdf`);
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="card-header">
        <span className="card-title">Calendário de Entregas</span>
        <div className="calendar-toolbar">
          <label className="calendar-toggle">
            <input type="checkbox" checked={showDelivered} onChange={(e) => setShowDelivered(e.target.checked)} />
            Incluir entregues
          </label>
          <button className="btn btn-ghost btn-sm" onClick={exportWeekPdf}>
            Exportar semana (PDF)
          </button>
          <div className="calendar-nav">
            <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(-1)}>
              ←
            </button>
            <span className="calendar-month-label">{monthLabel}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(1)}>
              →
            </button>
            <button className="btn btn-primary btn-sm" onClick={goToToday}>
              Hoje
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="delivery-calendar" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="calendar-grid calendar-weekdays">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>

          <div className="calendar-grid">
            {calendarMeta.cells.map((cell, idx) => {
              if (!cell) {
                return <button className="calendar-day calendar-day-empty" key={`empty-${idx}`} disabled></button>;
              }

              const iso = toIsoDate(cell);
              const count = (deliveriesByDate[iso] || []).length;
              const isToday = iso === today;
              const isSelected = iso === selectedDate;
              const isOverdue = overdueDates.has(iso);

              return (
                <button
                  key={iso}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isOverdue ? 'overdue' : ''}`}
                  onClick={() => setSelectedDate(iso)}
                >
                  <span className="calendar-day-number">{cell.getDate()}</span>
                  {!!count && <span className={`calendar-day-badge ${isOverdue ? 'badge-overdue' : ''}`}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="divider"></div>
        <div className="calendar-selected-header">
          <span className="detail-label">{showDelivered ? 'Entregas em' : 'Pendências em'}</span>
          <strong>{fmtDate(selectedDate)}</strong>
        </div>

        {!selectedItems.length && (
          <div className="td-muted">
            {showDelivered ? 'Nenhuma entrega nesta data.' : 'Nenhuma entrega pendente para esta data.'}
          </div>
        )}

        {!!selectedItems.length &&
          selectedItems
            .sort((a, b) => (a.horaEntrega || '99:99').localeCompare(b.horaEntrega || '99:99'))
            .map((v) => {
              const cli = clientes.find((c) => c.id === v.clienteId);
              return (
                <div className="calendar-delivery-item" key={v.id}>
                  <div>
                    <div className="td-name">{cli ? cli.nome : 'Cliente removido'}</div>
                    <div className="td-muted">
                      {v.horaEntrega ? `Entrega às ${v.horaEntrega}` : 'Horário não definido'}
                    </div>
                    <div className="td-muted">{v.pedido}</div>
                  </div>
                  <div className="calendar-delivery-meta">
                    {v.valor ? <span className="badge badge-info">{moneyBR(v.valor)}</span> : null}
                    {v.entregue ? <span className="badge badge-success">Entregue</span> : <span className="badge badge-warning">Pendente</span>}
                    {v.pago ? <span className="badge badge-success">Pago</span> : <span className="badge badge-danger">A pagar</span>}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
