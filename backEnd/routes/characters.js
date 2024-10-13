const Characters = require('../models/characters');
const Contributions = require('../models/contribution');
const User = require('../models/user');
const _ = require('lodash');
const isUserType = require('../config/middleware/isUserType');

const mongoose = require('mongoose');

module.exports = (app) => {
    app.get(
        '/api/characters/:characterId',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const { characterId } = req.params;
            try {
                const character = await Characters.findById(characterId);
                if (!character) {
                    return res
                        .status(404)
                        .json({ message: 'Character not found' });
                }
                res.json(character);
            } catch (error) {
                console.error('Error fetching character details: ', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    );

    // define the api endpoint
    app.post(
        '/api/characters/create',
        isUserType(['user', 'admin']),
        async (req, res) => {
            try {
                const isAdmin = req.user.userType === 'admin' ? true : false;
                const {
                    name,
                    subtitle,
                    description,
                    strength,
                    speed,
                    skill,
                    fear_factor,
                    power,
                    intelligence,
                    wealth,
                } = req.body;

                const id = name.split(' ')[0].toLowerCase();
                const exist = await Characters.findOne({ id });
                if (exist) throw new Error('Character already exist');
                const newCharData = {
                    id,
                    name,
                    subtitle,
                    description,
                    strength,
                    speed,
                    skill,
                    fear_factor,
                    power,
                    intelligence,
                    wealth,
                    active: true,
                };

                if (isAdmin) {
                    await Characters.create(newCharData);

                    await Contributions.create({
                        contribution_id: new mongoose.Types.ObjectId(),
                        user_id: { _id: req.user.id },
                        action: 'AddCharacter',
                        status: 'Approved',
                        date: new Date(),
                        reviewed_by: {
                            _id: req.user.id,
                        },
                        data: newCharData,
                    });
                } else {
                    await Contributions.create({
                        contribution_id: new mongoose.Types.ObjectId(),
                        user_id: { _id: req.user.id },
                        action: 'AddCharacter',
                        status: 'Pending',
                        date: new Date(),
                        reviewed_by: null,
                        data: newCharData,
                    });
                }

                res.json({ msg: 'Success' });
            } catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    );

    // fetch a character by id
    app.get(
        '/api/characters/:characterId',
        isUserType(['user', 'admin']),
        async (req, res) => {
            try {
                const character = await Characters.findById(
                    req.params.characterId
                );
                if (!character) {
                    return res.status(404).send('Character not found');
                }
                res.status(200).send(character);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    );

    // update a character
    app.put(
        '/api/characters/:characterId',
        isUserType(['user', 'admin']),
        async (req, res) => {
            try {
                const isAdmin = req.user.userType === 'admin' ? true : false;
                const character = await Characters.findById(
                    req.params.characterId
                );
                const updateField = {
                    ...req.body,
                    id: character.id,
                };

                const newContId = new mongoose.Types.ObjectId();
                await Contributions.create({
                    contribution_id: newContId.toString(),
                    user_id: { _id: req.user.id },
                    action: 'EditCharacter',
                    status: isAdmin ? 'Approved' : 'Pending',
                    date: new Date(),
                    reviewed_by: isAdmin
                        ? {
                              _id: req.user.id,
                          }
                        : null,
                    data: updateField,
                });

                if (isAdmin) {
                    const requestDetail = await Contributions.findOne({
                        contribution_id: newContId.toString(),
                    });
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
                        { contribution_id: newContId.toString() },
                        {
                            $set: {
                                data: newData,
                            },
                        }
                    );
                }

                res.json({ message: 'Success' });
            } catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        }
    );
};
