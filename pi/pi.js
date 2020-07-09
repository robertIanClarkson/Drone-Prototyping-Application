let isOn = false;
let PWD_VALUE = 0;
let PWD_AMOUNT = 100;

function setOn() {
    isOn = true
};

function setOff() {
    isOn = false
};

function setDown() {
    PWD_VALUE -= PWD_AMOUNT
};

function setUp() {
    PWD_VALUE += PWD_AMOUNT
};

function getStatus() {
    return isOn
};

function getValue() {
    return PWD_VALUE
};

module.exports = {
    setOn,
    setOff,
    setDown,
    setUp,
    getStatus,
    getValue
}