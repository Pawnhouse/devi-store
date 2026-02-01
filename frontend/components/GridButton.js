import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GridButton({ gridButtonAnimate, handleGridButtonClick }) {
    const [isMounted, setIsMounted] = useState(false);
    const firstBarVariants = {
        plus: {
            d: 'M4 12 L20 12'
        },
        minus: {
            d: 'M4 12 L20 12'
        },
        back: {
            d: 'M4 12 L10 18'
        }
    };
    const secondBarVariants = {
        plus: {
            d: 'M12 20 L12 4',
            opacity: 1
        },
        minus: {
            d: 'M12 20 L12 4',
            opacity: 0
        },
        back: {
            d: 'M4 12 L10 6',
            opacity: 1
        }
    }
    useEffect(()=>{
        setIsMounted(true);
    }, [])
    return (
        <button
            className="icon-container"
            onClick={handleGridButtonClick}
        >
            {isMounted &&
                <svg viewBox="0 0 24 24" fill="none">
                    <motion.path
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={false}
                        animate={gridButtonAnimate}
                        variants={firstBarVariants}
                    />
                    <motion.path
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={false}
                        animate={gridButtonAnimate}
                        variants={secondBarVariants}
                    />
                </svg>
            }
        </button>
    )
}
