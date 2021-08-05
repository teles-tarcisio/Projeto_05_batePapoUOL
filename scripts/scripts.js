const POST_LOGIN_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const POST_KEEPALIVE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const GET_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const POST_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

function userCheckIn() {
    const user = {
        name: "Pixels_The_Dog"
    };
    const checkInPromise = axios.post(POST_LOGIN_URL, user);
    console.log("checkin: ");
    checkInPromise.then(console.log);
}

function getAllMessages() {
    const getMessagesPromise = axios.get(GET_MESSAGES_URL);
    console.log("getMessages: ");
    getMessagesPromise.then(console.log);
    getMessagesPromise.then(printMessages);
}

function printMessages(messages) {
    //console.log("got messages");
    let mainChat = document.querySelector(".main-chat");
    for (i = 0; i < 100; i++) {
        mainChat.innerHTML += `<li> ${messages.data[i].time} ${messages.data[i].from} ${messages.data[i].text} </li>`;
    }
}