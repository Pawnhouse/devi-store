import Image from 'next/image';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';
import { useRef, useState } from "react";

export default function ProductCard(
    {
        product,
        pageRef,
        clickedProductId,
        setClickedProductId,
        setIsAnimationComplete,
        setIsImageLoaded
    }
) {
    const imageRef = useRef(null);
    const initialState = {
        scale: 1,
        x: 0,
        y: 0,
    };
    const [animationProps, setAnimationProps] = useState(initialState);
    const isAnimation = clickedProductId !== null;
    const transition = { duration: isAnimation ? 0.25 : 0, ease: 'easeInOut' };

    const router = useRouter();
    const isClicked = clickedProductId === product.id;

    const handleClick = () => {
        if (!imageRef.current || isAnimation) {
            return;
        }

        const rect = imageRef.current.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const currentCenterX = rect.left + rect.width / 2;
        const currentTop = rect.top;
        const carouselHeight = 400;
        const imageHeight = Math.min(carouselHeight, (window.innerWidth - 68) / 3 * 4)
        const scale = imageHeight / rect.height;
        const x = viewportCenterX - currentCenterX;
        const y = window.scrollY + pageRef.current.getBoundingClientRect().top - currentTop
            + (carouselHeight - rect.height) / 2;

        setClickedProductId(product.id);
        setIsAnimationComplete(false);
        setIsImageLoaded(false);
        setAnimationProps({ scale, x, y });
        router.push(
            { query: { productId: product.id } },
            undefined,
            { scroll: false }
        );
    };

    let imageAnimate;
    if (isAnimation) {
        imageAnimate = isClicked ? {
                scale: animationProps.scale,
                translateX: animationProps.x,
                translateY: animationProps.y,
                opacity: 1
            }
            : { ...initialState, opacity: 0 };
    }
    const textAnimate = isAnimation ? { opacity: 0 } : undefined;

    return (
        <button onClick={handleClick}>
            <motion.div
                className="image-wrapper"
                ref={imageRef}
                style={{ zIndex: isClicked ? 1 : 0 }}
                animate={imageAnimate}
                transition={transition}
                onAnimationComplete={() => isClicked && setIsAnimationComplete(true)}
            >
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 459px) 80px, (max-width: 768px) 135px, 200px"
                />
            </motion.div>
            <motion.h3
                animate={textAnimate}
                className="product-name"
                transition={transition}
            >
                {product.code}
            </motion.h3>
        </button>
    );
}