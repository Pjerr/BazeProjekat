const express = require('express');
const { copyFileSync } = require('fs');
const cassandraClient = require('../cassandraConnect');
const router = express.Router();


//BITNO: Nema update ovde jer je naziv clustering key za ovu tabelu, ne moze da se menja

/*
Za GET se salje Kategorija i Tip zbog particije uvek, salje se Pretraga : "Naziv" ili "Cena" ili "Ocena" ili "Popust" ili "Proizvodjac"
da bi se znalo kako da se pretrazi baza. Salje se i ascending : 0 ili 1, gde 1 znaci da se salje rastuce a 0 opadajauce
za Pretraga : "Naziv" salje se i Naziv proizvoda
za Pretraga : "Proizvodjac" salje se i Proizvodjac
*/
router.get('/', (req,res)=>{
  var nazivQuery = 'SELECT * FROM buyhub.proizvod_naziv WHERE kategorija = ? and tip = ? and naziv = ? ';
  var cenaQuery = 'SELECT * FROM buyhub.proizvod_cenanaziv WHERE kategorija = ? and tip = ?';
  var ocenaQuery = 'SELECT * FROM buyhub.proizvod_ocenanaziv WHERE kategorija = ? and tip = ?';
  var popustQuery = 'SELECT * FROM buyhub.proizvod_popust WHERE kategorija = ? and tip = ?';
  var proizvodjacQuery = 'SELECT * FROM buyhub.proizvod_proizvodjac WHERE kategorija = ? and tip = ? and proizvodjac = ?';

  var ascending = req.body.ascending;
  switch(req.body.Pretraga)
  {
      case "Naziv": 
      cassandraClient.execute(nazivQuery, [req.body.Kategorija, req.body.Tip, req.body.Naziv], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(result.rows)
        }
    }); break;
    case "Cena": 
      cassandraClient.execute(cenaQuery, [req.body.Kategorija, req.body.Tip], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(ascending == 1 ? result.rows : result.rows.reverse())
        }
    }); break;
    case "Ocena": 
      cassandraClient.execute(ocenaQuery, [req.body.Kategorija, req.body.Tip], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(ascending == 1 ? result.rows : result.rows.reverse())
        }
    }); break;
    case "Popust": 
      cassandraClient.execute(popustQuery, [req.body.Kategorija, req.body.Tip], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(ascending == 1 ? result.rows : result.rows.reverse())
        }
    }); break;
    case "Proizvodjac": 
      cassandraClient.execute(proizvodjacQuery, [req.body.Kategorija, req.body.Tip, req.body.Proizvodjac], (err, result)=>{
        if(err){
            console.log('Unable to get data' + err);
        }
        else 
        {
            console.log(req.body);
            res.status(200).send(result.rows)
        }
    }); break;
  }
    
  
    
})

//ISTO IZ BODY IDU PARAMS, SLATI SA /r/n za svaku stavku
router.post('/dodajUSveTabeleProizvoda', (req,res)=>{
    var allArgs = [req.body.Kategorija,req.body.Tip, req.body.Naziv, req.body.Cena, req.body.Ocena,req.body.Proizvodjac, req.body.Opis, req.body.Slika,req.body.Popust];
    var argsArray = [];
    for(i = 0; i < 5; i++)
        {
            allArgs.forEach(element => {
                argsArray.push(element);
            });
        }
    //console.log(argsArray);
    var addAllQuery = 'BEGIN BATCH INSERT INTO buyhub.proizvod_naziv (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?) ; INSERT INTO buyhub.proizvod_cenanaziv (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?); INSERT INTO buyhub.proizvod_ocenanaziv (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?); INSERT INTO buyhub.proizvod_popust (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?); INSERT INTO buyhub.proizvod_proizvodjac (kategorija, tip, naziv, cena, ocena, proizvodjac, opis, slika, popust) VALUES (?,?,?,?,?,?,?,?,?); APPLY BATCH';
    cassandraClient.execute(addAllQuery,
                            argsArray,
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

//TODO DELETE MORA VEROVATNO PREKO ID
//KAD brisemo iz tabele naziv, pre brisanja da zapamtimo Cenu,Ocenu,Proizvodjaca,Popust
router.delete('/obrisiIzSvihTabelaProizvoda', (req,res)=>{
    var allArgs =  [req.body.Kategorija, req.body.Tip, req.body.Naziv];
    var argsArray = [];
    for(i = 0; i < 5; i++)
    {
        allArgs.forEach(element => {
            argsArray.push(element);
        });
    }
    var deleteQuery = 'BEGIN BATCH DELETE FROM buyhub.proizvod_naziv WHERE kategorija = ? and tip = ? and naziv = ?; DELETE FROM buyhub.proizvod_cenanaziv WHERE kategorija = ? and tip = ? and naziv = ?; DELETE FROM buyhub.proizvod_ocenanaziv WHERE kategorija = ? and tip = ? and naziv = ?; DELETE FROM buyhub.proizvod_proizvodjac WHERE kategorija = ? and tip = ? and naziv = ?; DELETE FROM buyhub.proizvod_popust WHERE kategorija = ? and tip = ? and naziv = ? APPLY BATCH';
    cassandraClient.execute(deleteQuery, argsArray, (err,result)=>{
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


//TODO UPDATE CE MORATI ISTO PREKO ID


module.exports = router;