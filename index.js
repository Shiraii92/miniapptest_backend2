var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var index = require('./routes/index')
var user = require('./routes/user');
var Woman = require('./models/women');
const { InitGamestatus } = require('./server/game')
const cors = require('cors');

var app = express()



const corsOptions = {
  origin: 'https://test-three-amber-91.vercel.app', // Deine Frontend-URL hier angeben
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Optionale Preflight-Anfragen


const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://blockchainexpert2000:XqIBMUYEyWKU4DBh@miniapptest.zrrcu4q.mongodb.net/?retryWrites=true&w=majority&appName=miniapptest';
//const dbURI = 'mongodb+srv://admin:stress@cluster0.yjagzxb.mongodb.net/lovetap';
console.log('connecting to mongo');
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));


app.use('/', index);
app.use('/user',user);

const intervalId = setInterval(() => {
  syncTime();
}, 5000);
// InitGamestatus();

// const data = [
//   "Amanda","Marsha","Stella","Lusy","Emma","Becky","Victoria","Annet","Anna",
//   "Amanda","Marsha","Stella","Lusy","Emma","Becky","Victoria","Annet","Anna",
//   "Amanda","Marsha","Stella","Lusy","Emma","Becky","Victoria","Annet","Anna",
//   "Amanda","Marsha","Stella","Lusy","Emma"
// ];
// for(var i=0;i<data.length;i++){
//   Woman.addWoman(data[i],i+1);
// }
app.listen(4000, function () {
  console.log('Listening on port 4000...')
})

