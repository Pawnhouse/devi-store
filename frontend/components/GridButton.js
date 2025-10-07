import { motion } from 'framer-motion';
import { useRouter } from "next/router";

export default function GridButton({ isPlus, onClick }) {
    const router = useRouter();
    const isCatalog = router.asPath === '/';
    return (
        <button
            className="icon-container"
            onClick={isCatalog ? onClick : undefined}
            disabled={!isCatalog}
            tabIndex={isCatalog ? 0 : -1}
            style={isCatalog ? undefined : { cursor: 'default' }}
        >
            <svg viewBox="0 0 24 24" fill="none">
                <motion.path
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12H20"
                    initial={false}
                    animate={{ opacity: isCatalog ? 1 : 0 }}
                />
                <motion.path
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4V20"
                    initial={false}
                    animate={{ opacity: isCatalog && isPlus ? 1 : 0 }}
                />
            </svg>
        </button>

    )
}
