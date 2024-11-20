import React, { useState, useCallback } from "react";
import { Box, Button, ClickAwayListener, Grid } from "@mui/material";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CallEndDialog from "../Modals/CallEndDialog";
import RecordDialog from "../Modals/RecordDailogue";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import {
  CallEndOutlined,
  GridViewOutlined,
  MicNoneOutlined,
  StopScreenShareOutlined,
} from "@mui/icons-material";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import MicSettings from "../Settings/MicSettings";
import CameraSettings from "../Settings/CameraSettings";
import SmallMenus from "./SmallMenus";

const isUpArrowIconsNeeded = false;

function Menus(props) {
  const {
    handleDrawerClose,
    chat,
    handleShowUser,
    showUser,
    sharingOpen,
    handleStopSharing,
    handleScreenShare,
    recording,
    recordClick,
    startRecording,
    stopRecording,
    showStartDialog,
    showStopDialog,
    setShowStartDialog,
    setShowStopDialog,
    handleMic,
    handleCamera,
    micPermission,
    cameraOn,
    miniCamera,
    handleMiniCamera,
    cameraStream,
    smallMenus,
    handleSmallMenus,
    endCall,
    endCallForAll,
    isVisitNotesEnabled,
    visitNotesClick,
    recordingEnabled,
  } = props;

  const ToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      color: theme.palette.common.black,
      fontSize: "12px",
      padding: "10px",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      fontSize: "13px",
      padding: "10px",
    },
  }));

  const [callEnd, setCallEnd] = useState(false);
  const [micList, setMicList] = useState(1);
  const [speakerList, setSpeakerList] = useState(1);
  const [audioSettingOpen, setAudioSettingOpen] = useState(false);
  const [leaveMeeting, setLeaveMeeting] = useState(false);

  const handleMicList = useCallback((data) => {
    setMicList(data);
  }, []);

  const handleSpeakerList = useCallback((data) => {
    setSpeakerList(data);
  }, []);

  const handleAudioSetting = useCallback(() => {
    setAudioSettingOpen((prev) => !prev);
  }, []);

  const handleMeetingClick = useCallback(() => {
    setLeaveMeeting(true);
  }, []);

  const handleMeetingClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setLeaveMeeting(false);
  }, []);

  return (
    <>
      <Grid container sx={{ height: "100%" }}>
        <Grid item lg={3} md={3} sm={0} xs={0}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12} className="chatMenu-box">
          <Box
            className="chatMenu-icon"
            position={"relative"}
            sx={{
              bgcolor: micPermission
                ? "#666666"
                : {
                    xs: "#4a4a4a",
                    sm: "#666666",
                    md: "#666666",
                    lg: "#666666",
                  },
            }}
          >
            <Box className="chat-micIcon" onClick={handleMic}>
              {!micPermission ? (
                <ToolTip
                  title="Unmute"
                  PopperProps={{ style: { background: "#000000" } }}
                >
                  <MicOffOutlinedIcon className="IconList" />
                </ToolTip>
              ) : (
                <ToolTip title="Mute">
                  <MicNoneOutlined className="IconList" />
                </ToolTip>
              )}
            </Box>
            {isUpArrowIconsNeeded ? (
              <Box
                className="upArrow-icon"
                position={"absolute"}
                onClick={handleAudioSetting}
                sx={{
                  display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                }}
              >
                <ToolTip title="Audio settings">
                  <KeyboardArrowUpOutlinedIcon sx={{ color: "gray" }} />
                </ToolTip>
              </Box>
            ) : (
              ""
            )}
            {audioSettingOpen ? (
              <ClickAwayListener onClickAway={handleAudioSetting}>
                <Box className="micSetting" position={"absolute"}>
                  <MicSettings
                    micList={micList}
                    speakerList={speakerList}
                    handleMicList={handleMicList}
                    handleSpeakerList={handleSpeakerList}
                  />
                </Box>
              </ClickAwayListener>
            ) : (
              <></>
            )}
          </Box>
          <Box
            className="chatMenu-icon"
            position={"relative"}
            sx={{
              bgcolor: cameraOn
                ? "#666666"
                : {
                    xs: "#4a4a4a",
                    sm: "#666666",
                    md: "#666666",
                    lg: "#666666",
                  },
            }}
          >
            <Box className="chat-cameraIcon" onClick={handleCamera}>
              {!cameraOn ? (
                <ToolTip title="Start Camera">
                  <VideocamOffOutlinedIcon className="IconList" />
                </ToolTip>
              ) : (
                <ToolTip title="Stop camera">
                  <VideocamOutlinedIcon className="IconList" />
                </ToolTip>
              )}
            </Box>
            {isUpArrowIconsNeeded ? (
              <Box
                className="upArrow-icon"
                position={"absolute"}
                onClick={handleMiniCamera}
                sx={{
                  display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                }}
              >
                <ToolTip title="Camera settings">
                  <KeyboardArrowUpOutlinedIcon sx={{ color: "gray" }} />
                </ToolTip>
              </Box>
            ) : (
              ""
            )}

            {cameraStream && miniCamera ? (
              <CameraSettings
                cameraStream={cameraStream}
                handleMiniCamera={handleMiniCamera}
              />
            ) : (
              <></>
            )}
          </Box>
          {!sharingOpen ? (
            <Box
              className="chatMenu-icon"
              onClick={handleScreenShare}
              sx={{
                display: {
                  lg: "flex !important",
                  xl: "flex !important",
                  md: "flex !important",
                  sm: "none !important",
                  xs: "none !important",
                },
                bgcolor: "#666666",
              }}
            >
              <ToolTip title="Start screen sharing">
                <ScreenShareOutlinedIcon className="IconList" />
              </ToolTip>
            </Box>
          ) : (
            <Box
              className="chatMenu-icon"
              onClick={handleStopSharing}
              sx={{
                display: {
                  lg: "flex !important",
                  xl: "flex !important",
                  md: "flex !important",
                  sm: "none !important",
                  xs: "none !important",
                },
                bgcolor: "#666666",
              }}
            >
              <ToolTip title="Stop screen sharing">
                <StopScreenShareOutlined className="IconList" />
              </ToolTip>
            </Box>
          )}
          <Box
            className="chatMenu-icon"
            onClick={handleDrawerClose}
            sx={{
              bgcolor: chat ? "#3d3d3d !important" : "#666666",
            }}
          >
            <ToolTip title="Chat">
              <ChatOutlinedIcon className="IconList" />
            </ToolTip>
          </Box>
          <Box
            className="chatMenu-icon"
            onClick={handleShowUser}
            sx={{
              bgcolor: showUser ? "#3d3d3d !important" : "#666666",
              display: {
                lg: "flex !important",
                xl: "flex !important",
                md: "flex !important",
                sm: "none !important",
                xs: "none !important",
              },
            }}
          >
            <ToolTip title="Toggle tile view">
              <GridViewOutlined className="IconList" />
            </ToolTip>
          </Box>
          {recordingEnabled ? (
            <Box
              className="chatMenu-icon"
              onClick={recordClick}
              sx={{
                bgcolor: recording ? "#3d3d3d !important" : "#666666",
                display: {
                  lg: "flex !important",
                  xl: "flex !important",
                  md: "flex !important",
                  sm: "none !important",
                  xs: "none !important",
                },
              }}
            >
              <ToolTip
                title={recording ? "Stop Screen record" : "Screen record"}
              >
                <RadioButtonCheckedIcon className="IconList" />
              </ToolTip>
            </Box>
          ) : (
            ""
          )}
          <Box
            className="chatMenu-icon"
            onClick={handleSmallMenus}
            sx={{
              // bgcolor: recording ? '#3d3d3d !important' : 'transparent',
              display: {
                lg: "none !important",
                xl: "none !important",
                md: "none !important",
                sm: "flex !important",
                xs: "flex !important",
              },
              bgcolor: "#666666",
            }}
          >
            <MoreHorizSharpIcon className="IconList" />
          </Box>
          <Box
            className="chatMenu-icon"
            onClick={() => setCallEnd(true)}
            sx={{
              bgcolor: "#f44336 !important",
              display: {
                lg: "none !important",
                xl: "none !important",
                md: "none !important",
                sm: "flex !important",
                xs: "flex !important",
              },
            }}
          >
            <ToolTip title={"call End"}>
              <CallEndOutlined className="IconList" />
            </ToolTip>
          </Box>
        </Grid>
        <Grid
          item
          lg={3}
          md={3}
          sm={0}
          xs={0}
          className="chatMenu-box"
          sx={{
            justifyContent: "flex-end !important",
            pr: 2,
          }}
        >
          {isVisitNotesEnabled ? (
            <Button
              className="visitNotesBtn"
              onClick={visitNotesClick}
              sx={{
                display: {
                  lg: "flex !important",
                  xl: "flex !important",
                  md: "flex !important ",
                  sm: "none !important",
                  xs: "none !important",
                },
              }}
            >
              Visit Notes
            </Button>
          ) : (
            ""
          )}
          <Button
            className="endCall-Btn"
            onClick={() => setCallEnd(true)}
            startIcon={<CallEndOutlined />}
            sx={{
              display: {
                lg: "flex !important",
                xl: "flex !important",
                md: "flex !important ",
                sm: "none !important",
                xs: "none !important",
              },
            }}
          >
            End call
          </Button>
        </Grid>
      </Grid>
      <CallEndDialog
        callEnd={callEnd}
        setCallEnd={setCallEnd}
        leaveMeeting={leaveMeeting}
        handleMeetingClick={handleMeetingClick}
        handleMeetingClose={handleMeetingClose}
        endCall={endCall}
        endCallForAll={endCallForAll}
      />
      <RecordDialog
        showStartDialog={showStartDialog}
        showStopDialog={showStopDialog}
        setShowStartDialog={setShowStartDialog}
        setShowStopDialog={setShowStopDialog}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      <SmallMenus
        smallMenus={smallMenus}
        handleSmallMenus={handleSmallMenus}
        showUser={showUser}
        handleShowUser={handleShowUser}
        sharingOpen={sharingOpen}
        handleScreenShare={handleScreenShare}
        handleStopSharing={handleStopSharing}
        recording={recording}
        recordClick={recordClick}
        isVisitNotesEnabled={isVisitNotesEnabled}
        visitNotesClick={visitNotesClick}
        recordingEnabled={recordingEnabled}
      />
    </>
  );
}

export default Menus;
