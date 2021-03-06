module.exports = {renewlong, renewshort}

let request = require("graphql-request").request

let tokens = require("../../tokens.js")
let config = require("../../config.js")
let broadcast = require("../broadcast/broadcast.js").addqueue
let addstep = require("../../main.js").renewstep

function renewlong(token, offset, book){
 let query = `{sellBook(symbol:"${token}", limit:1000, offset:${offset}){txId, quantity, price, expiration, account}}`
   request('https://graphql.steem.services/', query).then(data =>{
   if(data.sellBook.length > 0){
   	offset = offset + 1000
   	for(var i=0;i<data.sellBook.length;i++){
   	 book.push(data.sellBook[i])
   	}
   	renewlong(token, offset, book)
   	return;
   }
   else{
    book = book.sort(function(a,b){return a.price - b.price});
    sortlong(token, book);
    return;
   }
  }).catch(err => {
  renewlong(token, offset, book);
  return;
 })
}

async function sortlong(token, book){
 console.log("renewing: " + token)
 txarray = [];
 for(var i=0;i<book.length;i++){
  let cancelobj = {
      "contractName" : "market",
      "contractAction" : "cancel",
      "contractPayload": {
          "type":"sell",
          "id":book[i].txId
          }
      }
  let buyobj = {
      "contractName" : "market",
      "contractAction" : "sell",
      "contractPayload" : {
         "symbol": token,
         "quantity": book[i].quantity,
         "price": book[i].price
         }
      }
  if(book[i].account === config.account){
    txarray.push(cancelobj);
    txarray.push(buyobj);
  }
 }
 addstep();
 broadcast(txarray);
 return;
}

function renewshort(token, offset, book){
 let query = `{buyBook(symbol:"${token}", limit:1000, offset:${offset}){txId, quantity, price, expiration, account}}`
  request('https://graphql.steem.services/', query).then(data =>{
   if(data.buyBook.length > 0){
   	offset = offset + 1000
   	for(var i=0;i<data.buyBook.length;i++){
   	 book.push(data.buyBook[i])
   	}
   	renewshort(token, offset, book)
   	return;
   }
   else{
    book = book.sort(function(a,b){return b.price - a.price});
    sortshort(token, book);
    return;
   }
  }).catch(err => {
  renewshort(token, offset, book);
  return;
 })
}

async function sortshort(token, book){
 console.log("renewing: " + token)
 txarray = [];
 for(var i=0;i<book.length;i++){
  let cancelobj = {
      "contractName" : "market",
      "contractAction" : "cancel",
      "contractPayload": {
          "type":"buy",
          "id":book[i].txId
          }
      }
  let buyobj = {
      "contractName" : "market",
      "contractAction" : "buy",
      "contractPayload" : {
         "symbol": token,
         "quantity": book[i].quantity,
         "price": book[i].price
         }
      }
  if(book[i].account === config.account){
    txarray.push(cancelobj);
    txarray.push(buyobj);
  }
 }
 addstep();
 broadcast(txarray);
 return;
}