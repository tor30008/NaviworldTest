import express from 'express';
import * as service from './service/example.service.js';

const app = express();
const port = 1000;

app.use(express.json());
//app.get('/items',express.json(),service.getItem);
app.get('/reportItems',service.getItemReport);
app.listen(port,() => {
    console.log(`Server run ${port}`);
});

