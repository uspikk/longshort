module.exports = {getbook}

let request = require("graphql-request").request

let bal = require("../balances/balances.js").returnbalance
let breadcast = require("../broadcast/broadcast.js").addqueue
let nextqueue = require("../../main.js").addstep
let config = require("../../config.js")
let bundler = require("../bundler/bundler.js").bundler


function getbook(token, offset, book){
 let per = bal("per")
 per = per[token.symbol]
 let query = `{sellBook(symbol:"${token.symbol}", limit:1000, offset:${offset}){txId, quantity, price, expiration, account}}`
  request('https://graphql.steem.services/', query).then(data =>{
   if(data.sellBook.length > 0){
   	offset = offset + 1000
   	for(var i=0;i<data.sellBook.length;i++){
   	 book.push(data.sellBook[i])
   	}
   	getbook(token, offset, book)
   	return;
   }
   else{
    book = book.sort(function(a,b){return a.price - b.price});
    firstordercheck(token, book);
    bundler(book, token.symbol, "sell", per);
    return;
   }
  }).catch(err => {
  getbook(token, offset, book);
  return;
 })
}

function firstordercheck(token, book){
 console.log("Token: " + token.symbol + " Mode: " + token.mode)
 console.log("Buying from: " + book[0].account)
 if(config.account === book[0].account){
  console.log("Won't buy from self, skipping...")
  nextqueue();
  return;
 }
 buymarket(token, book)
 return;
}


function buymarket(token, book){
 let txarray = [];
 let balances = bal("bal")
 let per = bal("per")
 let buyquantity = ((balances.STEEMP * token.precent / 100)/book[0].price).toFixed(per[token.symbol])*1
 if(buyquantity === 0){
 	console.log("Buyquantity is 0, will not transact....")
 	nextqueue();
 	return;
 }
 if(buyquantity > book[0].quantity*1) buyquantity = (book[0].quantity*1).toFixed(per[token.symbol])*1;
 buyquantity = JSON.stringify(buyquantity)
 let buyload = {
  	"contractName" : "market",
  	"contractAction" : "buy",
  	"contractPayload" : {
       "symbol": token.symbol,
       "quantity": buyquantity,
       "price": book[0].price
       }
    }
 txarray.push(buyload)
 let newprice = JSON.parse(book[0].price) + (book[0].price * token.longshort / 100)
 newprice = newprice.toFixed(8)*1
 newprice = JSON.stringify(newprice)
 let sellload = {
  	"contractName" : "market",
  	"contractAction" : "sell",
  	"contractPayload" : {
       "symbol": token.symbol,
       "quantity": buyquantity,
       "price": newprice
       }
    }
 txarray.push(sellload)
 breadcast(txarray);
 nextqueue();
}