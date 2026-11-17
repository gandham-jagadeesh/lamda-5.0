import { createClient } from "redis";
import { serviceNotAvailable } from "../utils/api-error.js"

let  redis  = createClient();

redis.on('error', (err) => {
  console.log('[redis] error');
  throw serviceNotAvailable(err.message);
  console.warn('[redis] error',err);
});

redis.on('reconnecting', () => {
  console.log('[redis] reconnecting');
});

redis.on('ready', () => {
  console.log('[redis] ready to Handle traffic');
})

redis.on('connect', () => {
  console.log('[redis] connected');
});

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
    return redis;
  }
  catch(error:any){
     console.warn('[redis error] :',error);
     throw serviceNotAvailable(error.message);
  }
}

export default redis ;
