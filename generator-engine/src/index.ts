// 1. function which pokes after a continous interval
// 2. in that function api hit our ("http://localhost:3000/transaction") endpoint
// this end point requires transactoinId, country, userId, amount, curr, ip

import axios from "axios"

function getCountry(){
    let countries = ["India","USA","Russia","Europe","China"]
    return countries[Math.floor(Math.random()*countries.length)]
}

function getCurrency(){
    let currencies = ["INR", "USD", "YEN", "EUR"]
    return currencies[Math.floor(Math.random()*currencies.length)]
}

function getAmount(){
    let amounts = [100,200,300,400,500]
    return amounts[Math.floor(Math.random()*amounts.length)]
}

function generateId(){
    return Math.random().toString(36)
}

function getUser(){
    let users = ["user_1", "user_2", "user_3", "user_4", "user_5"]
    return users[Math.floor(Math.random()*users.length)]
}

async function initialiseTransaction(){
    const transaction = ({
         transactionId: "txn_" + generateId(),
         userId: getUser(), 
         amount: getAmount(),
         currency: getCurrency(),
         country: getCountry(),
         ip: "146:12:333:1", 
         timestamp: Date.now() 
    })
    console.log(transaction)
    try{
    await axios.post("http://localhost:3000/transactions", transaction)
    console.log("Sent:", transaction)
  } catch (err) {
    console.log(err)
    console.error("Error sending transaction")
  }
}

setInterval(()=>{
    console.log("function hitted")
    initialiseTransaction()
},2000)