const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tourRoutes = require('./routes/tourRoutes');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Mount tour routes
app.use('/api/tours', tourRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('CMS API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});