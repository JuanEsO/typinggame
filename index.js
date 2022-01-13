const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io =  require("socket.io")(http);

const { getRamdomFact } = require('./helperFunction.js');

let players = [];
let text = getRamdomFact();

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
    socket.on('user_joined', (name) => {
        console.log(name, 'is now conected');
        const player = {
          id: socket.id,
          name,
          points: 0,
        }
        players.push(player);
        /* console.log(players); */

        updateGame();
    })
    socket.on('response', (response) => {
      //comprobar que la respuesta es correcta
      if(response.toLowerCase() === text.toLowerCase()) {
        text = getRamdomFact();
        increasePoints(socket.id);
        updateGame();
      }
    })
    socket.on('disconnect', () => {
        //eliminar el jugador del array local
        //players = [...players.filter(player => player.id !== socket.id)];
        console.log('user disconnected');

    });
});  



function increasePoints(id) {
  players = players.map((player) => {
    if(player.id === id) {
      return {
        ...player,
        points: player.points + 1,
      };
    } else {
      return player;
    }
  })
};

const updateGame = () => {
  const leaderboard = players.sort((a, b) => b.points - a.points).slice(0, 10);

  io.emit('text', text);
  io.emit('leaderboard', leaderboard);
};

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});