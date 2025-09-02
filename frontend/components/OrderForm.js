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
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";

export default function OrderForm({ cart }) {
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: 'Москва',
        deliveryTypeId: null
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
                setFormData({ ...formData, deliveryTypeId: types[0].id });
            })
            .catch(err => console.error('Error fetching products for cart:', err));
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const order = {
            ...formData,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                size: item.size.abbrev
            })),
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
                    <TextField
                        label="City"
                        variant="standard"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                    <RadioGroup
                        name="deliveryTypeId"
                        value={formData.deliveryTypeId}
                        onChange={(e) => setFormData({ ...formData, deliveryTypeId: e.target.value })}
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
