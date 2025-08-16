import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => setProduct(data))
                .catch((err) => console.error('Error fetching product:', err));
        }
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-details">
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
            >
                {product.images.map((img, index) => (
                    <Image key={index} src={img} alt={product.name} width={300} height={300}/>
                ))}
            </Carousel>
            <h2>{product.name}</h2>
            <button
                onClick={() => addToCart(product)}
                className="icon-container"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                <Image
                    alt="Add to Cart"
                    src="/icons/plus-large-svgrepo-com.svg"
                    fill
                />
            </button>
        </div>
    );

    function addToCart(product) {
        // Simplified cart logic (stored in localStorage)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    }
}