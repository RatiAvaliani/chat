const mongoose = require('mongoose');
const schema = mongoose.Schema;

module.exports = {
    "user" : mongoose.model('user', new schema({
        username: {
            type: String, 
            min: [5, 'Username needs to be at lest 5 characters'],
            max: [12, 'Username needs to be at less then 12 characters'],
            required: [true, 'Username is required']
        },
        password: {
            type: String,
            min: [8, 'Password needs to be at lest 5 characters'],
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            validator: {
                validate: function(email) {
                    return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(.[a-zA-Z0-9-]+)*$/.test(email)
                },
                message: "Email format incorrect"
            }
        }
    }))
}