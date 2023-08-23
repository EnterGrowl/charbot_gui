# CharShift ChatBot GUI

A simple and user-friendly GUI for interacting with the CharShift API using Node.js, Express, and Socket.io.

## Overview

The CharShift ChatBot GUI is designed to allow users to easily communicate with a CharShift server by providing the API's URL and authentication key. Messages are sent to the API, and the responses are streamed back to the user in real-time, ensuring a smooth chat experience.

## Requirements

- Node.js
- npm

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:EnterGrowl/charbot_gui.git
   ```

   or

   ```
   git clone https://github.com/EnterGrowl/charbot_gui.git
   ```

2. Navigate to the project directory:
   ```
   cd charbot_gui
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

## How to Use

1. Start the server:
   ```
   npm start
   ```

2. Open a web browser and go to:
   ```
   http://localhost:3000
   ```

3. You'll be prompted to enter the CharShift API's URL and authentication key.

4. After entering the required details, click on "Join Chat" to start your session.

5. Enter your prompts/queries/requests in the chat input and see the server's responses in real-time.

## How to Modify

- **Frontend**: The frontend files are located in the `public` folder. Modify the HTML files to change the structure, the CSS for styling, and the JS files for functionality.
  
- **Backend**: The server logic is in the `app.js` file. Here you can modify how the server responds to different socket events, add new routes, or integrate additional features.

## Notes

- Ensure that the CharShift server is running and accessible from the machine where this GUI is hosted.
  
- The GUI maintains the API URL and auth key in the browser's local storage for the duration of the session.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licensing

The code in this project is licensed under MIT license.

