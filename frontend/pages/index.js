import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPage from '../components/product/ProductPage';
import { useRouter } from "next/router";

export default function Home() {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error fetching products:', err));
    }, []);
    if (productId === null || productId === undefined) {
        return (
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        );
    }
    return (
        <ProductPage/>
    )
}