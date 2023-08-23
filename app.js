// dependencies
const express = require('express');
const axios = require('axios');
const socketIo = require('socket.io');
const moment = require('moment-timezone');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

function formatMessage(username, text) {
   return {
      username,
      text,
      // time: moment().format('h:mm a'),
      time: moment().format('h:mm a'),
   };
}

// set static file
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'CharBot';

// run when client connects
io.on('connection', (socket) => {

   socket.emit('message', formatMessage(botName, 'Welcome to CharShift API\'s user-interactive interface!'));

   socket.on('joinRoom', (room) => {
       socket.join(room);       
   });

   // Listen for chatMessage
   socket.on('chatMessage', async (data) => {
     const { msg, apiUrl, authKey } = data;
     const room = authKey.slice(-4);
     // Send user's message to chat
     io.to(room).emit('message', formatMessage('User', msg));

     // Call API and stream response back to the client
     const response = await axios({
       method: 'post',
       url: apiUrl,
       data: {
         auth: authKey,
         query: msg
       },
       responseType: 'stream'
     });

     response.data.on('data', (chunk) => {
       const cleaned_data = chunk.toString('utf-8').replace("data: ", "").replace("\r\n", "");
       io.to(room).emit('message', formatMessage(botName, cleaned_data));
     });

     response.data.on('end', () => {
       // Optional: Emit a message to indicate the end of the response, or handle any post-response actions
     });
   });
});

const PORT = process.env.PORT || 13447;
server.listen(PORT, () => {
   console.log(`🎯 Server is running on PORT: ${PORT}`);
});
