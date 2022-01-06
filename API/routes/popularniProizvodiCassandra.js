const express = require('express');
const { copyFileSync } = require('fs');
const cassandraClient = require('../cassandraConnect');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();


router.get('/',(req,res)=>{
    
    var getQuery = 'SELECT * FROM buyhub.popularno WHERE popularno = ?';
    cassandraClient.execute(getQuery,["POPULARNO"], (err,result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            res.status(200).send(result.rows)
        }
    })
})

router.post('/dodajNovePopularne', (req,res)=>{

    neo4jSession.readTransaction((tx)=>{
        tx
        .run('MATCH (p:Proizvod) \
             WHERE p.brojKupovina = 0 \
             and p.brojOcena = 0 \
             and p.zbirOcena / (p.brojOcena+1) = 0\
              RETURN p LIMIT 5')
        .then((result)=>{
            var argsArray = [];
                result.records.forEach(element => {
                   
                    argsArray.push(element._fields[0].properties);
                    console.log(proizvod);
                });
                argsArray.unshift("POPULARNO");
                var addQuery = 'BEGIN BATCH\
                 INSERT INTO buyhub.popularno (popularno, ocena, naziv, cena) VALUES (?,?,?,?); \
                 INSERT INTO buyhub.popularno (popularno, ocena, naziv, cena) VALUES (?,?,?,?);\
                 INSERT INTO buyhub.popularno (popularno, ocena, naziv, cena) VALUES (?,?,?,?);\
                 INSERT INTO buyhub.popularno (popularno, ocena, naziv, cena) VALUES (?,?,?,?);\
                 INSERT INTO buyhub.popularno (popularno, ocena, naziv, cena) VALUES (?,?,?,?);\
                 APPLY BATCH';
                cassandraClient.execute(addQuery,
                        ["POPULARNO",proizvod.zbirOcena/(proizvod.brojOcena + 1), proizvod.naziv,proizvod.cena],
                        {prepare : true}, (err,result)=>{
                            if(err){
                                console.log(proizvod);
                                console.log('Unable to put data' + err);
                            }
                            else 
                            {
                                //console.log(proizvod);
                                //res.status(200).send(result);
                            }
                        })

                
                //res.send(nizProizvoda);

            })
        .catch((err)=>{
                res.status(500).send('Neo4j not working' + err);
            });  
            
         res.status(200).send();   
    })
    
})


router.delete('/obrisiOceneIPopularno', (req,res)=>{

    var deletePopularno = 'TRUNCATE buyhub.popularno';
    var deleteOcene = 'TRUNCATE ocene';

    var executeBoth = 'BEGIN BATCH' + deleteOcene + " " + deletePopularno + "APPLY BATCH";

    cassandraClient.execute(executeBoth,[],(err,result)=>{
        if(err){
            console.log(proizvod);
            console.log('Unable to put data' + err);
        }
        else 
        {
            res.status(200).send(result);
        }
    })
})

module.exports = router;