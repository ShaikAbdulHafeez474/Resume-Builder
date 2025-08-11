
const express = require("express")

const app = express()

app.get('/health',(req,res)=>{

     res.json({status:'ok',service:'template-service'});
})

app.listen(5005,()=>{

    console.log("template-service is running at port 5005");
})