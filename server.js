const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();

const { dbMiddleware } = require('./middlewares');

const SERVICE_PORT = 9002;

const secretKey = "123ABC456DEF";

const dbConfig = {
    uri: 'mongodb://localhost:27017',
    db: 'test'
}

app.use(express.json()); // untuk mempermudah akses req.body
app.use(express.urlencoded({ extended: true }));

db = dbMiddleware(app, mongodb, dbConfig);
app.use(db);

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

const verifyToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer =  bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {    
        res.sendStatus(403);
    }
}

app.post('/auth', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "you are logged in.",
                data
            });
        }
    });
});

app.post('/login', async (req, res) => {
    console.log(req.body);
    console.log(req.body.username);

    const { db } = res.locals;
    const user = await db.collection('user').find({ "username": req.body.username }).toArray();

    console.log(user);

    jwt.sign({ user }, secretKey, { expiresIn: '1 day' },(err, token) => {
        res.json({
            token
        })
    })
});


app.listen(SERVICE_PORT, () => {
    console.log("listening to port ", SERVICE_PORT);
});