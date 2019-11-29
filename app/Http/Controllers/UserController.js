const User = require('../../User');

module.exports = {
    async show(req, res) {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json(user);
        } catch (err) {
            return res.status(404).json({ message: 'User not found' });
        }
    }
};