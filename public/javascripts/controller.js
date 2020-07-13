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
    $.post('http://10.0.0.5:3000/refresh', null, function(data, status) {
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
    $.post('http://10.0.0.5:3000/on', null, function(data, status) {
        console.log('Client: POST --> on')
        // refreshData()
    })
});

// OFF
document.querySelector('#off').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/off', null, function(data, status) {
        console.log('Client: POST --> off')
        refreshData()
    })
});

// UP
document.querySelector('#up').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/up', null, function(data, status) {
        console.log('Client: POST --> up')
        refreshData()
    })
});

// DOWN
document.querySelector('#down').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/down', null, function(data, status) {
        console.log('Client: POST --> down')
        refreshData()
    })
});

var slider = document.getElementById("motorSpeedSlider");
var output = document.getElementById("speedValue");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
  var data = {
      motor: 0,
      speed: this.value
  }
  $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
        console.log('Client: POST --> adjust speed')
    })
}

// TEST
document.querySelector('#test').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/test', null, function(data, status) {
        console.log('Client: POST --> test')  
    })
});


/******************************************************* */

var log = console.log.bind(console);
var keyData = document.getElementById('key_data');
var midi;
var data, cmd, channel, type, note, velocity;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
    data = event.data;
    // if(data[1] == 34 || data[1] == 36) {
        logger(keyData, 'key data', data);
    // }
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}

function listInputs(inputs) {
    var input = inputs.value;
    log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function logger(container, label, data) {
    midiEvent = parseMidiMessage(data);
    if (midiEvent.command === 11) { // slider
        if (midiEvent.note === 19) { // volume 1 & 3
            if(midiEvent.channel === 1) { // channel 1
                container.textContent = `Value : ${Math.floor(midiEvent.velocity * 135.0)}`;
            } else if(midiEvent.channel === 3) { // channel 2
                // 2nd motor midi code
                // container.textContent = `Value : ${midiEvent.velocity}`;
            }
        }
    }
}

function parseMidiMessage(message) {
    return {
      command: data[0] >> 4,
      channel: data[0] & 0xf,
      note: data[1],
      velocity: data[2] / 127
    }
  }
