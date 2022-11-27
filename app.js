const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const passport = require("./passport/setup.js");
const flash = require('connect-flash-plus');
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const db = "mongodb+srv://Erdinan:Angkajaya123@crm-project.79vnwjs.mongodb.net/?retryWrites=true&w=majority";
const dboptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: "CRM-Project"
  };
const cors = require('cors');

// connecting to database
mongoose.connect(db, dboptions).then(
    () => {
      console.log("Connection to the database established");
    },
    err => {
      console.log("Error connecting to database due to: ", err);
    }
  );

app.use(express.json())
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.set("trust proxy", 1);
app.use(session({
  resave: false,
  saveUnitialized: false,
  secret: "testttt",
  expires: new Date(Date.now() + (1)),
  cookie: { secure: true,
            sameSite: 'none',
            httpOnly: false } ,
  store: MongoDBStore.create({mongoUrl: db,
                              dbName: 'CRM-Project',
                              autoRemove: 'native'})
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

// setting trust proxy
app.enable('trust proxy');
app.set('trust proxy', true);

const port =  process.env.PORT || 5000

// set up routes
const contactRouter = require('./routes/contactRouter');
const eventRouter = require('./routes/eventRouter');
const departmentRouter = require('./routes/departmentRouter');
const organisationRouter = require('./routes/organisationRouter');
const loginRouter = require('./routes/loginRouter');
const profileRouter = require('./routes/profileRouter');
const notificationRouter = require('./routes/notificationRouter');

// handle requests
// the contact routes are added onto the end of '/contact'
app.use('/contact', contactRouter)
app.use('/event', eventRouter)
app.use('/department', departmentRouter)
app.use('/organisation', organisationRouter)
app.use('/', loginRouter)
app.use('/profile', profileRouter)
app.use('/notify', notificationRouter)

app.listen(port, () => {
  console.log(`The personal CRM app is listening on port ${port}!`)
})

module.exports = app