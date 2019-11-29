const { validationResult } = require('express-validator');
const User = require('../../User');

module.exports = {
    async store(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }

        try {
            const { email, password } = req.body;
            const user = await User.findByCredentials(email, password);

            await user.generateAuthToken();

            await user.updateLastLogin();

            return res.json(user);
        } catch (err) {
            return res.status(err.status).json({ error: err.message });
        }
    }
};