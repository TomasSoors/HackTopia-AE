const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/person', require('./routes/personRoutes'));
app.use('/disease', require('./routes/diseaseRoutes'));
app.use("/consultations", require("./routes/consultationRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));


app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});