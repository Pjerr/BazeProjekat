const express = require('express');

const proizvodNazivRouter = require('./routes/proizvod_naziv');
const ProizvodNeo4jRouter = require('./routes/neo4jProizvod');
const popularniProizvodiRouter = require('./routes/popularniProizvodiCassandra');
const korisnikNEORouter = require('./routes/korisnikNEO');


const app = express();
const APIRouter = express.Router();
const rootRouter = express.Router();
rootRouter.use('/proizvod_cassandra_tabele', proizvodNazivRouter);
rootRouter.use('/neo4jProizvod', ProizvodNeo4jRouter);
rootRouter.use('/popularniProizvodi', popularniProizvodiRouter);
rootRouter.use('/korisnik', korisnikNEORouter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', rootRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log("Server is running on PORT 5000....."));

app.get('/', (req,res)=>{
    res.status(200).send('Glavna stranica ')
})



