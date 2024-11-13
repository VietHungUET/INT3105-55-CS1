const {models: {User}} = require   ('../models');
module.exports ={
    create : async (req, res) => {
        if(req.body.username && req.body.password) {
            const {username, password} = req.body;

            await User.create ({
                username,
                password
            });
            res.render('profile', { username});
        } else {
            res.send('NOT add to the database!');
        }
    }
}