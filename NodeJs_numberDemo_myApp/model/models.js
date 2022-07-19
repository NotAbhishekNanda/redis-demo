const mongoose = require('mongoose')

// Schema for AddressBook
const addressSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	},
	place: {
		type: String,
		required: true
	}
})

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
