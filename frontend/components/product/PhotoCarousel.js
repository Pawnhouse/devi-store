import Image from "next/image";
import { Carousel } from "react-responsive-carousel";

export function PhotoCarousel({ images, onImageLoad }) {
    return (
        <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
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
                <Image
                    key={img}
                    src={img}
                    alt="Product Image"
                    width={300}
                    height={400}
                    style={{ objectFit: 'contain' }}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={index === 0 ? onImageLoad : undefined}
                />
            ))}
        </Carousel>
    );
}