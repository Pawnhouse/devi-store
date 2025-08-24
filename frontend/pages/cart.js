import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartItem from "../components/CartItem";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: 'Москва',
        deliveryMethod: 'pickup'
    });
    const router = useRouter();

    function getCartWithDetails(storedCart, products) {
        return storedCart.map(item => {
            const product = products.find(p => p.id === item.id);
            return { ...product, quantity: item.quantity };
        });
    }

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');

        fetch(`http://localhost:5000/api/products`)
            .then(res => res.json())
            .then(products => {
                const cartWithDetails = getCartWithDetails(storedCart, products);
                setCart(cartWithDetails);
            })
            .catch(err => console.error('Error fetching products for cart:', err));
    }, []);

    const updateQuantity = (id, quantity) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Number(quantity)) } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const order = {
            ...formData,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity
            })),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (res.ok) {
                localStorage.removeItem('cart');
                toast.success('Order placed successfully!');
                router.push('/');
            } else {
                toast.error('Error placing order.');
            }
        } catch (err) {
            console.error('Error submitting order:', err);
            toast.error('Error placing order.');
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ maxWidth: '500px' }}>
            <h2>Ваш заказ</h2>
            {cart.length === 0 ? (
                <p>Корзина пуста.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                        />
                    ))}
                    <p style={{ textAlign: 'right' }}>Subtotal: {total.toFixed(2)} RUB</p>
                    <form
                        className="flex-column"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            label="Фамилия Имя"
                            variant="standard"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            label="Email"
                            variant="standard"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            label="Телефон"
                            variant="standard"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <fieldset className="flex-column">
                            <legend>Delivery</legend>
                            <TextField
                                label="City"
                                variant="standard"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="cdek"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="pick-up-point"
                                    control={<Radio/>}
                                    label="До пункта выдачи СДЭК"
                                />
                                <FormControlLabel
                                    value="delivery"
                                    control={<Radio/>}
                                    label="Доставка в пределах МКАД"
                                />
                            </RadioGroup>
                        </fieldset>
                        <button className="submit-button">Submit Order</button>
                    </form>
                </>
            )}
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar/>
        </div>
    );
}
