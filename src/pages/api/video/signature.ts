import { NextApiRequest, NextApiResponse } from 'next';
import { KJUR } from 'jsrsasign';

type GenerateSignatureProps = {
  sessionName: string;
  role: number;
  sessionKey: string;
  userIdentity: string;
};

export const generateSignature = ({
  sessionName,
  role,
  sessionKey,
  userIdentity,
}: GenerateSignatureProps) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: 'HS256', typ: 'JWT' };

  const oPayload = {
    app_key: process.env.ZOOM_VIDEO_SDK_KEY,
    tpc: sessionName,
    role_type: role, // '1': host, '0': attendee
    session_key: sessionKey,
    user_identity: userIdentity,
    version: 1,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_VIDEO_SDK_SECRET);
  return sdkJWT;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionName, role, sessionKey, userIdentity } = req.body;

  const token = generateSignature({
    sessionName,
    role,
    sessionKey,
    userIdentity,
  });

  res.status(200).json({ token });
}
