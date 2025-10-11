import '../styles/globals.css';
import Header from "../components/Header";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
    const [isPlus, setIsPlus] = useState(true);
    const [gridColumnNumberOptions, setGridColumnNumberOptions] = useState([]);
    const [gridColumnNumberOptionIndex, setGridColumnNumberOptionIndex] = useState(0);
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

    useEffect(() => {
        if (window.innerWidth <= 459) {
            setGridColumnNumberOptions([4, 3, 2, 1]);
        } else if (window.innerWidth <= 1024) {
            setGridColumnNumberOptions([6, 4, 3]);
        } else {
            setGridColumnNumberOptions([8, 6, 4]);
        }
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
                    />
                    <Component {...pageProps} gridColumnNumber={gridColumnNumberOptions[gridColumnNumberOptionIndex]}/>
                </div>
            </ThemeProvider>
        </>
    );
}