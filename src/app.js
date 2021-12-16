const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../routes/auth')
const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

// Connect Database
// mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_PORT}/${process.env.DATABASE}`).then(con=> {
mongoose.connect(`mongodb://localhost:27017/sendMailDB`).then(con=> {
    console.log("connected DB");
}).catch(err=>{
    console.log('error', err);
});

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));