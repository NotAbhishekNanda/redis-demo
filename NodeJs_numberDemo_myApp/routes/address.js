const express = require('express');
const router = express.Router();
const Address = require('../model/models');

// Reading a User from AddressBook

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
