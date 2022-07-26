const express = require('express');
const router = express.Router();
const Number = require('../model/numbers');
const redisClient = require('../redisdb');

//Reading Numbers from number directory:

async function getNumber(req, res, next) {
  try {
    console.log('Cache Miss');

    const number = req.query.number;
    console.log(number);
    console.log(number.replace(/ /g,"+"));
    const resNumber = number.replace(/ /g,"+");

    Number.find({ number: resNumber })
      .then((data) => {
		let filteredData = data;
		if (filteredData.length !== 0) {
        redisClient.SETEX(number, 3600, JSON.stringify(data));
        return res.json({ found: true, data: data });
		}
		else {
			res.json({Error: 'Data not found'});
		}
      })
      .catch((err) => {
        console.log(err);
        return res.json({ found: false, data: null });
      });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
}

const cache = async (req, res, next) => {
  try {
    const { number } = req.query;

    const data = JSON.parse(await redisClient.get(number));
    console.log('data is ', data);
    if (data !== null) {
      console.log('Cache Hit');
      res.send(data);
    } else {
      console.log('Coming to cache');
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

router.get('/findNumberFromCache', cache, getNumber);

router.get('/numbers', async (req, res) => {
  const numberList = await redisClient.get('numbers');
  if (numberList != null) {
    console.log('Cache Hit');
    return res.json(JSON.parse(numberList));
  } else {
    console.log('Cache Miss');
    Number.find({})
      .then((data) => {
        redisClient.SET('numbers', JSON.stringify(data));
        res.json({ found: true, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.json({ found: false, data: null });
      });
  }
});

router.get('/findNumber', async (req, res) => {
  let searchField = req.query.number;
  let resNumber = searchField.replace(/ /g,"+")
  Number.find({ number: resNumber }).then(
    (data) => {
      let filteredData = data;
      if (filteredData.length !== 0) {
        res.json(filteredData);
      } else {
        res.json({ Error: 'Number not Found' });
      }
    }
  );
});

router.post('/number', (req, res) => {
  /*
	for (let i = 9999200000 ; i < 9999300000; i++){
	number = i.toString(),
	connectTimeInSec = i%10,
	isValid = true
	*/

  number = req.body.number;
  connectTimeInSec = req.body.connectTimeInSec;
  isValid = req.body.isValid;

  let newAddress = new Number({
    number: number,
    connectTimeInSec: connectTimeInSec,
    isValid: isValid,
  });

  newAddress
    .save()
    .then((numberDetails) => {
      res.send(numberDetails);
      // console.log('saved',i);
    })
    .catch((err) => {
      console.log(err);
    });
  /*}
   */
  // res.json({sent:'sent succesfully'})
});

module.exports = router;
