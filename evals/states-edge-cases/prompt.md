---
description: Error, empty and loading states go to Impeccable's harden scope.
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

This order list only works when the API answers fast with data. Make it ready for when the API is slow, fails or returns nothing. Reply with the updated component.

```jsx
export function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { fetch('/api/orders').then((r) => r.json()).then(setOrders); }, []);
  return (
    <ul className="orders">
      {orders.map((order) => <li key={order.id}>{order.customer} · {order.total}</li>)}
    </ul>
  );
}
```
