export default function Customers() {
  const customers = [
    { name: 'Casa Lima', city: 'Recife', orders: 42 },
    { name: 'Mercado Sol', city: 'Natal', orders: 27 },
    { name: 'Padaria Ipê', city: 'João Pessoa', orders: 15 },
  ];

  return (
    <main className="screen">
      <h1>Customers</h1>
      <section className="stats">
        <article className="stat-card">
          <p className="stat-card__label">Active customers</p>
          <p className="stat-card__value">312</p>
          <p className="stat-card__delta stat-card__delta--up">+18 this month</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">New this week</p>
          <p className="stat-card__value">9</p>
          <p className="stat-card__delta stat-card__delta--up">+3 vs last week</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Churned</p>
          <p className="stat-card__value">4</p>
          <p className="stat-card__delta stat-card__delta--down">-1 this month</p>
        </article>
      </section>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>City</th><th>Orders</th></tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.name}>
              <td>{customer.name}</td><td>{customer.city}</td><td>{customer.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
