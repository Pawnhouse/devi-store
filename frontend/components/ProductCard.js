import Image from 'next/image';
import { useRouter } from "next/router";

export default function ProductCard({ product }) {
    const router = useRouter();

    return (
        <button onClick={() => router.push({ query: { productId: product.id } })}>
            <div className="image-wrapper">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <h3 className="product-name">{product.code}</h3>
        </button>
    );
}