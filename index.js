var basicLog = console.log;
var prettyjson = require('prettyjson');
var validator = require('validator');
var logo = `
████████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████
███ ▄▄█████ ███ █████▄▄▄▄█████ ▄▄▀█████ █▀▄██████ ██████▄▄▄▄████▀▄▄▄▀████ ███ ██
████▄▄ ████ ▄▄▄ █████▄▄▄▄██████▄ ███████ ██████▄▄ ▄▄████▄▄▄▄████ ████████ ▄▄▄ ██
████▄▄█████▄███▄█████▄▄▄▄████████▄███████████████▄██████▄▄▄▄█████▄▄▄█████▄███▄██
████████████████████████████████████████████████████████████████████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`;
var styles = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
}
var activeLevel = 3;
var prettyjsonNoColor = false;
/**
 * this will customize logging
 * @param {Object} config 
 * @param {number} config.activeLevel 
 * @param {boolean} config.noColor customized config.  -  activeLeve:a number between 0 and 3 that tells which log types should be active. -  0 : deactive all for production -  1 : active Error -  2 : active Error-Info -  3 : active all - noColor: this will reset all colors to default environment color.
 *  
 * 
 */
function config(config) {
    if (!config) return this;
    if (config.activeLevel || config.activeLevel == 0) activeLevel = config.activeLevel;
    if (config.noColor) {
        var color = styles.Reset;
        var bgcolor = styles.Reset;
        styles.FgBlack = color;
        styles.FgBlue = color;
        styles.FgCyan = color;
        styles.FgGreen = color;
        styles.FgMagenta = color;
        styles.FgRed = color;
        styles.FgWhite = color;
        styles.FgYellow = color;

        styles.B = color;
        styles.BgBlue = color;
        styles.BgCyan = color;
        styles.BgGreen = color;
        styles.BgMagenta = color;
        styles.BgRed = color;
        styles.BgWhite = color;
        styles.BgYellow = color;

        prettyjsonNoColor = true;
    }
    return this;
}

function intro(projectInfo) {
    basicLog(logo);
    if (projectInfo) basicLog("~~~ PROJECT INFORMATION ~~~\n", prettyjson.render(projectInfo, {
        noColor: true
    }), "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    basicLog("\n");
    return this;

}



/**
 * 
 * @param {*[]} args arguments to print
 * @param {this} that console object
 */
var print = function (args, that) {

    if (!that.mode) that.mode = "";
    var text = that.mode;


    // text+=styles.FgBlack;
    // basicLog(that.pre)

    // that.pre.forEach(function(item){
    //     text+=item+" > "
    // });
    text += styles.Reset;

    for (var i = 0; i < args.length; i++) {
        try {
            var isjson = validator.isJSON(JSON.stringify(args[i]));

            var inlineArrays = true;
            if (isjson) {
                text += "\n{\n";
                basicLog(args[i])
                if (args[i].length < 10) inlineArrays = true;
            }

            text += prettyjson.render(args[i], {
                noColor: prettyjsonNoColor,
                keysColor: 'blue',
                dashColor: 'blue',
                numberColor: 'magenta',
                stringColor: 'white',
                inlineArrays
            }) + " ";
            if (isjson) text += "\n}\n"
        } catch (e) {
            text+=args[i]+" ";
        }
    }
    basicLog(text, styles.Reset);
    return this;
}
/**
 * this will print a log.
 */
function log() {
    if (activeLevel < 3) return this;
    this.mode = styles.FgCyan + "LOG >> "
    print(arguments, this);
    return this
}
/**
 * this will print a success message.
 */
function ok() {
    if (activeLevel < 3) return this;
    this.mode = styles.FgGreen + "SUCCESS >> "
    print(arguments, this);
    return this;
}
/**
 * this will print an error message.
 */
function error() {
    if (activeLevel < 1) return this;

    this.mode = styles.FgRed + "ERROR >> ";
    print(arguments, this);
    return this;
}
/**
 * this will print a warning message.
 */
function warning() {
    if (activeLevel < 2) return this;

    this.mode = styles.FgYellow + "WARNING >> ";
    print(arguments, this);
    return this;
}
/**
 * this will print an info message.
 */
function info() {
    if (activeLevel < 2) return this;

    this.mode = styles.FgBlue + "INFO >> ";
    print(arguments, this);
    return this;
}
//TODO:add scope later
// console.scope=function(){
//     if(!this.pre)this.pre=[];
//     for(var i=0;i<arguments.length;i++){
//         this.pre.push(arguments[i]);
//     }
//     this.test="hello test"
//     return this;
// }
function clear() {
    process.stdout.write('\033c');
    process.stdout.write("\x1B[2J");

}

console.config = config;
console.intro = intro;
console.log = log;
console.info = info;
console.error = error;
console.warning = warning;
console.clear = clear;
console.ok = ok;
console.plain = basicLog;
