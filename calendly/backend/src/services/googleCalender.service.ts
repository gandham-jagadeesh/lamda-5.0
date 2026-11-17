
import { google,  type Auth,  } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL, GOOGLE_SECRET } from "../config/env.js";
import { randomBytes } from "node:crypto";
import  redis  from "../config/redis.js";
import { serviceNotAvailable } from "../utils/api-error.js";

export const SCOPES: string[] = [
  "email",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",

]

export async function createOauth2Client() {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URL);
  return oauth2Client;
}

export async function createAuthURL(userid:number, oauth2client: Auth.OAuth2Client) {
  const state = randomBytes(32).toString("base64url");
  const redisKey = `google-state-auth-${state}`;
  try {
    // now tries to store redis in state if its fails redis ont able connect then throw 503 service not unavalble
    const result = await redis.set(redisKey, JSON.stringify({ id: userid }), { expiration: { type: 'EX', value: 300 },condition: 'NX'})
    if (result !== "OK") {
      throw Error('not able to initailize oauth'); //sad fellow not able to even login into my shittly backend :)
    }
    const url = oauth2client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state,
      include_granted_scopes: true,
    });
    // now after creating url and tries to store the cred's
    return url;
  }
  catch (error:any) {
    console.log('[google oauth failure] : ');
    throw serviceNotAvailable("Unable to initiate Google OAuth");
  }

}

  // check whether the state is matching or not - store that in redis whats the ttl  time then we are navigating if its existed then we can pass it as valid otherwise if not then what gonna happen




export async function getAuthToken(code: string,state:string,error?:string) {
// check whether state already existed if existed then create token and store it in redis and if possible store in postgres some kind of persisten and try failure modes
// if it throws error invlaid grant send user bro you are already registeered and check token and refresh toke already existed or not
// and let aouth2client atttach on referesh token handling and redis matching

}
