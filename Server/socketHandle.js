import crypto from "crypto"

const map = {}

const generateRoomId = (name, password) => {
    const roomId = crypto.randomBytes(8).toString('hex');
    map[roomId] = { name, password };
    return roomId;
}

// Socket.io
const handler = (socket) => {

    // Data : id and stream : passing stream to Connected Users.
    socket.on('offer', (data) => {
        socket.to(data.target).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.target).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.target).emit('ice-candidate', data.candidate);
    });

    // Handle room creation and joining :  --- Done ---
    socket.on('create-room', (data) => {
        const roomId = generateRoomId(data.name, data.password)
        socket.join(roomId);
        socket.emit('room-created', roomId);
    });

    // Room Join By Others :  --- Done ---
    socket.on('join-room', (data) => {
        const { id: roomId, password } = data;

        // -------------------
        // Check if the room exists in the map
        if (map[roomId]) {
            console.log("Join Room : ", map, roomId)
            // Check if the provided password matches the stored password for the room
            if (map[roomId].password === password) {
                // Join the room
                console.log("id and password varified :")
                socket.join(roomId);
                socket.emit('room-joined', { message: "Room Joined", name: data.name });
            } else {
                console.log("Password not varified")
                // Password doesn't match
                socket.emit('roomJoinError', { error: "Incorrect password" });
            }
        } else {
            // Room doesn't exist
            console.log("Error : Room does not exist")
            socket.emit('roomJoinError', { error: "Room does not exist" });
        }
        // -------------------
    });

    // Handle disconnection :  --- Done ---
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

}
export default handler;