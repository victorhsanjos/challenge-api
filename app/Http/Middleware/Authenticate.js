const jwt = require('jsonwebtoken');
const User = require('../../User');

const Authenticate = async (req, res, next) => {
    const auth = req.get('authorization');

    if (!auth) {
        return res.status(401).json({ message: 'Authorization Required' });
    }

    const token = auth.replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);

    try {
        const user = await User.findOne({ _id: data._id, 'token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this resource' });
    }
};

module.exports = Authenticate;