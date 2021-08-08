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
    console.log("user.name is valid", serverResponse);
    keepAliveTimerID = setInterval(enableKeepAlive, 5000);
    chatRefreshTimerID = setInterval(enableChatRefresh, 3000);
}

function logInError(serverError) {
    console.log("loginError: serverError.status: ", serverError.response.status);
    if (serverError.response.status === 400) {
        alert(`${globalUser.name} - Nome inválido ou já em uso na sala. Escolha outro nome.`);
        askUserName();
    }
}

//---------------------------------------------------------chatRefresh

function enableChatRefresh() {
    console.log("gettingMessages...");
    
    const getMessagesPromise = axios.get(MESSAGES_URL);
    getMessagesPromise.then(console.log);
    getMessagesPromise.then(printMessages);
    
    //getMessagesPromise.catch ??????
}


function printMessages(messages) {
    let mainChat = document.querySelector(".main-chat");
    mainChat.innerHTML = "";
    for (i = 0; i < messages.data.length; i++) {
        mainChat.innerHTML += `<li> ${messages.data[i].time} ${messages.data[i].from} ${messages.data[i].text} </li>`;
    }


    mainChat.scrollIntoView();
    console.log("messages printed in chat.", "  enableChat_timerID= " + chatRefreshTimerID);
}



//---------------------------------------------------------sendingMessages
/*
function clickedSend(submitted) {
    console.log("clickedSend: ", submitted);
}
*/

function sendMessage(element) {
    let textToSend = element.parentElement.querySelector("input").value;
    console.log(textToSend);
    
    let testUser = {
        from: globalUser.name,
        to: "Todos",
        text: textToSend,
        type: "message" // ou "private_message" para o bônus
    }
    
    const sendMessagePromise = axios.post(MESSAGES_URL, testUser);
    sendMessagePromise.then(sentMessageSuccess);
    sendMessagePromise.catch(sentMessageFailed);
}


function sentMessageSuccess(serverResponse) {
    console.log("message sent succesfully", serverResponse);
}

function sentMessageFailed(serverError) {
    console.log("cannot send empty message", serverError);
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
    //window.location.reload(); <<< working fine!
}


function getParticipants() {
    const participantsPromise = axios.get(LOGIN_URL);

    participantsPromise.then(printAllPeople);
    participantsPromise.catch(errorGettingPeople)
}

function printAllPeople(serverResponse) {
    console.log("online:", serverResponse.data);
}

function errorGettingPeople(serverError) {
    console.log("failed to get people", serverError);
}