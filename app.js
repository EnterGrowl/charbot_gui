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

    try {
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
        // Currently returns health check ping, identify it to ignore
        if (chunk.toString('utf-8').indexOf(': ping - ') > -1) return
        // Frontend uses the presence of identifiers such as \r\n sequence to know
        // it is a continuation of a message that is being streamed
        const cleaned_data = chunk.toString('utf-8');
        io.to(room).emit('message', formatMessage(botName, cleaned_data));
      });

      response.data.on('end', () => {
        // Optional: Emit a message to indicate the end of the response, or handle any post-response actions
      });

    } catch (error) {

      if (error.response && error.response.data) {
        let errorData = '';

        error.response.data.on('data', (chunk) => {
          errorData += chunk;
        });

        // Handle error as stream
        error.response.data.on('end', () => {
          try {
            const parsedError = JSON.parse(errorData);
            const errorMessage = parsedError.detail ? `Error: ${parsedError.detail}` : 'There was an error processing your request.';
            io.to(room).emit('message', formatMessage(botName, errorMessage));
          } catch (e) {
            console.error("Failed to parse error message:", e);
            io.to(room).emit('message', formatMessage(botName, 'There was an error processing your request. Unexpected server response format.'));
          }
        });

      } else {

        io.to(room).emit('message', formatMessage(botName, 'There was an error processing your request.'));

      }
    }
  });
});

const PORT = process.env.PORT || 13447;
server.listen(PORT, () => {
   console.log(`🎯 Server is running on PORT: ${PORT}`);
});
