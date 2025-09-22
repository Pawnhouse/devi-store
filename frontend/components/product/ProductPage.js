import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled, ToggleButton, toggleButtonClasses, ToggleButtonGroup, toggleButtonGroupClasses } from "@mui/material";
import { PhotoCarousel } from "./PhotoCarousel";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    flexWrap: 'wrap',
    gap: '1.5rem',
    [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
        {
            borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
            borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
    [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
        {
            borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
            borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
            borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
        },
    [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
        {
            borderLeft: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
        },
}));

export default function ProductPage({ product, goToNextProductPage, goToPrevProductPage, onImageLoad }) {
    const [sizeId, setSizeId] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (product.isCertificate) {
            setSizeId(null);
            setCertificate(product);
        } else {
            setSizeId(product.sizes[0].id);
            setCertificate(null);
        }
    }, [product]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let startY, scrollY, scrollToBottomY;
        let isStarted = false;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
            scrollY = window.scrollY;
            scrollToBottomY = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
            isStarted = true;
        };

        const onTouchMove = (e) => {
            if (!isStarted) {
                if (e.cancelable) {
                    e.preventDefault();
                }
                return;
            }
            const touchY = e.touches[0].clientY;
            const redirectionMargin = 100;
            if (touchY - startY > redirectionMargin + scrollY) {
                goToPrevProductPage();
                isStarted = false;
            } else if (touchY - startY < -redirectionMargin - scrollToBottomY) {
                goToNextProductPage();
                isStarted = false;
            }
        };

        container.addEventListener('touchstart', onTouchStart, { passive: false });
        container.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
        };
    }, [product]);

    return (
        <div className="product-details" ref={containerRef}>
            {product &&
                <>
                    <PhotoCarousel images={product.images} onImageLoad={onImageLoad}/>
                    <h2>{product.name}</h2>
                    {product.isCertificate
                        ? (
                            <StyledToggleButtonGroup
                                value={certificate?.id}
                                exclusive
                                onChange={(event, value) => {
                                    return value && setCertificate(product.options.find(item => item.id === value));
                                }}
                            >
                                {product.options.map((option) => (
                                    <ToggleButton value={option.id} key={option.id}>
                                        {new Intl.NumberFormat('ru-RU').format(option.price)}
                                    </ToggleButton>
                                ))}
                            </StyledToggleButtonGroup>
                        )
                        : (
                            <StyledToggleButtonGroup
                                value={sizeId}
                                exclusive
                                onChange={(event, value) => value && setSizeId(value)}
                            >
                                {product.sizes.map((size) => (
                                    <ToggleButton value={size.id} key={size.id}>
                                        {size.abbrev}
                                    </ToggleButton>
                                ))}
                            </StyledToggleButtonGroup>
                        )
                    }
                    <p style={{ margin: "0" }}>{new Intl.NumberFormat('ru-RU').format((certificate || product).price)} RUB</p>
                    <p style={{ margin: "0" }}>{product.description}</p>
                    <button
                        onClick={() => addToCart(certificate || product, sizeId)}
                        className="icon-container add-to-cart"
                    >
                        <Image
                            alt="Add to Cart"
                            src="/icons/plus-large-svgrepo-com.svg"
                            fill
                        />
                    </button>
                </>
            }
        </div>
    );

    function addToCart(product, sizeId) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((it) => it.id === product.id && it.sizeId === sizeId);
        if (existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
        } else {
            cart.push({ id: product.id, quantity: 1, sizeId: sizeId });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Added to cart!');
    }
}