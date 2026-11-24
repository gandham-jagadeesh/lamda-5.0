
import { google,  type Auth,  } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL, GOOGLE_SECRET } from "../config/env.js";
import { randomBytes } from "node:crypto";
import  redis  from "../config/redis.js";
import { badRequest, serviceNotAvailable } from "../utils/api-error.js";
import { findBookingById_ } from "../repository/booking.repository.js";

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
      await redis.set(`google-access-token-${userid}`, JSON.stringify(response.tokens)); // future cache aside pattern + implement not accces token role
      return response.tokens;
    }
    catch (err) {
      console.error("[Google Token Exchange Error]:", err);
      throw badRequest('Failed to exchange Google authorization code');
    }
}


// a user is booked need to create a google calender event
export async function googleCalenderEvent(userId:number , bookingId:number) {
//now create a google calender api and email
 // set the creds to oauth2 object and pass that to google calender and then attach an event listener such that redis gets constaly updtaed
// get the email and google calender event and then use that and booking id to  get the info and just edit the information
// check whether the access tokens are existed or not , but that needs user-id is it good idea to pass userid when calling when we are doing a booking or not


// get the userid and get the access token and refresh tokens from redis and if not throw invalid oauth and if correctly accessible then  use that to create a google calender event in both the user email and host email calender as well
//and check whether its valid or not all checks are done at booking level whether they are future or not
  try {
    const response  = await redis.get(`google-access-token-${userId}`);
    if (!response) {
      console.log('access tokens , refresh tokens are missing');
      throw Error("redo oauth  tokens are missing");
    }
    const {tokens} = JSON.parse(response);
    const oauthclient = await createOauth2Client();
    oauthclient.setCredentials(tokens);
    const ticket = await oauthclient.verifyIdToken({ idToken: tokens.id_token, audience: GOOGLE_CLIENT_ID });
    const client_email = ticket.getPayload()?.email;
    // get the user primary consented email  and google calender events and get the email updated to both of these events
    const booking = await findBookingById_(bookingId);
    if (!booking || booking.status === "cancelled") {
      throw Error("no booking to create events Might be cancelled or removed");
    }
    const googleCalender =  google.calendar({ version: "v3", auth: oauthclient });


    const eventsResponse = await  googleCalender.events.insert({
      calendarId: "primary",
      sendUpdates: 'all',
      requestBody: {
        summary: `${booking.eventType.title} with ${booking.host.first_name} ${booking.host.last_name} is confirmed`,
        description: [booking.eventType.description,
        booking.inviteeNotes ? `Invitee note: ${booking.inviteeNotes}` : '',
        ].join('\n\n'),
        "start": {
          dateTime: booking.slot.startAt.toISOString(),
          timeZone: booking.host.timezone
        },
        "end": {
          dateTime: booking.slot.startAt.toISOString(),
          timeZone: booking.host.timezone
        },
        attendees: [{ email: booking.host.email, displayName: booking.host.first_name }, { email: booking.inviteeEmail, displayName: booking.inviteeName }],
        conferenceData: {
          createRequest: {
            requestId: booking.id.toString(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            }
          }
        }
      },

      conferenceDataVersion: 1,

    });
    const meetLink = eventsResponse.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? eventsResponse.data.hangoutLink ?? null;
    if (!eventsResponse.data.id || !meetLink) {
      throw new Error("Failed to create Google Calender event");
    }
    return {
      meetLink,
      calenderEventId: eventsResponse.data.id
    }
  }
  catch (err) {
    throw badRequest("not able to proceed calender events");
  }


}
