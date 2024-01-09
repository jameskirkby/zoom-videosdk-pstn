import ZoomVideo, { VideoClient, Stream } from "@zoom/videosdk";
import { useEffect } from "react";

let client: typeof VideoClient;
let stream: typeof Stream;

const sessionInfo = {
  sessionName: "pstn-session",
  role: 1,
  sessionKey: "pstn-key",
  userIdentity: "pstn-user",
};

export const ZoomSession = () => {
  useEffect(() => {
    (async () => {
      const jwt = await fetch("/api/video/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionInfo),
      })
        .then((res) => res.json())
        .then((data) => data.token);

      client = ZoomVideo.createClient();
      await client.init("en-GB", "Global", { patchJsMedia: true });
      await client.join(
        sessionInfo.sessionName,
        jwt,
        sessionInfo.userIdentity,
        "",
        1
      );

      stream = client.getMediaStream();

      /** Should show more than 1 user on the call, and 1 of the users is the host */
      console.log(client.getAllUser());
      /** Should show the dial-in details */
      console.log(stream.getCurrentSessionCallinInfo());
    })();
  }, []);

  return <div>test</div>;
};
