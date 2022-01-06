const express = require('express');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

router.get('/preuzmiProdavnice', (req, res) =>
    {
        neo4jSession
                .run('MATCH (p:Prodavnica) RETURN p', { })
                .then((result) =>
                {
                    var nizProdavnica = [];

                    result.records.forEach(element => 
                    {
                        nizProdavnica.push(element._fields[0].properties);
                    });

                    res.send(nizProdavnica);
                })
                .catch((err) =>
                {
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

router.get('/preuzmiProdavniceUGradu', (req, res) =>
    {
        var grad = req.body.grad;

        neo4jSession
                .run('MATCH (p:Prodavnica {grad : $grad}) RETURN p', {grad : grad})
                .then((result) =>
                {
                    var nizProdavnica = [];

                    result.records.forEach(element => 
                    {
                        nizProdavnica.push(element._fields[0].properties);
                    });

                    res.send(nizProdavnica);
                })
                .catch((err) =>
                {
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

router.post('/dodajProdavnicu', (req, res) =>
    {
        var grad = req.body.grad;
        var adresa = req.body.adresa;
        var radnoVreme = req.body.radnoVreme;
        var telefon = req.body.telefon;
        var email = req.body.email;

        const query = 'MERGE (p:Prodavnica { grad : $grad, adresa : $adresa, radnoVreme : $radnoVreme, telefon : $telefon, email : $email}) RETURN p';

        neo4jSession
                .run(query, {grad : grad, adresa: adresa, radnoVreme: radnoVreme, telefon: telefon, email: email})
                .then((result) =>
                {
                    var nizProdavnica = [];

                    result.records.forEach(element => 
                    {
                        nizProdavnica.push(element._fields[0].properties);
                    });

                    res.send(nizProdavnica);
                })
                .catch((err) =>
                {
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

//Moze sve da se menja osim grada i adrese
router.put('/izmeniProdavnicu', (req, res) =>
    {
        var grad = req.body.grad;
        var adresa = req.body.adresa;
        var radnoVreme = req.body.radnoVreme;
        var telefon = req.body.telefon;
        var email = req.body.email;

        const query = 'MATCH (p:Prodavnica { grad : $grad, adresa : $adresa}) SET p.radnoVreme = $radnoVreme, p.telefon = $telefon, p.email = $email RETURN p';
    
        neo4jSession
                    .run(query, {grad, adresa, radnoVreme, telefon, email})
                    .then((result) => 
                    {
                        res.send(result);
                    })
                    .catch((err) =>
                    {
                        res.status(500).send('Neo4j not working' + err);
                    });
    }
) 

router.delete('/obrisiProdavnicu', (req, res) =>
    {
        var grad = req.body.grad;
        var adresa = req.body.adresa;
        
        var query = 'MATCH ( p:Prodavnica {grad: $grad, adresa: $adresa} ) DELETE p';
        
        neo4jSession
                    .run(query, {grad, adresa})
                    .then((result) => 
                    {
                        res.send(result);
                    })
                    .catch((err) =>
                    {
                        res.status(500).send('Neo4j not working' + err);
                    });
    }
)

module.exports = router;