const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aiRoutes = require("./routes/ai.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", aiRoutes);

app.get('/health',(req,res)=>{

     res.json({status:"ok",service:"ai"});
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
