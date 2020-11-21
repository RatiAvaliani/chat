const {user} = require('../schemas/user.schema');

class userModel {
    getList () {
        return user.find();
    }

    getUserId (email) {
        return user.find({email});
    }

    searchUserByNames (userName) {
        return user.find({"username": { $regex: '.*' + userName + '.*' }}, {username: 1});
    }

    getContacts (myId) {
        return user.findOne({_id : myId}, {contactList: 1});
    }

    addContact (myId, userId) {        
        if (myId === userId) return {status: false, message: 'Can\'t add your self to contact list.'};
        
        let userss = user.findOne({_id: myId}, (err, userInfo) => {
            
            if (userInfo.contactList[userId] === undefined) {
                let userList = JSON.parse(JSON.stringify(userInfo.contactList));
                user.findOne({_id: userId}, {username: 1, _id: 0}).then((cUsername) => {                     
                    userList[userId] = cUsername
                    console.log(userList);
                    userInfo.contactList = userList;
                    userInfo.save();
                });
                console.log('User added.');
            } else {
                console.log('This user is in the list.');
                return {"ss": 's'};
            }
        });

        console.log(userss);

        return {status: true, message: 'User added to contact list.'};
    }
}

module.exports = new userModel();
