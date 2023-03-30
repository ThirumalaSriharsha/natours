const fs=require("fs");
const express=require('express');
const app=express();
const port=3000;
app.use(express.json())
/*app.get('/',(req,res)=>
{
    res.status(404).json({message :'hello from the server side',apploication :"natours"});
});
 app.post('/',(req,res)=>
 {
    res.send("you can post this message to the endpoint.......................");
 })*/

const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//handling get request
 app.get("/api/v1/tours",(req,res)=>
 { 
    res.status(200).json(
        {
           stats:"sucessfull",
           result:tours.length,
           data:
           {
            tours
           }
    });
 
 });
 //reading from the url
 app.get("/api/v1/tours/:id",(req,res)=>
 {  console.log(req.params);
    const id=req.params.id*1;
    if(id>tours.length)
    {
        return res.status(404).json (
            {
                stats:"failed",
                message:"not valid"
            }
        );
         
    }

    const tour=tours.find(el=>el.id===id);
    res.status(200).json(
        {
            Status:"sucessfull",
           result:tours.length,
           data:
           {
            tour
           }
    });
 
 });
 //patch request
 app.patch("/api/v1/tours/:id",(req,res)=>
 {
    if(req.params.id>tours.length)
    {
        return res.status(404).json (
            {
                Status:"failed",
                message:"out of range"
            }
        );
         
    }
    res.status(200).json(
        {
            Status:"<updated sucessfully"

        }
    );
 });
 //delete req
 app.delete("/api/v1/tours/:id",(req,res)=>
 {
    if(req.params.id>tours.length)
    {
        return res.status(404).json (
            {
                Status:"failed",
                message:"out of range"
            }
        );
         
    }
    res.status(204).json(
        {
            Status:"<deleted sucessfully>"

        }
    );
 });
 //handling the post requests
 app.post("/api/v1/tours",(req,res)=>
 {
    //console.log(req.body);
   const newid=tours[tours.length-1].id+1;
   const newtour=Object.assign({id:newid},req.body);
   tours.push(newtour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err => 
   {
     res.status(201).json(
        {
            Status:"sucessful",
            data:{
               tour: newtour
            }
        }
     )
   });
    
 }); 
app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});
