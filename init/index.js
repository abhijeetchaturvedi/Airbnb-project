const mongoose=require("mongoose");
const RentifyDB_URL="mongodb://127.0.0.1:27017/RentifyDB"
const listing=require("../Models/listing.js")
const initdata=require("./data.js")
main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=> {
    console.log(err)}); 

async function main() {
  await mongoose.connect(RentifyDB_URL);
  initdb();

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//cleaning of old data in js

const initdb= async ()=>{

  await  listing.deleteMany({})
  initdata.data=initdata.data.map((obj)=>({...obj,owner:"67e9c1ab89775c1974a284b6"}))
  await listing.insertMany(initdata.data)
  console.log("Data was initialized")
} 
