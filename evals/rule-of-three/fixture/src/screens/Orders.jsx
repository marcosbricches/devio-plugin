export default function Orders() {
  const orders = [
    { id: 'PO-1042', customer: 'Casa Lima', total: 'R$ 1.240,00', status: 'Shipped' },
    { id: 'PO-1041', customer: 'Mercado Sol', total: 'R$ 860,50', status: 'Packing' },
    { id: 'PO-1040', customer: 'Padaria Ipê', total: 'R$ 312,00', status: 'Delivered' },
  ];

  return (
    <main className="screen">
      <h1>Orders</h1>
      <section className="stats">
        <article className="stat-card">
          <p className="stat-card__label">Open orders</p>
          <p className="stat-card__value">128</p>
          <p className="stat-card__delta stat-card__delta--up">+12 this week</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Shipped today</p>
          <p className="stat-card__value">34</p>
          <p className="stat-card__delta stat-card__delta--up">+5 vs yesterday</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Returns</p>
          <p className="stat-card__value">3</p>
          <p className="stat-card__delta stat-card__delta--down">-2 this week</p>
        </article>
      </section>
      <table className="table">
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td><td>{order.customer}</td><td>{order.total}</td><td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
