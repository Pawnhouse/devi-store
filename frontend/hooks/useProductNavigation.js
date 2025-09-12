import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

function useProductNavigation() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [prevProduct, setPrevProduct] = useState(null);
    const [nextProduct, setNextProduct] = useState(null);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    useEffect(() => {
        if (products.length === 0 || productId === null || productId === undefined) {
            setProduct(null);
            return;
        }
        setProduct(products.find(product => product.id === +productId));

        const index = products.findIndex(p => p.id === +productId);
        if (index === -1) {
            setPrevProduct(null);
            setNextProduct(null);
            return;
        }
        setPrevProduct(products[(index + products.length - 1) % products.length]);
        setNextProduct(products[(index + 1) % products.length]);
    }, [products, productId]);

    return {
        products,
        product,
        prevProduct,
        nextProduct
    };
}

export default useProductNavigation;
