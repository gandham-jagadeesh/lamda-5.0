
import { google,  type Auth,  } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL, GOOGLE_SECRET } from "../config/env.js";
import { randomBytes } from "node:crypto";
import  redis  from "../config/redis.js";
import { badRequest, serviceNotAvailable } from "../utils/api-error.js";

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




export async function getAuthToken(userid: number, code: string, state: string, error?: string) {
  if (error) {
    throw badRequest("oauth cancelled or invalid");
  }
  const rediskey = `google-state-auth-${state}`;
  const result = await redis.getDel(rediskey);
    if (!result) { // might be expired or user opening auth url twice double click or refresh may be
      throw badRequest('google oauth expired or already verified');
    }
    const oauth2loggedInUser = JSON.parse(result);
    if (oauth2loggedInUser.id !== userid) {
      throw badRequest("invalid oauth state");
    }
    try {
      const oauth2client = await createOauth2Client()
      const response = await oauth2client.getToken(code);
      await redis.set(`google-access-token-${userid}`, JSON.stringify(response.tokens)); // future cache aside pattern
      return response.tokens;
    }
    catch (err) {
      console.error("[Google Token Exchange Error]:", err);
      throw badRequest('Failed to exchange Google authorization code');
    }
}


export async function googleCalenderEvent(userid: number) {
  // get the email and google calender event and then use that and booking id to  get the info and just edit the information
}
