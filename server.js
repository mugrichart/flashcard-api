const express = require('express');
const http = require('http')
const { initializeWebSocketServer } = require("./websocket")
const cards = require('./routes/cards');
const deck = require('./routes/deck')
const words = require('./routes/words')
const batchRequest = require('./routes/batchRequest')
const connectDB = require('./db/connect');
const cors = require('cors')
// const session = require('express-session');
require('dotenv').config()

const { authRoutes, verifyToken} = require('./routes/auth');
const openaiTest = require('./routes/openaiTest')
const appMetaData = require('./routes/appMetaData')

const extension = require('./routes/extension')

const app = express();
const server = http.createServer(app)

// WebSocket setup
initializeWebSocketServer(server)
require("./controllers/games/game")

// middleware 
app.use(cors())
app.use(express.json());

// Session setup
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Use true in production with HTTPS
//   }));

// Protect routes that need authentication with verifyToken
app.use('/api/v1/protected-route', verifyToken, (req, res) => {
    res.json({ message: 'Access granted to protected route' });
});

app.use('/api/v1/extension', extension)

app.use('/api/v1/cards/test/openaiApi', openaiTest);
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/cards/app', appMetaData)
app.use('/api/v1/batch-request', batchRequest)
app.use('/api/v1/cards', cards, deck)
app.use('/api/v1/words', words)

const port = process.env.PORT || 3500;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(port, () => console.log(`listening on ${port}`))
    } catch (error) {
        console.log(error);
        return
    }
}

start()
