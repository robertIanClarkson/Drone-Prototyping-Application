function setStatus(isOn) {
    $('#status').empty()
    if(isOn) {
        $('#status').append('ON')
    } else {
        $('#status').append('OFF')
    }
}

function setValue(value) {
    $('#speed').empty()
    $('#speed').append(value)
}

// Refresh on load
$(window).on('load', () => {
    $.post('http://localhost:3000/refresh', null, function(data, status) {
        setStatus(data.status)
        setValue(data.value)
    })
    console.log('Client: POST --> loaded')
});

// REFRESH
document.querySelector('#refresh').addEventListener('click', event => {
    $.post('http://localhost:3000/refresh', null, function(data, status) {
        setStatus(data.status)
        setValue(data.value)
    })
    console.log('Client: POST --> refresh')
});

// ON
document.querySelector('#on').addEventListener('click', event => {
    $.post('http://localhost:3000/on')
    console.log('Client: POST --> on')
});

// OFF
document.querySelector('#off').addEventListener('click', event => {
    $.post('http://localhost:3000/off')
    console.log('Client: POST --> off')
});

// UP
document.querySelector('#up').addEventListener('click', event => {
    $.post('http://localhost:3000/up')
    console.log('Client: POST --> up')
});

// DOWN
document.querySelector('#down').addEventListener('click', event => {
    $.post('http://localhost:3000/down')
    console.log('Client: POST --> down')
});

// TEST
document.querySelector('#test').addEventListener('click', event => {
    $.post('http://localhost:3000/test')
    console.log('Client: POST --> test')
});