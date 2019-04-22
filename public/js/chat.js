const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        message: msg
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) {
            return console.log(error);
        }

        console.log('Message delivered');
    });
});

$sendLocationButton.addEventListener('click', () => {
   if(!navigator.geolocation) {
        return alert('Geolocation is not support by your browser');
   } 

   $sendLocationButton.setAttribute('disabled', 'disabled');

   navigator.geolocation.getCurrentPosition((position) => {
       $sendLocationButton.removeAttribute('disabled');
       socket.emit('sendLocation', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       }, () => {
           console.log('Location shared');
       });
   });
});