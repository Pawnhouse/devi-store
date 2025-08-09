import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            <Link href={`/product/${product.id}`}>
                <div>
                    <Image src={product.images[0]} alt={product.name} width={200} height={200} />
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                </div>
            </Link>
        </div>
    );
}