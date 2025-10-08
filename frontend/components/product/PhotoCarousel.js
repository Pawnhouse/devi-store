import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";

export function PhotoCarousel({ images, onImageLoad }) {
    const [showArrows, setShowArrows] = useState(true);

    useEffect(() => {
        if (window.innerWidth <= 459) {
            setShowArrows(false);
        }
    }, []);
    return (
        <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
            showArrows={showArrows}
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
            {images.map((img, index) => (
                <div key={img} style={{ position: "relative", width: '100%', height: '400px' }}>
                    <Image
                        src={img}
                        alt="Product Image"
                        fill
                        sizes="300px"
                        style={{ objectFit: 'contain' }}
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
                        onLoad={index === 0 ? onImageLoad : undefined}
                    />
                </div>
            ))}
        </Carousel>
    );
}