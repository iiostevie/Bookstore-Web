module.exports = (types) => {
    return (req, res, next) => {
        // let anyone through if types is empty
        if (types.length === 0) {
            return next();
        }
        if (req.user?.userType && types.includes(req.user.userType)) {
            return next();
        } else {
            res.status(401).json({ msg: 'unauthorized!' });
            if (req.user || req.method !== 'GET') {
                logApiError('Unauthorized', req);
            }
        }
    };
};
