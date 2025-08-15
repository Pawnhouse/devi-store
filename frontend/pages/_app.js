import '../styles/globals.css'
import Header from "../components/Header";

export default function MyApp({ Component, pageProps }) {
    return (
        <div className="container">
            <Header/>
            <Component {...pageProps} />
        </div>
    );
}