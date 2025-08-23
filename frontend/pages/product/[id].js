import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                renderArrowPrev={(clickHandler, hasPrev) => {
                    return (
                        <div
                            className={`${
                                hasPrev ? "absolute" : "hidden"
                            } arrow left-arrow`}
                        >
                            <button className="icon-container" onClick={clickHandler}>
                                <Image
                                    alt="Scroll to left image"
                                    src="/icons/arrow-left-svgrepo-com.svg"
                                    fill
                                />
                            </button>
                        </div>
                    );
                }}
                renderArrowNext={(clickHandler, hasNext) => {
                    return (
                        <div
                            className={`${
                                hasNext ? "" : "hidden"
                            } arrow right-arrow`}
                        >
                            <button className="icon-container" onClick={clickHandler}>
                                <Image
                                    alt="Scroll to right image"
                                    src="/icons/arrow-right-svgrepo-com.svg"
                                    fill
                                />
                            </button>
                        </div>
                    );
                }}
            >
                {product.images.map((img) => (
                    <Image
                        key={img}
                        src={img}
                        alt={product.name}
                        width={300}
                        height={300}
                        style={{ objectFit: 'contain' }}
                    />
                ))}
            </Carousel>
            <h2>{product.name}</h2>
            <p style={{ margin: "0" }}>{product.price} RUB</p>
            <p style={{ margin: "0" }}>{product.description}</p>
            <button
                onClick={() => addToCart(product)}
                className="icon-container add-to-cart"
            >
                <Image
                    alt="Add to Cart"
                    src="/icons/plus-large-svgrepo-com.svg"
                    fill
                />
            </button>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar/>
        </div>
    );

    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Added to cart!');
    }
}