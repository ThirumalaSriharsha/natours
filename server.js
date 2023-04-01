const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({ path:"./config.env"});
const app=require('./app');
const port=3000;
// console.log(process.env);
const db=process.env.DATABASE;
mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser:true,
    userFindAndMOdify:false,
     useUnifiedTopology: true
     
}).then( ()=>
{
      // console.log(con.connections);
    console.log("sucessfully connected 🎉🎉");
});


        

console.log(process.env.NODE_ENV);

app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});