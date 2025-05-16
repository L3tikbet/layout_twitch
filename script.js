const channelName = "teuNickEmMinusculo";

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

socket.onopen = () => {
  console.log("Conectado ao chat da Twitch!");

  // Conexão anônima
  socket.send("PASS oauth:anonymous");
  socket.send("NICK justinfan12345");
  socket.send(`JOIN #${channelName}`);
};

socket.onmessage = (event) => {
  const msg = event.data;
  console.log("Mensagem recebida:", msg); // Ver tudo que chega

  // Mantém conexão viva
  if (msg.startsWith("PING")) {
    socket.send("PONG :tmi.twitch.tv");
    return;
  }

  // Verifica se é mensagem de chat
  if (msg.includes("PRIVMSG")) {
    const [prefix, fullMessage] = msg.split("PRIVMSG");
    const username = prefix.split("!")[0].slice(1);
    const message = fullMessage.split(" :")[1];

    displayMessage(username, message);
  }
};

function displayMessage(user, text) {
  const chat = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<span class="username">${user}:</span> ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
