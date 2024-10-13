const User = require('../models/user');
const Contributions = require('../models/contribution');
const Characters = require('../models/characters');
const _ = require('lodash');
const isUserType = require('../config/middleware/isUserType');
module.exports = (app) => {
    app.get(
        '/api/allCharacters',
        isUserType(['admin', 'user']),
        async (req, res) => {
            const result = await Characters.find({ active: true });
            res.json(result);
        }
    );

    app.get(
        '/api/pendingCharacters',
        isUserType(['admin']),
        async (req, res) => {
            const returnValue = [];
            const result = await Contributions.find({ status: 'Pending' });
            for (const data of result) {
                if (data.action === 'AddCharacter') {
                    returnValue.push({
                        contributionId: data.contribution_id,
                        action: data.action,
                        date: data.date,
                        data: data.data,
                    });
                } else if (data.action === 'EditCharacter') {
                    const original = await Characters.findOne({
                        id: data.data.id,
                    });
                    returnValue.push({
                        contributionId: data.contribution_id,
                        action: data.action,
                        date: data.date,
                        data: data.data,
                        original,
                    });
                }
            }

            res.json(returnValue);
        }
    );

    app.get(
        '/api/characterHistory',
        isUserType(['admin']),
        async (req, res) => {
            const returnValue = [];
            const result = await Contributions.find({ status: 'Approved' });
            for (const data of result) {
                const contributor = await User.findById(data.user_id);
                let action = '';
                if (data.action === 'AddCharacter') {
                    action = 'Add Characcter';
                } else if (data.action === 'EditCharacter') {
                    action = 'Update Character';
                } else if (data.action === 'DeleteCharacter') {
                    action = 'Delete Character';
                }
                returnValue.push({
                    contributionId: data.contribution_id,
                    action: action,
                    contributor:
                        contributor.firstname + ' ' + contributor.lastname,
                    contributionDate: data.date,
                    data: data.data,
                });
            }

            res.json(returnValue);
        }
    );

    app.post(
        '/api/handleCharacterRequest',
        isUserType(['admin', 'user']),
        async (req, res) => {
            const { contributionId, approved } = req.body;
            const userInfo = req.session.passport.user;
            const requestDetail = await Contributions.findOne({
                contribution_id: contributionId,
            });
            if (approved && req.user.userType !== 'admin') {
                return res
                    .status(400)
                    .json({ message: 'user cannot approve change' });
            }
            if (!approved) {
                await Contributions.updateOne(
                    { contribution_id: contributionId },
                    {
                        $set: {
                            status: 'Rejected',
                            reviewed_by: { _id: req.user.id },
                        },
                    }
                );
            } else {
                if (requestDetail.action === 'AddCharacter') {
                    await Characters.create({
                        ...requestDetail.data,
                        active: 1,
                    });
                    await Contributions.updateOne(
                        { contribution_id: contributionId },
                        {
                            $set: {
                                status: 'Approved',
                                reviewed_by: { _id: req.user.id },
                            },
                        }
                    );
                } else if (requestDetail.action === 'EditCharacter') {
                    const original = await Characters.findOne({
                        id: requestDetail.data.id,
                    });
                    const attributes = Object.keys(requestDetail.data);
                    const newData = { id: requestDetail.data.id };

                    for (const feature of attributes) {
                        if (feature !== 'id')
                            newData[
                                feature
                            ] = `${original[feature]} => ${requestDetail.data[feature]}`;
                    }

                    await Characters.updateOne(
                        { id: requestDetail.data.id },
                        { $set: requestDetail.data }
                    );

                    await Contributions.updateOne(
                        { contribution_id: contributionId },
                        {
                            $set: {
                                status: 'Approved',
                                reviewed_by: { _id: req.user.id },
                                data: newData,
                            },
                        }
                    );
                }
            }
            res.json({});
        }
    );

    app.post(
        '/api/deactivateCharacter',
        isUserType(['admin']),
        async (req, res) => {
            const { characterId } = req.body;
            await Characters.deleteOne({ id: characterId });
            res.status(200);
        }
    );
};
