const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({ path:"./../../config.env"});
const fs=require('fs');
const Tour=require('../../models/tourModel');
const User=require('../../models/usermodel');
const Review=require('../../models/reviewModel')
const tours=JSON.parse((fs.readFileSync(`${__dirname}/tours.json`,'utf-8')));
const users=JSON.parse((fs.readFileSync(`${__dirname}/users.json`,'utf-8')));
const reviews=JSON.parse((fs.readFileSync(`${__dirname}/reviews.json`,'utf-8')));
const port=3000;
// console.log(process.env);
const db='mongodb+srv://tsriharsha02:harsha@11@cluster0.zlmsxie.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser:true,
      
     
}).then( ()=>
{
      // console.log(con.connections);
    console.log("sucessfully connected 🎉🎉");
});
// importing the data
const importData=async ()=>
{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log("data uploaded sucessfull");
        process.exit();

    }catch(err)
    {
        console.log(err);
    }

};
const deleteData=async ()=>
{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("data deleted  sucessfull");
        process.exit();

    }catch(err)
    {
        console.log(err);
    }

};
if(process.argv[2]==="--import")
{
    importData();
}
else if(process.argv[2]==="--delete")
{
    deleteData();
} 
console.log("from the data dev file");



        
