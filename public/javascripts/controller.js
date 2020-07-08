
let isOn = false;
let PWD_VALUE = 0;
let PWD_AMOUNT = 100;

// On/Off value
function setStatus() {
    
}

function refreshStatus() {
    $('#status').empty()
    if(isOn) {
        $('#status').append('ON')
    } else {
        $('#status').append('OFF')
    }
}

// PWD value
function setPWD() {

}

function refreshPWD() {
    $('#speed').empty()
    $('#speed').append(PWD_VALUE)
}

// ON
document.querySelector('#on').addEventListener('click', event => {
    // console.log('ON')
    isOn = true
    setStatus()
    refreshStatus()
});

// OFF
document.querySelector('#off').addEventListener('click', event => {
    // console.log('OFF')
    isOn = false
    setStatus()
    refreshStatus()
});

// UP
document.querySelector('#up').addEventListener('click', event => {
    // console.log('UP')
    PWD_VALUE += PWD_AMOUNT
    setPWD()
    refreshPWD()
});

// DOWN
document.querySelector('#down').addEventListener('click', event => {
    // console.log('DOWN')
    PWD_VALUE -= PWD_AMOUNT
    setPWD()
    refreshPWD()
});

// TEST
document.querySelector('#test').addEventListener('click', event => {
    console.log('TEST')
    $.post('http://localhost:3000/test', null, function(data, status) {
        console.log(`${data} and status is ${status}`)
    })
    
});

refreshPWD()
refreshStatus()





