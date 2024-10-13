const User = require('../models/user');
const Adminlist = require('../models/adminlist');
const isUserType = require('../config/middleware/isUserType');
module.exports = (app) => {
    app.get('/api/allUsers', isUserType(['admin']), async (req, res) => {
        let result = await User.find({});
        let adminList = await Adminlist.find({});
        adminList = adminList.map((data) => data._id.toString());
        result = result.map((user) => {
            let userType = 'user';
            if (adminList.includes(user._id.toString())) {
                userType = 'admin';
            }
            return {
                id: user._id.toString(),
                name: user.firstname + ' ' + user.lastname,
                email: user.email,
                userType: userType,
            };
        });
        res.json(result);
    });

    app.post('/api/demoteUser', isUserType(['admin']), async (req, res) => {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'Missing Fields' });
        }
        if (userId === req.user.id)
            return res.status(400).json({ message: 'Cannot Demote Yourself' });
        const target = await User.findById(userId);
        if (!target)
            return res.status(400).json({ message: 'Cannot find target user' });

        await Adminlist.deleteOne({ _id: target._id });
        res.json({});
    });

    app.post('/api/promoteUser', isUserType(['admin']), async (req, res) => {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'Missing Fields' });
        }
        const target = await User.findById(userId);
        if (!target)
            return res.status(400).json({ message: 'Cannot find target user' });

        await Adminlist.create({ _id: target._id });
        res.json({});
    });
};
