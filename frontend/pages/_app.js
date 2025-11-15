import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../styles/globals.css';
import Header from "../components/Header";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

export default function MyApp({ Component, pageProps }) {
    const [isPlus, setIsPlus] = useState(true);
    const [gridColumnNumberOptions, setGridColumnNumberOptions] = useState([]);
    const [gridColumnNumberOptionIndex, setGridColumnNumberOptionIndex] = useState(2);
    const [cartCount, setCartCount] = useState(null);

    const router = useRouter();
    const isCatalog = router.asPath === '/';
    let gridButtonAnimate;
    if (isCatalog && isPlus) {
        gridButtonAnimate = 'plus';
    } else if (isCatalog && !isPlus) {
        gridButtonAnimate = 'minus';
    } else {
        gridButtonAnimate = 'back';
    }

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
            const itemsCount = cart.map((item) => item.quantity).reduce((a, b) => a + b);
            if (itemsCount > 9) {
                setCartCount('');
            } else {
                setCartCount(itemsCount);
            }
        } else {
            setCartCount(null);
        }
    };

    useEffect(() => {
        if (window.innerWidth <= 459) {
            setGridColumnNumberOptions([4, 3, 2, 1]);
        } else if (window.innerWidth <= 1024) {
            setGridColumnNumberOptions([6, 5, 4, 3]);
        } else {
            setGridColumnNumberOptions([8, 6, 5, 4]);
        }
        updateCartCount();
    }, []);

    useEffect(() => {
        if (gridColumnNumberOptionIndex === 0) {
            setIsPlus(true);
        } else if (gridColumnNumberOptionIndex === gridColumnNumberOptions.length - 1) {
            setIsPlus(false);
        }
    }, [gridColumnNumberOptions, gridColumnNumberOptionIndex]);

    const handleGridButtonClick = () => {
        switch (gridButtonAnimate) {
            case 'plus':
                setGridColumnNumberOptionIndex((value) => value + 1);
                break;
            case 'minus':
                setGridColumnNumberOptionIndex((value) => value - 1);
                break
            case 'back':
                router.push('/');
        }
    }

    const isCartPage = router.pathname === "/cart";
    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Geologica:wght@100;300&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <div className="container">
                    <Header
                        gridButtonAnimate={gridButtonAnimate}
                        handleGridButtonClick={handleGridButtonClick}
                        cartCount={cartCount}
                    />
                    <AnimatePresence initial={false} mode="popLayout">
                        {isCartPage ? (
                            <motion.div
                                className="cart-container"
                                key={router.pathname}
                            >
                                <motion.div
                                    className="cart-animate-container"
                                    initial={{ left: "100%" }}
                                    animate={{ left: 0 }}
                                    exit={{ translateX: "100%" }}
                                    transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                                >
                                    <Component
                                        {...pageProps}
                                        updateCartCount={updateCartCount}
                                    />
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={router.pathname}
                                transition={{ duration: 0.5 }}
                                initial={{ opacity: 0.9 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.9 }}
                            >
                                <Component
                                    {...pageProps}
                                    gridColumnNumber={gridColumnNumberOptions[gridColumnNumberOptionIndex]}
                                    updateCartCount={updateCartCount}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar/>
            </ThemeProvider>
        </>
    );
}