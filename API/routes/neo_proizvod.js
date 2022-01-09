const express = require('express');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

router.get('/', (req,res)=>{
    var nazivProizvoda = req.body.Naziv;
    neo4jSession
            .run('MATCH (p:Proizvod{naziv:$nazivParam}) RETURN p', {nazivParam : nazivProizvoda})
            .then((result)=>{
                var nizProizvoda = [];
                result.records.forEach(element => {
                    nizProizvoda.push(element._fields[0].properties);
                });
                res.send(nizProizvoda);
            })
            .catch((err)=>{
                res.status(500).send('Neo4j not working' + err);
            });        
})


router.post('/dodajProizvod', (req,res)=>{
    
    var {brojKupovina,brojOcena,cena,kategorija,naziv,popust,tip,zbirOcena} = req.body;

    
    if(!naziv || popust < 0 || cena < 0 || brojKupovina < 0)
        res.status(400).send('Bad request params');
    
    const addQuery = 'MERGE (p:Proizvod{brojKupovina : $brojKupovina,brojOcena : $brojOcena,cena : $cena,kategorija:$kategorija,naziv:$naziv,popust:$popust,tip:$tip,zbirOcena:$zbirOcena}) RETURN p';
    neo4jSession
                .run(addQuery,{brojKupovina,brojOcena,cena,kategorija,naziv,popust,tip,zbirOcena})
                .then((result)=>{
                    res.send(result);
                })
                .catch((err)=>{
                    res.status(500).send('Neo4j not working' + err);
                });
})


router.delete('/obrisiProizvod', (req,res)=>{
    var naziv = req.body.Naziv;
    var deleteQuery = 'MATCH (p:Proizvod{naziv:$naziv}) DELETE p';
    neo4jSession
                .run(deleteQuery, {naziv})
                .then((result)=>{
                    res.send(result);
                })
                .catch((err)=>{
                    res.status(500).send('Neo4j not working' + err);
                });
})

//IZLISTANE PRODAVNICE U KOJIMA SE NALAZI:
router.get('/vratiProdavnice', (req, res) => 
    {
        var kategorija = req.body.kategorija;
        var tip = req.body.tip;
        var naziv = req.body.naziv;

        neo4jSession.readTransaction((tx) =>
            {
                tx
                    .run(`MATCH (n: Proizvod {kategorija: $kategorija, tip: $tip, naziv: $naziv})-[rel:U_MAGACINU]->(p: Prodavnica)
                    RETURN p`, {kategorija, tip, naziv})
                    .then((result) => 
                        {
                            var nizProdavnica = [];

                            result.records.forEach(element => 
                            {
                                nizProdavnica.push(element._fields[0].properties);
                            });
                            
                            res.send(nizProdavnica);
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