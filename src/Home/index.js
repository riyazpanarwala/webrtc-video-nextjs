import React, { useState } from "react";
import { Box, TextField, Button, Link } from "@mui/material";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

const Home = () => {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isJoin, setJoin] = useState(false);
  const router = useRouter();

  const onJoin = () => {
    if (name && roomName) {
      router.push(`/join/${roomName}?name=${name}`);
    }
  };

  const onHost = () => {
    if (name) {
      router.push(`/join/${nanoid()}?name=${name}`);
    }
  };

  return (
    <Box sx={{ marginTop: "30px", textAlign: "center" }}>
      <Box>
        <TextField
          label="My Name"
          variant="outlined"
          onChange={(e) => {
            setName(e.target.value);
          }}
          sx={{ mt: 2 }}
          val={name}
        />
      </Box>

      {isJoin && (
        <Box>
          <TextField
            label="Room Name"
            variant="outlined"
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
            sx={{ mt: 2 }}
            val={roomName}
          />
        </Box>
      )}
      <Box mt={1} mb={2}>
        {isJoin ? (
          <Button variant="contained" onClick={onJoin}>
            Join a Meeting
          </Button>
        ) : (
          <Button variant="contained" onClick={onHost}>
            Host a Meeting
          </Button>
        )}
      </Box>
      {isJoin ? (
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            setJoin(false);
          }}
        >
          Host a Meeting
        </Link>
      ) : (
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            setJoin(true);
          }}
        >
          Join a Meeting
        </Link>
      )}
    </Box>
  );
};

export default Home;
