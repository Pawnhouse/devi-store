import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import dynamic from 'next/dynamic';

const CdekWidget = dynamic(() => import('./CdekWidget'), { ssr: false });

const PICK_UP_POINT_TYPE_ID = 1;
const DELIVERY_TYPE_IDS = [2, 4];

export default function OrderForm({ cart }) {
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        deliveryTypeId: null,
        deliveryAddress: '',
        pickUpPointAddress: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [helperText, setHelperText] = useState('');
    const router = useRouter();
    const handleClose = () => {
        setIsDialogOpen(false);
        router.push('/');
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-types`)
            .then(res => res.json())
            .then(types => {
                setDeliveryTypes(types);
            })
            .catch(err => console.error('Error fetching products for cart:', err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newData = {
            ...formData,
            [name]: name === 'deliveryTypeId' ? Number(value) : value
        };
        if (name === 'deliveryTypeId') {
            setHelperText('');
        }
        setFormData(newData);
    };

    const handleCdekChoose = (type, tariff, address) => {
        setFormData((prev) => ({
            ...prev,
            pickUpPointAddress: address.city + ', ' + address.address
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.deliveryTypeId === null) {
            setHelperText('Выберите способ доставки');
            return;
        }
        if (formData.deliveryTypeId === PICK_UP_POINT_TYPE_ID && !formData.pickUpPointAddress) {
            setHelperText('Выберите пункт самовывоза');
            return;
        }
        if (DELIVERY_TYPE_IDS.includes(formData.deliveryTypeId) && !formData.deliveryAddress) {
            setHelperText('Введите адрес доставки');
            return;
        }
        setHelperText('');

        setIsLoading(true);
        let address = null;
        if (DELIVERY_TYPE_IDS.includes(formData.deliveryTypeId)) {
            address = formData.deliveryAddress;
        } else if (formData.deliveryTypeId === PICK_UP_POINT_TYPE_ID) {
            address = formData.pickUpPointAddress;
        }
        const order = {
            ...formData,
            address: address,
            items: cart.map(item => {
                if (item.isCertificate) {
                    return {
                        code: item.code,
                        quantity: item.quantity,
                        price: item.price
                    }
                } else {
                    return {
                        code: item.code,
                        quantity: item.quantity,
                        size: item.size.abbrev
                    };
                }
            }),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (res.ok) {
                localStorage.removeItem('cart');
                setIsDialogOpen(true);
            } else {
                toast.error('Error placing order.');
            }
        } catch (err) {
            console.error('Error submitting order:', err);
            toast.error('Error placing order.');
        }
        setIsLoading(false);
    };

    return (
        <>
            <form
                className="flex-column"
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Фамилия Имя"
                    variant="standard"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <TextField
                    label="Email"
                    variant="standard"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />

                <TextField
                    label="Телефон"
                    variant="standard"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
                <fieldset className="flex-column">
                    <legend>Delivery</legend>
                    <FormControl error={!!helperText} variant="standard">
                        <RadioGroup
                            name="deliveryTypeId"
                            value={formData.deliveryTypeId}
                            onChange={handleInputChange}
                        >
                            {
                                deliveryTypes.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        value={item.id}
                                        control={<Radio/>}
                                        label={item.name}
                                    />
                                ))
                            }
                        </RadioGroup>
                        <CdekWidget
                            shouldShow={formData.deliveryTypeId === PICK_UP_POINT_TYPE_ID}
                            onChoose={handleCdekChoose}
                        />
                        {DELIVERY_TYPE_IDS.includes(formData.deliveryTypeId) &&
                            <TextField
                                label="Address"
                                variant="standard"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                required
                            />
                        }
                        {formData.deliveryTypeId === PICK_UP_POINT_TYPE_ID &&
                            <TextField
                                label="Pick-up point"
                                variant="standard"
                                name="pickUpPointAddress"
                                value={formData.pickUpPointAddress}
                                onChange={handleInputChange}
                                slotProps={{ input: { readOnly: true } }}
                                required
                            />
                        }
                        <FormHelperText>{helperText}</FormHelperText>
                    </FormControl>
                </fieldset>
                <button
                    className="submit-button"
                    disabled={isLoading}
                >
                    Оформить заказ
                </button>
            </form>
            <Dialog
                open={isDialogOpen}
                onClose={handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Заказ оформлен. С вами свяжутся менеджеры для подтверждения заказа!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
