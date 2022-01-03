const express = require('express');
const cassandraClient = require('../cassandraConnect');
const router = express.Router();

router.get('/:naziv', (req,res)=>{
  var firstQuery = 'SELECT * FROM buyhub.proizvod_naziv WHERE kategorija = ? and tip = ? and naziv = ? ';
    cassandraClient.execute(firstQuery, ['Racunarske komponente', 'SSD', req.params.naziv], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            res.status(200).send(result.rows)
        }
    })
})

module.exports = router;