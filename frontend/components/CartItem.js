export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="cart-item">
            <p>{item.name}</p>
            <p>{item.price} RUB x </p>
            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
            />
            <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
    );
}