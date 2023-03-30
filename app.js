const fs=require("fs");
const express=require('express');
const morgan = require("morgan");
const app=express();
const port=3000;
//middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use((req,res,next)=>
{
    console.log("hello from the middleware👋👋👋");
next();
});
app.use((req,res,next)=>
{
    req.requesttime=new Date().toISOString();
    next();
}
)
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//route handlers
const getAlltours=
(req,res)=>
 { 
    console.log(req.requesttime);
    res.status(200).json(
        {
           stats:"sucessfull",
           result:tours.length,
           requested_at:req.requesttime,
           data:
           {
            tours
           }
    });
 
 };
 const singletour=(req,res)=>
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
};
const upadteTour=(req,res)=>
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
};
const deleteTour=(req,res)=>
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
};
const creteTour=(req,res)=>
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
  })
};

       /*app.get("/api/v1/tours",getAlltours);
        app.get("/api/v1/tours/:id",singletour);
        app.patch("/api/v1/tours/:id",upadteTour);
        app.delete("/api/v1/tours/:id",deleteTour);
     app.post("/api/v1/tours",creteTour); */
//routes
 app.route("/api/v1/tours").
 get(getAlltours)
 .post(creteTour);
 app.route("/api/v1/tours/:id").
 patch(upadteTour).
 get(singletour).delete(deleteTour);
 //server
app.listen(port,()=>
{
    console.log(`listening to the port ${port}...............`);
});
