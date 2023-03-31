const fs=require("fs");
const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
exports.checkId=(req,res,next,val)=>
{ console.log(`the value of the id is ${val}`);
    if(req.params.id*1>tours.length)
    {
        return res.status(404).json (
            {
                Status:"failed",
                message:"out of range"
            }
        );
         
    }
    next();
};
// exports.checkBody=(req,res,next)=>
// {
//     console.log(" in the middle ware where we check for the data");
//     if(!req.body.name|| !req.body.price )
//     {
//         return res.status(400).json(
//             {
//                  status:"error",
//                 message:"no name or price"
//             }
//         );
//     };
// next();
// };
//route handlers for the tours
exports. getAlltours=
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
 exports.singletour=(req,res)=>
 {  console.log(req.params);
    const id=req.params.id*1;
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
exports.upadteTour=(req,res)=>
{
   
   res.status(200).json(
       {
           Status:"<updated sucessfully"

       }
   );
};
exports.deleteTour=(req,res)=>
{
   
   res.status(204).json(
       {
           Status:"<deleted sucessfully>"

       }
   );
};
exports.creteTour=(req,res)=>
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
