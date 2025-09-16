const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const deliveryTypesRouter = require('./routes/deliveryTypes');
const sizesRouter = require('./routes/sizes');
const cdekServiceRouter = require('./routes/cdekService');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/delivery-types', deliveryTypesRouter);
app.use('/api/sizes', sizesRouter);
app.use('/api/cdek-service', cdekServiceRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));