const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const db=require('./config/db');
const routes=require('./src/v1/routes');
const dotenv = require('dotenv');
const { requestLogger } = require('./src/utils/logger'); 
const { errorHandler } = require('./src/middleware/errorhandler/errorhandler');

dotenv.config();
const app=express();

//middle wares
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(errorHandler);

app.use('/v1',routes);

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({error:'Internal server error'});

});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


