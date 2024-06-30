var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var user = require('./routes/user');
var game = require('./server/game');
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
app.use(cors(corsOptions));

// Logging middleware hinzufügen
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.options('*', cors(corsOptions));

// Favicon-Route hinzufügen, um 404-Fehler zu vermeiden
app.get('/favicon.ico', (req, res) => res.status(204));

// MongoDB Verbindung
const dbURI = 'mongodb+srv://blockchainexpert2000:letsgo@miniapptest.zrrcu4q.mongodb.net/test?retryWrites=true&w=majority&appName=miniapptest';
console.log('connecting to mongo');
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 300000, // 5 Minuten
})
.then(async () => {
  console.log('Connected to MongoDB');
  await game.initializeData(); // Initialisierungsfunktion aufrufen
})
  .catch((error) => console.error('Connection error', error));

app.use('/', index);
app.use('/user', user);

// Beispiel-Route zur Initialisierung eines Spiels (falls benötigt)
app.get('/init-game', async (req, res) => {
  try {
    const round = new Round({
      gameId: 1,
      roundId: 1,
      players: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32",
      result: "",
      endAt: 600000
    });
    await round.save();
    res.json({ message: 'Game initialized', round });
  } catch (error) {
    console.error('Error initializing game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/game/status', async (req, res) => {
  try {
    const gameStatus = await game.getGameStatus();
    const currentRound = await game.getCurrentRound();
    res.json({
      gameStatus,
      currentRound
    });
  } catch (error) {
    console.error('Error fetching game status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Erhöhe das Timeout für den Express-Server
const server = require('http').createServer(app);
server.setTimeout(300000); // 5 Minuten

server.listen(4000, function () {
  console.log('Listening on port 4000...');
});
