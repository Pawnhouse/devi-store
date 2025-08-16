import Link from 'next/link';
import Image from 'next/image'

export default function Header() {
    return (
        <header style={{padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>
                <Link href="/" className="black-link">
                    <span>Daivy Store</span>
                </Link>
            </h1>
            <nav>
                <Link href="/cart">
                    <div className="icon-container">
                        <Image
                            alt="Cart"
                            src="/icons/bag-svgrepo-com.svg"
                            fill
                        />
                    </div>
                </Link>
            </nav>
        </header>
    );
}