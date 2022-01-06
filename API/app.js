const express = require('express');
const proizvodNazivRouter = require('./routes/proizvod_naziv');
const ProizvodNeo4jRouter = require('./routes/neo4jProizvod');
const popularniProizvodiRouter = require('./routes/popularniProizvodiCassandra');
const proizvodjacRouter = require('./routes/proizvodjac');
const RadnikNeo4jRouter = require('./routes/neo4jRadnik');
const ProdavnicaNeo4jRouter = require('./routes/neo4jProdavnica');

const app = express();
const rootRouter = express.Router();
rootRouter.use('/proizvod_cassandra_tabele', proizvodNazivRouter);
rootRouter.use('/neo4jProizvod', ProizvodNeo4jRouter);
rootRouter.use('/popularniProizvodi', popularniProizvodiRouter);
rootRouter.use('/proizvodjac', proizvodjacRouter);
rootRouter.use('/neo4jRadnik', RadnikNeo4jRouter);
rootRouter.use('/neo4jProdavnica', ProdavnicaNeo4jRouter);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', rootRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log("Server is running on PORT 5000....."));

app.get('/', (req,res)=>{
    res.status(200).send('Glavna stranica ')
})
