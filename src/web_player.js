import { getUrlParameter } from "@antmedia/webrtc_adaptor/dist/fetch.stream";
import { Logger } from "@antmedia/webrtc_adaptor/dist/loglevel.min";
import { UpArrow } from "./icons/images";

export const STATIC_VIDEO_HTML =  "<video id='video-player' class='video-js vjs-default-skin vjs-big-play-centered' controls playsinline></video>";

const PTZ_LEFT_BUTTON_ID = "left-button";
const PTZ_RIGHT_BUTTON_ID = "right-button";
const PTZ_UP_BUTTON_ID = "up-button";
const PTZ_DOWN_BUTTON_ID = "down-button";
const PTZ_ZOOM_IN_BUTTON_ID = "zoom-in-button";
const PTZ_ZOOM_OUT_BUTTON_ID = "zoom-out-button";
const PTZ_ZOOM_TEXT_BUTTON_ID = "zoom-text";

export class WebPlayer {

    static PLAYER_EVENTS = ['abort','canplay','canplaythrough','durationchange','emptied','ended','error','loadeddata','loadedmetadata','loadstart','pause','play','playing','progress','ratechange','seeked','seeking','stalled','suspend','timeupdate','volumechange','waiting','enterpictureinpicture','leavepictureinpicture','fullscreenchange','resize','audioonlymodechange','audiopostermodechange','controlsdisabled','controlsenabled','debugon','debugoff','disablepictureinpicturechanged','dispose','enterFullWindow','error','exitFullWindow','firstplay','fullscreenerror','languagechange','loadedmetadata','loadstart','playerreset','playerresize','posterchange','ready','textdata','useractive','userinactive','usingcustomcontrols','usingnativecontrols'];

	static DEFAULT_PLAY_ORDER = ["webrtc", "hls"];

	static DEFAULT_PLAY_TYPE  =  ["mp4", "webm"];

	static HLS_EXTENSION  = "m3u8";

	static WEBRTC_EXTENSION = "webrtc";

	static DASH_EXTENSION = "mpd";

	/**
	* streamsFolder: streams folder. Optional. Default value is "streams"
	*/
	static STREAMS_FOLDER = "streams";

    /**
	* lowLatencyHlsFolder: ll-hls folder. Optional. Default value is "ll-hls"
	*/
    static LL_HLS_FOLDER = "ll-hls";

    
    /**
     * Video HTML content. It's by default STATIC_VIDEO_HTML
     */
	videoHTMLContent;

    /**
     * video player Id. It's by default "video-player"
     */
	videoPlayerId;
	
    /**
    *  "playOrder": the order which technologies is used in playing. Optional. Default value is "webrtc,hls".
    *	possible values are "hls,webrtc","webrtc","hls","ll-hls","vod","dash",
    *   It will be taken from url parameter "playOrder".
    */
    playOrder;

    /**
     * currentPlayType: current play type in playOrder
     */
    currentPlayType;

    /**
     * "is360": if true, player will be 360 degree player. Optional. Default value is false.
     * It will be taken from url parameter "is360".
     */
    is360 = false;

    /**
     * "streamId": stream id. Mandatory. If it is not set, it will be taken from url parameter "id".
     * It will be taken from url parameter "id".
     */
    streamId;

    /**
     * "playType": play type. Optional.  It's used for vod. Default value is "mp4,webm".
     * It can be "mp4,webm","webm,mp4","mp4","webm","mov" and it's used for vod.
     * It will be taken from url parameter "playType".
     */
    playType;

    /**
     * "token": token. It's required when stream security for playback is enabled .
     * It will be taken from url parameter "token".
     */
    token;

    /**
     * autoplay: if true, player will be started automatically. Optional. Default value is true.
     * autoplay is false by default for mobile devices because of mobile browser's autoplay policy.
     * It will be taken from url parameter "autoplay".
     */
    autoPlay = true;

    /**
     * mute: if false the player will try to auto play the stream with audio if it fails player will mute the audio and try again to autoplay it.
     * It will be taken from url parameter "mute".
     */
    mute = false;


    /**
     * controls: Toggles the visibility of player controls.
     */
    controls = true;

    /**
     * Force the Player to play with audio Auto Play might not work.
     */
    forcePlayWithAudio = false;

    /**
     * request specific time duraion in HLS Playback
     */

    start = null;
    
    end = null;

    /**
     * targetLatency: target latency in seconds. Optional. Default value is 3.
     * It will be taken from url parameter "targetLatency".
     * It's used for dash(cmaf) playback.
     */
    
    targetLatency = 3;

    /**
     * subscriberId: subscriber id. Optional. It will be taken from url parameter "subscriberId".
     */
    subscriberId;

    /**
     * subscriberCode: subscriber code. Optional. It will be taken from url parameter "subscriberCode".
     */
    subscriberCode;

    /**
     * window: window object
     */
    window;

    /**
     * video player container element
     */
    containerElement;

    /**
     * player placeholder element
     */
    placeHolderElement;

    /**
     * videojs player
     */
    videojsPlayer;

    /**
     * dash player
     */
    dashPlayer;

    /**
     * Ice servers for webrtc
     */
    iceServers;

    /**
     * ice connection state
     */
    iceConnected;

    /**
     * flag to check if error callback is called
     */
    errorCalled;

    /**
     * scene for 360 degree player
     */
    aScene;

    /**
     * player listener
     */
    playerListener

    /**
     * webRTCDataListener
     */
    webRTCDataListener;

    /**
     * Field to keep if tryNextMethod is already called
     */
    tryNextTechTimer;

     /**
     * Listener for ID3 text data
     */
     id3Listener;

    /**
     * REST API Filter JWT 
     */
    restJwt;

     /**
     * PTZ Control HTML Elements
     */
    ptzControlElements;

    /** 
     * PTZ Value Step
    */
    ptzValueStep;

    /**
     * PTZ Movement. It can be relative, absolute, continuous
     */
    ptzMovement;

    /**
     * Rest API promise to call REST api through some external methods
     */
    restAPIPromise;

    /**
     * Is IP Camera
     */
    isIPCamera;

    /**
     * Stream id of backup stream.
     */
    backupStreamId;

    /**
     * activeStreamId: is the stream id that is being played currently
     * It can be streamID or backupStreamId
     */
    activeStreamId;

    /**
     * withCredentials: if true, the player will include credentials in cross-origin requests.
     */
    withCredentials;


    constructor(configOrWindow, containerElement, placeHolderElement) {

		WebPlayer.DEFAULT_PLAY_ORDER = ["webrtc", "hls"];;

		WebPlayer.DEFAULT_PLAY_TYPE =  ["mp4", "webm"];

		WebPlayer.HLS_EXTENSION = "m3u8";

		WebPlayer.WEBRTC_EXTENSION = "webrtc";

		WebPlayer.DASH_EXTENSION = "mpd";

		/**
		* streamsFolder: streams folder. Optional. Default value is "streams"
		*/
		WebPlayer.STREAMS_FOLDER = "streams";

        WebPlayer.LL_HLS_Folder = "ll-hls";

		WebPlayer.VIDEO_PLAYER_ID = "video-player";

        WebPlayer.PLAYER_EVENTS = ['abort','canplay','canplaythrough','durationchange','emptied','ended','error','loadeddata','loadedmetadata','loadstart','pause','play','playing','progress','ratechange','seeked','seeking','stalled','suspend','timeupdate','volumechange','waiting','enterpictureinpicture','leavepictureinpicture','fullscreenchange','resize','audioonlymodechange','audiopostermodechange','controlsdisabled','controlsenabled','debugon','debugoff','disablepictureinpicturechanged','dispose','enterFullWindow','error','exitFullWindow','firstplay','fullscreenerror','languagechange','loadedmetadata','loadstart','playerreset','playerresize','posterchange','ready','textdata','useractive','userinactive','usingcustomcontrols','usingnativecontrols'];

		
		// Initialize default values
        this.setDefaults();
		
		  // Check if the first argument is a config object or a Window object
        if (!this.isWindow(configOrWindow)) {
            // New config object mode
			Logger.info("config object mode");
            Object.assign(this, configOrWindow);
            this.window = window;
        }
        else {
            // Backward compatibility mode
			Logger.info("getting from url mode");
            this.window = configOrWindow;
        
            // Use getUrlParameter for backward compatibility
            this.initializeFromUrlParams();
        }
        
        this.containerElement = containerElement;
        if (this.containerElement.style && this.containerElement.style.display !== "") {
            this.containerElementInitialDisplay = this.containerElement.style.display;
        }
        this.placeHolderElement = placeHolderElement;

        if (this.placeHolderElement && this.placeHolderElement.style && this.placeHolderElement.style.display != "") {
            this.placeHolderElementInitialDisplay = this.placeHolderElement.style.display;
        }
		
		if (this.streamId == null) {
            var message = "Stream id is not set.Please add your stream id to the url as a query parameter such as ?id={STREAM_ID} to the url"
            Logger.error(message);
            //TODO: we may need to show this message on directly page
            alert(message);
            throw new Error(message);
        }
        //set the active stream id as stream id
        this.activeStreamId = this.streamId;
        
        if (!this.httpBaseURL) 
        {
            //this is the case where web player gets everything from url
            let appName = "/";
            if (this.window.location.pathname && this.window.location.pathname.indexOf("/") != -1) {
         	    appName = this.window.location.pathname.substring(0, this.window.location.pathname.lastIndexOf("/") + 1);
            }
			let path = this.window.location.hostname;
            if (this.window.location.port != "") {
                path += ":" + this.window.location.port;
            }
            if (!appName.startsWith("/")) {
                appName = "/" + appName;
            }

            if (!appName.endsWith("/")) 
            {
                appName += "/";
            }
            path += appName 

            this.httpBaseURL = this.window.location.protocol + "//" + path;
		    this.websocketBaseURL = "ws://" + path;
		
		    if (this.window.location.protocol.startsWith("https")) {
                this.websocketBaseURL = this.websocketBaseURL.replace("ws", "wss");
		    }
	
        }
        else if (!this.websocketBaseURL) 
        {
            //this is the case where web player gets inputs from config object
            if (!this.httpBaseURL.endsWith("/")) {
                this.httpBaseURL += "/";
            }

			this.websocketBaseURL = this.httpBaseURL.replace("http", "ws");
		}

        this.dom = this.window.document;
       
        this.containerElement.innerHTML = this.videoHTMLContent;

        this.setPlayerVisible(false);
    }

    isWindow(configOrWindow) {
        //accept that it's a window if it's a Window instance or it has location.href
        //location.href is used in test environment
        return configOrWindow instanceof Window || (configOrWindow.location && configOrWindow.location.href);
    }

    initialize() 
    {
        return this.loadVideoJSComponents()
        .then(() => {
			return this.loadDashScript(); 
		})
        .then(() => {
			if (this.is360 && !window.AFRAME) {
				
				return import('aframe');
			}
		})
		.catch((e) => {
            Logger.error("Scripts are not loaded. The error is " + e);
            throw e;
        });
    };

    loadDashScript() {
        if (this.playOrder.includes("dash") && !this.dashjsLoaded) {
		
           return import('dashjs/dist/dash.all.min.js').then((dashjs) => 
            {
				window.dashjs = dashjs.default;
                this.dashjsLoaded = true;	 
                console.log("dash.all.min.js is loaded");
            })
        }
        else {
            return Promise.resolve();
        }
    }
    
    setDefaults() {
        this.playOrder = WebPlayer.DEFAULT_PLAY_ORDER;
        this.currentPlayType = null;
        this.is360 = false;
        this.streamId = null;
        this.playType = WebPlayer.DEFAULT_PLAY_TYPE;
        this.token = null;
        this.autoPlay = true;
        this.mute = false;
        this.targetLatency = 3;
        this.subscriberId = null;
        this.subscriberCode = null;
        this.window = null;
        this.containerElement = null;
        this.placeHolderElement = null;
        this.videojsPlayer = null;
        this.dashPlayer = null;
        this.iceServers = '[ { "urls": "stun:stun1.l.google.com:19302" } ]';
        this.iceConnected = false;
        this.errorCalled = false;
        this.tryNextTechTimer = -1;
        this.aScene = null;
        this.playerListener = null;
        this.webRTCDataListener = null;
        this.websocketBaseURL = null;
        this.httpBaseURL = null;
        this.videoHTMLContent = STATIC_VIDEO_HTML;
        this.videoPlayerId = "video-player";
        this.videojsLoaded = false;
        this.dashjsLoaded = false;
        this.containerElementInitialDisplay = "block";
        this.placeHolderElementInitialDisplay = "block";
        this.forcePlayWithAudio = false;
        this.id3Listener = null;
        this.restJwt = "";
        this.ptzControlElements = {}
        this.ptzValueStep = 0.1;
        this.ptzMovement = "relative";
        this.restAPIPromise = null;
        this.isIPCamera = false;
        this.playerEvents = WebPlayer.PLAYER_EVENTS
        this.backupStreamId = null;
        this.start = null;
        this.end = null;
        this.withCredentials = true;
    }
    
    initializeFromUrlParams() {
	    // Fetch parameters from URL and set to class properties
	    this.streamId = getUrlParameter("id", this.window.location.search) || this.streamId;
	    
	    if (this.streamId == null) {
            //check name variable for compatibility with older versions

            this.streamId = getUrlParameter("name", this.window.location.search) || this.streamId;
            if (this.streamId == null) {
	 			Logger.warn("Please use id parameter instead of name parameter.");
			}
        }
    
	    this.is360 = (getUrlParameter("is360", this.window.location.search) === "true") || this.is360;
	    
        this.start = getUrlParameter("start", this.window.location.search)?.split(',') || this.start;
        this.end = getUrlParameter("end", this.window.location.search)?.split(',') || this.end;
	    this.playType = getUrlParameter("playType", this.window.location.search)?.split(',') || this.playType;
	    this.token = getUrlParameter("token", this.window.location.search) || this.token;
	    let autoPlayLocal = getUrlParameter("autoplay", this.window.location.search);
	    if (autoPlayLocal === "false") {
			this.autoPlay = false;
		}
		else  {
			this.autoPlay = true;
		}
		
	    let muteLocal = getUrlParameter("mute", this.window.location.search);
		if (muteLocal === "false") {
            this.mute = false;
            //user specifically asks to play with audio so if it fails in auto play, it will not try to play without audio
			this.forcePlayWithAudio = true;
		}else if(muteLocal === "true"){
            this.mute = true;
        }
        
		
		let localTargetLatency = getUrlParameter("targetLatency", this.window.location.search);
	    if (localTargetLatency != null) {
	        let latencyInNumber = Number(localTargetLatency);
	        if (!isNaN(latencyInNumber)) {
	            this.targetLatency = latencyInNumber;
	        } else {
	            Logger.warn("targetLatency parameter is not a number. It will be ignored.");
	            this.targetLatency = this.targetLatency || 3; // Default value or existing value
	        }
	    }
	    this.subscriberId = getUrlParameter("subscriberId", this.window.location.search) || this.subscriberId;
	    this.subscriberCode = getUrlParameter("subscriberCode", this.window.location.search) || this.subscriberCode;
	    let playOrder = getUrlParameter("playOrder", this.window.location.search);
	    this.playOrder = playOrder ? playOrder.split(',') : this.playOrder;
	    
        this.restJwt = getUrlParameter("restJwt", this.window.location.search) || this.restJwt;

        this.ptzValueStep = getUrlParameter("ptzValueStep", this.window.location.search) || this.ptzValueStep;

        this.ptzMovement = getUrlParameter("ptzMovement", this.window.location.search) || this.ptzMovement;

        this.backupStreamId = getUrlParameter("backupStreamId", this.window.location.search) || this.backupStreamId;

        this.withCredentials = (getUrlParameter("withCredentials", this.window.location.search) === "false") ? false : this.withCredentials;

	}

    loadWebRTCComponents() {
        if (this.playOrder.includes("webrtc")) 
        {
            return import('@antmedia/videojs-webrtc-plugin/dist/videojs-webrtc-plugin.css').then((css) =>
            {   
                Logger.info("videojs-webrtc-plugin.css is loaded");
                    const styleElement = this.dom.createElement('style');
                    styleElement.textContent = css.default.toString(); // Assuming css module exports a string
                    this.dom.head.appendChild(styleElement);
        
                    return import('@antmedia/videojs-webrtc-plugin').then((videojsWebrtcPluginLocal) => 
                    {
                        Logger.info("videojs-webrtc-plugin is loaded");

                    });
            });
        }
        else {

            return Promise.resolve();
        }
    }
    /**
     * load scripts dynamically
     */
    loadVideoJSComponents() {
        if (this.playOrder.includes("hls") || this.playOrder.includes("ll-hls") || this.playOrder.includes("vod") || this.playOrder.includes("webrtc")) {
            //it means we're going to use videojs
            //load videojs css
			if (!this.videojsLoaded) 
			{
				return import('video.js/dist/video-js.min.css').then((css) => {
	                const styleElement = this.dom.createElement('style');
				    styleElement.textContent = css.default.toString(); // Assuming css module exports a string
				    this.dom.head.appendChild(styleElement);
				})
				.then(() => { return import("video.js") })
				.then((videojs) => 
				{
                    window.videojs = videojs.default;		
                    this.videojsLoaded = true;	 
				})
				.then(() => { return import('videojs-quality-selector-hls') } )
				.then(() => { return this.loadWebRTCComponents(); });
			}
			else {
				return Promise.resolve();
			}
			
	    }
	    else {
	        return Promise.resolve();
	    }
    }

    /**
     * enable 360 player
     */
    enable360Player() {
        this.aScene = this.dom.createElement("a-scene");
        var elementId = this.dom.getElementsByTagName("video")[0].id;
        this.aScene.innerHTML = "<a-videosphere src=\"#"+elementId+"\" rotation=\"0 180 0\" style=\"background-color: antiquewhite\"></a-videosphere>";
        this.dom.body.appendChild(this.aScene);
    }

    /**
     * set player visibility
     * @param {boolean} visible
     */
    setPlayerVisible(visible) {
        this.containerElement.style.display = visible ? this.containerElementInitialDisplay : "none";
        if (this.placeHolderElement) {
        	this.placeHolderElement.style.display = visible ? "none" : this.placeHolderElementInitialDisplay;
        }

        if (this.is360) {
            if (visible) {
                this.enable360Player();
            }
            else if (this.aScene != null) {
                var elements = this.dom.getElementsByTagName("a-scene");
                while (elements.length > 0) {
                    this.dom.body.removeChild(elements[0]);
                    elements = this.dom.getElementsByTagName("a-scene");
                }
                this.aScene = null;
            }
        }
    }


    handleWebRTCInfoMessages(infos) {
	    if (infos["info"] == "ice_connection_state_changed") {
            Logger.debug("ice connection state changed to " + infos["obj"].state);
            if (infos["obj"].state == "completed" || infos["obj"].state == "connected") {
                this.iceConnected = true;
            }
            else if (infos["obj"].state == "failed" || infos["obj"].state == "disconnected" || infos["obj"].state == "closed") {
				//
				Logger.warn("Ice connection is not connected. tryNextTech to replay");
				this.tryNextTech();
			}

        }
        else if (infos["info"] == "closed") {
			//this means websocket is closed and it stops the playback - tryNextTech
			Logger.warn("Websocket is closed. tryNextTech to replay");
			this.tryNextTech();
		}
        else if (infos["info"] == "resolutionChangeInfo") 
        {
            Logger.info("Resolution is changing");
            this.videojsPlayer.pause();
            setTimeout(() => {
                this.videojsPlayer.play();
            }, 2000);
        }
        else if (infos["info"] == "streaming_started") 
        {
            Logger.info("Requested stream has started");
            this.playIfExists(this.currentPlayType, infos["obj"].streamId);
        }
	}

    // we define insertSecurityParameters in this way because we want to get the this context such as this.subscriberId
    insertSecurityParameters = (options) => {
        var queryParams = [];
        if (!options.uri.includes("subscriberId") && this.subscriberId != null) {
          queryParams.push("subscriberId=".concat(this.subscriberId));
        }
        if (!options.uri.includes("subscriberCode") && this.subscriberCode != null) {
          queryParams.push("subscriberCode=".concat(this.subscriberCode));
        }
        if (!options.uri.includes("token") && this.token != null) {
          queryParams.push("token=".concat(this.token));
        }
        if (queryParams.length > 0) {
          var queryString = queryParams.join("&");
          options.uri += options.uri.includes("?") ? "&".concat(queryString) : "?".concat(queryString);
        }
          Logger.debug("hls request: " + options.uri);
    }

    /**
     * Play the stream via videojs
     * @param {*} streamUrl
     * @param {*} extension
     * @returns
     */
    playWithVideoJS(streamUrl, extension) {
        var type;
        if (extension == "mp4") {
            type = "video/mp4";
        }
        else if (extension == "webm") {
            type = "video/webm";
        }
        else if (extension == "mov") {
            type = "video/mp4";
            alert("Browsers do not support to play mov format");
        }
        else if (extension == "avi") {
            type = "video/mp4";
            alert("Browsers do not support to play avi format");
        }
        else if (extension == "m3u8") {
            type = "application/x-mpegURL";
        }
        else if (extension == "mpd") {
            type = "application/dash+xml";
        }
        else if (extension == "webrtc") {
            type = "video/webrtc";
        } 
        else if (extension == "mp3") {
            type = "audio/mpeg";
        } 
        else {
            Logger.warn("Unknown extension: " + extension);
            return;
        }

        var preview = this.streamId;
        if (this.streamId.endsWith("_adaptive")) {
            preview = streamId.substring(0, streamId.indexOf("_adaptive"));
        }

        //same videojs is being use for hls, vod and webrtc streams
        this.videojsPlayer = videojs(this.videoPlayerId, {
            poster: "previews/" + preview + ".png",
            liveui: extension == "m3u8" ? true : false,
            liveTracker: {
                trackingThreshold: 0
            },
            html5: {
                vhs: {
                    limitRenditionByPlayerDimensions: false
                }
            },
            controls: this.controls,
            class: 'video-js vjs-default-skin vjs-big-play-centered',
            muted: this.mute,
            preload: "auto",
            autoplay: this.autoPlay

        });

		//webrtc specific events
		if (extension == "webrtc") {

	        this.videojsPlayer.on('webrtc-info', (event, infos) => {

	            //Logger.warn("info callback: " + JSON.stringify(infos));
				this.handleWebRTCInfoMessages(infos);
	        });


	        this.videojsPlayer.on('webrtc-error', (event, errors) => {
	            //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
	            Logger.warn("error callback: " + JSON.stringify(errors));
                if (errors["error"] == "no_stream_exist" 
                        && errors["message"] // check if message exists
                        && errors["message"]["information"] == "stream_not_exist_or_not_streaming") 
                {
                    // server puts the this client to the waiting list automatically and it will notify with
                    //streaming_started event
                    
                    //check if backup stream id is set
                    if (this.backupStreamId != null) {
                        this.tryNextTech();
                    }
                    else {
                        //if backup stream id is not set, let the server notify
                         Logger.info("Stream "+errors["message"]["streamId"] +" does not exists or not started yet. Waiting for the stream to start. It will be notified with streaming_started event by the server");
                    }
                } 
                else if (errors["error"] == "no_stream_exist" || errors["error"] == "WebSocketNotConnected"
	                || errors["error"] == "not_initialized_yet" || errors["error"] == "data_store_not_available"
	                || errors["error"] == "highResourceUsage" || errors["error"] == "unauthorized_access"
	                || errors["error"] == "user_blocked") {

	                //handle high resource usage and not authroized errors && websocket disconnected
	                //Even if webrtc adaptor has auto reconnect scenario, we dispose the videojs immediately in tryNextTech
	                // so that reconnect scenario is managed here
					
	                this.tryNextTech();
	            }
	            else if (errors["error"] == "notSetRemoteDescription") {
	                /*
	                * If getting codec incompatible or remote description error, it will redirect HLS player.
	                */
	                Logger.warn("notSetRemoteDescription error. Redirecting to HLS player.");
	                this.playIfExists("hls", this.activeStreamId);
	            }
                if (this.playerListener != null) {
                    this.playerListener("webrtc-error", errors);
                }
	        });

	        this.videojsPlayer.on("webrtc-data-received", (event, obj) => {
	            Logger.trace("webrtc-data-received: " + JSON.stringify(obj));
	            if (this.webRTCDataListener != null) {
	                this.webRTCDataListener(obj);
	            }
	        });
        }

		//hls specific calls
		if (extension == "m3u8") 
        {    
            this.videojsPlayer.on('xhr-hooks-ready', () => {
                    this.videojsPlayer.ready(() => {
                        // tech is ready after ready event
                        this.videojsPlayer.tech().vhs.xhr.onRequest(this.insertSecurityParameters);
                    });
            });     

	        this.videojsPlayer.ready(() => {
                
	            // If it's already added to player, no need to add again
	            if (typeof this.videojsPlayer.qualitySelectorHls === "function") {
	                this.videojsPlayer.qualitySelectorHls({
	                    displayCurrentQuality: true,
	                });
	            }

	            // If there is no adaptive option in m3u8 no need to show quality selector
	            let qualityLevels = this.videojsPlayer.qualityLevels();
	            qualityLevels.on('addqualitylevel', function (event) {
	                let qualityLevel = event.qualityLevel;
	                if (qualityLevel.height) {
	                    qualityLevel.enabled = true;
	                } else {
	                    qualityLevels.removeQualityLevel(qualityLevel);
	                    qualityLevel.enabled = false;
	                }
	            });
	        });

            this.listenForID3MetaData()
        }

        //videojs is being used to play mp4, webm, m3u8 and webrtc
        //make the videoJS visible when ready is called except for webrtc
        //webrtc fires ready event all cases so we use "play" event to make the player visible

        //this setting is critical to play in mobile
        if (extension == "mp4" || extension == "webm" || extension == "m3u8") {
            this.makeVideoJSVisibleWhenReady();
        }

        this.listenPlayerEvents()

        this.iceConnected = false;

        this.videojsPlayer.src({
            src: streamUrl,
            type: type,
            withCredentials: this.withCredentials,
            iceServers: this.iceServers,
            reconnect: false, //webrtc adaptor has auto reconnect scenario, just disable it, we manage it here

        });

        if (this.autoPlay) {
            //try to play directly
            this.videojsPlayer.play().catch((e) => {

                //if it's not allowed error and default value are being used, try to play it muted
                //if this.forcePlayWithAudio is true, it means user specifically ask to do. 
                // If it's false, it's default value so that we can proceed to try to play with muted
                //This implementation is added because of auto play policy of the browsers
                if (e.name === "NotAllowedError" && !this.forcePlayWithAudio) {
                    this.videojsPlayer.muted(true);
                    this.videojsPlayer.play();
                }
                Logger.warn("Problem in playback. The error is " + e);
            });
        }
    }

    listenPlayerEvents() {
        this.playerEvents.forEach(event => {
            this.videojsPlayer.on(event, (eventData) => {
                switch (event) {
                    case 'play':
                        this.setPlayerVisible(true);
                        if (this.playerListener != null) {
                            this.playerListener("play");
                        }
            
                        if(this.restJwt){
                            this.isIpCameraBroadcast();
                        }
                        else if (this.isIPCamera){
                            this.injectPtzElements();  
                        }
                        break;
                    case 'ended':
                        //reinit to play after it ends
                        Logger.warn("stream is ended")
                        this.setPlayerVisible(false);
                        //for webrtc, this event can be called by two reasons
                        //1. ice connection is not established, it means that there is a networking issug
                        //2. stream is ended
                        if (this.currentPlayType != "vod") {
                            //if it's vod, it means that stream is ended and no need to replay
                
                            if (this.iceConnected) {
                                //if iceConnected is true, it means that stream is really ended for webrtc
                
                                //initialize to play again if the publishing starts again
                                this.playIfExists(this.playOrder[0], this.activeStreamId);
                            }
                            else if (this.currentPlayType == "hls") {
                                //if it's hls, it means that stream is ended
                
                                this.setPlayerVisible(false);
                                if (this.playOrder[0] = "hls")
                                {
                                    //do not play again if it's hls because it play last seconds again, let the server clear it
                                    setTimeout(() => {
                                        this.playIfExists(this.playOrder[0], this.activeStreamId);
                                    }, 10000);
                                }
                                else
                                {
                                    this.playIfExists(this.playOrder[0], this.activeStreamId);
                                }
                                //TODO: what if the stream is hls vod then it always re-play
                            }
                            else {
                                //if iceConnected is false, it means that there is a networking issue for webrtc
                                this.tryNextTech();
                            }
                        }
                        if (this.playerListener != null) {
                            this.playerListener(event);
                        }
                        break;
                    case 'timeupdate':
                        if (this.playerListener != null) {
                            this.playerListener(event, eventData, { currentTime: this.videojsPlayer.currentTime() });
                        }
                        break;
                    case 'progress':
                        if (this.playerListener != null) {
                            this.playerListener(event, eventData, { bufferedPercent: this.videojsPlayer.bufferedPercent() });
                        }
                        break;
                    case 'volumechange':
                        if (this.playerListener != null) {
                            this.playerListener(event, eventData, { 
                                volume: this.videojsPlayer.volume(),
                                muted: this.videojsPlayer.muted()
                            });
                        }
                        break;
                    case 'ratechange':
                        if (this.playerListener != null) {
                            this.playerListener(event, eventData, { playbackRate: this.videojsPlayer.playbackRate() });
                        }
                        break;
                    case 'error':
                        Logger.warn("There is an error in playback: ", eventData);
                        // We need to add this kind of check. If we don't add this kind of checkpoint, it will create an infinite loop
                        if (!this.errorCalled) {
                            this.errorCalled = true;
                            setTimeout(() => {
                                this.tryNextTech();
                                this.errorCalled = false;
                            }, 2500)
                        }
                        if(this.playerListener != null){
                            this.playerListener("error", eventData)
                        }
                        break;
                    default:
                        if (this.playerListener != null) {
                            this.playerListener(event, eventData);
                        }
                }
            });
        }); 
    }

    listenForID3MetaData() {
        this.videojsPlayer.textTracks().on('addtrack', e => {
            const metadataTrack = Array.from(this.videojsPlayer.textTracks()).find(t => t.label === 'Timed Metadata');         
            if (metadataTrack) {
                metadataTrack.addEventListener('cuechange', () => {
                    var id3DataText = metadataTrack.activeCues[0]?.text
                    if(this.id3Listener){
                        this.id3Listener(id3DataText)
                    }
                    Logger.info("ID3 Meta Data Received: " + id3DataText);
                });
            }
        });
    }

    makeVideoJSVisibleWhenReady() {
		this.videojsPlayer.ready(() => {
			 this.setPlayerVisible(true);
		});
	}

    /**
     * check if stream exists via http
     * @param {*} streamsfolder
     * @param {*} streamId
     * @param {*} extension
     * @returns
     */
    checkStreamExistsViaHttp(streamsfolder, streamId, extension) {

        var streamPath = this.httpBaseURL;
        if (!streamId.startsWith(streamsfolder)) {
            streamPath += streamsfolder + "/";
        }
        var llHls = streamsfolder.includes(WebPlayer.LL_HLS_FOLDER);

        if (llHls) {
            // LL-HLS path
            streamPath += `${streamId}/${streamId}__master`;
        } else {
            streamPath += streamId;
        }
    
        if (extension) {
            streamPath += `_adaptive.${extension}`;
        }

        streamPath = this.addSecurityParams(streamPath);

        return fetch(streamPath, { method: 'HEAD' })
            .then((response) => {
                if (response.status == 200) {
                    // adaptive m3u8 & mpd exists,play it
                    return new Promise(function (resolve, reject) {
                        resolve(streamPath);
                    });
                } else {

                    if (llHls) {
                        streamPath = this.httpBaseURL + streamsfolder + "/" + streamId + "/"+  streamId + "__master." + extension;

                    } else {
                        streamPath = this.httpBaseURL + streamsfolder + "/" + streamId + "." + extension;
                    }

                    streamPath = this.addSecurityParams(streamPath);

                    return fetch(streamPath, { method: 'HEAD' })
                        .then((response) => {
                            if (response.status == 200) {
                                return new Promise(function (resolve, reject) {
                                    resolve(streamPath);
                                });
                            }
                            else {
                                Logger.warn("No stream found");
                                return new Promise(function (resolve, reject) {
                                    reject("resource_is_not_available");
                                });
                            }
                        });
                }
            });
    }

    addSecurityParams(streamPath) {
        var securityParams = this.getSecurityQueryParams();
        if (securityParams != null && securityParams != "") {
            streamPath += "?" + securityParams;
        }
        return streamPath;
    }

    /**
     * try next tech if current tech is not working
     */
    tryNextTech() {
		if (this.tryNextTechTimer == -1)
		{
	        this.destroyDashPlayer();
	        this.destroyVideoJSPlayer();
	        this.setPlayerVisible(false);

            //before changing play type, let's check if there is any backup stream
            var playTypeIndex = this.playOrder.indexOf(this.currentPlayType);
            if (this.activeStreamId == this.streamId && this.backupStreamId != null) 
            {
                //update active stream id to backup stream id
                this.activeStreamId = this.backupStreamId;
                //don't update playTypeIndex because we're trying backup stream with the same play type
            }
            else 
            {
                //reset the activeStreamId back to streamId
                this.activeStreamId = this.streamId;
                //update the playTypeIndex to try next tech
                if (playTypeIndex == -1 || playTypeIndex == (this.playOrder.length - 1)) {
                    playTypeIndex = 0;
                }
                else {
                    playTypeIndex++;
                }
            }
	        this.tryNextTechTimer = setTimeout(() => {
				 this.tryNextTechTimer = -1;
	            this.playIfExists(this.playOrder[playTypeIndex], this.activeStreamId);
	        }, 3000);
        }
        else
        {
			Logger.debug("tryNextTech is already scheduled no need to schedule again");
		}
    }

    /**
     * play stream throgugh dash player
     * @param {string"} streamUrl
     */
    playViaDash(streamUrl) {
        this.destroyDashPlayer();
        this.dashPlayer = dashjs.MediaPlayer().create();
        this.dashPlayer.extend("RequestModifier", () => {
            return {
                modifyRequestHeader: function (xhr, { url }) {
                    return xhr;
                },
                modifyRequestURL: (url) => {
                    var modifiedUrl = ""

                    var securityParams = this.getSecurityQueryParams();
                    if (!url.includes(securityParams))
                    {
                        if (!url.endsWith("?"))
                        {
                            url += "?";
                        }
                        modifiedUrl = url + securityParams;
						Logger.warn(modifiedUrl);
						return modifiedUrl
                    }

                    return url;
                },
                modifyRequest(request) {

                },
            };
        });

        this.dashPlayer.updateSettings({
            streaming: {
                delay: {
                    liveDelay: this.targetLatency
                },
                liveCatchup: {
                    maxDrift: 0.5,
                    playbackRate: 0.5,
                    latencyThreshold: 60
                }
            }
        });

        this.dashPlayer.initialize(this.containerElement.firstChild, streamUrl, this.autoPlay);

        this.dashPlayer.setMute(this.mute);

        this.dashLatencyTimer = setInterval(() => {
            Logger.warn("live latency: " + this.dashPlayer.getCurrentLiveLatency());
        }, 2000);


       	this.makeDashPlayerVisibleWhenInitialized();

        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, (event) => {
            Logger.warn("playback started");
            this.setPlayerVisible(true);
            if (this.playerListener != null) {
                this.playerListener("play");
            }
        });
        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
            Logger.warn("playback ended");
            this.destroyDashPlayer();
            this.setPlayerVisible(false);
            //streaming can be started again so try to play again with preferred tech
            if (this.playOrder[0] = "dash")
            {
                //do not play again if it's dash because it play last seconds again, let the server clear it
                setTimeout(() => {
                    this.playIfExists(this.playOrder[0], this.activeStreamId);
                }, 10000);
            }
            else {
                this.playIfExists(this.playOrder[0], this.activeStreamId);
            }
            if (this.playerListener != null) {
                this.playerListener("ended");
            }
        });
        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_ERROR, (event) => {
            Logger.warn("dash playback error: " + event);
            this.tryNextTech();
        });
        this.dashPlayer.on(dashjs.MediaPlayer.events.ERROR, (event) => {
            Logger.warn("error: " + event);
            this.tryNextTech();
        });

        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_NOT_ALLOWED, (event) => {
            Logger.warn("dash playback not allowed: " + event);
            this.handleDashPlayBackNotAllowed();
        });
        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, (event)=> {
            if (this.playerListener != null) {
                //same event with videojs
                this.playerListener("pause");
            }
        });

        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, (event)=> {
            if (this.playerListener != null) {
                //same event with videojs
                this.playerListener("seeked");
            }
        });

        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, (event)=> {
            if (this.playerListener != null) {
                //same event with videojs
                this.playerListener("timeupdate");
            }
        });

        

    }

    handleDashPlayBackNotAllowed() {
        if (!this.forcePlayWithAudio) {
            Logger.info("Try to play with muted audio");
            this.dashPlayer.setMute(true);
            this.dashPlayer.play();
        }
        else {
            this.tryNextTech();
        }
    }

    makeDashPlayerVisibleWhenInitialized() {
		 this.dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, (event) => {
            Logger.warn("Stream initialized");
            //make the player visible in mobile devices
            this.setPlayerVisible(true);
        });
	}

    /**
     * destroy the dash player
     */
    destroyDashPlayer() {
        if (this.dashPlayer) {
            this.dashPlayer.destroy();
            this.dashPlayer = null;
            clearInterval(this.dashLatencyTimer);
        }
    }

    /**
     * destroy the videojs player
     */
    destroyVideoJSPlayer() {
        if (this.videojsPlayer) {
            this.videojsPlayer.dispose();
            this.videojsPlayer = null;
        }
    }

    /**
     * Destory the player
     */
    destroy() {
        this.destroyVideoJSPlayer();
        this.destroyDashPlayer();
    }

    /**
     * play the stream with the given tech
     * @param {string} tech
     */
    async playIfExists(tech, streamIdToPlay) {
        this.currentPlayType = tech;
        this.destroyVideoJSPlayer();
        this.destroyDashPlayer();
        this.setPlayerVisible(false);

        this.containerElement.innerHTML = this.videoHTMLContent;

        // Extract clean streamId for protocols that don't support subfolders
        var cleanStreamId = streamIdToPlay;
        if (cleanStreamId) {
            cleanStreamId = streamIdToPlay.includes('/') ? streamIdToPlay.split('/').pop() : streamIdToPlay;
        }

        Logger.warn("Try to play the stream " + streamIdToPlay + " with " + this.currentPlayType + " CleanID " + cleanStreamId);
        switch (this.currentPlayType) {
            case "hls":
                //TODO: Test case for hls
                //1. Play stream with adaptive m3u8 for live and VoD
                //2. Play stream with m3u8 for live and VoD
                //3. if files are not available check nextTech is being called
                return this.checkStreamExistsViaHttp(WebPlayer.STREAMS_FOLDER, streamIdToPlay, WebPlayer.HLS_EXTENSION).then((streamPath) => {

                    this.playWithVideoJS(streamPath, WebPlayer.HLS_EXTENSION);
                    Logger.warn("incoming stream path: " + streamPath);

                }).catch((error) => {

                    Logger.warn("HLS stream resource not available for stream:" + streamIdToPlay + " error is " + error + ". Try next play tech");
                    this.tryNextTech();
                });
            case "ll-hls":
                return this.checkStreamExistsViaHttp(WebPlayer.STREAMS_FOLDER + "/" + WebPlayer.LL_HLS_FOLDER, streamIdToPlay, WebPlayer.HLS_EXTENSION).then((streamPath) => {

                    this.playWithVideoJS(streamPath, WebPlayer.HLS_EXTENSION);
                    Logger.warn("incoming stream path: " + streamPath);

                }).catch((error) => {

                    Logger.warn("LL-HLS stream resource not available for stream:" + streamIdToPlay + " error is " + error + ". Try next play tech");
                    this.tryNextTech();
                });
            case "dash":
                return this.checkStreamExistsViaHttp(WebPlayer.STREAMS_FOLDER, cleanStreamId + "/" + cleanStreamId, WebPlayer.DASH_EXTENSION).then((streamPath) => {
                    this.playViaDash(streamPath);
                }).catch((error) => {
                    Logger.warn("DASH stream resource not available for stream:" + streamIdToPlay + " error is " + error + ". Try next play tech");
                    this.tryNextTech();
                });

            case "webrtc":
                return this.playWithVideoJS(this.addSecurityParams(this.getWebsocketURLForStream(cleanStreamId)), WebPlayer.WEBRTC_EXTENSION);
            case "vod":
                //TODO: Test case for vod
                //1. Play stream with mp4 for VoD
                //2. Play stream with webm for VoD
                //3. Play stream with playOrder type

                var lastIndexOfDot = streamIdToPlay.lastIndexOf(".");
                var extension;
                if (lastIndexOfDot != -1)
                {
                    //if there is a dot in the streamId, it means that this is extension, use it. make the extension empty
                    this.playType[0] = "";
                    extension = streamIdToPlay.substring(lastIndexOfDot + 1);
                }
                else {
					//we need to give extension to playWithVideoJS
					extension = this.playType[0];
				}

                return this.checkStreamExistsViaHttp(WebPlayer.STREAMS_FOLDER, streamIdToPlay,  this.playType[0]).then((streamPath) => {

                    //we need to give extension to playWithVideoJS
                    this.playWithVideoJS(streamPath, extension);

                }).catch((error) => {
                    Logger.warn("VOD stream resource not available for stream:" + streamIdToPlay + " and play type " + this.playType[0] + ". Error is " + error);
                    if (this.playType.length > 1) {
                        Logger.warn("Try next play type which is " + this.playType[1] + ".")
                        this.checkStreamExistsViaHttp(WebPlayer.STREAMS_FOLDER, streamIdToPlay, this.playType[1]).then((streamPath) => {
                            this.playWithVideoJS(streamPath, this.playType[1]);
                        }).catch((error) => {
                            Logger.warn("VOD stream resource not available for stream:" + streamIdToPlay + " and play type error is " + error);
                        });
                    }

                });
        }
    }


    getWebsocketURLForStream(streamIdToPlay) {
        return  this.websocketBaseURL + streamIdToPlay + ".webrtc";
    }

    /**
     *
     * @returns {String} query string for security
     */
    getSecurityQueryParams() {
        var queryString = "";
        if (this.token != null) {
            queryString += "token=" + this.token + "&";
        }
        if (this.subscriberId != null) {
            queryString += "subscriberId=" + this.subscriberId + "&";
        }
        if (this.subscriberCode != null) {
            queryString += "subscriberCode=" + this.subscriberCode + "&";
        }
        if (this.start != null) {
            queryString += "start=" + this.start + "&";
        }
        if (this.end != null) {
            queryString += "end=" + this.end + "&";
        }

        //remove the last character if it's "&"
        if (queryString.endsWith("&")) {
            queryString = queryString.substring(0, queryString.length - 1);
        }
        return queryString;
    }

   

    /**
     * play the stream with videojs player or dash player
     */
    play() {
        //if there is a request to play, try original stream first
        this.activeStreamId = this.streamId;
        if (this.activeStreamId.startsWith(WebPlayer.STREAMS_FOLDER)) {

            //start videojs player because it directly try to play stream from streams folder
            var lastIndexOfDot = this.activeStreamId.lastIndexOf(".");
            var extension = this.activeStreamId.substring(lastIndexOfDot + 1);

            this.playOrder= ["vod"];
            this.currentPlayType = this.playOrder[0];

            if (!this.httpBaseURL.endsWith("/")) {
                this.httpBaseURL += "/";
            }
            this.containerElement.innerHTML = this.videoHTMLContent;

            if (extension == WebPlayer.DASH_EXTENSION)
            {
				this.playViaDash(this.httpBaseURL + this.addSecurityParams(this.activeStreamId), extension);
			}
			else  {
				this.playWithVideoJS(this.httpBaseURL + this.addSecurityParams(this.activeStreamId), extension);
			}
        }
        else {
            this.playIfExists(this.playOrder[0], this.activeStreamId);
        }
    }

    /**
     * mute or unmute the player
     * @param {boolean} mutestatus true to mute the player
     */
    mutePlayer(mutestatus)
    {
        this.mute = mutestatus;
        if (this.videojsPlayer) {
            this.videojsPlayer.muted(mutestatus);
        }
        if (this.dashPlayer) {
            this.dashPlayer.setMute(mutestatus);
        }
    }

    /**
     *
     * @returns {boolean} true if player is muted
     */
    isMuted() {
        return this.mute;
    }

    addPlayerListener(playerListener) {
        this.playerListener = playerListener;
    }

    /**
     * WebRTC data listener
     * @param {*} webRTCDataListener
     */
    addWebRTCDataListener(webRTCDataListener) {
        this.webRTCDataListener = webRTCDataListener
    }

    /**
     * ID3 meta data listener
     * @param {*} id3Listener
     */
    addId3Listener(id3Listener) {
        this.id3Listener = id3Listener
    }

    /**
     *
     * @param {*} data
     */
    sendWebRTCData(data) {
	    try {
	        if (this.videojsPlayer && this.currentPlayType == "webrtc") {
	            this.videojsPlayer.sendDataViaWebRTC(data);
	            return true;
	        }
	        else {
	            Logger.warn("Player is not ready or playType is not WebRTC");
	        }
	    } catch (error) {
	        // Handle the error here
	        Logger.error("An error occurred while sending WebRTC data: ", error);
	    }
	    return false;
	}

    injectPtzElements(){
        var ptzControlsHtmlContent = `
        <style>
          .ptz-camera-container {
            display: none;
            position: absolute;
            flex-direction: row;
            align-items: center;
            bottom: 30px;
            right: 10px;
            z-index:999;
          }
          .direction-arrow-container {
            display: flex;
            width: 200px;
            height: 200px;
            position: relative;
          }
         
        </style>
        <div id="ptz-camera-container" class="ptz-camera-container">
          
            <div style="display: flex; flex-direction: column;">
             <div style="margin-bottom:5px">
                <span id="zoom-out-button" style="color: #bc1b22; font-size: 50px; font-weight: bold; user-select: none; cursor: pointer; margin-right: 5px;">-</span>
                <span id="zoom-in-button" style="color: #bc1b22; font-size: 50px; font-weight: bold; cursor: pointer; margin-left: 5px; user-select: none;">+</span>
             </div>
              <div id="direction-arrow-container" class="direction-arrow-container">
                <img id="up-button" style="position: absolute; width: 50px; cursor: pointer; height: 50px; left: 50%; transform: translateX(-50%);" src="`+ UpArrow.src +`"/>
             
                <img id="left-button" style="position: absolute; left: 0px; width: 50px; height: 50px; cursor: pointer; top: 50%; transform: translateY(-50%) rotate(-90deg);" src="`+UpArrow.src+`"/>
                <img id="right-button" style="position: absolute; right:0px; top: 50%; width: 50px; cursor: pointer; height: 50px; transform: translateY(-50%) rotate(90deg);" src="`+UpArrow.src+`"/>
                <img id="down-button" style="position: absolute; bottom:0px;left: 50%; width: 50px; cursor: pointer; height: 50px; transform: translateX(-50%) rotate(180deg);" src="`+UpArrow.src+`"/>
               
            </div>
           
           
            </div>
          </div>
        </div>
        `;

       var ptzCameraContainer = document.getElementById("ptz-camera-container");
       if (ptzCameraContainer) {
            Logger.info("PTZ controls are already injected");
            return;
       }
 
       var videoPlayerContainer = document.getElementById("video-player")
       videoPlayerContainer.insertAdjacentHTML('afterbegin', ptzControlsHtmlContent)

       let ptzButton = this.videojsPlayer.controlBar.addChild('button');
       let ptzButtonEl = ptzButton.el();
       ptzButtonEl.innerHTML = '<span style="cursor:pointer">PTZ</span>';
       ptzButtonEl.onclick = ()=> {
        var ptzContainer = document.getElementById("ptz-camera-container")
        var display = ptzContainer.style.display
        if(display === "none" || display === ""){
            this.scalePtzControls()
            ptzContainer.style.display = "flex"
        }else{
            ptzContainer.style.display = "none"
        }
       };
       ptzButton.controlText('Show PTZ Controls');
       this.videojsPlayer.controlBar
         .el()
         .insertBefore(
            ptzButtonEl,
           this.videojsPlayer.controlBar.getChild('fullscreenToggle').el()
         );
      
       
       this.videojsPlayer.on('fullscreenchange', ()=> {
            this.scalePtzControls()
       });

       this.initPtzControls()
       
    }

    scalePtzControls(){
        var containerWidth = this.getContainerWidth()
        var arrowButtonWidthHeight = Math.round((containerWidth* 25) / 640)
        var arrowContainerWidthHeight = Math.round((containerWidth * 75)/640)
        var zoomButtonTextSize = Math.round((containerWidth * 35)/640)

        this.ptzControlElements.leftButton = document.getElementById(PTZ_LEFT_BUTTON_ID);
        this.ptzControlElements.rightButton = document.getElementById(PTZ_RIGHT_BUTTON_ID);
        this.ptzControlElements.upButton = document.getElementById(PTZ_UP_BUTTON_ID);
        this.ptzControlElements.downButton = document.getElementById(PTZ_DOWN_BUTTON_ID);
           
        this.ptzControlElements.leftButton.style.width = arrowButtonWidthHeight+"px"
        this.ptzControlElements.leftButton.style.height = arrowButtonWidthHeight+"px"

        this.ptzControlElements.rightButton.style.width = arrowButtonWidthHeight+"px"
        this.ptzControlElements.rightButton.style.height = arrowButtonWidthHeight+"px"

        this.ptzControlElements.upButton.style.width = arrowButtonWidthHeight+"px"
        this.ptzControlElements.upButton.style.height = arrowButtonWidthHeight+"px"

        this.ptzControlElements.downButton.style.width = arrowButtonWidthHeight+"px"
        this.ptzControlElements.downButton.style.height = arrowButtonWidthHeight+"px"

        this.ptzControlElements.directionArrowContainer.style.width = arrowContainerWidthHeight+"px"
        this.ptzControlElements.directionArrowContainer.style.height = arrowContainerWidthHeight+"px"

        this.ptzControlElements.zoomInButton.style.fontSize = zoomButtonTextSize+"px"
        this.ptzControlElements.zoomOutButton.style.fontSize = zoomButtonTextSize+"px"


    }

    getContainerWidth(){
        var videoPlayerContainer = document.getElementById("video-player")
        var rect = videoPlayerContainer.getBoundingClientRect()
        return rect.width
       
    }

    initPtzControls(){

        this.ptzControlElements.directionArrowContainer = document.getElementById("direction-arrow-container")
        


        this.ptzControlElements.leftButton = document.getElementById(PTZ_LEFT_BUTTON_ID);
        this.ptzControlElements.rightButton = document.getElementById(PTZ_RIGHT_BUTTON_ID);
        this.ptzControlElements.upButton = document.getElementById(PTZ_UP_BUTTON_ID);
        this.ptzControlElements.downButton = document.getElementById(PTZ_DOWN_BUTTON_ID);
        this.ptzControlElements.zoomInButton = document.getElementById(PTZ_ZOOM_IN_BUTTON_ID);
        this.ptzControlElements.zoomOutButton = document.getElementById(PTZ_ZOOM_OUT_BUTTON_ID);


        this.ptzControlElements.leftButton.addEventListener('click', () => this.moveCamera(1 * this.ptzValueStep, 0, 0, this.ptzMovement));
        this.ptzControlElements.rightButton.addEventListener('click', () => this.moveCamera(-1 * this.ptzValueStep, 0, 0, this.ptzMovement));
        this.ptzControlElements.downButton.addEventListener('click', () => this.moveCamera(0, -1 * this.ptzValueStep, 0, this.ptzMovement));
        this.ptzControlElements.upButton.addEventListener('click', () => this.moveCamera(0, this.ptzValueStep, 0, this.ptzMovement));
        this.ptzControlElements.zoomInButton.addEventListener('click', () => this.moveCamera(0, 0, this.ptzValueStep, this.ptzMovement));
        this.ptzControlElements.zoomOutButton.addEventListener('click', () => this.moveCamera(0, 0, - 1 * this.ptzValueStep, this.ptzMovement));
    }

    isIpCameraBroadcast() {
        var apiEndpoint =  "rest/v2/broadcasts/" + this.streamId;
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': this.restJwt
          },
        };
      
        var restPromise;
        if (this.restAPIPromise) {
            restPromise = this.restAPIPromise(apiEndpoint, requestOptions);
        }
        else {
            restPromise = fetch(this.httpBaseURL + apiEndpoint, requestOptions);
        }
        restPromise
          .then(response => response.json ? response.json() : response)
          .then(data => {
            var broadcastType = data.type;
            
            if (broadcastType === "ipCamera") {
              this.injectPtzElements()                
            }
            console.log(data);
          }).catch(error => console.error('Error:', error));;
      }
      
    moveCamera(valueX, valueY, valueZ, movement) {

        Logger.info("move camera called valuex:" + valueX + " valueY:" + valueY + " valueZ:" + valueZ + " movement:" + movement);
        var apiEndpoint =  "rest/v2/broadcasts/" + this.streamId + "/ip-camera/move"+ "?valueX="+valueX+"&valueY="+valueY+"&valueZ="+valueZ+"&movement="+movement;
       
        const requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': this.restJwt,
            'Content-Type': 'application/json',
          },
        };
        var restPromise;
        if (this.restAPIPromise) {
            restPromise = this.restAPIPromise(apiEndpoint, requestOptions);
        }
        else {
            restPromise = fetch(this.httpBaseURL + apiEndpoint, requestOptions);
        }
      
        restPromise
          .then(response => response.json ? response.json() : response)
          .then(data => {
            // Handle the response data as needed
          })
          .catch(error => console.error('Error:', error));
      }
      
    getSource() {
        if (this.videojsPlayer) {
            return this.videojsPlayer.currentSrc();
        }
        else if (this.dashPlayer) {
            return this.dashPlayer.getSource();
        }
    }

    getTime() {
        if (this.videojsPlayer) {
            return this.videojsPlayer.currentTime()
        }
        else if (this.dashPlayer) {
            return this.dashPlayer.time();
        } 
    }

}
