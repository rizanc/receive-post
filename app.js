const express = require('express')
const fs = require('fs');
const path = require('path');


const app = express()

const inputPath = "input";

const binaryData = function(req, res, next) {
    
    var buffer = [];
    
    req.on('data', function(data) { 
        buffer.push(data)
    });
    
    req.on('end', function() {
        req.body = Buffer.concat(buffer);
        next();
    });
}

app.post('/opera', binaryData, function(req, res) {

    if (Buffer.isBuffer(req.body)){
        console.log('Binary Buffer '+req.body.length);
        console.log(req.body.toString('utf-8'));

        let filename = req.query.filename;

        console.log(`Received file ${filename}`);

        fs.open(path.join(inputPath,filename), 'w',(err,fd) =>{
            
            if (err) {
                throw err;
            }

            fs.write(fd, req.body, 0, req.body.length,null, (err,written)=>{
                if (err){
                    throw err;
                } else{
                    console.log(`Wrote ${written} bytes to ${filename}`);
                }

                fs.close(fd, () => {
                    console.log('file written');
                })  
            });
        })

    } else{
        console.log('Not  a buffer');
        res.status(402).send({ error: 'Unexpected Request' })
    }

    res.send("OK");
})

app.listen(8888, function () {
  console.log('Listening on port 8888')
})
