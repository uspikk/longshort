module.exports = {broadcast, addqueue}

let steem = require("steem")

let config = require("../../config.js")
let queue = []

function broadcast(){
 if(queue.length === 0){
  console.log("...")
  return;
 };
 let wholetx = [
  "custom_json",
  {
    "required_auths": [config.account],
    "required_posting_auths": [],
    "id": "ssc-mainnet1",
    "json": JSON.stringify(queue.splice(0, config.ops))
  }
 ]
 steem.broadcast.send({
   extensions: [],
   operations: [wholetx]}, [config.wif], (err, result) => {
    if(err){console.log(err);addqueue(JSON.parse(wholetx[1].json))}
    if(result){console.log(result.operations[0][1])}
  });
}

function addqueue(jsons){
 for(var i=0;i<jsons.length;i++){
  queue.push(jsons[i])
 }
}

