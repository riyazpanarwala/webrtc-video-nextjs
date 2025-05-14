import React, { useState, useCallback, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { PersonOutlineOutlined } from "@mui/icons-material";

const isNameNotDefined = false;

function ChatBox({ handleDrawerOpen, generateColor, messages, sendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const emojis = [
    { id: 1, name: ":)", emoji: "😀" },
    { id: 2, name: ":(", emoji: "😦" },
    { id: 3, name: ":D", emoji: "😄" },
    { id: 4, name: ":+1:", emoji: "👍" },
    { id: 5, name: ":P", emoji: "😛" },
    { id: 6, name: ":wave:", emoji: "👋" },
    { id: 7, name: ":blush:", emoji: "😊" },
    { id: 8, name: ":slightly_smiling_face:", emoji: "🙂‍" },
    { id: 9, name: ":scream:", emoji: "😱" },
    { id: 10, name: ":*", emoji: "😙" },
    { id: 11, name: ":-1:", emoji: "👎" },
    { id: 12, name: ":mag:", emoji: "🔍" },
    { id: 13, name: ":heart:", emoji: "❤️" },
    { id: 14, name: ":innocent:", emoji: "😇" },
    { id: 15, name: ":angry:", emoji: "😠" },
    { id: 16, name: ":angel:", emoji: "👼" },
    { id: 17, name: ";(", emoji: "😭" },
    { id: 18, name: ":clap:", emoji: "👏" },
    { id: 19, name: ";)", emoji: "😉" },
    { id: 20, name: ":beer:", emoji: "🍺" },
  ];

  const sendMsg = useCallback(() => {
    let messageToSend = selectedEmoji
      ? `${selectedEmoji} ${newMessage.trim()}`
      : newMessage.trim();
    if (!messageToSend) return;
    sendMessage(messageToSend);
    setNewMessage("");
    setLastMessageTime(new Date());
    setSelectedEmoji(null);
  }, [messages, newMessage, selectedEmoji]);

  const replaceEmojiTextWithEmoji = useCallback(
    (message) => {
      let updatedMessage = message.content;
      emojis.forEach((emoji) => {
        const emojiName = emoji.name;
        let index = updatedMessage.indexOf(emojiName);
        while (index !== -1) {
          updatedMessage =
            updatedMessage.substring(0, index) +
            emoji.emoji +
            updatedMessage.substring(index + emojiName.length);
          index = updatedMessage.indexOf(emojiName, index + emoji.emoji.length);
        }
      });
      return updatedMessage;
    },
    [emojis]
  );

  const handleEmojiPickerOpen = useCallback(() => {
    setIsEmojiPickerOpen((prev) => !prev);
  }, []);

  const handleEmojiSelect = useCallback(
    (emoji) => {
      const updatedMessage =
        newMessage.slice(0, cursorPosition) +
        emoji +
        newMessage.slice(cursorPosition);
      setNewMessage(updatedMessage);
      setCursorPosition((prev) => prev + emoji.length);
      setIsEmojiPickerOpen(false);
    },
    [cursorPosition, newMessage]
  );

  const handleInputChange = useCallback((e) => {
    setNewMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
  }, []);

  const chunkedEmojis = useMemo(() => {
    return emojis.reduce((acc, _, index) => {
      if (index % 7 === 0) {
        acc.push(emojis.slice(index, index + 7));
      }
      return acc;
    }, []);
  }, [emojis]);

  return (
    <>
      <Box className="chatBox-header">
        <Typography variant="h4" className="chatBox-title">
          Chat
        </Typography>
        <IconButton onClick={handleDrawerOpen}>
          <CloseIcon sx={{ color: "#fff", fontSize: "22px" }} />
        </IconButton>
      </Box>
      {isNameNotDefined ? (
        <Box className="chat-nickname">
          <Typography variant="body1" className="nickname-text">
            Enter a nickname to use chat
          </Typography>
          <Box className="name-textfeild">
            <input
              type="text"
              placeholder="Choose a nickname"
              className="textfield"
            />
          </Box>
          <Button className="enterRoom-btn" variant="contained">
            Enter room
          </Button>
        </Box>
      ) : (
        <>
          <Box
            className="chatBox-messages"
            sx={{
              height: { xs: "75%", sm: "75%", md: "75%", lg: "76%", xl: "80%" },
            }}
          >
            {messages.map((message, index) =>
              !message.isLeft ? (
                <Box className="message-box" key={index}>
                  <Typography
                    variant="body1"
                    className="message-text"
                    sx={{ whiteSpace: "wrap" }}
                  >
                    {replaceEmojiTextWithEmoji(message)}
                  </Typography>
                  {lastMessageTime && index === messages.length - 1 && (
                    <Box>
                      <Typography variant="h6" className="message-time">
                        {lastMessageTime.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box key={index} className="message-box-container">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: message.name
                        ? generateColor(message.name)
                        : "none",
                    }}
                  >
                    {message.name ? (
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: "14px",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {message.name.charAt(0).toUpperCase()}
                      </Typography>
                    ) : (
                      <PersonOutlineOutlined sx={{ fontSize: "18px" }} />
                    )}
                  </Avatar>
                  <Box className="message-box-right">
                    <Box className="message-right" sx={{ whiteSpace: "wrap" }}>
                      <Typography
                        variant="body1"
                        className="msg-userName"
                        sx={{ whiteSpace: "wrap" }}
                      >
                        {message.name}
                      </Typography>
                      {replaceEmojiTextWithEmoji(message)}
                    </Box>
                    {lastMessageTime && index === messages.length - 1 && (
                      <Box>
                        <Typography variant="h6" className="message-time-right">
                          {lastMessageTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )
            )}
          </Box>
          <Grid container className="chatBox-input" gap={1}>
            <Grid
              direction="row"
              alignItems="center"
              gap={1}
              className="chat-textfeild"
              gridColumn={{
                xs: "span 9",
                sm: "span 9",
                md: "span 9",
                lg: "span 9",
              }}
            >
              <IconButton onClick={handleEmojiPickerOpen}>
                <SentimentSatisfiedSharpIcon
                  sx={{ color: "#f4f4f4", fontSize: "20px" }}
                />
              </IconButton>
              <input
                type="text"
                placeholder="Type a message"
                className="textfield"
                value={newMessage}
                onChange={handleInputChange}
                onFocus={(e) => setCursorPosition(e.target.selectionStart)}
                onBlur={(e) => setCursorPosition(e.target.selectionStart)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") sendMsg();
                }}
              />
            </Grid>
            <Grid
              direction="row"
              alignItems="center"
              gap={1}
              gridColumn={{
                xs: "span 2",
                sm: "span 2",
                md: "span 2",
                lg: "span 2",
              }}
            >
              <IconButton
                onClick={sendMsg}
                disableRipple
                className="chat-sendBtn"
                sx={{
                  bgcolor:
                    selectedEmoji || newMessage.trim().length > 0
                      ? "#246FE5"
                      : "#c2c2c2",
                }}
              >
                <SendRoundedIcon
                  sx={{
                    color:
                      selectedEmoji || newMessage.trim().length > 0
                        ? "#fff"
                        : "gray",
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </>
      )}
      {isEmojiPickerOpen && (
        <Box className="emoji-container">
          <Box className="emoji-divider"></Box>
          {chunkedEmojis.map((row, index) => (
            <Box key={index} style={{ display: "flex", ml: 1 }}>
              {row.map((emoji) => (
                <Box
                  className="emoji-icon"
                  key={emoji.id}
                  onClick={() => handleEmojiSelect(emoji.name)}
                >
                  <span>{emoji.emoji}</span>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}

export default ChatBox;
