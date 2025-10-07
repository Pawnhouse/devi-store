import { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPage from '../components/product/ProductPage';
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import useProductNavigation from "../hooks/useProductNavigation";
import { ToastContainer } from "react-toastify";

export default function Home({ gridColumnNumber }) {
    const [clickedProductId, setClickedProductId] = useState(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    const pageRef = useRef(null);
    const router = useRouter();
    const { productId } = router.query;
    const prevByHistoryProductIdRef = useRef(productId);
    const prevGridColumnNumberRef = useRef(null);
    const [productPageAnimationProps, setProductPageAnimationProps] = useState({ initial: null, exit: null });

    const {products, product, nextProduct, prevProduct } = useProductNavigation();

    useEffect(() => {
        if (productId === undefined) {
            setProductPageAnimationProps({ initial: null, exit: null });
        }
    }, [productId]);

    useEffect(() => {
        const prevByHistoryProductId = prevByHistoryProductIdRef.current;
        if (
            clickedProductId !== null &&
            prevByHistoryProductId !== undefined &&
            productId === undefined
        ) {
            setClickedProductId(null);
        }
        prevByHistoryProductIdRef.current = productId;
    }, [productId, clickedProductId, setClickedProductId]);


    useEffect(() => {
        if (clickedProductId !== null && isImageLoaded && isAnimationComplete) {
            setClickedProductId(null);
            window.scrollTo(0, 0);
        }
    }, [clickedProductId, isAnimationComplete, isImageLoaded]);

    const isProductPage = productId !== null && productId !== undefined;

    const goToNextProductPage = () => {
        if(nextProduct?.id !== undefined) {
            setProductPageAnimationProps({
                initial: { opacity: 0, y: '100%' },
                exit: { opacity: 0, y: '-100%' },
            });
            router.push({ query: { productId: nextProduct.id } });
        }
    };
    const goToPrevProductPage = () => {
        if(prevProduct?.id !== undefined) {
            setProductPageAnimationProps({
                initial: { opacity: 0, y: '-100%' },
                exit: { opacity: 0, y: '100%' },
            });
            router.push({ query: { productId: prevProduct.id } });
        }
    };

    if (prevGridColumnNumberRef.current === null) {
        prevGridColumnNumberRef.current = gridColumnNumber;
    }

    let imageGridAnimate, textGridAnimate;

    if (pageRef.current !== null && prevGridColumnNumberRef.current !== gridColumnNumber) {
        const containerWidth = pageRef.current.getBoundingClientRect().width;
        const gap = 20;
        const prevWidth = (containerWidth - (prevGridColumnNumberRef.current - 1) * gap) / prevGridColumnNumberRef.current;
        const currentWidth = (containerWidth - (gridColumnNumber - 1) * gap) / gridColumnNumber;

        imageGridAnimate = {
            scale: [null, prevWidth / currentWidth, 1],
            transition: { duration: 0.25, times: [0, 0, 1] },
        };
        textGridAnimate = {
            translateX: [null, (prevWidth - currentWidth) / 2, 0],
            translateY: [null, (prevWidth - currentWidth) * 1.33, 0],
            transition: { duration: 0.25, times: [0, 0, 1] },
        };
        prevGridColumnNumberRef.current = gridColumnNumber;
    }


    const shouldShowProductPage = clickedProductId === null;
    return (
        <>
            <div
                className="product-grid"
                ref={pageRef}
                style={{
                    display: isProductPage && shouldShowProductPage ? 'none' : 'grid',
                    gridTemplateColumns: `repeat(${gridColumnNumber}, minmax(80px, 1fr))`,
                }}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        pageRef={pageRef}
                        gridAnimationProps={{ imageAnimate: imageGridAnimate, textAnimate: textGridAnimate }}
                        clickedProductId={clickedProductId}
                        setClickedProductId={setClickedProductId}
                        setIsAnimationComplete={setIsAnimationComplete}
                        setIsImageLoaded={setIsImageLoaded}
                    />
                ))}
            </div>
            {isProductPage && product &&
                <AnimatePresence mode="popLayout" onExitComplete={() => setProductPageAnimationProps({ initial: null, exit: null })}>
                    <motion.div
                        key={product.id}
                        style={{ display: shouldShowProductPage ? 'block' : 'none' }}
                        exit={productPageAnimationProps.exit}
                        animate={{ opacity: 1, y: 0 }}
                        initial={productPageAnimationProps.initial}
                        transition={{ duration: 0.3 }}
                    >
                        <ProductPage
                            product={product}
                            goToNextProductPage={goToNextProductPage}
                            goToPrevProductPage={goToPrevProductPage}
                            onImageLoad={() => setIsImageLoaded(true)}
                        />
                    </motion.div>
                </AnimatePresence>
            }
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar/>
        </>
    );
}