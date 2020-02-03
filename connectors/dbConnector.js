const connectionDb = async (mongodb, dbConfig) => {
    const { MongoClient } = mongodb;
    const client = await MongoClient.connect(dbConfig.uri, { useNewUrlParser: true });
    console.log('connected to db');

    return client.db(dbConfig.db);
}

const dbConnector = async (app, mongodb, dbConfig) => {
    app.locals.db = await connectionDb(mongodb, dbConfig)
}

module.exports = dbConnector;