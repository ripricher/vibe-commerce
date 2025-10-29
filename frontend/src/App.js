import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [checkout, setCheckout] = useState(null);

  // Fetch products
  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      setProducts(res.data);
    });
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get("http://localhost:5000/api/cart").then((res) => {
      setCart(res.data.cart);
      setTotal(res.data.total);
    });
  };

  const addToCart = (id) => {
    axios.post("http://localhost:5000/api/cart", { productId: id, qty: 1 }).then(() => fetchCart());
  };

  const removeFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`).then(() => fetchCart());
  };

  const handleCheckout = () => {
    axios.post("http://localhost:5000/api/checkout", { cartItems: cart }).then((res) => {
      setCheckout(res.data);
      fetchCart();
    });
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>🛒 Vibe Commerce</h1>
      <h2>Products</h2>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "10px",
              width: "180px",
              textAlign: "center",
            }}
          >
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "40px" }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.qty} — ₹{item.price * item.qty}{" "}
              <button onClick={() => removeFromCart(item.id)}>❌ Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{total}</h3>
      <button onClick={handleCheckout} disabled={!cart.length}>
        Checkout
      </button>

      {checkout && (
        <div style={{ marginTop: "20px", borderTop: "1px solid gray", paddingTop: "10px" }}>
          <h3>✅ Receipt</h3>
          <p>Total: ₹{checkout.total}</p>
          <p>Timestamp: {checkout.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default App;
