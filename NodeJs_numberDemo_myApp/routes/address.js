const express = require('express');
const router = express.Router();
const Address = require('../model/models');
const Number = require('../model/numbers');

const redisClient = require('../redisdb');

//Reading Numbers from number directory: 

router.get('/numbers', async(req,res)=>{

	const numberList = await redisClient.get('numbers');
	if(numberList != null){
		console.log('Cache Hit');
		return res.json(JSON.parse(numberList))
	}else
	{
	console.log('Cache Miss');
    Number.find({})
            .then((data)=>{
				redisClient.SET('numbers', JSON.stringify(data));
                res.json({found: true, data: data});
			})
            .catch((err)=>{
                console.log(err)
                res.json({found: false, data: null});
            })
		}
})

router.get('/findNumber', async (req,res) => {
	let searchField = req.query.number;
	Number.find({number:{$regex: searchField, $options: '$i'}})
	.then(data => {
		let filteredData = data;
		if(filteredData.length !== 0){
			res.json(filteredData);
		}
			else{
				res.json({Error:"Number not Found"});

			
		}
	})
})

router.post('/number', (req, res) => {
	// for (let i = 9999200000 ; i < 9999300000; i++){
	// number = i.toString(),
	// connectTimeInSec = i%10,
	// isValid = true
	number = req.body.number;
	connectTimeInSec = req.body.connectTimeInSec;
	isValid = req.body.isValid;


	let newAddress = new Number({
		number: number,
		connectTimeInSec: connectTimeInSec,
		isValid: isValid
	})

	newAddress.save().then((numberDetails) => {
		res.send(numberDetails)
		// console.log('saved',i);
	}).catch((err) => {
		console.log(err)
	})
// }
// res.json({sent:'sent succesfully'})
})


//--------------------------------------------------------------------------------------------------------------------
// Reading a User from AddressBook

router.get('/',(req,res)=>{
    Address.find({})
            .then((data)=>{
                res.json({found: true, data: data});
            })
            .catch((err)=>{
                console.log(err)
                res.json({found: false, data: null});
            })
})

router.get('/:id', (req, res) =>{
	Address.findById(req.params.id, (err, user) =>{
		res.send(user)
	})
})

// Adding a User to AddressBook
router.post('/', (req, res) => {
	name = req.body.name,
	email = req.body.email,
	phone = req.body.phone,
	place = req.body.place

	let newAddress = new Address({
		name: name,
		email: email,
		phone: phone,
		place: place
	})

	newAddress.save().then((address) => {
		res.send(address)
	}).catch((err) => {
		console.log(err)
	})
})

// Updating the User

router.post('/update/:id', (req, res) => {
	let address = {}
	if (req.body.name) address.name = req.body.name
	if (req.body.email) address.email = req.body.email
	if (req.body.phone) address.phone = req.body.phone
	if (req.body.place) address.place = req.body.place

	address = { $set: address }

	Address.update({_id: req.params.id}, address).then(() => {
		res.send(address)
	}).catch((err) => {
		console.log(err)
	})
})


// Deleting the User from AddressBook

router.delete('/delete/:id', (req, res) => {
	Address.deleteOne({_id: req.params.id}).then(() => {
		res.send('user deleted')
	}).catch((err) => {
		console.log(err)
	})
})

module.exports = router;
