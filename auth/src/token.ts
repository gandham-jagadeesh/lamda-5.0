
export interface Payload{
  id: string,
  username: string ,
  issued_at: number,
  expired_at : number,
}

// in Error why we are passing name : may be later we need to check whaat error instance is this from
export class TokenExpiredError extends Error{
  public name: string;
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class InvalidTokenError extends Error{
  public name: string;
  constructor() {
    super("Token is Invalid");
    this.name  = "InvalidTokenError"
  }
}


export function newPayload(username: string, durationMs: number ): Payload {
  const now = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    username: username,
    id: crypto.randomUUID(),
    issued_at: now,
    expired_at: now + durationMs
  };
  return payload;
 }


  
 export function validatePayload(payload: Payload ) void{
	 const now  = Math.floor( Date.now() / 1000 ); 
	 if( payload.expired_at <=  currentTime ) {
		 throw new InvalidTokenError(); 
	 }
	 return null; 
}


export interface Maker{
  createToken(username: string , durationMs: number ):Promise<string>;
  verifyToken(token: string):Promsie<Payload>; 
}


export class jwtMaker implements Maker{
  private readonly secretKey: Uint8Array;

  constructor(secret: string){
     let key = new TextEncoder(secret);
     if(key.length < 32){
       throw new Error("Secret  must be  at least 32 bytes");
     }
     this.secretKey = key;
  }

  createToken(){}
  verifyToken(){}
}
