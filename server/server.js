//Express//
const express = require('express');
const app = express();
app.use(express.json());

//Face-api//
const faceapi = require('face-api.js');

//Cors//
const cors = require('cors');
app.use(cors({origin:'http://localhost:5173'}));

//Database//
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/face-recognize-db.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

app.post('/api/register', function(req, res){
    const email = req.body.validEmail;
    const descriptor = req.body.descriptor;

    db.run('INSERT INTO Users (email, face_descriptors) VALUES (?, ?)', [email, JSON.stringify(descriptor)], (err) => {
        if (err) {
            console.error(err.message);
            res.json({status: 500, message:"Server error"});
        };
        res.json({status: 200, message:"Registration succesfull"});
    });
});

//Email validation//
app.post('/api/validateRegisterData', function(req, res){
    const email = req.body.email;
    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err.message);
            res.json({status: 500, message:"Server error"});            
        }
        if (row) {
            res.json({status: 400, message:"The email address is already registered"});
        } else {
            res.json({status: 200, message:"The email accepted"});  
        };
    });
});

app.post('/api/validateLoginData', function(req, res){
    const email = req.body.email;
    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err.message);
            res.json({status: 500, message:"Server error"});            
        };
        if (!row) {
            res.json({status: 400, message:"The email address is not registered! Please sign up!"});
        } else {
            res.json({status: 200, message:"The email registered"});
        };
    });
});

app.post('/api/authenticate', (req, res) => {
    const singleResult = req.body.singleResult;
    const arrDescriptor = Float32Array.from(Object.values(singleResult.descriptor));
    singleResult.descriptor = arrDescriptor;
    const email = req.body.validEmail;  
    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err.message);
            res.json({status: 500, message:"Server error"});           
        };
        if (row) {
            const faceDescriptorToJson = JSON.parse(row.face_descriptors);
            const faceDescriptorToArr = Float32Array.from(Object.values(faceDescriptorToJson[0]));
            const faceMatcher = new faceapi.FaceMatcher(singleResult);
            const bestMatch = faceMatcher.findBestMatch(faceDescriptorToArr);
            if (bestMatch._label == 'person 1') {
                res.json({status: 200, message:"Authentication Successful"});
            }else {
                res.json({status: 400, message:"No Matching!"});
            };            
        } else {
            res.json({status: 400, message:"No such user"});  
        };
    });
});

app.listen(3153);