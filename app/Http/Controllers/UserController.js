module.exports = {
    show(req, res) {
        return res.json(req.user);
    }
};