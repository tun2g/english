const socketIO = require("socket.io");
const handleEvent = require("./handleEvent")

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "*",
            method: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A client connected with id ", socket.id);

        handleEvent(socket, io);

        socket.on("disconnect", async () => {
            console.log(`A client with id ${socket.id} disconnected`);
        });
    });
};
