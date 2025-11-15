import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CartItem from "../components/cart/CartItem";
import OrderForm from "../components/cart/OrderForm";

export default function Cart({ updateCartCount }) {
    const [cart, setCart] = useState([]);

    function getCartWithDetails(storedCart, products) {
        return storedCart
            .filter(item => products.some(p => p.id === item.id))
            .map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    ...product,
                    quantity: item.quantity,
                    size: product.sizes.find(size => size.id === item.sizeId)
                };
            })
            .filter(item => item.size || item.isCertificate);
    }

    function updateCart(cart) {
        setCart(cart);
        localStorage.setItem('cart', JSON.stringify(cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            sizeId: item.size?.id || null
        }))));
        updateCartCount();
    }

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then(res => res.json())
            .then(products => {
                const cartWithDetails = getCartWithDetails(storedCart, products);
                setCart(cartWithDetails);
            })
            .catch(err => console.error('Error fetching products for cart:', err));
    }, []);

    const updateQuantity = (id, sizeId, quantity) => {
        const updatedCart = cart.map((item) =>
            item.id === id && item.size?.id === sizeId ? { ...item, quantity: Math.max(1, Number(quantity)) } : item
        );
        updateCart(updatedCart);
    };

    const removeItem = (id, sizeId) => {
        const updatedCart = cart.filter((item) => item.id !== id || sizeId !== item.size?.id);
        updateCart(updatedCart);
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
                            key={item.id + '-' + (item.size?.id || '')}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                        />
                    ))}
                    <p style={{ textAlign: 'right' }}>Subtotal: {new Intl.NumberFormat('ru-RU').format(total)} RUB</p>
                    <OrderForm cart={cart}/>
                </>
            )}
        </div>
    );
}
