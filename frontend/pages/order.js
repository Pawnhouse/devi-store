import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const router = useRouter();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const order = { ...formData, items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) };
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (res.ok) {
                localStorage.removeItem('cart');
                alert('Order placed successfully!');
                router.push('/');
            } else {
                alert('Error placing order.');
            }
        } catch (err) {
            console.error('Error submitting order:', err);
            alert('Error placing order.');
        }
    };

    return (
        <>
            <h2>Place Your Order</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </label>
                <label>
                    Address:
                    <textarea name="address" value={formData.address} onChange={handleInputChange} required />
                </label>
                <h3>Order Summary</h3>
                {cart.map((item) => (
                    <p key={item.id}>{item.name} - {item.quantity} x {item.price} RUB</p>
                ))}
                <p>Subtotal: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} RUB</p>
                <button type="submit">Submit Order</button>
            </form>
        </>
    );
}