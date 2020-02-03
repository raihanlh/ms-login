const { dbConnector } = require('../connectors');

const dbMiddleware = (app, mongodb, dbConfig) => {
    dbConnector(app, mongodb, dbConfig);
    return async (req, res, next) => {
        const db = app.locals.db;
        res.locals.db = db;
        next();
    };
};

module.exports = dbMiddleware;