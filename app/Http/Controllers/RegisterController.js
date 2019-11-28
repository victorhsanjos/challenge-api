const { validationResult } = require('express-validator');
const User = require('../../User');

module.exports = {
    async store(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }

        try {
            const user = new User(req.body);

            await user.save();

            await user.generateAuthToken();
            await user.findGeolocation();
            
            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json(err);
        }
    }
};