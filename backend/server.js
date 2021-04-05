const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');

const Data = require('./data');

const API_CORS = 3001;
const app = express();
app.use(cors());

const router = express.Router();

// database
const dbRoute = 'mongodb+srv://practice1:practice1@cluster0.f0r0y.mongodb.net/datas?retryWrites=true&w=majority'

//connect backend to database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true })

let db = mongoose.connection;

db.once('open', () => console.log('Connected to database'));

db.on('error', console.error.bind(console, 'MongoDB connection error'))

// readable format
app.use(express.json());

//optional
app.use(logger('dev'))

// now start with methods.
// thiss is our get method
// this method fetches all available data in our database.
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) {
            res.json({ success: false, error: err });
        } else {
            return res.json({ success: true, data: data })
        }
    })
});


//this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true })
    })
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true })
    })
})


// this is our create method
// this method adds new data in our database
router.post('/putData', (req, res) => {
    let data = new Data();
    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        })
    }
    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
