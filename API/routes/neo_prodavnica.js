const express = require('express');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

//Ovo je npr korisno da se izlista adminu da bi zaposlio nekog radnika 
//u konkretnu prodavnicu
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

//Moze da se koristi takodje za admina kada hoce da zaposli radnika
router.get('/preuzmiProdavniceUGradu', (req, res) =>
    {
        var grad = req.query.grad;

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

//Moze sve da se menja osim grada i adrese. Nema poente da se grad/adresa menjaju
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
        var grad = req.query.grad;
        var adresa = req.query.adresa;
        
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

//Vraca trenutni broj proizvoda te kategorije, tog tipa i tog naziva u magacinu
router.get('/vratiStanjeMagacina', (req, res) => 
    {
        var kategorija = req.query.kategorija;
        var tip = req.query.tip;
        var naziv = req.query.naziv;

        var grad = req.query.grad;
        var adresa = req.query.adresa;

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

//Vraca sve relacije - PROVERITI POSLE 
router.get('/vratiSveProizvodeProdavnice', (req, res) => 
    {
        var grad = req.query.grad;
        var adresa = req.query.adresa;

        neo4jSession.readTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod)-[rel:U_MAGACINU]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                    RETURN rel`, {grad, adresa})
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

//KREIRA vezu izmedju proizvoda i prodavnice ALI se postavlja i inicijalni
//broj proizvoda te kategorije, tog tipa i tog naziva u magacinu
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

//Primer:
//Ako je trenutan broj proizvoda 100, a preko ove funkcije se prosledi 50,
//rezultat ce biti 150
//=> Ovo se koristi za narucivanje jos proizvoda (potrebno za OFFLINE kupovinu, ovo radi RADNIK)
router.put('/izmeniBrojProizvodaMagacina', (req, res) => 
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

//RASKIDANJE VEZE IZMEDJU PROIZVODA I PRODAVNICE
router.delete('/obrisiMagacin', (req, res) => 
    {
        var kategorija = req.query.kategorija;
        var tip = req.query.tip;
        var naziv = req.query.naziv;

        var grad = req.query.grad;
        var adresa = req.query.adresa;

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