const LOGIN_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const KEEPALIVE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

//---------------------------------------------------------globalVars

let globalUser = {
    name: ""
};

let keepAliveTimerID;
let chatRefreshTimerID;

//---------------------------------------------------------userLogin

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
}

function isNameValid(serverResponse) {
    keepAliveTimerID = setInterval(enableKeepAlive, 5000);
    chatRefreshTimerID = setInterval(enableChatRefresh, 3000);
}

function logInError(serverError) {
    if (serverError.response.status === 400) {
        alert(`${globalUser.name} - Nome inválido ou já em uso na sala. Escolha outro nome.`);
        askUserName();
    }
}

//---------------------------------------------------------chatRefresh

function enableChatRefresh() {
    const getMessagesPromise = axios.get(MESSAGES_URL);
    getMessagesPromise.then(printMessages);
}


function printMessages(response) {
    let mainChat = document.querySelector(".main-chat");
    mainChat.innerHTML = "";
    for (i = 0; i < response.data.length; i++) {
        if ((response.data[i].to !== globalUser.name) && (response.data[i].type === "private_message")){
            mainChat.innerHTML += "";
            i++;
        }
        if (response.data[i].type === "status") {
            mainChat.innerHTML += `<li class="${response.data[i].type}">
            <p1>
            <span class="timestamp">(${response.data[i].time})</span>
            <span class="from">${response.data[i].from}</span>
            ${response.data[i].text}
            </p1>
            </li>`;
        }
        else if ((response.data[i].type === "private_message") && (response.data[i].to === globalUser.name)) {
            mainChat.innerHTML += `<li class="${response.data[i].type}">
            <p1>
            <span class="timestamp">(${response.data[i].time}) </span>
            <span class="from">${response.data[i].from}</span> reservadamente para
            <span class="to">${response.data[i].to}</span>:
            ${response.data[i].text}
            </p1>
            </li>`;            
        }
        else {
            mainChat.innerHTML += `<li class="${response.data[i].type}">
            <p1>
            <span class="timestamp">(${response.data[i].time}) </span>
            <span class="from">${response.data[i].from}</span> para
            <span class="to">${response.data[i].to}</span>:
            ${response.data[i].text}
            </p1>
            </li>`;
        }
    }
    mainChat.scrollIntoView();
}



//---------------------------------------------------------sendingMessages

function sendMessage(element) {
    let textToSend = element.parentElement.querySelector(".message-form input").value;
        
    let testUser = {
        from: globalUser.name,
        to: "Todos",
        text: textToSend,
        type: "message" // ou "private_message" para o bônus
    }
    
    const sendMessagePromise = axios.post(MESSAGES_URL, testUser);
    sendMessagePromise.then(sentMessageSuccess);
    sendMessagePromise.catch(sentMessageFailed);
    element.parentElement.querySelector(".message-form").reset();
}


function sentMessageSuccess(serverResponse) {
    console.log("message sent succesfully", serverResponse);
}

function sentMessageFailed(serverError) {
    console.log("cannot send empty message");
}

//---------------------------------------------------------keepAlive
function enableKeepAlive() {
    const keepAlivePromise = axios.post(KEEPALIVE_URL, globalUser)
    keepAlivePromise.then(userIsActive);
    keepAlivePromise.catch(userIsOffline);
}

function userIsActive(serverResponse) {
    console.log("userStillAlive, timerID= ", keepAliveTimerID, serverResponse);
}

function userIsOffline(serverError) {
    alert("keepAliveError: user disconnected due to inactivity");
    window.location.reload();
}

//---------------------------------------------------------usersOnline
function getParticipants() {
    const participantsPromise = axios.get(LOGIN_URL);
    participantsPromise.then(printAllUsers);
    participantsPromise.catch(errorGettingUsers)
}

function printAllUsers(serverResponse) {
    console.log("users online:"); 
    for (i = 0; i < serverResponse.data.length; i++) {
        console.log(serverResponse.data[i].name);
    }
}

function errorGettingUsers(serverError) {
    console.log("failed to get online users", serverError);
}