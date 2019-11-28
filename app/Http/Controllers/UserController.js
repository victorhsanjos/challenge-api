module.exports = {
    async show(req, res) {
        return res.json(req.user);
    }
};