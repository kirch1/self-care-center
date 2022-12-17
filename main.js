var receiveMessageBtn = document.querySelector('#btn-receive-msg');
var homeBtn = document.querySelector('#btn-home');
var collectionBtn = document.querySelector('#btn-collection');
var createBtn = document.querySelector('#btn-create');
var editBtn = document.querySelector('#btn-edit');
var createAffBtn = document.querySelector('#btn-create-aff');
var createManBtn = document.querySelector('#btn-create-man');
var affirmationRb = document.querySelector('#rb-affirmation');
var mantraRb = document.querySelector('#rb-mantra');
var messageDisplay = document.querySelector('#message-display');
var homeSection = document.querySelector('#main-section');
var collectionSection = document.querySelector('#collection-section');
var affirmationList = document.querySelector('#affirmation-list');
var mantraList = document.querySelector('#mantra-list');
var createMessage = document.querySelector('#create-message-form');
var editMessage = document.querySelector('#edit-message-form');
var createMessageTextArea = document.querySelector('#create-message-ta');
var editMessageTextArea = document.querySelector('#edit-message-ta');
var footer = document.querySelector('footer');
var editingIndex = null;
var msgDragged;
var currentMessage;

window.addEventListener('load', displayMessages);
homeBtn.addEventListener('click', goHome);
collectionBtn.addEventListener('click', goToCollection);
createAffBtn.addEventListener('click', addNewMessage);
createManBtn.addEventListener('click', addNewMessage);
createBtn.addEventListener('click', toggleCreateMessage);
editBtn.addEventListener('click', confirmEdit);

receiveMessageBtn.addEventListener('click', function (event) {
    event.preventDefault();

    if(affirmationRb.checked){
        currentMessage = getMessage('affirmation');
    }else if(mantraRb.checked) {
        currentMessage = getMessage('mantra');
    }

    if(currentMessage.fav){
        messageDisplay.classList.add('favorite');
    }else{
        messageDisplay.classList.remove('favorite');
    }

    messageDisplay.innerHTML = `<p>${currentMessage.msg}</p>`;
});


collectionSection.addEventListener('dragstart', function(event) {
    msgDragged = event.target.id;
})
collectionSection.addEventListener('dragover', function(event){
    event.preventDefault();
});
collectionSection.addEventListener('dragenter', function(event){
    if(editingIndex === null){
        if(event.target.id === 'trash-can' || event.target.id === 'favorite' || event.target.id === 'btn-edit') {
            event.target.classList.add('zoom');
        }
    }
});
collectionSection.addEventListener('dragleave', function(event){
    if(editingIndex === null){
        if(event.target.id === 'trash-can' || event.target.id === 'favorite' || event.target.id === 'btn-edit') {
            event.target.classList.remove('zoom');
        }
    }
});
collectionSection.addEventListener('drop', function(event) {
    if(editingIndex === null){
        if(event.target.id === 'trash-can') {
            deleteMessage(msgDragged);
            event.target.classList.remove('zoom');
        }else if(event.target.classList[0] === 'single-message') {
            var msgDropped = event.target.id;
            moveMessage(getIndexFromID(msgDragged),getIndexFromID(msgDropped));
        }else if(event.target.id === 'btn-edit') {
            beginEdit(getIndexFromID(msgDragged));
            event.target.classList.remove('zoom');
        }else if(event.target.id === 'favorite') {
            toggleFavorite(getIndexFromID(msgDragged));
            event.target.classList.remove('zoom');
        }
    }
})

function goHome() {
    collectionSection.classList.add('hidden');
    homeSection.classList.remove('hidden');
    footer.classList.add('hidden');
}

function goToCollection() {
    collectionSection.classList.remove('hidden');
    homeSection.classList.add('hidden');
    footer.classList.remove('hidden');
}

function toggleCreateMessage() {
    if(editingIndex === null){
        createMessage.classList.toggle('hidden');
        if(createMessage.classList.contains('hidden')) {
            createBtn.innerText = '➕';
        }else{
            createBtn.innerText = '➖';
        }
    }
}

function addNewMessage(event) {
    event.preventDefault();
    if(createMessageTextArea.value) {
        var msgType;
        if(event.target.id === 'btn-create-aff') {
            msgType = 'affirmation';
        }else if(event.target.id === 'btn-create-man'){
            msgType = 'mantra';
        }
        messages.unshift({
            type: msgType,
            msg: createMessageTextArea.value,
            id: Date.now()
        })
        createMessageTextArea.value = '';
        toggleCreateMessage();
        displayMessages();
    }
}


function beginEdit(messageIndex) {
    if(editingIndex === null) {
        editingIndex = messageIndex;
        editMessage.classList.remove('hidden');
        editMessageTextArea.value = messages[messageIndex].msg;
        editBtn.innerText = '✅';
    }
}

function confirmEdit() {
    if(editingIndex !== null){
        messages[editingIndex].msg = editMessageTextArea.value;
        editMessage.classList.add('hidden');
        editMessageTextArea.value = '';
        editBtn.innerText = '✏️';
        editingIndex = null;
        displayMessages();
    }
}

function deleteMessage(idString) {
    for(var i = 0; i < messages.length; i++) {
        if(messages[i].id.toString() === idString){
            messages.splice(i,1);
            break;
        }
    }
    displayMessages();
}

function moveMessage(messageIndex, newIndex) {
    if(messages[messageIndex].type === messages[newIndex].type){
        var messageToMove = messages.splice(messageIndex,1)[0];
        messages.splice(newIndex,0,messageToMove);
        displayMessages();
    }
}

function toggleFavorite(messageIndex) {
    messages[messageIndex].fav = !messages[messageIndex].fav;
    displayMessages();
}

function getIndexFromID(idString) {
    for(var i = 0; i < messages.length; i++) {
        if(messages[i].id.toString() === idString){
            return i;
        }
    }
}

function displayMessages() {
    affirmationList.innerHTML = ''
    mantraList.innerHTML = ''
    for(var i = 0; i < messages.length; i++) {
        var classString = 'single-message card';
        if(messages[i].fav){
            classString += ' favorite';
        }
        if(messages[i].type === 'affirmation') {
            affirmationList.innerHTML += `<div draggable="true" class="${classString}" id="${messages[i].id}">${messages[i].msg}</div>`;
        }else if(messages[i].type === 'mantra'){
            mantraList.innerHTML += `<div draggable="true" class="${classString}" id="${messages[i].id}">${messages[i].msg}</div>`
        }
    }
}

function getMessage(type) {
    var filtered = [];
    for(var i = 0; i < messages.length; i++){
        if(messages[i].type === type){
            filtered.push(messages[i]);
        }
    }
    return filtered[getRandomIndex(filtered)];
}

function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}
