const LOGIN_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const KEEPALIVE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";


//---------------------------------------------------------

let globalUser = {
    name: ""
};

//---------------------------------------------------------

function askUserName() {
    do {
        globalUser.name = prompt("Olar! Informe-nos o seu lindo nome: ");
        if (globalUser.name === null) {
            globalUser.name = "";
        }
        if (globalUser.name.length < 3) {
            alert("Seu nome deve conter ao menos 3 caracteres. Tente Novamente.");
        }
    } while ((globalUser.name.length < 3 ));

    let checkInPromise = axios.post(LOGIN_URL, globalUser);
    checkInPromise.then(isNameValid);
    checkInPromise.catch(logInError);
    console.log("end of askUserName()");
}

function isNameValid(serverResponse) {
    console.log("serverResponse: ", serverResponse, "\n end of then");
    //setInterval(keepAlive, 4900);

}

function logInError(serverError) {
    console.log("serverError.status: ", serverError.response.status);
    if (serverError.response.status === 400) {
        alert("Nome inválido ou já em uso na sala. Escolha outro nome.")
        askUserName();
        console.log("saida IF catch");
    }
    console.log("end of catch")
}

let getMessagesEnabled;
function enableChatRefresh() {
    getMessagesEnabled = setInterval(getAllMessages, 3000);
    console.log(getMessagesEnabled);
}

function disableChatRefresh() {
    console.log("disable id= " + getMessagesEnabled);
    clearInterval(Number(getMessagesEnabled));
}

function getAllMessages() {
    const getMessagesPromise = axios.get(MESSAGES_URL);
    console.log("fetching messages, timer id = " + getMessagesEnabled);
    console.log("gettingMessages: ");
    getMessagesPromise.then(console.log);
    getMessagesPromise.then(printMessages);
}

function printMessages(messages) {
    console.log("got messages");
    let mainChat = document.querySelector(".main-chat");
    mainChat.innerHTML = "";
    for (i = 0; i < messages.data.length; i++) {
        mainChat.innerHTML += `<li> ${messages.data[i].time} ${messages.data[i].from} ${messages.data[i].text} </li>`;
    }
    mainChat.scrollIntoView();
}


function keepAlive() {
    const userObject = globalUser;
    const keepAlivePromise = axios.post(KEEPALIVE_URL, userObject)
    console.log("called keepAlive, globalUser: ", globalUser.name);

    keepAlivePromise.then(userIsActive);
    keepAlivePromise.catch(userIsOffline);
    console.log("end of keepAlive()");
}

function userIsActive(serverResponse) {
    console.log("stillAlive: ", serverResponse, "\n end of then");
}

function userIsOffline(serverError) {
    console.log("keepAliveError: ", serverError.response, "\nend of catch");
    alert("Disconnected due to inactivity");
}