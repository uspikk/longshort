module.exports = {bundler}

let config = require("../../config.js")
let broadcast = require("../broadcast/broadcast.js").addqueue

async function bundler(book, tokensymbol, action, per){
 let txarray = []
 let priceobj = {}
 for(var i=0;i<book.length;i++){
  if(book[i].account === config.account){
   if(priceobj.hasOwnProperty(book[i].price)){
    priceobj[book[i].price].push(book[i])
   }
   else{
   	priceobj[book[i].price] = [book[i]]
   }
  }
 }
 for(prop in priceobj){
  if(Object.prototype.hasOwnProperty.call(priceobj, prop)){
   let neworder = {
  	"contractName" : "market",
  	"contractAction" : action,
  	"contractPayload" : {
       "symbol": tokensymbol,
       "quantity": 0,
       "price": 0
       }
    }
   if(priceobj[prop].length > 1){
    for(var i=0;i<priceobj[prop].length;i++){
     let cancelobj = {
  		"contractName" : "market",
  	    "contractAction" : "cancel",
  	    "contractPayload": {
  	    "type":action,
  	    "id":priceobj[prop][i].txId
  	    }
    	}
     neworder.contractPayload.price = priceobj[prop][i].price
     neworder.contractPayload.quantity = neworder.contractPayload.quantity + JSON.parse(priceobj[prop][i].quantity)
     neworder.contractPayload.quantity = (neworder.contractPayload.quantity).toFixed(per)*1
     txarray.push(cancelobj);
    }
    neworder.contractPayload.quantity = JSON.stringify(neworder.contractPayload.quantity)
    txarray.push(neworder);
   }
  }
 }
 broadcast(txarray);
 return;
}