import Link from 'next/link';
import Image from 'next/image';
import NavigationMenu from "./NavigationMenu";
import Logo from '../public/images/logo.svg';

export default function Header() {
    return (
        <header style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <NavigationMenu />
            <Link href="/">
                <Image
                    className="logo"
                    alt="Devi Logo"
                    src={Logo}
                    priority
                />
            </Link>
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