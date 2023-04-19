const mongoose=require('mongoose');
const dotenv=require('dotenv');
process.on('unCaughtException',err=>
{
    console.log(err.name,err.message);
    console.log("uncaugth exception,shutting down")
     process.exit(1);
  
 
}
);

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
const server= app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});
process.on('unhandledRejection',err=>
{
    console.log(err.name,err.message);
    console.log("unhandled rejection,shutting down");
    server.close(()=>
    {
        process.exit(1);
    });
 
}
);
