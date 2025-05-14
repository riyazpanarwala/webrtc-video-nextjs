import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Box, Drawer, Typography, styled } from "@mui/material";
import { PersonOutlineOutlined } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

import BottomMenu from "./BottomMenu/BottomMenu";
import ChatBox from "./ChatBox/ChatBox";
import SideMenu from "./SideMenu/SideMenu";
import RenderVideo from "./renderVideo";
import Clock from "./Clock/index";
import { useSocket, SocketProvider } from "./socketProvider";

//import './virtualMeet.scss'

const drawerWidth = 315;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: 0,
    },
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

let connections = [];
let sharingOpen = false;
let screenStream = null;

function VirtualMeet({
  myname,
  roomName,
  callEnded,
  visitNotesEnabled,
  startWithAudioMuted,
  startWithVideoMuted,
  apiEventNotify,
  buttonsWithNotifyClick = [],
  recordingEnabled,
}) {
  const [open, setOpen] = useState(true);
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: 1 });
  // Screen sharing =>  Some issue in this so commented out and added global
  // const [sharingOpen, setSharingOpen] = useState(false)
  // const [screenStream, setScreenStream] = useState(null)

  // Screen recording
  const [recording, setRecording] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Mic and Camera
  const [cameraPermission, setCameraPermission] = useState(false);
  // const [showPermissionError, setShowPermissionError] = useState(false);
  const [localStream, setlocalStream] = useState(null);

  const [miniCamera, setMiniCamera] = useState(false);

  const [chat, setChat] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [localMicOn, setlocalMicOn] = useState(!startWithAudioMuted);
  const [localWebcamOn, setlocalWebcamOn] = useState(!startWithVideoMuted);
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  const peerConnectionConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
    iceTransportPolicy: "all", // Try both relay and non-relay candidates
    bundlePolicy: "max-bundle", // Reduces negotiation
    rtcpMuxPolicy: "require", // Reduces ports needed
    iceCandidatePoolSize: 0, // 0 means let browser decide
  };

  //Small menus
  const [smallMenus, setSmallMenus] = useState(false);
  const handleSmallMenus = () => {
    setSmallMenus(!smallMenus);
  };

  const handleChatDrawer = useCallback(() => {
    setChat((prevState) => !prevState);
  }, []);

  const gotRemoteStream = (stream, id, name) => {
    setRemoteStreams((prevState) => {
      let arrIndex = prevState.findIndex((v) => v.id === id);
      if (arrIndex === -1) {
        return [...prevState, { id: id, stream: stream, name }];
      }
      return [...prevState];
    });

    if (sharingOpen) {
      setTimeout(() => {
        replaceStreams(connections[id], screenStream);
      }, 1000); // dont remove this timeout
    }
  };

  const setRemoteStreamsObject = (id, name, obj, username) => {
    setRemoteStreams((prevState) => {
      let arrIndex = prevState.findIndex((v) => v.id === id);
      if (arrIndex !== -1) {
        prevState[arrIndex] = {
          ...prevState[arrIndex],
          [name]: obj[name],
        };
        if (username) {
          prevState[arrIndex].name = username;
        }
      }
      return [...prevState];
    });
  };

  const sendPostMessageToParent = (msgObj) => {
    /*
    // For iframe
    if (window.parent) {
      window.parent.postMessage(msgObj, '*')
    }
    */
    apiEventNotify(msgObj);
  };

  const gotMessageFromServer = (fromId, message) => {
    //Parse the incoming signal
    var signal = JSON.parse(message);

    //Make sure it's not coming from yourself
    if (fromId != socket.id) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type == "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const handleOnSocketConnect = () => {
    sendPostMessageToParent({ eventType: "userconnect" });
    console.log("connected");
  };

  const handleBrodCastMessage = (id, message, username) => {
    if (Object.prototype.hasOwnProperty.call(message, "isMuted")) {
      setRemoteStreamsObject(id, "isMuted", message, username);
    } else if (Object.prototype.hasOwnProperty.call(message, "isVideoMuted")) {
      setRemoteStreamsObject(id, "isVideoMuted", message, username);
    } else if (Object.prototype.hasOwnProperty.call(message, "isScreenShare")) {
      setRemoteStreamsObject(id, "isScreenShare", message, username);
    }
  };

  const handleChatMessage = (message, id) => {
    const isLeft = socket.id === id;
    setMessages((prevState) => [...prevState, { isLeft, ...message }]);
  };

  const handleUserLeft = (id, username) => {
    let streamsArr = remoteStreams.filter((v) => v.id !== id);
    setRemoteStreams(streamsArr);
    toast.success(`${username} left the meeting`);
    setSelectedUser({ id: 1, name: "Me" });
  };

  const handleUserJoin = (id, clients, username) => {
    if (id !== socket.id) {
      toast.success(`${username} joined the meeting`);
    }

    if (clients.length > 1) {
      setTimeout(() => {
        socket.emit("message", { isMuted: !localMicOn });
        socket.emit("message", { isVideoMuted: !localWebcamOn });
      }, 1000);
    }

    clients.forEach((socketListId) => {
      if (!connections[socketListId]) {
        connections[socketListId] = new RTCPeerConnection(peerConnectionConfig);

        //Wait for their ice candidate
        connections[socketListId].onicecandidate = (event) => {
          if (event.candidate != null) {
            console.log("SENDING ICE");
            socket.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        connections[socketListId].ontrack = (ev) => {
          gotRemoteStream(ev.streams[0], socketListId, username);
        };

        localStream.getTracks().forEach((track) => {
          connections[socketListId].addTrack(track, localStream);
        });
      }
    });

    //Create an offer to connect with your local description

    if (clients.length >= 2) {
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
  };

  useEffect(() => {
    if (localStream && socket) {
      socket.emit("join-room", roomName, myname);

      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      socket.on("signal", gotMessageFromServer);
      socket.on("connect", handleOnSocketConnect);
      socket.on("user-joined", handleUserJoin);
      socket.on("user-left", handleUserLeft);
      socket.on("endCallForAll", endCall);
      socket.on("createMessage", handleChatMessage);
      socket.on("broadcast-message", handleBrodCastMessage);

      return () => {
        socket.off("connect", handleOnSocketConnect);
        socket.off("signal", gotMessageFromServer);
        socket.off("user-joined", handleUserJoin);
        socket.off("user-left", handleUserLeft);
        socket.off("endCallForAll", endCall);
        socket.off("createMessage", handleChatMessage);
        socket.off("broadcast-message", handleBrodCastMessage);
      };
    }
  }, [socket, localStream]);

  const toggleMediaStream = (type, state, stream) => {
    stream.getTracks().forEach((track) => {
      if (track.kind === type) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = !state;
      }
    });
  };

  const toggleMic = () => {
    socket.emit("message", { isMuted: localMicOn });
    toggleMediaStream("audio", localMicOn, localStream);
    setlocalMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    socket.emit("message", { isVideoMuted: localWebcamOn });
    toggleMediaStream("video", localWebcamOn, localStream);
    setlocalWebcamOn((prev) => !prev);
  };

  const endCall = () => {
    socket.disconnect();
    connections = [];
    setMessages([]);
    setRemoteStreams([]);
    setlocalStream(null);
    if (callEnded) {
      callEnded();
    }
    sendPostMessageToParent({ eventType: "endCall" });
  };

  const endCallForAll = () => {
    sendPostMessageToParent({ eventType: "endCallForAll" });
    socket.emit("endCallForAll", "");
    endCall();
  };

  const visitNotesClick = () => {
    sendPostMessageToParent({ eventType: "visitNotes" });
  };

  const inviteUserClick = () => {
    sendPostMessageToParent({ eventType: "invite" });
  };

  const replaceStreams = (peerObj, streamData) => {
    let videoTrack = streamData.getVideoTracks()[0];
    peerObj?.getSenders().map((sender) => {
      if (sender.track.kind == videoTrack.kind) {
        sender.replaceTrack(videoTrack);
      }
    });
  };

  const initStream = (stream) => {
    try {
      // Add this to stabilize the video track
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.contentHint = "motion"; // Helps with motion content
        videoTrack.applyConstraints({
          advanced: [{ frameRate: 24 }],
        });
      }

      if (startWithAudioMuted) {
        toggleMediaStream("audio", startWithAudioMuted, stream);
        setlocalMicOn(false);
      }

      if (startWithVideoMuted) {
        toggleMediaStream("video", startWithVideoMuted, stream);
        setlocalWebcamOn(false);
      }
    } catch (error) {
      console.error("Error initializing stream:", error);
    }
  };

  useEffect(() => {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 24, max: 30 }, // Limit frame rate to reduce flicker
        facingMode: "user",
        resizeMode: "crop-and-scale", // Add this for better handling
      },
      audio: {
        autoGainControl: false, // Disable AGC to prevent brightness fluctuations
        echoCancellation: true,
        noiseSuppression: true,
      },
    };

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          initStream(stream);
          setlocalStream(stream);
          setCameraPermission(true);

          /*
          const audioTracks = stream.getAudioTracks()[0]
          const videoTracks = stream.getVideoTracks()[0]

          console.log(videoTracks.getSettings())
          console.log(audioTracks.getSettings())
          */
        })
        .then(() => {
          // success
        })
        .catch((error) => {
          console.log("Error permission to get mic and camera", error);
        });
    } else {
      alert("Your browser does not support getUserMedia API");
    }
  }, []);

  const sendMessage = (msg) => {
    socket.emit("messagesend", { name: myname, content: msg });
  };

  const handleScreenShareStream = (stream) => {
    let videoTrack = stream.getVideoTracks()[0];

    // Add content hint for better screen sharing quality
    if (videoTrack) {
      videoTrack.contentHint = "detail"; // 'detail' is better for screen sharing
    }

    videoTrack.onended = () => {
      handleStopSharing();
    };

    // Add a small delay before replacing streams
    setTimeout(() => {
      Object.keys(connections).forEach((item) => {
        try {
          replaceStreams(connections[item], stream);
        } catch (error) {
          console.error("Error replacing stream:", error);
        }
      });
    }, 300);

    // setScreenStream(stream)
    // setSharingOpen(true)
    screenStream = stream;
    sharingOpen = true;
    socket.emit("message", { isScreenShare: true });
  };

  const handleScreenShare = () => {
    if (sharingOpen) {
      handleStopSharing();
    }
    const options = {
      audio: true,
      video: { displaySurface: "monitor" },
    };
    navigator.mediaDevices
      .getDisplayMedia(options)
      .then(handleScreenShareStream);
  };

  const handleStopSharing = () => {
    if (!sharingOpen) return;

    Object.keys(connections).forEach((item) => {
      replaceStreams(connections[item], localStream);
    });

    screenStream?.getTracks().forEach((track) => {
      track.stop();
    });

    // setScreenStream(null)
    // setSharingOpen(false)
    screenStream = null;
    sharingOpen = false;
    socket.emit("message", { isScreenShare: false });
  };

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        downloadRecording();
        setRecording(false);
        setMediaStream(null);
        setMediaRecorder(null);
        setRecordedChunks([]);
      };
    }
  }, [mediaRecorder]);

  const handleShowUser = useCallback(() => {
    setShowUser((prevState) => !prevState);
  }, []);

  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
    setShowUser(false);
  }, []);

  const generateRandomColor = useCallback((str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = Math.floor(
      Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216)
    ).toString(16);
    return "#" + "000000".substring(0, 6 - color.length) + color;
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setRecording(true);
      setShowStartDialog(false);
    } catch (error) {
      console.error("Error accessing screen:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaStream) {
      mediaRecorder.stop();
      mediaStream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      setShowStopDialog(false);
      downloadRecording();
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "screen-recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRecordClick = () => {
    console.log("clicked");
    if (recording) {
      setShowStopDialog(true);
    } else {
      setShowStartDialog(true);
    }
  };

  const handleMiniCamera = () => {
    if (!cameraPermission) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setlocalStream(stream);
          setCameraPermission(true);
          setMiniCamera(true);
        })
        .catch((err) => {
          console.log("Error permission to get camera", err);
        });
    } else {
      if (miniCamera) {
        // Turn off camera
        const tracks = localStream.getTracks();
        tracks.forEach((track) => track.stop());
        setMiniCamera(false);
      } else {
        // Turn on camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            setlocalStream(stream);
            setMiniCamera(true);
          })
          .catch((err) => {
            // setShowPermissionError(true);
            console.log("Error to turn on camera", err);
          });
      }
    }
  };
  /*
  const handleMic = () => {
    if (!micPermission) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => setMicPermission(true))
        .catch(err => {
          console.log('Error permission to get mic', err)
        })
    } else {
      setMicPermission(false)
    }
  }

  const handleCamera = () => {
    if (!cameraPermission) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          setlocalStream(stream)
          setCameraPermission(true)
          setlocalWebcamOn(true)
        })
        .catch(err => {
          // setShowPermissionError(true);
          console.log('Error permission to get camera', err)
        })
    } else {
      if (cameraOn) {
        // Turn off camera
        const tracks = localStream.getTracks()
        tracks.forEach(track => track.stop())
        setlocalWebcamOn(false)
      } else {
        // Turn on camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => {
            setlocalStream(stream)
            setlocalWebcamOn(true)
          })
          .catch(err => {
            // setShowPermissionError(true);
            console.log('Error to turn on camera', err)
          })
      }
    }
  }
  */

  const isSelectedStreamVideoMuted = () => {
    const arr = remoteStreams.filter((v) => v.id === selectedUser.id);
    return arr.length ? !arr[0].isVideoMuted : true;
  };

  let userObj = [
    {
      id: 1,
      name: "Me",
      isMuted: !localMicOn,
      isVideoMuted: !localWebcamOn,
      stream: localStream,
    },
  ];
  if (showUser && screenStream && sharingOpen) {
    userObj = [
      ...userObj,
      {
        id: 2,
        name: "",
        isMuted: !localMicOn,
        isVideoMuted: !localWebcamOn,
        stream: screenStream,
      },
    ];
  }

  return (
    <Box
      sx={{ display: { xs: "block", sm: "block", md: "block", lg: "flex" } }}
    >
      <Drawer
        sx={{
          width: {
            xs: "100%",
            sm: drawerWidth,
            md: drawerWidth,
            lg: drawerWidth,
          },
          background: "#474747",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: {
              xs: "100%",
              sm: drawerWidth,
              md: drawerWidth,
              lg: drawerWidth,
            },
            background: "#131519",
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={chat}
      >
        <ChatBox
          handleDrawerOpen={handleChatDrawer}
          selectedUser={selectedUser}
          generateColor={generateRandomColor}
          messages={messages}
          sendMessage={sendMessage}
        />
      </Drawer>
      <Main open={chat}>
        <Box className="chat-container">
          <Box sx={{ width: "100%", height: "100%", zIndex: 1 }}>
            <Box className="user-timer">
              <p>{roomName}</p>
              <Clock />
            </Box>
            {showUser ? (
              ""
            ) : screenStream && sharingOpen ? (
              <Box className="screen-share">
                <RenderVideo stream={screenStream} />
              </Box>
            ) : selectedUser.id === 1 && localStream && localWebcamOn ? (
              <Box className="camera-share">
                <RenderVideo stream={localStream} />
              </Box>
            ) : selectedUser.id !== 1 && isSelectedStreamVideoMuted() ? (
              <Box className="camera-share">
                <RenderVideo stream={selectedUser.stream} />
              </Box>
            ) : (
              <Box className="chat-content">
                <Box />
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    bgcolor: selectedUser.name
                      ? generateRandomColor(selectedUser.name)
                      : "none",
                  }}
                >
                  {selectedUser.name ? (
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: "100px",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </Typography>
                  ) : (
                    <PersonOutlineOutlined
                      sx={{ fontSize: "120px", color: "#fff" }}
                    />
                  )}
                </Avatar>
                <Box className="user-details">
                  <Typography variant="h6" sx={{ fontSize: "16px" }}>
                    {selectedUser.name ? selectedUser.name : "Name (N/A)"}
                  </Typography>
                </Box>
              </Box>
            )}
            <SideMenu
              open={open}
              chat={chat}
              setOpen={setOpen}
              showUser={showUser}
              userData={userObj}
              handleUserClick={handleUserClick}
              generateColor={generateRandomColor}
              selectedUser={selectedUser}
              remoteStreams={remoteStreams}
              inviteUserClick={inviteUserClick}
              buttonsWithNotifyClick={buttonsWithNotifyClick}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "80px",
              backgroundColor: "#878787",
              zIndex: 2,
            }}
          >
            <BottomMenu
              handleShowUser={handleShowUser}
              showUser={showUser}
              sharingOpen={sharingOpen}
              handleScreenShare={handleScreenShare}
              handleStopSharing={handleStopSharing}
              recording={recording}
              recordClick={handleRecordClick}
              showStartDialog={showStartDialog}
              showStopDialog={showStopDialog}
              setShowStartDialog={setShowStartDialog}
              setShowStopDialog={setShowStopDialog}
              startRecording={startRecording}
              stopRecording={stopRecording}
              handleCamera={toggleCamera}
              handleMic={toggleMic}
              micPermission={localMicOn}
              cameraOn={localWebcamOn}
              selectedUser={selectedUser}
              chat={chat}
              handleDrawerClose={handleChatDrawer}
              miniCamera={miniCamera}
              cameraStream={localStream}
              handleMiniCamera={handleMiniCamera}
              smallMenus={smallMenus}
              handleSmallMenus={handleSmallMenus}
              endCall={endCall}
              endCallForAll={endCallForAll}
              isVisitNotesEnabled={visitNotesEnabled}
              visitNotesClick={visitNotesClick}
              recordingEnabled={recordingEnabled}
            />
          </Box>
        </Box>
      </Main>
    </Box>
  );
}

const App = (props) => {
  return (
    <SocketProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            background: "#fff",
            color: "#000",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
          },
          duration: 3000,
          success: { style: { background: "#4caf50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />
      <VirtualMeet {...props} />
    </SocketProvider>
  );
};

export default App;
