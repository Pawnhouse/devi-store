import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/images/logo.svg';
import GridButton from "./GridButton";

export default function Header({ gridButtonAnimate, handleGridButtonClick, cartCount }) {
    return (
        <header style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GridButton
                gridButtonAnimate={gridButtonAnimate}
                handleGridButtonClick={handleGridButtonClick}
            />
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
                        {cartCount !== null &&
                            <div className="cart-badge">
                                {cartCount}
                            </div>
                        }
                    </div>
                </Link>
            </nav>
        </header>
    );
}