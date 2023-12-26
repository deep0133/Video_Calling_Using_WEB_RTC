// server.js
import express from "express"
import http from "http"
import { Server } from "socket.io"
const app = express();
const server = http.createServer(app);
import cors from "cors"
import handler from "./socketHandle.js"


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const allowedOrigins = ['http://192.168.1.65:5173']; // Add your React app's URL

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("ERROR IN CORS")
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

export const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
}).sockets.on("connection", handler)


// Express routes
app.get('/', (req, res) => {
    console.log("server request from frontend")
    res.send('Video Calling App Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
