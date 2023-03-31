const dotenv=require('dotenv');
dotenv.config({ path:"./config.env"});
const app=require('./app');
const port=3000;
console.log(process.env);

console.log(process.env.NODE_ENV);
app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});