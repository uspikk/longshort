module.exports = {sorter, addstep, renewstep}
let broadcast = require("./functions/broadcast/broadcast.js").broadcast
let config = require("./config.js")
let getbalances = require("./functions/balances/balances.js").cuttokens
let tokens = require("./tokens.js")
let short = require("./functions/short/short.js").getbook
let long = require("./functions/long/long.js").getbook
let renewl = require("./functions/renew/renew.js").renewlong
let renews = require("./functions/renew/renew.js").renewshort

let step = 0;
let restart = tokens.length - 1;
let roundsleep = false;
let renewinterval = 0;


function sorter(){
 if(tokens[step].mode === "long"){long(tokens[step], 0, []);return;}
 if(tokens[step].mode === "short"){short(tokens[step], 0, []);return;}
}

function addstep(){
 if(roundsleep === true){roundsleep = false;sleep();return;}
 step++
 sorter();
 if(step === restart){step = 0;roundsleep = true;}
 return;
}

function sleep(){
 if(renewinterval === config.renewinterval){
 renewinterval = 0;
 console.log("renewing all orders...");
 renewsorter()
 return;
 }
 renewinterval++;
 console.log("sleeping for " + config.interval + " minutes")
 setTimeout(getbalances, config.interval * 1000 * 60)
 return;
}

function renewsorter(){
 if(tokens[step].mode === "long"){renewl(tokens[step].symbol, 0, []);return;}
 if(tokens[step].mode === "short"){renews(tokens[step].symbol, 0, []);return;}
}

function renewstep(){
 if(roundsleep === true){roundsleep = false;sleep();return;}
 step++;
 renewsorter();
 if(step === restart){step = 0;roundsleep = true;}
 return;
}

setInterval(broadcast, 5000)
getbalances()
