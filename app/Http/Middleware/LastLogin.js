const moment = require('moment');

const LastLogin = (req, res, next) => {
    const user = req.user;

    const lastLogin = moment(user.last_login_at);

    const duration = moment.duration(moment().diff(lastLogin));

    let minutes = duration.minutes();

    if (minutes < 30) {
        return next();
    }

    return res.status(401).json({ message: 'Invalid session' });
};

module.exports = LastLogin;