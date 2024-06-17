var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var user = require('./routes/user');
const cors = require('cors');
var app = express();

const corsOptions = {
  origin: 'https://test-three-amber-91.vercel.app', // Deine Frontend-URL hier angeben
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Logging middleware hinzufügen
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.options('*', cors(corsOptions));

// Favicon-Route hinzufügen, um 404-Fehler zu vermeiden
app.get('/favicon.ico', (req, res) => res.status(204));

const mongoose = require('mongoose');
//const dbURI = 'mongodb+srv://admin:stress@cluster0.yjagzxb.mongodb.net/lovetap';
const dbURI = 'mongodb+srv://blockchainexpert2000:XqIBMUYEyWKU4DBh@miniapptest.zrrcu4q.mongodb.net/?retryWrites=true&w=majority&appName=miniapptest';
console.log('connecting to mongo');
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

app.use('/', index);
app.use('/user', user);

app.listen(4000, function () {
  console.log('Listening on port 4000...');
});
