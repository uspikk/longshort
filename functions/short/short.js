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
 let query = `{buyBook(symbol:"${token.symbol}", limit:1000, offset:${offset}){txId, quantity, price, expiration, account}}`
  request('https://graphql.steem.services/', query).then(data =>{
   if(data.buyBook.length > 0){
   	offset = offset + 1000
   	for(var i=0;i<data.buyBook.length;i++){
   	 book.push(data.buyBook[i])
   	}
   	getbook(token, offset, book)
   	return;
   }
   else{
    book = book.sort(function(a,b){return b.price - a.price});
    bundler(book, token.symbol, "buy", per);
    firstordercheck(token, book);
    return;
   }
  }).catch(err => {
  getbook(token, offset, book);
  return;
 })
}

function firstordercheck(token, book){
 console.log("Token: " + token.symbol + " Mode: " + token.mode)
 console.log("Selling to: " + book[0].account)
 if(config.account === book[0].account){
  console.log("Won't sell to self, skipping...")
  nextqueue();
  return;
 }
 sellmarket(token, book)
}


function sellmarket(token, book){
 let txarray = [];
 let balances = bal("bal")
 let per = bal("per")
 let orderquantity = (balances[token.symbol] * token.precent / 100).toFixed(per[token.symbol])*1
 let firstorderprice = book[0].price*1
 firstorderprice = firstorderprice.toFixed(8)*1
 firstorderprice = JSON.stringify(firstorderprice)
 if(orderquantity === 0){
  console.log("ERROR order quantity 0, will not transact...")
  nextqueue();
  return;
 }
 if(orderquantity > book[0].quantity*1) orderquantity = book[0].quantity*1;
 orderquantity = JSON.stringify(orderquantity)
 let sellload = {
  	"contractName" : "market",
  	"contractAction" : "sell",
  	"contractPayload" : {
       "symbol": token.symbol,
       "quantity": orderquantity,
       "price": firstorderprice
       }
    }
 txarray.push(sellload);
 let steemquantity = (book[0].price * orderquantity).toFixed(8)*1
 let percentnewprice = (book[0].price * token.longshort / 100).toFixed(8)*1
 let newprice = (book[0].price - percentnewprice).toFixed(8)*1
 let newquantity = (steemquantity / newprice).toFixed(per[token.symbol])*1
 newprice = JSON.stringify(newprice);
 newquantity = JSON.stringify(newquantity)
 let buyload = {
  	"contractName" : "market",
  	"contractAction" : "buy",
  	"contractPayload" : {
       "symbol": token.symbol,
       "quantity": newquantity,
       "price": newprice
       }
    }
 if(sellload.contractPayload.quantity === buyload.contractPayload.quantity){
  console.log("No profit is being made, will not transact...")
  nextqueue();
  return;
 }
 txarray.push(buyload)
 breadcast(txarray);
 nextqueue();
 return;
}

