import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled, ToggleButton, toggleButtonClasses, ToggleButtonGroup, toggleButtonGroupClasses } from "@mui/material";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sizeId, setSizeId] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);
                    setSizeId(data?.sizes[0].id);
                })
                .catch((err) => console.error('Error fetching product:', err));
        }
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-details">
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                renderArrowPrev={(clickHandler, hasPrev) => {
                    return (
                        <div
                            className={`${
                                hasPrev ? "absolute" : "hidden"
                            } arrow left-arrow`}
                        >
                            <button className="icon-container" onClick={clickHandler}>
                                <Image
                                    alt="Scroll to left image"
                                    src="/icons/arrow-left-svgrepo-com.svg"
                                    fill
                                />
                            </button>
                        </div>
                    );
                }}
                renderArrowNext={(clickHandler, hasNext) => {
                    return (
                        <div
                            className={`${
                                hasNext ? "" : "hidden"
                            } arrow right-arrow`}
                        >
                            <button className="icon-container" onClick={clickHandler}>
                                <Image
                                    alt="Scroll to right image"
                                    src="/icons/arrow-right-svgrepo-com.svg"
                                    fill
                                />
                            </button>
                        </div>
                    );
                }}
            >
                {product.images.map((img) => (
                    <Image
                        key={img}
                        src={img}
                        alt={product.name}
                        width={300}
                        height={300}
                        style={{ objectFit: 'contain' }}
                    />
                ))}
            </Carousel>
            <h2>{product.name}</h2>
            <StyledToggleButtonGroup
                value={sizeId}
                exclusive
                onChange={(event, value) => setSizeId(value) }
                aria-label="text alignment"
            >
                {product.sizes.map((size) => (

                    <ToggleButton value={size.id} key={size.id}>
                        {size.abbrev}
                    </ToggleButton>
                ))}
            </StyledToggleButtonGroup>
            <p style={{ margin: "0" }}>{product.price} RUB</p>
            <p style={{ margin: "0" }}>{product.description}</p>
            <button
                onClick={() => addToCart(product, sizeId)}
                className="icon-container add-to-cart"
            >
                <Image
                    alt="Add to Cart"
                    src="/icons/plus-large-svgrepo-com.svg"
                    fill
                />
            </button>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar/>
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