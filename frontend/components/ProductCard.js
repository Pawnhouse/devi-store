import Image from 'next/image';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';
import { useRef, useState } from "react";

export default function ProductCard(
    {
        product,
        pageRef,
        clickedProductId,
        gridAnimationProps,
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

    const [isGridAnimation, setIsGridAnimation] = useState(false);

    const router = useRouter();
    const isClicked = clickedProductId === product.id;

    const getImageHeight = () => {
        const rect = imageRef.current.getBoundingClientRect();
        const naturalWidth = imageRef.current.naturalWidth;
        const naturalHeight = imageRef.current.naturalHeight;

        const naturalAspect = naturalHeight / naturalWidth;
        const containerAspect = rect.height / rect.width;
        return rect.height * Math.min(1, naturalAspect / containerAspect);
    }

    const handleClick = () => {
        if (!imageRef.current || isAnimation || isGridAnimation) {
            return;
        }

        const rect = imageRef.current.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const currentCenterX = rect.left + rect.width / 2;
        const currentTop = rect.top;
        const carouselHeight = 400;
        const containerWidth = window.innerWidth - (window.innerWidth <= 459 ? 68 : 84);
        const imageHeight = Math.min(
            carouselHeight,
            containerWidth / imageRef.current.naturalWidth * imageRef.current.naturalHeight
        );
        const scale = imageHeight / getImageHeight();
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
        <motion.button
            layout="position"
            transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
            onClick={handleClick}
            onLayoutAnimationStart={() => setIsGridAnimation(true)}
            onLayoutAnimationComplete={() => setIsGridAnimation(false)}
        >
            <motion.div
                animate={gridAnimationProps.imageAnimate}
                style={{ transformOrigin: "top left" }}
            >
                <motion.div
                    className="image-wrapper"
                    style={{ zIndex: isClicked ? 1 : 0 }}
                    animate={imageAnimate}
                    transition={transition}
                    onAnimationComplete={() => isClicked && setIsAnimationComplete(true)}
                >
                    <Image
                        ref={imageRef}
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 459px) 80px, (max-width: 768px) 135px, 200px"
                    />
                </motion.div>
            </motion.div>
            <motion.div animate={gridAnimationProps.textAnimate}>
                <motion.h3
                    animate={textAnimate}
                    className="product-name"
                    transition={transition}
                >
                    {product.code}
                </motion.h3>
            </motion.div>
        </motion.button>
    );
}