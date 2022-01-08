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
        var options = {year: "numeric", month: "short", day: "numeric", 
                        hour: "2-digit", minute: "2-digit", hour12: false,
                        timeZoneName: "short", timeZone: "CET"};
        var datum = new Intl.DateTimeFormat(["rs-RS"], options).format;
        console.log(datum().toString().split(' ')[0].toUpperCase());
        
        var meseci = ["JAN", "FEB", "MAR", "APR", "MAJ", "JUN", "JUL", "AVG", "SEP", "OKT", "NOV", "DEC"];

        var today = new Date();
        var godina = today.getFullYear();
        var mesec = meseci[today.getMonth()];
        //var mesec = datum().toString().split(' ')[0].toUpperCase();
        var kvartal = ~~((mesec + 1) / 4) + 1;
        var minutes = today.getMinutes();
        var vreme = today.getDate() + " - " + today.getHours() + ":" + today.getMinutes();
        
        //console.log(mesec)
        //console.log(godina);
        //console.log(mesec);
        //console.log(kvartal);

        //Online je boolean:
        var online = req.body.online;
        var imeProdavnice = req.body.imeProdavnice;
        
        if(online == true)
            imeProdavnice = "ONLINE";

        var allArgs = [godina, kvartal, mesec, online, imeProdavnice, req.body.kupljeniProizvodi, req.body.ukupnaCena, req.body.usernameKorisnika, vreme];
        var query = 'INSERT INTO buyhub.transakcija (godina, kvartal, mesec, online, "imeProdavnice", "kupljeniProizvodi", "ukupnaCena", "usernameKorisnika", "vremeKupovine") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

        cassandraClient.execute(query, allArgs, {prepare: true}, (err, result) => 
        {
            if(err)
            {
                console.log(req.body);
                console.log('Unable to put data' + err);
            }
            else 
            {
                console.log(req.body);
                res.status(200).send(result);
            }
        });
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
       
        cassandraClient.execute(query, allArgs, {prepare: true}, (err,result) =>
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