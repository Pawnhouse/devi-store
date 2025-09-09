import { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPage from '../components/product/ProductPage';
import { useRouter } from "next/router";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [clickedProductId, setClickedProductId] = useState(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    const pageRef = useRef(null);
    const router = useRouter();
    const { productId } = router.query;
    const prevProductIdRef = useRef(productId);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    useEffect(() => {
        const prevProductId = prevProductIdRef.current;
        if (
            clickedProductId !== null &&
            prevProductId !== undefined &&
            productId === undefined
        ) {
            setClickedProductId(null);
        }
        prevProductIdRef.current = productId;
    }, [productId, clickedProductId, setClickedProductId]);


    useEffect(() => {
        if (clickedProductId !== null && isImageLoaded && isAnimationComplete) {
            setClickedProductId(null);
            window.scrollTo(0, 0);
        }
    }, [clickedProductId, isAnimationComplete, isImageLoaded]);

    const isProductPage = productId !== null && productId !== undefined;

    const shouldShowProductPage = clickedProductId === null;
    return (
        <>
            <div
                className="product-grid"
                ref={pageRef}
                style={{ display: isProductPage && shouldShowProductPage ? 'none' : 'grid' }}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        pageRef={pageRef}
                        clickedProductId={clickedProductId}
                        setClickedProductId={setClickedProductId}
                        setIsAnimationComplete={setIsAnimationComplete}
                        setIsImageLoaded={setIsImageLoaded}
                    />
                ))}
            </div>
            {isProductPage &&
                <div style={{ display: shouldShowProductPage ? 'block' : 'none' }}>
                    <ProductPage onImageLoad={() => setIsImageLoaded(true)}/>
                </div>
            }
        </>
    );
}