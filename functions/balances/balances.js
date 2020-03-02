module.exports = {cuttokens, returnbalance}
let tokens = require("../../tokens.js")
let config = require("../../config.js")
let request = require("graphql-request").request
let startiterating = require("../../main.js").sorter

let balances = {}
let tokenstolookfor = []
let tokenpersicions = {}

function cuttokens(){
 tokenstolookfor.push("STEEMP")
 for(var i=0;i<tokens.length;i++){
  tokenstolookfor.push(tokens[i].symbol)
 }
 getbalances()
}

function getbalances(){
 let query = `{balances(account:"${config.account}", limit:999){symbol, balance}}`
 request('https://graphql.steem.services/', query).then(data =>{
  for(var i=0;i<data.balances.length;i++){
   for(var j=0;j<tokenstolookfor.length;j++){
   	if(data.balances[i].symbol === tokenstolookfor[j]){
   	 balances[tokenstolookfor[j]]=data.balances[i].balance
   	}
   }
  }
  getpercision();
 }).catch(err => {
  getbalances();
  return;
 })
}

function getpercision(){
 tokenstolookfor = [];
 for(var prop in balances){
  if(Object.prototype.hasOwnProperty.call(balances, prop)){
   prop = JSON.stringify(prop)
   tokenstolookfor.push(prop)
  }
 }
 let query = `{tokens(symbols:[${tokenstolookfor}]){symbol, precision}}`
 request('https://graphql.steem.services/', query).then(data =>{
  for(var i=0;i<data.tokens.length;i++){
   tokenpersicions[data.tokens[i].symbol] = data.tokens[i].precision
  }
  startiterating();
 }).catch(err => {
  getpercision();
  return;
 })
}

function returnbalance(mode){
  if(mode === "bal") return balances;
  if(mode === "per") return tokenpersicions;
}