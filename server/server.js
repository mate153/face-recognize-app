//Express//
const express = require('express');
const app = express();
app.use(express.json());


//Cors//
const cors = require('cors');
app.use(cors({origin:'http://localhost:5173'}));




app.listen(3153);