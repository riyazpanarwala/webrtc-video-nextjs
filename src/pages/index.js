import Head from "next/head";
import Image from "next/image";
import Home1 from "../Home";

export default function Home() {
  return (
    <>
      <Head>
        <title>WebRTC - Video Call</title>
        <meta name="description" content="WebRTC based video call APP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home1 />
    </>
  );
}
