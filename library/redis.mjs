import { Redis } from "ioredis";

const REDIS_URL = "redis://redis-17176.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:17176"
const REDIS_PASSWORD = "GLIj9nUxmNsLtJyY0vzrDEklncGNcNBk"


const redis = new Redis( REDIS_URL,{
    password: REDIS_PASSWORD,
} ); // Redis connection string

export default redis;