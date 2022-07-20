const express = require('express');
const axios = require('axios');
const cors = require('cors');

const redis = require('redis');//Configure redis client
const redisClient = redis.createClient();
redisClient.connect().then(() =>{
    console.log('redis connected')
})
const DEFAULT_EXPIRATION = 3600;

const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(cors())

app.get('/photos', async (req, res) => {
    const albumId = req.query.albumId;
    const photos = await redisClient.get(`photos?albumId=${albumId}`);

        if(photos != null){
            console.log('Cache Hit');
            return res.json(JSON.parse(photos))
        }
        else {
            console.log('Cache Miss');
            const { data } = await axios.get(
                'https://jsonplaceholder.typicode.com/photos',
                {params: {albumId} }
            )
            redisClient.SETEX(`photos?albumId=${albumId}`, DEFAULT_EXPIRATION, JSON.stringify(data));
            res.json(data)
        }
})

app.get('/photos/:id', async (req,res) => {
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    ) 

    res.json(data)
})

app.listen(5000, ()=>{
    console.log('Application started')
});
