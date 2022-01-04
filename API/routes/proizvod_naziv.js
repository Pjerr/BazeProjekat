const express = require('express');
const { copyFileSync } = require('fs');
const cassandraClient = require('../cassandraConnect');
const router = express.Router();


//BITNO: Nema update ovde jer je naziv clustering key za ovu tabelu, ne moze da se menja

//BODY SADRZI QUERY PARAMS
router.get('/', (req,res)=>{
  var firstQuery = 'SELECT * FROM buyhub.proizvod_naziv WHERE kategorija = ? and tip = ? and naziv = ? ';
    cassandraClient.execute(firstQuery, [req.body.Kategorija, req.body.Tip, req.body.Naziv], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(result.rows)
        }
    })
})

//ISTO IZ BODY IDU PARAMS, SLATI SA /r/n za svaku stavku
router.post('/dodajProizvod',(req,res)=>{

    var addQuery = 'INSERT INTO buyhub.proizvod_naziv (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?)';
    cassandraClient.execute(addQuery,
                            [req.body.Kategorija,req.body.Tip, req.body.Naziv, req.body.Cena, req.body.Ocena,req.body.Proizvodjac, req.body.Opis, req.body.Slika,req.body.Popust],
                            { prepare : true },
                            (err,result)=>{
                                if(err){
                                    console.log(req.body);
                                    console.log('Unable to put data' + err);
                                }
                                else 
                                {
                                    console.log(req.body);
                                    res.status(200).send(result);
                                }
                            })
})

//u body idu i kateogrija i tip i naziv
router.delete('/obrisiProizvod', (req,res)=>{

    var deleteQuery = 'DELETE FROM buyhub.proizvod_naziv WHERE kategorija = ? and tip = ? and naziv = ?';
    cassandraClient.execute(deleteQuery, [req.body.Kategorija, req.body.Tip, req.body.Naziv], (err,result)=>{
        if(err){
            console.log(req.body);
            console.log('Unable to delete data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(result);
        }
    })

})



module.exports = router;