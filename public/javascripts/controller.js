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

function refreshData() {
    $.post('http://localhost:3000/refresh', null, function(data, status) {
        setStatus(data.status)
        setValue(data.value)
        console.log('Client: POST --> refresh')
    })
}

// Refresh on load
$(window).on('load', () => {
    refreshData()
});

// REFRESH
document.querySelector('#refresh').addEventListener('click', event => {
    refreshData()
});

// ON
document.querySelector('#on').addEventListener('click', event => {
    $.post('http://localhost:3000/on', null, function(data, status) {
        console.log('Client: POST --> on')
        refreshData()
    })
});

// OFF
document.querySelector('#off').addEventListener('click', event => {
    $.post('http://localhost:3000/off', null, function(data, status) {
        console.log('Client: POST --> off')
        refreshData()
    })
});

// UP
document.querySelector('#up').addEventListener('click', event => {
    $.post('http://localhost:3000/up', null, function(data, status) {
        console.log('Client: POST --> up')
        refreshData()
    })
});

// DOWN
document.querySelector('#down').addEventListener('click', event => {
    $.post('http://localhost:3000/down', null, function(data, status) {
        console.log('Client: POST --> down')
        refreshData()
    })
});

// TEST
document.querySelector('#test').addEventListener('click', event => {
    $.post('http://localhost:3000/test', null, function(data, status) {
        console.log('Client: POST --> test')  
    })
});