//Express//
const express = require('express');
const app = express();
app.use(express.json());

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

let tmpDescriptor;

app.post('/api/register', function(req, res){
    const email = req.body.validEmail;
    const descriptor = req.body.descriptor;

    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err.message);
            res.json({status: 500, message:"Server error"})            
        }
        if (row) {
            res.json({status: 400, message:"The email address is already registered"})
        } else {
            db.run('INSERT INTO Users (email, face_descriptors) VALUES (?, ?)', [email, JSON.stringify(descriptor)], (err) => {
                if (err) {
                    console.error(err.message);
                    res.json({status: 500, message:"Server error"})
                }
                res.json({status: 200, message:"everything ok"})
            });
        }
    });
});

app.get('/api/getDescriptor', function(req, res){
    res.json(tmpDescriptor);
})

app.listen(3153);