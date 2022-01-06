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
        var usernameRadnika = req.body.username;

        neo4jSession
                .run('MATCH (r:Radnik {username : $usernameParam}) RETURN r', {usernameParam : usernameRadnika})
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
        var username = req.body.Username;
        
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

module.exports = router;