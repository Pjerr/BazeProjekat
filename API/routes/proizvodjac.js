const express = require('express');
const { copyFileSync } = require('fs');
const cassandraClient = require('../cassandraConnect');
const router = express.Router();

router.get('/preuzmiProizvodjace', (req, res) =>
    {
        var query = 'SELECT * FROM buyhub.proizvodjac WHERE kategorija = ? and tip = ?';
        
        cassandraClient.execute(query, [req.body.kategorija, req.body.tip], (err, result) =>
        {
            if(err)
            {
                console.log('Unable to get data' + err);
            }
            else 
            {
                console.log(req.body);
                res.status(200).send(result.rows)
            }
        });
    }
)

//Ovo nam treba da bismo videli da li proizvodjac postoji za odredjenu kategoriju i tip
//Npr kada se dodaje novi proizvod u bazu
router.get('/preuzmiProizvodjaca', (req, res) =>
    {
        var query = 'SELECT * FROM buyhub.proizvodjac WHERE kategorija = ? and tip = ? and naziv = ?';
        
        cassandraClient.execute(query, [req.body.kategorija, req.body.tip, req.body.naziv], (err, result) =>
        {
            if(err)
            {
                console.log('Unable to get data' + err);
            }
            else 
            {
                console.log(req.body);
                res.status(200).send(result.rows)
            }
        });
    }
)

//OVO BI TREBALO DA SE IZVRSI AKO /preuzmiProizvodjaca vrati prazan niz
router.post('/dodajProizvodjaca', (req, res) =>
    {
        var allArgs = [req.body.kategorija, req.body.tip, req.body.naziv];
        var query = 'INSERT INTO buyhub.proizvodjac (kategorija, tip, naziv) VALUES (?, ?, ?);';

        cassandraClient.execute(query, allArgs, (err, result) => 
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

router.delete('/obrisiProizvodjaca', (req, res) =>
    {
        var allArgs =  [req.body.kategorija, req.body.tip, req.body.naziv];

        var query = 'DELETE FROM buyhub.proizvodjac WHERE kategorija = ? and tip = ? and naziv = ?;';
       
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