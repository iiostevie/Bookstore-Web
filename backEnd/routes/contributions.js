const Contributions = require('../models/contribution');
const isUserType = require('../config/middleware/isUserType');

module.exports = (app) => {
    app.get(
        '/api/contributions',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const userId = req.user.id;

            try {
                const contributions = await Contributions.find({
                    user_id: userId,
                });
                if (!contributions) {
                    // User does not exist in contributions db
                    return res.json({ contributions: [] });
                }
                const returnLs = [];
                for (const contribution of contributions) {
                    const action =
                        contribution.action === 'AddCharacter'
                            ? 'Add Character'
                            : 'Update Character';
                    const contributionId = contribution.contribution_id;
                    returnLs.push({
                        action,
                        status: contribution.status,
                        date: contribution.date,
                        id: contributionId,
                        _id: contribution._id,
                        reviewed_by: contribution.reviewed_by,
                        data: contribution.data
                            ? objectToList(contribution.data)
                            : null,
                    });
                }
                // User exists in contributions db
                // return all contributions associated with user
                return res.json(returnLs);
            } catch (error) {
                console.error('Error fetching user contributions: ', error),
                    res.status(500).json({ message: 'Internal server error' });
            }
        }
    );
    app.delete(
        '/api/contribution/:contributionId',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const { contributionId } = req.params;
            const target = await Contributions.findOne({
                contribution_id: contributionId,
            });
            if (target.user_id._id.toString() !== req.user.id) {
                return res
                    .status(400)
                    .json({ message: "YOU CAN'T REVOKE OTHER'S WORK!!!" });
            }
            await Contributions.deleteOne({ contribution_id: contributionId });
            res.json({});
        }
    );
};
const objectToList = (obj) => {
    console.log(obj);
    val = [];
    for (const [key, value] of Object.entries(obj)) {
        val.push(`${key}: ${value}`);
    }
    return val;
};
