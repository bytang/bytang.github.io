function init(canvas) {

}

function Sandbox(width, height) {

}

function Display(width, height) {

}

function SandShader() {

}

//

function getRandom(min, max) {
    if (min == max) {
        return min;
    }
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    if (min == max) {
        return min;
    }
    return Math.floor(getRandom(min, max + 1));
}

function getRandomChoice(choices) {
    return choices[getRandomInt(0, choices.length - 1)];
}