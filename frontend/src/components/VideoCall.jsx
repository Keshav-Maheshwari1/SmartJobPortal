import { useEffect, useState } from "react";
import { Room, Track } from "livekit-client";
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import MyVideoConference from "./MyVideoConference";

const VideoCall = ({ token, serverUrl }) => {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  useEffect(() => {
    const connect = async () => {
      try {
        if (!serverUrl || !token) {
          console.error("Missing serverUrl or token");
          return;
        }

        await room.connect(serverUrl, token);
        console.log("Connected to the room successfully!");
      } catch (error) {
        console.error("Error connecting to the room:", error);
      }
    };

    connect();

    // ✅ Listen for disconnect and reload the page
    const handleDisconnected = () => {
      console.log("Room disconnected. Reloading page...");
      window.location.reload();
    };

    room.on("disconnected", handleDisconnected);

    return () => {
      room.off("disconnected", handleDisconnected);
      if (room && room.connected) {
        room.disconnect();
      }
    };
  }, [room, serverUrl, token]);

  return (
    <RoomContext.Provider value={room}>
      <div data-lk-theme="default" style={{ height: "100vh" }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar onLeave={() => room.disconnect()} />
      </div>
    </RoomContext.Provider>
  );
};

export default VideoCall;
