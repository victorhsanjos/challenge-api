const jwt = require('jsonwebtoken');
const User = require('../../User');

const Authenticate = async (req, res, next) => {
    let token = req.get('authorization');

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Token is not valid'
                });
            } else {
                const user = await User.findOne({ _id: decoded._id, 'token': token });

                if (!user) {
                    res.status(401).json({ message: 'Not authorized to access this resource' });
                }

                req.user = user;

                return next();
            }
        });
    } else {
        return res.status(400).json({
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = Authenticate;