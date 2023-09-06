const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
}));

// Connect to the MongoDB database
// user : rahulkashyap2870
// p/w : veMa2bCtm76AEkb0
mongoose.connect('mongodb+srv://rahulkashyap2870:veMa2bCtm76AEkb0@cluster0.4hegsml.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.get('/', (req, res) => {
    res.send("working")
});

app.use("/api", require("./modules/index"))

app.listen(PORT, () => {
    console.log("server is running")
});