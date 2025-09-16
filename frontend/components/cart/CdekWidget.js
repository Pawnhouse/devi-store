import { useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import CDEKWidget from '@cdek-it/widget';

export default function CdekWidget({ shouldShow, defaultLocation, onChoose }) {
    const widgetRef = useRef(null);

    useEffect(() => {
        if (shouldShow && !widgetRef.current) {
            widgetRef.current = new CDEKWidget({
                root: 'cdek-map',
                apiKey: process.env.NEXT_PUBLIC_YANDEX_API_KEY,
                servicePath: `${process.env.NEXT_PUBLIC_API_URL}/cdek-service`,
                defaultLocation,
                lang: 'rus',
                currency: 'RUB',
                hideDeliveryOptions: {
                    office: false,
                    door: true,
                },
                onChoose
            });
        }
    }, [shouldShow, defaultLocation, onChoose]);

    return (
        <motion.div
            key="cdek-map-motion"
            initial={{ opacity: 0, height: 0 }}
            animate={shouldShow ? { opacity: 1, height: 600 } : { opacity: 0, height: 0 }}
            style={{ overflowY: 'hidden', width: '100%' }}
        >
            <div id="cdek-map" style={{ width: '100%', height: '600px' }}/>
        </motion.div>
    );
};
