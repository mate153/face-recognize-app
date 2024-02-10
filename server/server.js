//Express//
const express = require('express');
const app = express();
app.use(express.json());


//Cors//
const cors = require('cors');
app.use(cors({origin:'http://localhost:5173'}));

let tmpDescriptor;


app.post('/api/sendDescriptor', function(req, res){
    const descriptor = req.body.descriptor;
    console.log(descriptor);
    tmpDescriptor = descriptor;
    res.json(descriptor);
});

app.get('/api/getDescriptor', function(req, res){
    res.json(tmpDescriptor);
})

app.listen(3153);