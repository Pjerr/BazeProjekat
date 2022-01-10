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

router.post('/kupiProizvode', authenticateJWTToken, (req,res)=>{
    //username Korisnika kaže ko je kupio
    //niz naziva Proizvoda je sve ono što je kupio
    //neka se sabere i posalje ukupna cena sa fronta

    //zaProizvod se azurira brojKupovina

    //za cassandru ide niz naziva proizvoda, username korisnika, ukupna cena i vreme kupovine


    var username = req.body.username;
    var nizProizvoda = req.body.nizProizvoda;
    var ukupnaCena = req.body.ukupnaCena;

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


//router.post('/komentarisiProizvod', authenticateJWTToken, (req,res)=>{
router.post('/komentarisiProizvod', (req,res)=>{    
    var username = req.body.username;
    var komentar = req.body.komentar;
    var naziv = req.body.naziv;

    neo4jSession.writeTransaction((tx)=>{
        tx
          .run(`MATCH (p:Proizvod{naziv : $naziv}) 
                MATCH (k:Korisnik{username : $username })
                CREATE (k)-[rel:KOMENTARISAO{komentar:'${komentar}'}]->(p)`,{naziv,username})
          .then((result)=>{
              res.status(200).send('Komentar uspesan')
          })
          .catch((err)=>{
              res.status(500).send('NEUSPENO' + err);
          });
    })
})

router.get('/pogledajSvojeTransakcije',(req,res)=>{

    var username = req.query.username;

    neo4jSession.readTransaction((tx)=>{
        tx
          .run('MATCH (k:Korisnik{username:$username})-[r:KUPIO]->(p:Proizvod) RETURN p',{username})
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

//TODO PREPOURKA PROIZVODA I TODO RELACIJA OCENI
//RELACIJA OCENI:
//router.post('/oceniProizvod', authenticateJWTToken, (req, res) =>
router.post('/oceniProizvod', (req, res) => 
{    
    var username = req.body.username;
    var ocena = req.body.ocena;
    var naziv = req.body.naziv;

    neo4jSession.writeTransaction((tx) =>
    {
        tx
          .run(`MATCH (p:Proizvod{naziv : $naziv}) 
                MATCH (k:Korisnik{username : $username })
                CREATE (k)-[rel:OCENIO{ocena:'${ocena}'}]->(p)`, {naziv,username})
          .then((result) =>
          {
              res.status(200).send('Ocenjivanje uspesno')
          })
          .catch((err) =>
          {
              res.status(500).send('NEUSPENO' + err);
          });
    })
})

module.exports = router;

