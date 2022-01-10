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

//Treba slika da se doda
router.post('/dodajNovePopularne', getPopularneProizvodeNeo, (req,res)=>{
     
    var addQuery = 'BEGIN BATCH' +
                ' INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);' +
               ' INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);' +
               ' INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);' +
               ' INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);' +
               ' INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);' +
               ' APPLY BATCH';
     //var addQuery = "INSERT INTO buyhub.popularno (popularno, ocena, cena, kategorija,naziv,tip) VALUES (?,?,?,?,?,?);";
     cassandraClient.execute(addQuery, req.body.argsArray,
                    {prepare : true}, (err,result)=>{
                        if(err){
                            console.log('Unable to put data' + err);
                        }
                    })          

    res.status(200).send(req.body.argsArray);                    
    
})


router.delete('/obrisiOceneIPopularno', (req,res)=>{

    var deletePopularno = 'TRUNCATE buyhub.popularno';
    var deleteOcene = 'TRUNCATE ocene';

    var executeBoth = 'BEGIN BATCH' + deleteOcene + " " + deletePopularno + "APPLY BATCH";

    cassandraClient.execute(executeBoth,[],(err,result) =>
    {
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


async function getPopularneProizvodeNeo(req,res,next){
    neo4jSession.readTransaction((tx)=>{
        tx
        .run('MATCH (p:Proizvod) \
        WHERE p.brojKupovina = 0 \
        and p.brojOcena = 0 \
        and p.zbirOcena / (p.brojOcena+1) = 0\
         RETURN p LIMIT 5')
         .then((result)=>{
            var argsArray = [];
            var i = 0;
            result.records.forEach(element=>{
                
                var elemUnpacked = element._fields[0].properties;
                argsArray.push('POPULARNO', elemUnpacked.zbirOcena/(elemUnpacked.brojOcena+1),
                elemUnpacked.cena,elemUnpacked.kategorija,elemUnpacked.naziv,
                elemUnpacked.tip);
            });
            req.body.argsArray = argsArray;
            next();
         })
         .catch((err)=>{
            res.status(500).send('Neo4j not working' + err);
         });
    })
}

module.exports = router;