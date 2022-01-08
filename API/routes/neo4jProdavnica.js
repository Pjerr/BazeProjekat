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

//Veza sa proizvodom - PRIVREMENO OVDE. TREBA DA BUDE KOD PROIZVODA:
router.get('/vratiStanjeMagacina', (req, res) => 
    {
        var kategorija = req.body.kategorija;
        var tip = req.body.tip;
        var naziv = req.body.naziv;

        var grad = req.body.grad;
        var adresa = req.body.adresa;

        neo4jSession.readTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod {kategorija: $kategorija, tip: $tip, naziv: $naziv})-[rel:U_MAGACINU]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                    RETURN rel`, {kategorija, tip, naziv, grad, adresa})
                    .then((result) => 
                        {
                            var info = [];

                            result.records.forEach(element => {
                                info.push(element._fields[0].properties);
                            });

                            res.send(info);
                        }
                    )
                    .catch((error) => 
                        {
                            res.status(500).send('Neuspesno' + error);
                        }
                    );
            }
        )
    }
)

router.post('/dodajUProdavnicu', (req, res) => 
    {
        var kategorija = req.body.kategorija;
        var tip = req.body.tip;
        var naziv = req.body.naziv;

        var grad = req.body.grad;
        var adresa = req.body.adresa;
        
        var brojProizvoda = req.body.brojProizvoda;

        neo4jSession.writeTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod {kategorija: $kategorija, tip: $tip, naziv: $naziv})
                        MATCH (m: Prodavnica {grad: $grad, adresa: $adresa})
                        CREATE (n)-[rel:U_MAGACINU { brojProizvoda: ${brojProizvoda}}]->(m)`, {kategorija, tip, naziv, grad, adresa})
                    .then((result) => 
                        {
                            res.status(200).send('Uspesno dodat proizvod u magacin!')
                        }
                    )
                    .catch((error) => 
                        {
                            res.status(500).send('Neuspesno' + error);
                        }
                    );
            }
        )
    }
)

//NE MENJA BROJ PROIZVODA ZADATIM BROJEM, NEGO DODAJE TOLIKO NA TRENUTNO STANJE
//NOTE: ovo se koristi i za dekrementiranje prilikom offline kupovine! Samo se salje -1 kao brojProizvoda
router.put('/dodajProizvodeUMagacin', (req, res) => 
    {
        var kategorija = req.body.kategorija;
        var tip = req.body.tip;
        var naziv = req.body.naziv;

        var grad = req.body.grad;
        var adresa = req.body.adresa;
        
        var brojProizvoda = req.body.brojProizvoda;

        neo4jSession.writeTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod {kategorija: $kategorija, tip: $tip, naziv: $naziv})-[rel:U_MAGACINU]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                        SET rel.brojProizvoda = rel.brojProizvoda + ${brojProizvoda}
                        RETURN rel`, {kategorija, tip, naziv, grad, adresa})
                    .then((result) => 
                        {
                            res.status(200).send('Uspesno dodato jos proizvoda u magacin!')
                        }
                    )
                    .catch((error) => 
                        {
                            res.status(500).send('Neuspesno' + error);
                        }
                    );
            }
        )
    }
)

router.delete('/obrisiMagacin', (req, res) => 
    {
        var kategorija = req.body.kategorija;
        var tip = req.body.tip;
        var naziv = req.body.naziv;

        var grad = req.body.grad;
        var adresa = req.body.adresa;

        neo4jSession.writeTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod {kategorija: $kategorija, tip: $tip, naziv: $naziv})-[rel:U_MAGACINU]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                        DELETE rel`, {kategorija, tip, naziv, grad, adresa})
                    .then((result) => 
                        {
                            res.status(200).send('Uspesno obrisan proizvod/magacin!')
                        }
                    )
                    .catch((error) => 
                        {
                            res.status(500).send('Neuspesno' + error);
                        }
                    );
            }
        )
    }
)

module.exports = router;