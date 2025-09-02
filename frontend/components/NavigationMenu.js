import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from "next/image";
import Link from "next/link";

export default function NavigationMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <button
                className="icon-container"
                onClick={handleClick}
            >
                <Image
                    alt="Decrease quantity"
                    src="/icons/menu-hamburger-svgrepo-com.svg"
                    fill
                />
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <Link href="/" className="black-link">
                        Каталог
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/why-devi" className="black-link">
                        Why devi?
                    </Link>
                </MenuItem>
            </Menu>
        </>
    );
}
