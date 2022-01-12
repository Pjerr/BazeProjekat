const express = require('express');
const neo4jSession = require('../neo4jConnection');
const cassandraClient = require('../cassandraConnect');
const router = express.Router();
const bcrypt = require('bcryptjs');

const generateJWTToken = require('../auth').generateJWTToken;
const authenticateJWTToken = require('../auth').authenticateJWTToken;

const dotenv = require('dotenv');
dotenv.config();


router.get('/',(req,res)=>{
    
    
    var username = req.query.username;
    neo4jSession.readTransaction((tx)=>{
        tx
        .run(`MATCH (k:Korisnik{username: $username}) RETURN k`,{username})
        .then((result)=>{
            res.status(200).send(result.records[0]._fields[0].properties);
        })
        .catch((err)=>{
            res.status(500).send('NEO4J ne GET Korisnika' + err)
        });
        
    })

})


router.post('/dodajKorisnika',async (req,res)=>{

    var {email,ime,pass,prezime,telefon,username} = req.body;
    var hashPass = bcrypt.hashSync(pass,10);



    neo4jSession
        .run('MERGE (k:Korisnik{email : $email, ime : $ime , password : $hashPass,prezime:$prezime,telefon:$telefon,username:$username}) RETURN k', 
            {email,ime,hashPass,prezime,telefon,username})
        .then((result)=>{
            var token = generateJWTToken(username);
            res.status(200).send(token);
        })
        .catch((err)=>{
            res.status(500).send('NECE NEO4J DODAVANJE KORISNIKA' + err);
        });
    
    
})

router.put('/azurirajKorisnika', authenticateJWTToken, async (req,res)=>{
    
    var zaAzurirati = req.body.zaAzurirati;
    var username = req.body.username;
    

    switch(zaAzurirati)
    {
        case "BrojTelefona":
            var telefon = req.body.telefon;
            neo4jSession.writeTransaction((tx)=>{
                tx
                  .run(`MATCH (k:Korisnik {username: $username}) SET k.telefon = ${telefon} RETURN k`,{username})
                  .then((result)=>{
                      res.status(200).send(result);
                  })
                  .catch((err)=>{
                      res.status(500).send('Greska u dodavanju telefona ' + err)
                  });
                  
            });
            break;
        case "Password":
            var noviPass = bcrypt.hashSync(req.body.noviPass,10);
            neo4jSession.writeTransaction((tx)=>{
                tx
                  .run(`MATCH (k:Korisnik {username: $username}) SET k.password = '${noviPass}' RETURN k`,{username})
                  .then((result)=>{
                      res.status(200).send(result);
                  })
                  .catch((err)=>{
                      res.status(500).send('Greska u dodavanju sifre ' + err)
                  });
                  
            });
            break;    
    }
})

router.delete('/obrisiKorisnika', authenticateJWTToken,  (req,res)=>{

    var username = req.query.username;
    neo4jSession
                .run('MATCH (k:Korisnik{username:$username}) DELETE k', {username})
                .then((result)=>{
                    res.status(200).send(result);
                })
                .catch((err)=>{
                    res.status(500).send(err);
                });
})

router.post('/kupiProizvode', /*authenticateJWTToken,*/ (req,res)=>{
    //username Korisnika kaže ko je kupio
    //niz naziva Proizvoda je sve ono što je kupio
    //neka se sabere i posalje ukupna cena sa fronta

    //zaProizvod se azurira brojKupovina

    //za cassandru ide niz naziva proizvoda, username korisnika, ukupna cena i vreme kupovine


    var username = req.body.username;
    var nizProizvoda = req.body.nizProizvoda;

    let currentDate = new Date();
    let datum = `${currentDate.getDate()} / ${currentDate.getMonth()+1} / ${currentDate.getFullYear()} `;


    
        neo4jSession.writeTransaction((tx)=>{
            nizProizvoda.forEach(naziv => {
                tx
                .run(`MATCH (p:Proizvod{naziv : $naziv}) 
                      MATCH (k:Korisnik{username : $username })
                      SET p.brojKupovina = p.brojKupovina + 1
                      CREATE (k)-[rel:KUPIO{DatumKupovine:'${datum}'}]->(p)`,{naziv,username})
                .then((result)=>{
                    console.log('Uspesna relacija');
                    console.log(datum);
                })
                .catch((err)=>{
                    res.status(500).send('GRESKA KOD RELACIJA' + err)
                });
            });
           
        })
    

    res.status(200).send(req.body.nizProizvoda);
   
})

function vratiKomentarisaoRelaciju(req, res, next) 
{
    var username = req.body.username;
    var naziv = req.body.naziv;

    neo4jSession
          .run(`
                RETURN EXISTS((:Proizvod{naziv : $naziv})<-[:KOMENTARISAO]-(:Korisnik{username : $username }))`, {naziv, username})
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

//router.post('/komentarisiProizvod', authenticateJWTToken, (req,res)=>{
router.post('/komentarisiProizvod', vratiKomentarisaoRelaciju, (req,res) =>
{    
    var username = req.body.username;
    var komentar = req.body.komentar;
    var naziv = req.body.naziv;

    if(req.body.postoji.records[0]._fields[0] == false)
    {
        neo4jSession.writeTransaction((tx) =>
        {
            tx
            .run(`MATCH (p:Proizvod{naziv : $naziv}), (k:Korisnik{username : $username })
                CREATE (p)<-[rel:KOMENTARISAO {komentar : '${komentar}'}]-(k)`, {naziv, username})
            .then((result) =>
            {
                res.status(200).send('Komentarisanje uspesno')
            })
            .catch((err) =>
            {
                res.status(500).send('NEUSPENO' + err);
            });
        })
    }
    else
    {
        res.status(400).send('Vec ste komentarisali proizvod!')
    }
})

router.get('/pogledajSvojeTransakcije',(req,res)=>{

    var username = req.query.username;

    neo4jSession.readTransaction((tx) => 
    {
        tx
          .run('MATCH (k:Korisnik{username:$username})-[r:KUPIO]->(p:Proizvod) RETURN p', {username})
          .then((result)=>{
              var output = [];
              result.records.forEach(element => {
                  output.push(element._fields[0].properties);
              });
              res.status(200).send(output);
          })
          .catch((err)=>{
              res.status(500).send('ERR TRANSAKCIJA' + err);
          });
    })
})

function vratiOcenioRelaciju(req, res, next) 
{
    var username = req.body.username;
    var naziv = req.body.naziv;

    neo4jSession
          .run(`
                RETURN EXISTS((:Proizvod{naziv : $naziv})<-[:OCENIO]-(:Korisnik{username : $username }))`, {naziv, username})
          .then((result) =>
          {
              //res.status(200).send('Ocenjivanje uspesno')
              req.body.postoji = result;

              next();
          })
          .catch((err) =>
          {
              res.status(500).send('NEUSPENO' + err);
          });
}

//RELACIJA OCENI:
//router.post('/oceniProizvod', authenticateJWTToken, (req, res) =>
router.post('/oceniProizvod', vratiOcenioRelaciju, (req, res) => 
{    
    var username = req.body.username;
    var ocena = req.body.ocena;
    var naziv = req.body.naziv;

    if(req.body.postoji.records[0]._fields[0] == false)
    {
        neo4jSession.writeTransaction((tx) =>
        {
            tx
            .run(`MATCH (p:Proizvod{naziv : $naziv}), (k:Korisnik{username : $username })
                CREATE (p)<-[rel:OCENIO {ocena : ${ocena}}]-(k)`, {naziv,username})
            .then((result) =>
            {
                res.status(200).send('Ocenjivanje uspesno')
            })
            .catch((err) =>
            {
                res.status(500).send('NEUSPENO' + err);
            });
        })
    }
    else
    {
        res.status(400).send('Vec ste ocenili proizvod!')
    }
})

//TODO PREPOURKA PROIZVODA

//isto iz req.query idu param i to req.query.username

//Nalazi 5 korisnika koji su najslicniji po ukusu kao dati korisnik i nalazi proizvode koje su
//oni najbolje ocenili a da ih dati korisnik nije kupio
router.get('/preporuceniProizvodiMetodaPrva',(req,res)=>{

    var username = req.query.username;

    var listaPreporucenihProizvoda = [];

    neo4jSession
                .run('MATCH (k1:Korisnik{username:$username})-[r:OCENIO]->(p:Proizvod) \
                      WITH k1,avg(r.ocena) as k1_mean \
                      MATCH (k1)-[r1:OCENIO]->(p:Proizvod)<-[r2:OCENIO]-(k2:Korisnik) \
                      WITH k1, k1_mean, k2, COLLECT({r1:r1, r2:r2}) AS ocene WHERE size(ocene) > 5 \
                      MATCH (k2)-[rel:OCENIO]->[p:Proizvod] \
                      WITH k1, k1_mean, k2, avg(rel.ocena) AS u2_mean, ocene \
                      UNWIND ocene as o \
                      WITH sum( (o.r1.ocena - k1_mean) * (o.r2.ocena - k2_mean) ) AS nom \
                      sqrt(sum( (o.r1.ocena - k1_mean)^2 + (o.r2.ocena - k2_mean)^2 )) as denom \
                      k1,k2 WHERE denom <> 0 \
                      WITH k1,k2, nom/denom as pearson \
                      ORDER BY pearson DESC LIMIT 10 \
                      MATCH(k2)-[r:OCENIO]->(p:Proizvod) WHERE NOT EXISTS ((k1)-[:KUPIO]->(p) ) \
                      RETURN p, SUM(pearson * o.ocena) as score \
                      ORDER BY score DESC LIMIT 20', {username}
                      )
                .then((result)=>{
                    res.status(200).send(result.records);
                })
                .catch((err)=>{
                    res.status(500).send('Preporuka ne radi' + err);
                });
})

//Korisnici koji su kupili ovo sto si ti, kupili su jos i...
//req.query.username je parametar
router.get('/preporuceniProizvodiMetodaDruga', (req,res)=>{

    var username = req.body.username;
    neo4jSession
                .run('MATCH (k:Korisnik{username:$username})-[rel:KUPIO]->(p:Proizvod)<-[rel2:KUPIO]-(k2:Korisnik)-[rel3:KUPIO]->(p2:Proizvod) \
                      WHERE k.username <> k2.username and p.naziv <> p2.naziv \
                      RETURN p2 LIMIT 6', {username})
                .then((result)=>{
                    res.status(200).send(result.records);
                })
                .catch((err)=>{
                    res.status(500).send('Preporuka 2 ne radi' + err);
                });

})


//ovo gleda koje kategorije i tip proizvoda korisnik kupuje i predlaze mu iy tih kategorija/tipova
//proizvode koje nije jos uvek kupio
//isto je iz req.query.username korisnik
router.get('/preporuceniProizvodiMetodaTreca', (req,res)=>{

    var username = req.query.username;

    neo4jSession
                .run('MATCH (k:Korisnik{username:$username})-[r:KUPIO]->(p:Proizvod) \
                      MATCH (p2:Proizvod) WHERE p.naziv <> p2.naziv AND \
                      p2.kategorija = p.kategorija \
                      or p2.tip = p.tip or p2.proizvodjac = p.proizvodjac \
                      MATCH (k:Korisnik)-[rel:KUPIO]->(p2) \
                      WITH avg(rel.ocena) as mean \
                      RETURN p2, mean \
                      ORDER BY mean DESC LIMIT 10', {username})
                .then((result)=>{
                    res.status(200).send(result.records);
                })
                .catch((err)=>{
                    res.status(500).send('Preporuka 3 ne radi' + err);
                });
})
module.exports = router;

