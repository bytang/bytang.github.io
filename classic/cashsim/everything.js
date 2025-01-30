$(document).ready(function() {
    init("screen");
});

var denomList = [10000, 5000, 2000, 1000, 500, 200, 100, 25, 10, 5];
var denomNames = ["$100 Bill", "$50 Bill", "$20 Bill", "$10 Bill", "$5 Bill", "Toonie", "Loonie", "Quarter", "Dime", "Nickel"];

var money = NaN;
var change = NaN;
var denomAmount = [];
var denomLimit = [];

var out = "";

function init(elementID) {
    document.getElementById(elementID).innerHTML = cashInputString;
    $("#money").keyup(function(e) {
        $("#output").html(interpret($("#money").val()));
    });
}

function interpret(string) {
    var num = Number(string);
    if (string.length == 0 || isNaN(num)) {
        out = "Give $$$";
    }
    else {
        var newMoney = Math.round(num * 100);
        if (newMoney.toString().length > 14) {
            out = "Much $$$";
        }
        else {
            if (money != newMoney) {
                calculateChange(newMoney);
            }
            out = outputReadable();
        }
    }
    return out;
}

function calculateChange(cents) {
    money = cents;
    change = penniless(cents);
    var changeCopy = change;
    if (change != 0) {
        var denomLength = denomList.length;
        var fill = denomLength - denomAmount.length;
        denomAmount = [];
        for (var i = 0; i < fill; i++) {
            denomAmount.push(0);
        }
        for (var i = 0; i < denomLength; i++) {
            denomAmount[i] = Math.floor(abs(change) / denomList[i]);
            change %= denomList[i];
            if (change == 0) {
                break;
            }
        }
    }
    change = changeCopy;
}

function outputReadable() {
    var outputString = "";
    if (abs(money) != abs(change)) {
        outputString += "R.I.P. Penny 1858 - 2012<br>";
        outputString += formatCash(money) + " -> " + formatCash(change);
        outputString += "<br>";
    }
    if (change == 0) {
        outputString += "Zero $$$"
    }
    else {
        if (money < 0) {
            outputString += "Give me "
        }
        else {
            outputString += "Here is "
        }
        outputString += formatCash(abs(change)) + ": ";
        for (var i = 0; i < denomAmount.length; i++) {
            if (denomAmount[i] > 0) {
                outputString += formatNum(denomAmount[i]) + " ";
                if (denomAmount[i] > 1) {
                    outputString += pluralize(denomNames[i])
                }
                else {
                    outputString += denomNames[i];
                }
                outputString += ", ";
            }
        }
        outputString = outputString.substring(0, outputString.length - 2);
    }
    return outputString;
}

function penniless(money) {
    var mult = 1;
    if (money < 0) {
        mult = -1;
        money *= -1;
    }
    var pennies = money % 10;
    if (pennies < 3) {
        money -= pennies;
    }
    else if (pennies > 7) {
        money += 10 - pennies;
    }
    else {
        money += 5 - pennies;
    }
    return mult * money;
}

function pluralize(string) {
    if (string.charAt(string.length - 1) == 'y') {
        string = string.slice(0, string.length - 1);
        return string + "ies";
    }
    return string + "s";
}

function formatCash(money) {
    var output = "";
    if (money < 0) {
        output += "($" + formatNum((-money / 100).toFixed(2)) + ")";
    }
    else {
        output += "$" + formatNum((money / 100).toFixed(2));
    }
    return output;
}

function formatNum(number) {
    var numString = number.toString();
    var start = numString.indexOf('-');
    var stop = numString.indexOf('.');
    if (start == -1) {
        start = 0;
    }
    if (stop == -1) {
        stop = numString.length;
    }
    if (stop - start > 3) {
        var hundreds = numString.substring(stop - 3, stop);
        var output = "";
        for (var i = start; i < stop - 3; i++) {
            if (i % 3 == 0) {
                output += ",";
            }
            output += numString[stop - 4 - i];
        }
        return output.split('').reverse().join('') + hundreds + numString.substring(stop, numString.length);
    }
    return numString;
}

function abs(n) {
    if (n < 0) {
        return -n;
    }
    return n;
}

// Huge strings for UI html

var cashInputString = '<input type="text" id="money" name="money" autocomplete="off" /><p class="output" id="output">Enter a Canadian Dollar value in the box above to get the equivalent in Canadian currency denominations.</p>';