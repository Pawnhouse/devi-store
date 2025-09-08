import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled, ToggleButton, toggleButtonClasses, ToggleButtonGroup, toggleButtonGroupClasses } from "@mui/material";
import { PhotoCarousel } from "./PhotoCarousel";

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
    const id = router.query.productId;
    const [product, setProduct] = useState(null);
    const [sizeId, setSizeId] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
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
            <PhotoCarousel images={product.images}/>
            <h2>{product.name}</h2>
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