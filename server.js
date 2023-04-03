const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({ path:"./config.env"});
const app=require('./app');
const port=3000||env.process.PORT;
// console.log(process.env);
const db=process.env.DATABASE;
mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser:true,
    // userFindAndMOdify:false,
     
     
}).then( ()=>
{
      // console.log(con.connections);
    console.log("sucessfully connected 🎉🎉");
});
 app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});