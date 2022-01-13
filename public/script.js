//let socket = io();
const userEl = document.getElementById('user');
const responseEl = document.getElementById('response');
const introEl = document.getElementById('intro');
const gameEl = document.getElementById('game');
const textEl = document.getElementById('text');
const leaderboardEl = document.getElementById('leaderboard');
let socket = undefined;

userEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target['name'].value;
    if (name) {
        // estamos conectando al socket
        socket = window.io();
        socket.emit('user_joined', name);

        startGame()
    }
});

function startGame() {
    introEl.classList.add('hidden');
    gameEl.classList.remove('hidden');

    socket.on('text', (text) => {
        textEl.innerText = text;
    })
    socket.on('leaderboard', (leaderboard) => {
        leaderboardEl.innerHTML = `
            ${leaderboard
                .map(
                    (player) => 
                    `<li class="flex justify-between"><strong>${player.name}</strong> ${player.points}</li>`
                )
                .join('')}
        `
    })
};

responseEl.addEventListener('input', (e) => {
    const { value } = e.target;

    if (value.toLowerCase() === textEl.innerText.toLowerCase()) {
        socket.emit('response', value);

        e.target.value = '';
    } 
})
