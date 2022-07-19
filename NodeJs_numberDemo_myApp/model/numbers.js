const mongoose = require('mongoose');

const numberSchema = mongoose.Schema({
	number: {
		type: String,
		required: true
	},
	connectTimeInSec: {
		type: Number,
        required: true
		
	},
	isValid: {
		type: Boolean,
        required: true
		
	},
})

const QueryNumber = mongoose.model('Query-Number', numberSchema);

module.exports = QueryNumber;
