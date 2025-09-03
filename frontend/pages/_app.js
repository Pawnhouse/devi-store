import '../styles/globals.css'
import Header from "../components/Header";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { theme } from "../theme";

export default function MyApp({ Component, pageProps }) {
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
                    <Header/>
                    <Component {...pageProps} />
                </div>
            </ThemeProvider>
        </>
    );
}