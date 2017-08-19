function codeManupulator(code) {
    this.code = code;
    this.count = code.length;
    this.current = 0;
}
codeManupulator.prototype = {
    checkAllowedSymbols: function() {
        for (var i = 0; i < this.count; i++)
            if (this.code[i] === '8' || this.code[i] === '9')
            {
                selectError(i, i);
                throw "Разрешено использовать только восьмеричную систему счисления";
            }
            else if (/^[абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ]$/.test(this.code[i]))
            {
                selectError(i, i);
                throw "Кириллица не разрешена";
            }
            
            else if (!/^[a-zA-Z0-7\+\-\*\/\=\^\s\:\.\,\n]$/.test(this.code[i]))
            {
                selectError(i, i);
                throw "Недопустимый символ \"" + this.code[i] + "\"";
            }
    },
    
    getCode: function() {
        return this.code;
    },
    checkStop: function()
    {
        if (/Stop\s*$/.test(this.code))
            return true;
        else
            return false;
    },
    getLength: function()
    {
        return this.count;
    },
    getCurrent: function()
    {
        return this.current;
    },
    getNextSymbolWithOutSkipSpaces: function() {
        var current = this.current;
        do
        {
            if (this.current >= this.count)
                return false;
            var symbol = this.code[current];
            if (symbol === ' ' || symbol === '\n')
                current++;
            else
                break;
        }
        while (true);
        return this.code[current];
    },
    mustBeOneOrMoreSpaces: function() {
        if (this.code[this.current] === ' ' || this.code[this.current] === '\n')
            return true;
        else
            return false;
    },
    isSin: function() {
        if (this.count < (this.current + 2))
            return false;
        if (
            this.code[this.current] === 's' &&
            this.code[this.current + 1] === 'i' &&
            this.code[this.current + 2] === 'n'
        )
            return true;
        else
            return false;
    },
    isCos: function() {
        if (this.count < (this.current + 2))
            return false;
        if (
            this.code[this.current] === 'c' &&
            this.code[this.current + 1] === 'o' &&
            this.code[this.current + 2] === 's'
        )
            return true;
        else
            return false;
    },
    isAbs: function() {
        if (this.count < (this.current + 2))
            return false;
        if (
            this.code[this.current] === 'a' &&
            this.code[this.current + 1] === 'b' &&
            this.code[this.current + 2] === 's'
        )
            return true;
        else
            return false;
    },
    isEnd: function() {
        this.skipSpaces();
        if (this.count < (this.current + 3))
            return false;
        if (
            this.code[this.current] === 'S' &&
            this.code[this.current + 1] === 't' &&
            this.code[this.current + 2] === 'o' &&
            this.code[this.current + 3] === 'p'
        )
            return true;
        else
            return false;
    },
    debug_getRemainingCode: function() {
        console.log(this.code.substr(this.current));
    },
    skipSpaces: function() {
        var skippedSpaces = 0;
        do
        {
            if (this.current >= this.count)
                return false;
            var symbol = this.code[this.current];
            if (symbol === ' ' || symbol === '\n')
            {
                this.current++;
                skippedSpaces++;
            }
            else
                break;
        }
        while (true);
        if (skippedSpaces === 0)
            return true;
        else
            return skippedSpaces;
    },
    skipSpaces2: function() {
        var skippedSpaces = 0;
        do
        {
            if (this.current >= this.count)
                return false;
            var symbol = this.code[this.current];
            if (symbol === ' ' || symbol === '\n')
            {
                this.current++;
                skippedSpaces++;
            }
            else
                break;
        }
        while (true);
        if (skippedSpaces === 0)
            return true;
        else
            return skippedSpaces;
    },
    getPosition: function() {
        return this.current;
    },
            
    increaseCurrent: function()
    {
        this.current++;
    },
    
    getVariable: function() {
        var selectBegin = code.getCurrent();
        var variable = code.getSymbol();
        do
        {
            var symbol = code.getSymbolWithOutSkip();
            if (isLetter(symbol) || isEightNumberSystem(symbol))
            {
                variable += symbol;
                code.increaseCurrent();
            }
            else
                break;
        } while(true);
        var returnedVariable = undefined;
        variables.forEach(function(item, i) {
            if (variable === item.name)
            {
                returnedVariable = item.value;
                return;
            }
        });
        if (returnedVariable === undefined)
        {
            if (variable === 'Stop')
            {
                selectError(selectBegin, code.current - 1);
                throw "Неожиданное слово \"Stop\"";
            }
            
            selectError(selectBegin, code.current - 1);
            throw "Необъявленная переменная " + variable;
        }
        else
        {
            return returnedVariable;
        }
    },
    
    getReal: function() {
        var real = '';
        var wasLeftPart = false;
        var wasSemicolon = false;
        var wasRightPart = false;
        do
        {
            var symbol = code.getSymbolWithOutSkip();
            if (wasLeftPart === false)
            {
                if (isEightNumberSystem(symbol))
                {
                    real += symbol;
                    wasLeftPart = true;
                    code.increaseCurrent();
                }
                else
                    return false;
            }
            else if (wasSemicolon === false)
            {
                if (isEightNumberSystem(symbol))
                {
                    real += symbol;
                    code.increaseCurrent();
                }
                else if (symbol === '.')
                {
                    real += '.';
                    wasSemicolon = true;
                    code.increaseCurrent();
                }
                else
                    return false;
            }
            else if (wasRightPart === false)
            {
                if (isEightNumberSystem(symbol))
                {
                    real += symbol;
                    wasRightPart = true;
                    code.increaseCurrent();
                }
                else
                    return false;
            }
            else
            {
                if (isEightNumberSystem(symbol))
                {
                    real += symbol;
                    code.increaseCurrent();
                }
                else
                    break;
            }
        } while(true);
        return real;
    },
    
    getNumber: function() {
        var number = code.getSymbol();
        var numbersAreNotFinished = true;
        do
        {
            var symbol = code.getSymbol();
            if (isEightNumberSystem(symbol))
            {
                number += symbol;
            }
            else
                numbersAreNotFinished = false;
        } while(numbersAreNotFinished);
    },
    getSymbol: function() {
        if (this.current >= this.count)
            return false;
        else
        {
            var resultChar = this.code[this.current];
            this.current++;
            return resultChar;
        };
    },
    
    getSymbolWithOutSkip: function() {
        if (this.current >= this.count)
            return false;
        else
        {
            var resultChar = this.code[this.current];
            return resultChar;
        };
    },
    getToken: function(errorMessage) {
        var token = {};
        token.begin = this.current;
        token.end = this.current - 1;
        token.data = "";
        var isEnd = false;
        do
        {
            if (this.current >= this.count)
                break;
            else
            {
                var symbol = this.code[this.current];
                if (symbol === ' ' || symbol === '\n')
                    break;
                token.data += symbol;
                token.end++;
                this.current++;
            }
        }
        while (true);
        if (token.data.length !== 0)
            return token;
        else
        {
            if (this.code.length > 0)
                selectError(this.code.length - 1, this.code.length);
            throw "Неожиданный конец. " + errorMessage;
        }
    },
    deleteStop: function() {
        var tokens = [];
        for (var i = 0; i < this.count - 3; i++)
            if (this.code[i] === 'S' && this.code[i+1] === 't' && this.code[i+2] === 'o' && this.code[i+3] === 'p')
            {
                var token = {};
                token.begin = i;
                token.end = i + 3;
                tokens.push(token);
            }
        if (tokens.length > 1)
        {
            var token = tokens.shift();
            selectError(token.begin, token.end);
            throw "Cлово \"Stop\" должно стоять в конце";
        }
        else if (tokens.length === 0)
        {
            selectError(this.code.length - 1, this.code.length);
            throw "Неожиданный конец. Ожидалось слово \"Stop\"";
        }
        else if (tokens.length === 1)
        {
            for (var i = tokens[0].end + 1; i < this.count; i++)
            {
                if (!(this.code[i] === ' ' || this.code[i] === '\n'))
                {
                    selectError(i, i);
                    throw "После слова \"Stop\" не ожидается больше ничего";
                }
            }
            this.code = this.code.slice(0, tokens[0].begin);
        }
    },
    debug_printCodeWithPositions: function()
    {
        for (var i = 0; i < this.count; i++)
            console.log(i + ' ' + this.code[i]);
    }
};

function translateCode()
{
    try {
        var codeField = document.getElementById("codeField").value;
        var errorField = document.getElementById("errorsField");
        errorField.innerHTML = "";
        var outputField = document.getElementById("outputField");
        outputField.innerHTML = "";
        window.code = new codeManupulator(codeField);
        window.token = {};
        window.symbol = "";
        window.variables = [];
        
        code.checkAllowedSymbols();

        if (code.getCode().trim().length === 0)
            throw "Введите строку";
        code.skipSpaces();
        token = code.getToken("Ожидается слово \"Start1\"");      
        checkToken(token, "Start", "Язык должен начинаться со слова \"Start\"");
        
        if (!code.checkStop())
        {
            selectError(code.count - 1, code.count);
            throw "Язык должен заканчиваться словом \"Stop\"";
        }
        links();
               
        countables();

        printVariables(variables);     

    }
    catch(message)
    {
        var errorField = document.getElementById("errorsField");
        errorField.innerHTML = 'Ошибка! ' + message;
    }
}
function links()
{
    do {
        code.skipSpaces();
        token = code.getToken("Ожидается слово \"First\" или \"Second\" или \"Third\" или \"Fourth\"");
        var endLinksLoop;
        switch (token.data) {
          case "First":
            code.skipSpaces();
            token = code.getToken("Ожидается вещественное число");
            endLinksLoop = checkRealSemicolon(token);
            break
          case "Second":
            do {
                code.skipSpaces();
                token = code.getToken("Ожидается вещественное число");
                var endSecondLoop = checkRealSemicolon(token);
            } while (!endSecondLoop);
            break
          case "Third":
            code.skipSpaces();
            token = code.getToken("Ожидается целое число");
            endLinksLoop = checkIntSemicolon(token);
            break
          case "Fourth":
            do {
                code.skipSpaces();
                token = code.getToken("Ожидается целое число");
                var endFourthLoop = checkIntSemicolon(token);
            } while (!endFourthLoop);
            break
          default:
            selectError(token.begin, token.end);
            throw "Ожидается слово \"First\" или \"Second\" или \"Third\" или \"Fourth\"";
        }
    } while (endLinksLoop);
}
function countables()
{
    do
    {
        var isBreak = countable();
    }
    while(isBreak);
}

function countable()
{
        var variable = {};
        readMark();
        variable.name = readVariable();      
        variable.value = rightPart();
        variables.push(variable);
        if (!code.mustBeOneOrMoreSpaces())
        {
            selectError(code.current, code.current);
            throw "Переменные должны отделяться одним или более пробелами";
        }
        if (code.isEnd())
            return false;
        else
            return true;
}
function negation(number)
{
    if (number[0] === '-')
        return number.slice(1);
    else
        return '-' + number;
}
function readVariable() {
    var selectBegin = code.getCurrent();
    var variableName = symbol;
    var flag = true;
    do {
        symbol = code.getSymbol();
        if (isLetter(symbol) || isEightNumberSystem(symbol))
            variableName += symbol;
        else if (symbol === '=')
            flag = false;
        else if (symbol === ' ' || symbol === '\n') {
            code.skipSpaces();
            symbol = code.getSymbol();
            if (symbol === '=')
                flag = false;
            else {
                console.log('variable name = ' + variableName);
                console.log('variables.length = ' + variables.length);
                if (variableName === 'Stop' && variables.length === 0) {
                    selectError(selectBegin - 1, selectBegin + 2);
                    throw "Ожидаются операторы";
                }
                selectError(code.current - 1, code.current - 1);
                throw "Ожидался знак \"=\"";
            }
        }
        else {
            selectError(code.current - 1, code.current - 1);
            throw "Недопустимый символ в переменной";
        }
    } while (flag);
    return variableName;
}
function readMark()
{
    code.skipSpaces();
    symbol = code.getSymbol();
    if (isEightNumberSystem(symbol)) {
        do {
            symbol = code.getSymbol();
        } while (isEightNumberSystem(symbol));
        if (symbol === ' ' || symbol === '\n') {
            code.skipSpaces();
            symbol = code.getSymbol();
        }
        if (symbol === ':') {
            code.skipSpaces();
            symbol = code.getSymbol();
        }
        else {
            selectError(code.current - 1, code.current - 1);
            throw "После метки ожидается \":\"";
        } if (!isLetter(symbol)) {
            selectError(code.current - 1, code.current - 1);
            throw "После метки ожидается переменная";
        }
    }
    else if (!isLetter(symbol)) {
        selectError(code.current - 1, code.current);
        throw "Ожидалась метка или переменная";
    }
}
function printVariables(variables)
{
    var outputField = document.getElementById("outputField");
    message = '';
    variables.forEach(function(item, i, arr) {
        message += item.name + ' = ' + item.value + '<br>';
    });
    outputField.innerHTML = message;
}
function rightPart()
{
    code.skipSpaces();
    var rightPart = 0;
    var symbol = code.getSymbolWithOutSkip();
    if (symbol === '-')
    {
        code.increaseCurrent();
        rightPart = negation(block1());
    }
    else
        rightPart = block1();
    do
    {
        symbol = code.getNextSymbolWithOutSkipSpaces();
        if (symbol === '+')
        {
            code.skipSpaces();
            code.increaseCurrent();
            rightPart = add(rightPart, block1());
        }
        else if (symbol === '-')
        {
            code.skipSpaces();
            code.increaseCurrent();
            rightPart = sub(rightPart, block1());
        }
    } while (symbol === '+' || symbol === '-');
    return rightPart;
}
function block1()
{
    var block1 = block2();
    do
    {
        var symbol = code.getNextSymbolWithOutSkipSpaces();
        if (symbol === '*')
        {
            code.skipSpaces();
            code.increaseCurrent();
            code.skipSpaces();
            var sign = code.getSymbolWithOutSkip();
            if (sign === '-')
            {
                code.increaseCurrent();
                block1 = mult(block1, negation(block2()));
            }
            else
                block1 = mult(block1, block2());
        }
        else if (symbol === '/')
        {
            code.skipSpaces();
            var startSelection = code.getCurrent();
            code.increaseCurrent();
            code.skipSpaces();
            var sign = code.getSymbolWithOutSkip();
            if (sign === '-')
            {
                code.increaseCurrent();
                var resultBlock2 = negation(block2());
            }
            else
                var resultBlock2 = block2();
            if (parseFloat(resultBlock2) === 0)
            {
                selectError(startSelection, code.current - 1);
                throw "Деление на ноль";
            }
            block1 = div(block1, resultBlock2);
        }
    } while (symbol === '*' || symbol === '/');
    return block1;
}
function block2()
{
    var block2 = block3();
    do
    {
        var symbol = code.getNextSymbolWithOutSkipSpaces();
        if (symbol === '^')
        {
            code.skipSpaces();
            code.increaseCurrent();
            code.skipSpaces();
            var sign = code.getSymbolWithOutSkip();
            if (sign === '-')
            {
                code.increaseCurrent();
                block2 = power(block2, negation(block3()));
            }
            else
                block2 = power(block2, block3());
        }
    } while (symbol === '^');
    return block2;
}
function block3()
{   
    var resultBlock3;
    do {
        code.skipSpaces();
        if (code.isSin()) {
            code.increaseCurrent();
            code.increaseCurrent();
            code.increaseCurrent();
            code.skipSpaces();
            var symbol = code.getSymbolWithOutSkip();
            if (symbol === '-') {
                code.increaseCurrent();
                resultBlock3 = sin(negation(block3()));
            }
            else
                resultBlock3 = sin(block3());
        }
        else if (code.isCos()) {
            code.increaseCurrent();
            code.increaseCurrent();
            code.increaseCurrent();
            code.skipSpaces();
            var symbol = code.getSymbolWithOutSkip();
            if (symbol === '-') {
                code.increaseCurrent();
                resultBlock3 = cos(negation(block3()));
            }
            else
                resultBlock3 = cos(block3());
        }
        else if (code.isAbs()) {
            code.increaseCurrent();
            code.increaseCurrent();
            code.increaseCurrent();
            code.skipSpaces();
            var symbol = code.getSymbolWithOutSkip();
            if (symbol === '-') {
                code.increaseCurrent();
                resultBlock3 = abs(negation(block3()));
                
            }
            else
                resultBlock3 = abs(block3());
        }
        else {
            resultBlock3 = block4();
        }
    } while (code.isSin() || code.isCos() || code.isAbs());
    return resultBlock3;
}
function block4()
{
    var block4 = 0;
    code.skipSpaces();
    var symbol = code.getSymbolWithOutSkip();
    if (isLetter(symbol))
        block4 = code.getVariable();
    else if (isEightNumberSystem(symbol))
    {
        var startSelection = code.current;
        var real = code.getReal();
        if  (real === false)
        {
            selectError(startSelection, code.current);
            throw "Неверная запись вещественного числа";
        }
        else
            block4 = real;
    }
    else
    {
        selectError(code.current, code.current);
        throw "Ожидалась переменная или вещественное число";
    }
    return block4;
}

function add(variable1, variable2)
{
    var var1 = modifyToReal(variable1);
    var var2 = modifyToReal(variable2);
    var1 = octToDec(var1);
    var2 = octToDec(var2);
    var answer = decToOct(var1 + var2);
    return answer;
}
function modifyToReal(number)
{
    var regexp = /\./i;
    var result = regexp.exec(number);
    if (result === null)
        return number + '.0';
    else
        return number;
}
function octToDec(number)
{
    if (number < 0)
        var negative = true;
    else
        var negative = false;
    var regexp = /(^-?[01234567]+)\.([01234567]+$)/i;
    var result = regexp.exec(number);
    if (result === null)
        return false;
    var leftPart = result[1];
    var rightPart = result[2];
    var sum = parseInt(leftPart, 8);
    for (var i = 0; i < rightPart.length; i++)
    {
        var summand = parseInt(rightPart[i]) * Math.pow(8, -(i + 1));
        if (negative)
            sum -= summand;
        else
            sum += summand;
    }
    return sum;
}
function decToOct(number)
{
    return parseFloat(number).toString(8);
}

function sub(variable1, variable2)
{
    var var1 = modifyToReal(variable1);
    var var2 = modifyToReal(variable2);
    var1 = octToDec(var1);
    var2 = octToDec(var2);
    var answer = decToOct(var1 - var2);
    return answer;
}
function mult(variable1, variable2)
{
    var var1 = modifyToReal(variable1);
    var var2 = modifyToReal(variable2);
    var1 = octToDec(var1);
    var2 = octToDec(var2);
    var answer = decToOct(var1 * var2);
    return answer;
}
function div(variable1, variable2)
{
    var var1 = modifyToReal(variable1);
    var var2 = modifyToReal(variable2);
    var1 = octToDec(var1);
    var2 = octToDec(var2);
    var answer = decToOct(var1 / var2);
    return answer;
}
function power(variable1, variable2)
{
    var var1 = modifyToReal(variable1);
    var var2 = modifyToReal(variable2);
    var1 = octToDec(var1);
    var2 = octToDec(var2);
    var answer = decToOct(Math.pow(Number(var1), Number(var2)));
    return answer;
}
function sin(variable)
{
    var var1 = modifyToReal(variable);
    var1 = octToDec(var1);
    var answer = decToOct(Math.sin(var1));
    return answer;
}
function cos(variable)
{
    var var1 = modifyToReal(variable);
    var1 = octToDec(var1);
    var answer = decToOct(Math.cos(var1));
    return answer;
}
function abs(variable)
{
    var var1 = modifyToReal(variable);
    return Math.abs(var1);
}
function isLetter(symbol)
{
    if (/^[a-z,A-Z]$/.test(symbol))
        return true;
    else
        return false;
}
function getVariablesByCode(code)
{
    var regexp = /((\s+)?(\d+)?(\s+)?:(\s+)?)?(\w[\w\d]+)(\s+)?=(.+)/ig;
    var result;
    var tokens = [];

    while (result = regexp.exec(code)) {
        var token = {};
        token.mark = {};
        token.mark.data = result[3];
        token.mark.begin = result.index;
        token.mark.end = regexp.lastIndex;
        token.result = {};
        token.result.data = result[6];
        token.result.begin = result.index;
        token.result.end = regexp.lastIndex;
        token.rightPart = {};
        token.rightPart.data = result[8];
        token.rightPart.begin = result.index;
        token.rightPart.end = regexp.lastIndex;
        tokens.push(token);
    }
    return tokens;
}
function getTokensByCode(code)
{
    if (code.trim().length == 0)
        throw "Введите строку";
    var tokens = [];
    var token = {};
    token.data = "";
    var tokenLength = 0;
    for (var i = 0; i < code.length; i++)
    {
        if (code[i] !== " " && code[i] !== "\n")
        {
            if (tokenLength == 0)
                token.begin = i;
            token.data += code[i];
            tokenLength++;
            if (i === (code.length - 1))
            {
                token.end = i;
                tokens.push(token);
            }
        }
        else
            if (token.data.length !== 0)
            {
                token.end = i - 1;
                tokens.push(token);
                var token = {};
                token.data = "";
                tokenLength = 0;
            }
    }
    return tokens;
}
function isEightNumberSystem2(number)
{
    var eightNumberSystem = [0, 1, 2, 3, 4, 5, 6, 7];
    if (eightNumberSystem.indexOf(number) === -1)
        return false;
    else
        return true;
}
function isEightNumberSystem(number)
{
    if (/^[0-7]$/.test(number))
        return true;
    else
        return false;
}
function checkIntSemicolon(token)
{
    if (/[01234567]+\s*,/.test(token.data))
        return true;
    else
        if (/^[01234567]+$/.test(token.data))
            return false;
        else
        {
            selectError(token.begin, token.end-1);
            throw "Ожидается целое число";
        }
}
function checkRealSemicolon(token)
{
    if (/^[01234567]+\.[01234567]+,$/.test(token.data))
        return true;
    else
        if (/^[01234567]+\.[01234567]+$/.test(token.data))
            return false;
        else
        {
            selectError(token.begin, token.end);
            throw "Ожидается вещественное число";
        }
}
function shiftToken(tokens, errorMessage, token)
{
    if (tokens.length > 0)
    {
        var newToken = tokens.shift();
        return newToken;
    }
    else
    {
        if (undefined !== token)
        {
            selectError(token.begin, token.end)
        }
        throw "Неожиданный конец. " + errorMessage;
    }
}
function selectError(begin, end)
{
    var codeField = document.getElementById("codeField");
    codeField.selectionStart = begin;
    codeField.selectionEnd = end + 1;
    codeField.focus();
}
function checkToken(token, expected, errorMessage)
{
    if (token.data !== expected)
    {
        selectError(token.begin, token.end);
        throw errorMessage;
    }
}
function debug_printCharacters(code)
{
    for (var i = 0; i < code.length; i++)
        console.log(i + '   ' + code[i] + ' (' + code.charCodeAt(i) + ')');
}
function debug_printTokens(tokens)
{
    for (var i = 0; i < tokens.length; i++)
        console.log(tokens[i].data + "   [" + tokens[i].begin + "-" + tokens[i].end + "]");
}