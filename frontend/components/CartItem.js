import Image from "next/image";

export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="cart-item">
            <div className="image-wrapper">
                <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <div className="cart-info-container">
                <p>{item.name}</p>
                <div className="quantity-controls">
                    <button
                        className="icon-container small-icon-container"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Image
                            alt="Decrease quantity"
                            src="/icons/minus-circle-svgrepo-com.svg"
                            fill
                        />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        className="icon-container small-icon-container"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Image
                            alt="Increase quantity"
                            src="/icons/plus-circle-svgrepo-com.svg"
                            fill
                        />
                    </button>
                    <p>{item.price} RUB</p>
                </div>
            </div>

            <button
                className="icon-container small-icon-container"
                onClick={() => removeItem(item.id)}
            >
                <Image
                    alt="Remove item"
                    src="/icons/cross-circle-svgrepo-com.svg"
                    fill
                />
            </button>
        </div>
    );
}