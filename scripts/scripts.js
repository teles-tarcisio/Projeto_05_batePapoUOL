const POST_LOGIN_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const POST_KEEPALIVE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const GET_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const POST_MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

//---------------------------------------------------------

let user = {
    name: ""
};

//---------------------------------------------------------

function askUserName() {
    do {
        user.name = prompt("Olar! Informe-nos o seu lindo nome: ");
        if (user.name.length < 3) {
            alert("Seu nome deve conter ao menos 3 caracteres. Tente Novamente.");
        }
    } while (user.name.length < 3);

    let checkInPromise = axios.post(POST_LOGIN_URL, user);
    checkInPromise.then(isNameValid);
    checkInPromise.catch(logInError);

    console.log("end of askUserName()");
}

function isNameValid(serverResponse) {
    console.log("serverResponse: ", serverResponse, "\n end of then");

}

function logInError(serverError) {
    console.log("serverError.status: ", serverError.response.status);
    if (serverError.response.status === 400) {
        alert("Já existe alguém logado com este nome, escolha outro:")
        askUserName();
        console.log("saida IF catch");
    }
    console.log("end of catch")
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