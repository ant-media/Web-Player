# Web Player for Ant Media Server

Web Player is a powerful, versatile player for Ant Media Server, designed to embed and play streams directly in web applications. It supports various stream types including WebRTC, HLS, DASH, and VR 360, ensuring broad compatibility and high performance. The player can be easily configured via URL parameters or directly in your code, offering both flexibility and ease of use.

## Features

- Supports WebRTC, HLS, DASH, and VR 360 streams.
- Configurable through URL parameters or directly in the code.
- Supports token-based security for stream access.
- Autoplay and mute options for a seamless user experience.
- Customizable play order and types for different stream technologies and formats.
- Adjustable target latency for DASH players.
- 360-degree video playback capability.

## Installation

Install the Web Player package using npm:

```bash
npm i @antmedia/web_player
```

## Configuration Parameters

The player accepts several configuration parameters, either through the URL or directly in the code:

1. `id` (String): The stream ID to play. This parameter is mandatory.
2. `token` (String): The token for stream access. It's mandatory if token security is enabled on the server side.
3. `autoplay` (Boolean): Autoplay the stream if available. Optional. Default value is `true`.
4. `mute` (Boolean): Start playing in mute mode if the stream is available. Optional. Default value is `true`.
5. `playOrder` (String): The order of technologies used for playing. Optional. Default value is `"webrtc,hls"`. Possible values include `"hls,webrtc"`, `"webrtc"`, `"hls"`, `"vod"`, `"dash"`.
6. `playType` (String): The order of play types used for playing. Optional. Default value is `"mp4,webm"`. Possible values include `"webm,mp4"`, `"mp4"`, `"webm"`, `"mov"`.
7. `targetLatency` (Number): The target latency for the DASH player. Optional. Default value is `3`.
8. `is360` (Boolean): Enable playback in 360 mode. Optional. Default value is `false`.

## Usage

### Basic Usage

Import the `WebPlayer` and initialize it with the desired configuration:

```javascript
import { WebPlayer } from "@antmedia/web_player";

var embeddedPlayer = new WebPlayer(window, document.getElementById("video_container"), document.getElementById("video_info"));

embeddedPlayer.initialize().then(() => {
    embeddedPlayer.play();
});
```

The sample for this usage is available in [play.html in StreamApp](https://github.com/ant-media/StreamApp/blob/master/src/main/webapp/play.html)

### Advanced Usage
You can also pass the parameters as an object to the WebPlayer constructor:

```javascript
var player = new WebPlayer({
    streamId: streamId,
    httpBaseURL: "http://example.antmedia.io:5080/WebRTCAppEE",
    token: tokenId,
    playOrder: ["webrtc", "hls", "dash"],
    videoHTMLContent: '<video id="video-player" class="video-js vjs-default-skin vjs-big-play-centered" controls playsinline style="width:100%;height:100%"></video>',
}, document.getElementById("video_container"), null);

player.initialize().then(() => {
    player.play();
}).catch((error) => {
    console.error("Error while initializing embedded player: " + error);
});
```

The sample for this usage is available in [app.page.component.ts in Ant-Media-Management-Console](https://github.com/ant-media/Ant-Media-Management-Console/blob/master/src/app/app.page/app.page.component.ts)


## Support
For support and further inquiries, please visit [Ant Media Server's community](https://github.com/orgs/ant-media/discussions). If you are an enterprise user, you can receive support by sending an email to support@antmedia.io.

## Issues
For reporting issues, please create them on the [Ant-Media-Server issues page](https://github.com/ant-media/Ant-Media-Server/issues).

## Contributing
Contributions are warmly welcomed. If you would like to help improve the Web Player, please submit your pull requests to the repository or report any issues you encounter.

Enjoy streaming with the Ant Media Server's Web Player!

