const express = require('express');
const neo4jSession = require('../neo4jConnection');
const router = express.Router();

router.get('/:nazivProizvoda', (req,res)=>{
    var nazivProizvoda = req.params.nazivProizvoda;
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


module.exports = router;