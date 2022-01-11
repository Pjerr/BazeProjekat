const express = require('express');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

router.get('/preuzmiRadnike', (req, res) =>
    {
        neo4jSession
                .run('MATCH (r:Radnik) RETURN r', { })
                .then((result) =>
                {
                    var nizRadnika = [];

                    result.records.forEach(element => 
                    {
                        nizRadnika.push(element._fields[0].properties);
                    });

                    res.send(nizRadnika);
                })
                .catch((err) =>
                {
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

router.get('/preuzmiRadnika', (req, res) =>
    {
        var usernameRadnika = req.query.username;

        neo4jSession
                .run('MATCH (r:Radnik {username : $usernameParam}) RETURN r', {usernameParam : usernameRadnika})
                .then((result) =>
                {
                    var radnik = result.records[0]._fields[0].properties;
                    res.send(radnik);
                })
                .catch((err) =>
                {
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

router.post('/dodajRadnika', (req, res) =>
    {
        var username = req.body.username;
        var password = req.body.password;
        var ime = req.body.ime;
        var prezime = req.body.prezime;

        const query = 'MERGE (r:Radnik { username : $username, password : $password, ime : $ime, prezime : $prezime}) RETURN r';

        neo4jSession
                .run(query, {username : username, password: password, ime: ime, prezime: prezime})
                .then((result)  =>
                {
                    var nizRadnika = [];

                    result.records.forEach(element => {
                        nizRadnika.push(element._fields[0].properties);
                    });

                    res.send(nizRadnika);
                })
                .catch((err)=>{
                    res.status(500).send('Neo4j not working' + err);
                });        
    }
)

router.delete('/obrisiRadnika', (req, res) =>
    {
        var username = req.query.username;
        
        var deleteQuery = 'MATCH (r:Radnik {username: $username} ) DELETE r';
        
        neo4jSession
                    .run(deleteQuery, {username})
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

//Veza sa prodavnicom:
router.get('/preuzmiZaposlenje', (req, res) => 
    {
        var username = req.query.username;
        var grad = req.query.grad;
        var adresa = req.query.adresa;

        neo4jSession.readTransaction((tx) =>
            {
                tx
                    .run(`MATCH (r: Radnik {username: $username})-[rel:RADI_U]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                        RETURN rel`, {username, grad, adresa})
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

router.get('/preuzmiInfoOProdavnici', (req, res) => 
    {
        var username = req.query.username;

        neo4jSession.readTransaction((tx) =>
            {
                tx
                    .run(`MATCH (r: Radnik {username: $username})-[rel:RADI_U]->(p: Prodavnica)
                        RETURN p`, {username})
                    .then((result) => 
                        {
                            var prodavnica = result.records[0]._fields[0].properties;

                            // var info = [];

                            // result.records.forEach(element => {
                            //     info.push(element._fields[0].properties);
                            // });

                            res.send(prodavnica);
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

//Ogranicenje da ne moze da se dvaput kreira relacija izmedju radnika i neke prodavnice
function vratiRadiURelaciju(req, res, next) 
{
    var username = req.body.username;

    neo4jSession
          .run(`RETURN EXISTS((:Prodavnica)<-[:RADI_U]-(:Radnik{username : $username }))`, 
                {username})
          .then((result) =>
          {
              req.body.postoji = result;

              next();
          })
          .catch((err) =>
          {
              res.status(500).send('NEUSPENO' + err);
          });
}

router.post('/zaposliRadnika', vratiRadiURelaciju, (req, res) =>
{    
    var username = req.body.username;
    var grad = req.body.grad;
    var adresa = req.body.adresa;
    var pozicija = req.body.pozicija;
    var datum = req.body.datum;

    if(req.body.postoji.records[0]._fields[0] == false)
    {
        neo4jSession.writeTransaction((tx) =>
        {
            tx
            .run(`MATCH (r: Radnik {username: $username}), (p: Prodavnica {grad: $grad, adresa: $adresa})
                CREATE (r)-[rel:RADI_U { pozicija: '${pozicija}', datumZaposlenja: '${datum}'}]->(p)`, {username, grad, adresa})
            .then((result) =>
            {
                res.status(200).send('Uspesno zaposljen radnik!')
            })
            .catch((err) =>
            {
                res.status(500).send('NEUSPENO' + err);
            });
        })
    }
    else
    {
        res.status(400).send('Radnik je vec zaposljen!')
    }
})

//samo moze da se menja pozicija. Nema poente da se menja datum zaposlenja
router.put('/izmeniPoziciju', (req, res) => 
    {
        var username = req.body.username;
        var grad = req.body.grad;
        var adresa = req.body.adresa;
        var pozicija = req.body.pozicija;

        neo4jSession.writeTransaction((tx) =>
            {
                tx
                    .run(`MATCH (r: Radnik {username: $username})-[rel:RADI_U]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                        SET rel.pozicija = '${pozicija}'
                        RETURN rel`, {username, grad, adresa})
                    .then((result) => 
                        {
                            res.status(200).send('Uspesna promocija/demotion radnika!')
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

router.delete('/otpustiRadnika', (req, res) => 
    {
        var username = req.query.username;
        var grad = req.query.grad;
        var adresa = req.query.adresa;

        neo4jSession.writeTransaction((tx) =>
            {
                tx
                    .run(`MATCH (r: Radnik {username: $username})-[rel:RADI_U]->(p: Prodavnica {grad: $grad, adresa: $adresa})
                        DELETE rel`, {username, grad, adresa})
                    .then((result) => 
                        {
                            res.status(200).send('Uspesno otpusten radnik!')
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