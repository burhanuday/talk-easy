import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { agoraPublicKeys } from "constants/agora";

/**
 * Generate token to be used by Agora
 */
export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { channelName, uid } = req.body;

      console.log("channelName", channelName, uid);

      const role = RtcRole.PUBLISHER;

      // token expiry time
      const expirationTimeInSeconds = 7200;

      const currentTimestamp = Math.floor(Date.now() / 1000);

      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

      // Build token with uid
      const token = RtcTokenBuilder.buildTokenWithUid(
        agoraPublicKeys.appId,
        agoraPublicKeys.appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs,
      );

      res.status(200).json({ token });
    } catch (error) {
      console.log("[api]", "generate-token", error.message);
    }
  } else {
    res.status(405).json({
      error: "Method not allowed",
    });
  }
}
