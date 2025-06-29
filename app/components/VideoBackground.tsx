import React from "react";

const VideoBackground: React.FC = () => (
  <video
    autoPlay
    loop
    muted
    playsInline
    disablePictureInPicture
    className="fixed top-0 left-0 w-full h-full object-cover  z-0"
    style={{ pointerEvents: "none" }}
  >
    <source src="/background/background.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

export default VideoBackground;
