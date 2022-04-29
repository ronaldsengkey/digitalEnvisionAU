const mongoUrl1 = `mongodb://${process.env.mongoLocalHost}:${process.env.mongoLocalPort}/${process.env.mongoLocalDb}`;
const mongoUrl2 = `mongodb://[${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}]@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`;

const options = {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    // replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
const devEnv = {url: mongoUrl1,options: options},
        prodEnv = {url: mongoUrl2,options: options};
module.exports = {
    dataConnection:{
        env:devEnv
    }
};