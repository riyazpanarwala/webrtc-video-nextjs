import React, { useMemo } from "react";

const RenderVideo = ({ stream }) => {
  const renderVideo = useMemo(
    () => (
      <video
        autoPlay
        controls={false}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        ref={(cameraElement) => {
          if (cameraElement && stream) {
            cameraElement.srcObject = stream;
          }
        }}
      />
    ),
    [stream]
  );

  return renderVideo;
};

export default RenderVideo;
