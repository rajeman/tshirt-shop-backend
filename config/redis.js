import redis from 'redis';
import { promisify } from 'util';

const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);
const getAsync = promisify(client.get).bind(client);

export default { client, getAsync };
