const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Load environment variables
require('./config/env');

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://main--poetic-macaron-6768de.netlify.app',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.options('*', cors()); // Handle preflight requests

// Route setup
app.use('/auth', require('./routes/authRoutes'));
app.use('/test', require('./routes/testRoutes'));
app.get('/',(req,res)=>{
    console.log("server is running...")
    res.send("backend is running...")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
});
