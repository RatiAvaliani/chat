const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

module.exports = {
    "user" : mongoose.model('user', new schema({
        username: {
            type: String,
            lowercase: true, 
            trim: true, 
            unique: true,
            minlength: [5, 'Username needs to be at lest 5 characters'],
            maxlength: [25, 'Username needs to be at less then 12 characters'],
            required: [true, 'Username is required'],
            unique: 'Two users cannot share the same username ({VALUE})'
        },
        password: {
            type: String,
            minlength: [8, 'Password needs to be at lest 5 characters'],
            required: [true, 'Password is required']
        },
        contactList: "Mixed",
        email: {
            type: String,
            unique: 'This emails is registerd ({VALUE})',
            trim: true, 
            required: [true, 'Email is required'],
            validator: {
                validate: function(email) {
                    return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(.[a-zA-Z0-9-]+)*$/.test(email)
                },
                message: "Email format incorrect"
            }
        }
    }).plugin(beautifyUnique))
}