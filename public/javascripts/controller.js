var timeThen = 0;
var timeNow;

function setStatus(motor, isOn) {
    $(`#status-${motor}`).empty()
    if(isOn) {
        $(`#status-${motor}`).append('ON')
    } else {
        $(`#status-${motor}`).append('OFF')
    }
}

function setPWM(motor, value) {
    $(`#pwm-${motor}`).empty()
    $(`#pwm-${motor}`).append(value)
}

function refreshData() {
    $.post('http://10.0.0.5:3000/refresh', null, function(data, status) {
        setStatus(0, data.motor0.isOn)
        setStatus(1, data.motor1.isOn)
        setPWM(0, data.motor0.speed)
        setPWM(1, data.motor1.speed)
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

// ON-0
document.querySelector('#on-0').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/on', {motor: 0}, function(data, status) {
        console.log('Client: POST --> on-0')
    })
});

// ON-1
document.querySelector('#on-1').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/on', {motor: 1}, function(data, status) {
        console.log('Client: POST --> on-1')
    })
});

// OFF-0
document.querySelector('#off-0').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/off', {motor: 0}, function(data, status) {
        console.log('Client: POST --> off-1')
    })
});

// OFF-1
document.querySelector('#off-1').addEventListener('click', event => {
    $.post('http://10.0.0.5:3000/off', {motor: 1}, function(data, status) {
        console.log('Client: POST --> off-2')
    })
});

// SLIDER-0
var slider0 = document.getElementById("speed-0");
var output0 = document.getElementById("speedValue-0");
output0.innerHTML = slider0.value;
slider0.oninput = function() {
  output0.innerHTML = this.value;
  var data = {
      motor: 0,
      speed: this.value
  }
  $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
        console.log('Client: POST --> adjust speed-0')
  })
  refreshData()
}


// SLIDER-1
var slider1 = document.getElementById("speed-1");
var output1 = document.getElementById("speedValue-1");
output1.innerHTML = slider1.value;
slider1.oninput = function() {
    output1.innerHTML = this.value;
    var data = {
        motor: 1,
        speed: this.value
    }
    $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
          console.log('Client: POST --> adjust speed-1')
    })
    refreshData()
  }

/*************************MIDI****************************** */
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
    midiEvent = parseMidiMessage(event.data);
    if (midiEvent.command === 11) { // slider
        if (midiEvent.note === 19) { // volume 1 & 3
            if(midiEvent.channel === 1) { // channel 1
                adjustSlider(0, midiEvent.value);
            } else if(midiEvent.channel === 3) { // channel 2
                adjustSlider(1, midiEvent.value);
            }
        }
    }
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

function parseMidiMessage(message) {
    return {
        command: data[0] >> 4,
        channel: data[0] & 0xf,
        note: data[1],
        value: Math.floor((data[2] / 127) * 135.0)
    }
}

function adjustSlider(motor, value) {
    timeNow = Date.now()
    if((timeNow - timeThen) > 250) { // allow every X millisecond
        if(motor == 0) {
            if(slider0.value != value) { // dont post if value hasn't changed
                slider0.value = value;
                output0.innerHTML = value;
                var data = {
                    motor: 0,
                    speed: value
                }
                $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
                    console.log('Client: POST --> adjust speed')
                    timeThen = timeNow;
                    refreshData();
                })
            }
        } else if(motor == 1) {
            if(slider1.value != value) { // dont post if value hasn't changed
                slider1.value = value;
                output1.innerHTML = value;
                var data = {
                    motor: 1,
                    speed: value
                }
                $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
                    console.log('Client: POST --> adjust speed')
                    timeThen = timeNow;
                    refreshData();
                })
            }
        }
    }
}

