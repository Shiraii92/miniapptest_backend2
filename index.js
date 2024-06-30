var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var user = require('./routes/user');
const cors = require('cors');
const mongoose = require('mongoose');

var app = express();

// CORS options
const corsOptions = {
  origin: 'https://miniapptest.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Logging middleware hinzufügen
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.options('*', cors(corsOptions));

// Favicon-Route hinzufügen, um 404-Fehler zu vermeiden
app.get('/favicon.ico', (req, res) => res.status(204));

// MongoDB Verbindung
const dbURI = 'mongodb+srv://blockchainexpert2000:letsgo@miniapptest.zrrcu4q.mongodb.net/?retryWrites=true&w=majority&appName=miniapptest';
console.log('connecting to mongo');
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 300000, // 5 Minuten
  useCreateIndex: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

app.use('/', index);
app.use('/user', user);

// Erhöhe das Timeout für den Express-Server
const server = require('http').createServer(app);
server.setTimeout(300000); // 5 Minuten

server.listen(4000, function () {
  console.log('Listening on port 4000...');
});
