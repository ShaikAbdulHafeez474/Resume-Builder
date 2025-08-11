
const express = require("express")

const app = express();

app.get('/health',(req,res)=>{

    res.json({status:'OK',service:'resume-service'});
})

app.listen(5004,()=>{

    console.log("resume-service is running at port 5004");
})