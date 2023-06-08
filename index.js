import http from 'http'
import app from './app.js'
import Server from "socket.io"

const server = http.createServer(app)
var io = new Server(server, {
  'cors': {
    origin: "*",
    methods: ['GET', 'POST']
  }
})

const PORT = 8080
var socketList = {}
var teams = []

io.on('connection', (socket) => {
  console.log(`New User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    socket.disconnect();
    // console.log(io.sockets)
    // console.log(`${socket.id} disconnected`);
  });

  socket.on('BE-check-user', ({ roomId, userName }) => {
    // console.log({ action: 'BE-check-user', roomId, userName })
    // console.log(roomId, userName)
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  });

  socket.on('BE-join-room', ({ roomId, userName }) => {
    // console.log({ action: 'BE-join-room', roomId, userName })
    // Socket Join RoomName
    socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true };

    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: socketList[client] });
        });
        socket.broadcast.to(roomId).emit('FE-user-join', users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
      }
    });
  });

  socket.on('BE-call-user', ({ userToCall, from, signal }) => {

    // console.log({ action: 'BE-call-user', userToCall, from, signal })

    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {

    // console.log({ action: 'BE-accept-call', signal, to })

    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  socket.on('BE-send-message', ({ roomId, msg, sender }) => {

    // console.log({ action: 'BE-send-message', roomId, msg, sender })

    io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  });

  socket.on('BE-leave-room', ({ roomId, leaver }) => {

    // console.log({ action: 'BE-leave-room', roomId, leaver })

    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(roomId);
  });

  socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {

    // console.log({ action: 'BE-toggle-camera-audio', roomId, switchTarget })

    if (switchTarget === 'video') {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
  });

  socket.on('find-team', (data) => {
    // console.log(data.username, "START FIND TEAM")
    //1. Kiem tra xem user nay ton tai chua
    if (teams.includes(data.username)) {
      socket.emit(`error:find-team`, { exist: true, msg: `user ${data.username} existed` });
    } else {
      teams.push(data.username)

      socket.join(`${data.tage+data.subject+data.part}`)
      if (teams.length >= 3) {
        teams = []
        io.to(`${data.tage+data.subject+data.part}`).emit('success:find-team', Math.round(Math.random() * 909090909090))
      } else {
        io.to(`${data.tage+data.subject+data.part}`).emit('pre:find-team', {payload:data.tage+data.subject+data.part, msg:`Some one joined`})
      }
      
    }
  })

  socket.on('left-queue', (data) => {
    teams = teams.filter(item => item !== data.username)
    socket.leave(`${data.command}`)
  })
});

server.listen(8080, () => console.log(`Server is running on :: http://localhost:8080`))
