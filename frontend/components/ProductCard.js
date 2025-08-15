import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            <Link href={`/product/${product.id}`} className="black-link">
                <div>
                    <div className="image-wrapper">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            style={{objectFit: 'contain'}}
                        />
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                </div>
            </Link>
        </div>
    );
}