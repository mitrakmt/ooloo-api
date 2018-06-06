const config = require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const rootRouter = require('./routers/index')
const expressJWT = require('express-jwt')
const helmet = require('helmet')
const db = require('./db')
const PORT = process.env.PORT || 3001
const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_KEY });
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

app.use("/docs", express.static(__dirname + '/docs'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods: GET, POST, PUT");
  next();
});

app.use('/api', rootRouter)

app.use(raygunClient.expressHandler);
app.listen(PORT, () => console.log('Making some magic on port', PORT))
