const express = require('express');
const cors = require('cors');
const { processData } = require('./processor');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    if (!req.body || !Array.isArray(req.body.data)) {
        return res.status(400).json({ error: "Invalid request. 'data' must be an array." });
    }
    
    try {
        const result = processData(req.body.data);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
