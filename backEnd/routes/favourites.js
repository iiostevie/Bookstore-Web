const Favourites = require('../models/favourites');
const Characters = require('../models/characters');
const isUserType = require('../config/middleware/isUserType');

module.exports = (app) => {
    app.get(
        '/api/favourites/check/:characterId',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const { characterId } = req.params;
            const userId = req.user.id;

            try {
                // Check if user already in favourites model
                let favourites = await Favourites.findOne({ user_id: userId });

                // If user does not exist in favourites model
                if (!favourites) {
                    return res.json({ isFavourite: false });
                }

                // User in favourites model
                // Check if character is in user's favourites
                const isInFavourites =
                    favourites.characters.includes(characterId);
                res.json({ isFavourite: isInFavourites });
            } catch (error) {
                console.error(
                    'Error checking if character is in favourites: ',
                    error
                );
                res.status(500).json({ message: 'Internal server error ' });
            }
        }
    );

    app.post(
        '/api/favourites/add',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const { characterId } = req.body;
            const userId = req.user.id;

            try {
                // Check if user in Favourites model
                let favourites = await Favourites.findOne({ user_id: userId });

                if (!favourites) {
                    // if user does not exist in Favourites DB
                    // create a new favorites document with user and new favourite character
                    favourites = new Favourites({
                        user_id: userId,
                        characters: [characterId],
                    });
                } else {
                    // if user exists in Favourites DB
                    if (!favourites.characters.includes(characterId)) {
                        // if character does not exist in user's favourites
                        favourites.characters.push(characterId);
                    } else {
                        // if character exists in user's favourites
                        return res.status(400).json({
                            message: 'Character already exists in favourites',
                        });
                    }
                }

                await favourites.save();
                res.json({
                    message: 'Character added to favourites successfully',
                });
            } catch (error) {
                console.error('Error adding character to favourites: ', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    );

    app.post(
        '/api/favourites/remove',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const { characterId } = req.body;
            const userId = req.user.id;

            try {
                // Check if user in Favourites db
                let favourites = await Favourites.findOne({ user_id: userId });

                if (!favourites) {
                    // User does not exist in favourites db
                    return res
                        .status(404)
                        .json({ message: 'Favourites not found for user' });
                }

                // User exists in favourites model
                // remove character from user's favourites
                favourites.characters = favourites.characters.filter(
                    (char) => char !== characterId
                );

                // Check if the character array is empty
                if (favourites.characters.length === 0) {
                    // remove document from the DB
                    await Favourites.findOneAndDelete({ user_id: userId });
                } else {
                    await favourites.save();
                }

                res.json({
                    message: 'Character removed from favourites successfully',
                });
            } catch (error) {
                console.error(
                    'Error removing character from favourites: ',
                    error
                );
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    );

    app.get(
        '/api/favourites',
        isUserType(['user', 'admin']),
        async (req, res) => {
            const userId = req.user.id;

            try {
                const favourites = await Favourites.findOne({
                    user_id: userId,
                });
                if (!favourites) {
                    // User does not exist in favourites db
                    return res.json({ favourites: [] });
                }
                // User exists in favourites db
                returnLs = [];
                for (const charId of favourites.characters) {
                    if (charId) {
                        const character = await Characters.findOne({
                            id: charId,
                        });
                        returnLs.push({
                            _id: character._id,
                            name: character.name,
                        });
                    }
                }
                return res.json(returnLs);
            } catch (error) {
                console.error('Error fetching user favourites: ', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    );
};
