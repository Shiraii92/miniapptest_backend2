const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const index = require('./routes/index');
const user = require('./routes/user');

const app = express();

// CORS options
const corsOptions = {
  origin: 'https://miniapptest.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Handle favicon requests to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204));

// MongoDB connection
const dbURI = 'your-mongodb-uri';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 300000, // 5 minutes
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

// Routes
app.use('/', index);
app.use('/user', user);

// Increase timeout for Express server
const server = require('http').createServer(app);
server.setTimeout(300000); // 5 minutes

server.listen(4000, () => {
  console.log('Listening on port 4000...');
});
