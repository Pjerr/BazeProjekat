const express = require('express');
const { copyFileSync } = require('fs');
const cassandraClient = require('../cassandraConnect');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

router.get('/preuzmiTransakcije', (req, res) =>
    {
        var query = 'SELECT * FROM buyhub.transakcija WHERE godina = ? and kvartal = ? and mesec = ?';
        
        cassandraClient.execute(query, [req.body.godina, req.body.kvartal, req.body.mesec], (err,result) =>
        {
            if(err)
            {
                console.log('Unable to get data' + err);
            }
            else 
            {
                res.status(200).send(result.rows)
            }
        })

    }
)

router.get('/preuzmiTransakcijeIzProdavnice', (req, res) =>
    {
        var query = 'SELECT * FROM buyhub.transakcija WHERE godina = ? and kvartal = ? and mesec = ?';
        
        cassandraClient.execute(query, [req.body.godina, req.body.kvartal, req.body.mesec], (err,result) =>
        {
            if(err)
            {
                console.log('Unable to get data' + err);
            }
            else 
            {
                res.status(200).send(result.rows)
            }
        })

    }
)

router.post('/dodajTransakciju', (req,res) => 
    {
        
    }
)

//Ima li smisla da uopste brisemo transakciju/e? Kada bismo to radili?
//Svakako, ako bismo brisali transakcije, morali bismo celu particiju ili deo nje.
//Jedini scenario koji vidim je da brisemo ako se prodavnica zatvori?
router.delete('/obrisiTransakciju', (req,res) =>
    {
        var allArgs =  [req.body.godina, req.body.kvartal, req.body.mesec, req.body.online, req.body.imeProdavnice];

        //online bi trebalo da bude = 0. Mozda da se hardkodira u upitu?
        var query = 'DELETE FROM buyhub.transakcija WHERE godina = ? and kvartal = ? and mesec = ? and online = ? and "imeProdavnice" = ?;';
       
        cassandraClient.execute(query, allArgs, (err,result) =>
        {
            if(err)
            {
                console.log(req.body);
                console.log('Unable to delete data' + err);
            }
            else 
            {
                console.log(req.body);
                res.status(200).send(result);
            }
        })
    }
)

module.exports = router;