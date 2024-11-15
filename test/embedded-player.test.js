
import { STATIC_VIDEO_HTML, WebPlayer } from '../dist/es/web_player.js';
//import { isMobile } from "../../../main/js/fetch.stream.js";

describe("WebPlayer", function() {
		
	var clock;
	
	var sandbox;

	beforeEach(function () {
	  clock = sinon.useFakeTimers();
	  sandbox = sinon.createSandbox();
	});
	
	
	afterEach(() => {
	  // Restore the default sandbox here
	  sinon.restore();
	  clock.restore();
	  sandbox.restore();
	});
	
	 it("Check default parameters", async function() {
		
		
		  var videoContainer = document.createElement("video_container");
		  
		  var placeHolder = document.createElement("place_holder");
		  			
		  var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/" , protocol:"http:"};
		  var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	      var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	      
	      expect(player.streamId).to.equal('stream123');
	      expect(player.playOrder).to.eql(["webrtc","hls"]);
	      expect(player.token).to.be.null;
	      expect(player.is360).to.be.false;
	      expect(player.playType).to.eql(['mp4','webm']);
	      
	      
	      //the following is a test autoPlay is still true in mobile. We just try to play the stream if mobile browser can play or not
		  //in autoPlay mode 
	      expect(player.autoPlay).to.true;
	      expect(player.mute).to.false;
	      expect(player.isMuted()).to.be.false;
	      expect(player.targetLatency).to.equal(3);
	      expect(player.subscriberId).to.be.null;
	      expect(player.subscriberCode).to.be.null;
	      expect(player.containerElement).to.equal(videoContainer);
	      expect(player.placeHolderElement).to.equal(placeHolder);
	      expect(player.iceConnected).to.false;
	      expect(player.errorCalled).to.false;
	      
	      expect(player.getSecurityQueryParams()).to.be.equal("");
    });

	it("checkWebsocketURLIfSecure", async function() {
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");

		var token = "this_is_the_token";
		var subscriberId = "this_is_subscriber_id";
		var subscriberCode = "this_is_subscriber_id_subscriberCode"
		var locationComponent =  { 	href : 'https://example.com?id=stream123', 
									pathname:"/", 
									search: "?id=stream123&playOrder=webrtc,hls,dash&token="+token+"&is360=true"+
										"&playType=webm&mute=false&targetLatency=6&subscriberId="+subscriberId+ "&subscriberCode="+subscriberCode+"&autoplay=false", 
									hostname:"example.com", 
									port:"", 
									protocol:"https:"
								};
		var windowComponent = { location : locationComponent,
										document:  document};

		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);

		expect(player.websocketURL).to.be.equal('wss://example.com/stream123.webrtc');
	});
    
    it("Check url parameters", async function() {
		
		  var videoContainer = document.createElement("video_container");
		  
		  var placeHolder = document.createElement("place_holder");
		  			
		  var token = "this_is_the_token";
		  var subscriberId = "this_is_subscriber_id";
		  var subscriberCode = "this_is_subscriber_id_subscriberCode"
		  var locationComponent =  { href : 'http://example.com?id=stream123', 
		  							 pathname:"/", 
		  							 search: "?id=stream123&playOrder=webrtc,hls,dash&token="+token+"&is360=true"+
		  								"&playType=webm&mute=false&targetLatency=6&subscriberId="+subscriberId+ "&subscriberCode="+subscriberCode+"&autoplay=false"
									, hostname:"example.com", port:"", protocol:"http:"	
		  								
		  							 };
		  var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	      var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	      
	      expect(player.streamId).to.equal('stream123');
	      expect(player.playOrder).to.eql(["webrtc","hls","dash"]);
	      expect(player.token).to.be.equal(token);
	      expect(player.is360).to.be.true;
	      expect(player.playType).to.eql(['webm']);
	      expect(player.autoPlay).to.false;
	      expect(player.mute).to.false;
	      expect(player.isMuted()).to.be.false;
	      expect(player.targetLatency).to.equal(6);
	      expect(player.subscriberId).to.equal(subscriberId);
	      expect(player.subscriberCode).to.equal(subscriberCode);
	      expect(player.containerElement).to.equal(videoContainer);
	      expect(player.placeHolderElement).to.equal(placeHolder);
	      expect(player.iceConnected).to.false;
	      expect(player.errorCalled).to.false;

		  expect(player.websocketURL).to.be.equal('ws://example.com/stream123.webrtc');
		  expect(player.httpBaseURL).to.be.equal('http://example.com/');
	      expect(player.getSecurityQueryParams()).to.be.equal("&token="+token+"&subscriberId="+subscriberId+"&subscriberCode="+subscriberCode);      
    

		  {
			locationComponent =  {  href : 'http://example.com?id=stream123', 
				search: "?id=stream123&playOrder=webrtc,hls,dash&token="+token+"&is360=true"+
				"&playType=webm&mute=false&targetLatency=6&subscriberId="+subscriberId+ "&subscriberCode="+subscriberCode+"&autoplay=false"
				, hostname:"example.com", port:""	, protocol:"http:"
			};
			windowComponent = { location : locationComponent,
				document:  document};

			player = new WebPlayer(windowComponent, videoContainer, placeHolder);

			expect(player.websocketURL).to.be.equal('ws://example.com/stream123.webrtc');
			expect(player.httpBaseURL).to.be.equal('http://example.com/');


		  }
    });
    
    it("CheckConfigParameters", async function(){
	        
        var videoContainer = document.createElement("video_container");
		  
	
        
		var player = new WebPlayer({
			streamId:"streamConfig",
		}, videoContainer, null);
		
		expect(player.streamId).to.be.equal("streamConfig");
		expect(player.containerElement).to.equal(videoContainer);
	    expect(player.placeHolderElement).to.be.null;
		expect(player.playOrder).to.eql(["webrtc","hls"]);
	 	expect(player.token).to.be.null;
	 	expect(player.is360).to.be.false;
		expect(player.playType).to.eql(['mp4','webm']);
		  
		  
		  //the following is a test autoPlay is still true in mobile. We just try to play the stream if mobile browser can play or not
		  //in autoPlay mode 
		expect(player.autoPlay).to.true;
		expect(player.mute).to.false;
		expect(player.isMuted()).to.be.false;
		expect(player.targetLatency).to.equal(3);
		expect(player.subscriberId).to.be.null;
		expect(player.subscriberCode).to.be.null;
		expect(player.iceConnected).to.false;
		expect(player.errorCalled).to.false;
		
		
		var placeHolder = document.createElement("place_holder");
		var player = new WebPlayer({
			streamId:"streamConfig123",
			playOrder: ["webrtc","hls","dash"],
			token: "token",
			is360: true,
			playType: ["webm"],
			autoPlay: false,
			mute: false,
			targetLatency: 5,
			subscriberId: "subscriberId",
			subscriberCode: "subscriberCode",
			httpBaseURL: "http://example.antmedia.io:5080/WebRTCAppEE",
		}, videoContainer, placeHolder);
		
		
		expect(player.streamId).to.be.equal("streamConfig123");
		expect(player.containerElement).to.be.equal(videoContainer);
	    expect(player.placeHolderElement).to.be.equal(placeHolder);
		expect(player.playOrder).to.eql(["webrtc","hls","dash"]);
	 	expect(player.token).to.be.equal("token");
	 	expect(player.is360).to.be.true;
		expect(player.playType).to.eql(['webm']);
		  
		  
		  //the following is a test autoPlay is still true in mobile. We just try to play the stream if mobile browser can play or not
		  //in autoPlay mode 
		expect(player.autoPlay).to.false;
		expect(player.mute).to.false;
		expect(player.isMuted()).to.be.false;
		expect(player.targetLatency).to.equal(5);
		expect(player.subscriberId).to.be.equal('subscriberId');
		expect(player.subscriberCode).to.be.equal('subscriberCode');
		
		expect(player.httpBaseURL).to.be.equal('http://example.antmedia.io:5080/WebRTCAppEE/');
		
		expect(player.websocketURL).to.be.equal('ws://example.antmedia.io:5080/WebRTCAppEE/streamConfig123.webrtc');
		
	});
	
	it("loadComponents", async function(){
			
	    this.timeout(10000);
		var videoContainer = document.createElement("video_container");
		  
	
 
		var player = new WebPlayer({
			streamId:"streamConfig",
		}, videoContainer, null);
		
		
		{
			await player.initialize().then(()=> {
				
			}).catch((err) => {
				expect.fail("it should not fail because it's already loaded");
			});
			
		}
		
		{
			player.playOrder = ["dash"];
			await player.initialize().then(()=> {
				
			}).catch((err) => {
				expect.fail("it should not fail because we skip videojs and dash is already loaded");
			});
		}

		{
			player.playOrder = ["hls","dash"];

			await player.loadWebRTCComponents().then(() => {
				//it will just return promise
			}).catch((err) => {
				expect.fail("it should not reject");
			});


			player.playOrder = ["webrtc", "dash"];

			await player.loadWebRTCComponents().then(() => {
				expect.fail("it should reject because it's not loadable here");
			}).catch((err) => {

			});
		}
		
		
	});
    
     it("Check if not stream id", async function() {
	  	var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  
		var locationComponent =  { href : 'http://example.com', search: "", pathname:"/" , protocol:"http:"};
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		try {
			var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
			//it should throw error
			expect.fail("it should throw exception");
		}
		catch (err) {
			//expected because there is no stream id
		}
		
		var locationComponent =  { href : 'http://example.com?name=stream123', search: "?name=stream123", pathname:"/", protocol:"http:" };
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		  						  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		
		expect(player.streamId).to.equal('stream123');
	 });
	 
	 
	 
	 it("Check http resource is available", async function() {
		
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', protocol:"http:", search: "?id=stream123" , pathname:"/", hostname:"example.antmedia.io", port:"5080"};
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    
	    var streamsFolder = "testfolder";

		function mockApiSuccess(body = {}) {
		    return new window.Response(JSON.stringify(body), {
		       status: 200,
		       headers: { 'Content-type': 'application/json' }
		    });
		}
	    
	    var fake = sinon.replace(window, "fetch", sinon.fake.returns(Promise.resolve(mockApiSuccess())));


	    var testFolder = "testFolder";
	    var streamId = "stream123";
	    var extension = "m3u8";
	    await player.checkStreamExistsViaHttp(testFolder, streamId, extension).then((streamPath) => {
			expect(streamPath).to.be.equal("http://example.antmedia.io:5080" + "/" + testFolder + "/" + streamId + "_adaptive" + "." + extension);
		}).catch((err) => {
			expect.fail("it should not throw exception. error:" +  err);
		});
		
		testFolder = "testFolder";
		streamId = "stream123";
		await  player.checkStreamExistsViaHttp(testFolder, testFolder + "/" + streamId, extension).then((streamPath) => {
			console.log("stream path: " + streamPath);
			expect(streamPath).to.be.equal("http://example.antmedia.io:5080" + "/" + testFolder + "/" + streamId + "_adaptive" + "." + extension);
		}).catch((err) => {
			expect.fail("it should not throw exception");
		});
		
		
		testFolder = "testFolder";
		streamId = "stream123";
		var token = "token2323kjfalskfhakf";
		player.token = token;
		await  player.checkStreamExistsViaHttp(testFolder, streamId, extension).then((streamPath) => {
			console.log("stream path: " + streamPath);
			expect(streamPath).to.be.equal("http://example.antmedia.io:5080" + "/" + testFolder + "/" + streamId + "_adaptive" + "." + extension + "?&token=" + token);
		}).catch((err) => {
			expect.fail("it should not throw exception");
		});
		
	});
	
	
	 it("Check when http resource is not available", async function() {
		
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/", protocol:"http:" };
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    
	    var streamsFolder = "testfolder";

		function mockApiSuccess(body = {}) {
		    return new window.Response(JSON.stringify(body), {
		       status: 200,
		       headers: { 'Content-type': 'application/json' }
		    });
		}
	    

	    var testFolder = "testFolder";
	    var streamId = "stream123";
	    var extension = "m3u8";

		function mockApiFail(body = {}) {
		    return new window.Response(JSON.stringify(body), {
		       status: 404,
		       headers: { 'Content-type': 'application/json' }
		    });
		}
		
		var fake = sinon.replace(window, "fetch", sinon.fake.returns(Promise.resolve(mockApiFail())));
		
		await  player.checkStreamExistsViaHttp(testFolder, streamId, extension).then((streamPath) => {
			expect.fail("it should not reject");
		}).catch((err) => {			
			expect(err).to.be.equal("resource_is_not_available");
		});
		
	});
	
	
	it("destroy", async function() {
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/" , protocol:"http:"};
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    
	    var destroyDashPlayer = sinon.replace(player, "destroyDashPlayer", sinon.fake());
	    var destroyVideoJSPlayer = sinon.replace(player, "destroyVideoJSPlayer", sinon.fake());
	    
	    
	    player.destroy();
	    
	    expect(destroyDashPlayer.calledOnce).to.be.true;
	    expect(destroyVideoJSPlayer.calledOnce).to.be.true;
		
	});
	
	it("tryNextTech", async function() {
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/" , protocol:"http:"};
		var windowComponent = { location : locationComponent,
		  						  document:  document};
		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    
	    var destroyDashPlayer = sinon.replace(player, "destroyDashPlayer", sinon.fake());
	    var destroyVideoJSPlayer = sinon.replace(player, "destroyVideoJSPlayer", sinon.fake());
	    var playIfExists = sinon.replace(player, "playIfExists", sinon.fake());
	    var setPlayerVisible = sinon.replace(player, "setPlayerVisible", sinon.fake());

	    player.playOrder = ["webrtc","hls"];
	    player.currentPlayType = "webrtc";
	    
	    player.tryNextTech();
	    
	    
	    
	    expect(destroyDashPlayer.calledOnce).to.be.true;
	    expect(destroyVideoJSPlayer.calledOnce).to.be.true;
	    expect(setPlayerVisible.calledOnce).to.be.true;
	    expect(setPlayerVisible.calledWithMatch(false)).to.be.true;
	    
	    clock.tick(2500);
	    
	    expect(playIfExists.calledOnce).to.be.false;
	    
	    clock.tick(3500);
	    
	    expect(playIfExists.calledOnce).to.be.true;
	    expect(playIfExists.calledWithMatch("hls")).to.be.true;
	    
	    player.currentPlayType = "hls";
	    
	    player.tryNextTech();
	    clock.tick(3500);
	    expect(playIfExists.callCount).to.be.equal(2);
	    expect(playIfExists.calledWithMatch("webrtc")).to.be.true;

	});
	
	
	it("play", async function() {
		this.timeout(10000);

		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/", protocol:"http:" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  
		const fixture = document.createElement('div');
		fixture.innerHTML = STATIC_VIDEO_HTML;
		
		// Append the fixture element to the document body
		document.body.appendChild(fixture);
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);

		await player.initialize();
	    var playIfExists = sinon.replace(player, "playIfExists", sinon.fake());
	    
	    player.play();
	    
	    expect(playIfExists.callCount).to.be.equal(1);
	    sinon.restore();
	    
	    var locationComponent =  { href : 'http://example.com?id=streams/stream123.mp4', protocol:"http:", search: "?id=streams/stream123.mp4", pathname:"/", hostname:"example.antmedia.io", port:"5080" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  					
		
		player = new WebPlayer(windowComponent, videoContainer, placeHolder);	
		
		await player.initialize();
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());

		player.play();
		
		expect(playWithVideoJS.calledWithExactly("http://example.antmedia.io:5080/streams/stream123.mp4", "mp4")).to.be.true;

		sinon.restore();
		
		var makeVideoJSVisibleWhenReady = sinon.replace(player, "makeVideoJSVisibleWhenReady", sinon.fake());

		player.play();
		expect(makeVideoJSVisibleWhenReady.calledOnce).to.be.true;
		
		
		sinon.restore();
		var locationComponent =  { href : 'http://example.com?id=streams/stream123/stream123.mpd', protocol:"http:", search: "?id=streams/stream123/stream123.mpd", pathname:"/" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  
		player = new WebPlayer(windowComponent, videoContainer, placeHolder);	
		await player.initialize();
		var playViaDash = sinon.replace(player, "playViaDash", sinon.fake());
		player.play();
		expect(playViaDash.calledWithMatch("streams/stream123/stream123.mpd", "mpd")).to.be.true;	
	
	});
	
	
	it("makeVideoJSVisibleWhenInitialized", async function() 
	{
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname:"/" , protocol:"http:"};
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  
		console.log("makeVideoJSVisibleWhenInitialized--------------------");
		  						  
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");		  						  
		  						  
		videoContainer.innerHTML = STATIC_VIDEO_HTML;
		
		// Append the fixture element to the document body
		document.body.appendChild(videoContainer);		  						  
	  
		
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);	
		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123.m3u8")));

		var makeVisibleWhenInitialzed =  sinon.replace(player, "makeVideoJSVisibleWhenReady", sinon.fake());
		
		await player.playIfExists("hls");
		
		expect(makeVisibleWhenInitialzed.calledOnce).to.be.true;
		
		
		console.log("makeVideoJSVisibleWhenInitialized-----------end---------");
	  	
	});
	
	
	it("makeDashPlayerVisibleWhenInitialized", async function() 
	{
		var locationComponent =  { href : 'http://example.com?id=streams/stream123/stream123.mpd', search: "?id=streams/stream123/stream123.mpd&playOrder=dash", pathname:"/", protocol:"http:" };	
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");		  						  
		  						  
		videoContainer.innerHTML = STATIC_VIDEO_HTML;
		
		// Append the fixture element to the document body
		document.body.appendChild(videoContainer);		  						  
	  
		
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);	
		var makeVisibleWhenInitialzed =  sinon.replace(player, "makeDashPlayerVisibleWhenInitialized", sinon.fake());

		await player.initialize();
		
		player.play();
		expect(makeVisibleWhenInitialzed.calledOnce).to.be.true;


	});
	
	
	it("playIfExistsWebRTC", async function() {
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123",  pathname: "/", 
									hostname:"example.com", port:5080,
									protocol:"http:" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  };
		  						  
		  						  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
		
		await player.playIfExists("webrtc");	
		expect(playWithVideoJS.callCount).to.be.equal(1);
		expect(playWithVideoJS.calledWithExactly("ws://example.com:5080/stream123.webrtc", "webrtc", undefined)).to.be.true;
		
	});
	
	it("playIfExists", async function() {
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123",  protocol:"http:", pathname: "/", hostname:"example.com", port:5080 };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  };
		  						  
		  						  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	 
	    
		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123.m3u8")));
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
		var setPlayerVisible = sinon.replace(player, "setPlayerVisible", sinon.fake());
		
		
		await player.playIfExists("hls");	  
		
		expect(playWithVideoJS.called).to.be.true;
		expect(playWithVideoJS.calledWithMatch("streams/stream123.m3u8")).to.be.true;
		expect(setPlayerVisible.called).to.be.true;
		expect(setPlayerVisible.calledWithMatch(false)).to.be.true;
		
		await player.playIfExists("webrtc");	
		expect(playWithVideoJS.callCount).to.be.equal(2);
		expect(playWithVideoJS.calledWithMatch("ws://example.com:5080/stream123.webrtc", "webrtc")).to.be.true;
		
		sinon.restore();
		
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123.mp4")));
		await player.playIfExists("vod");
		
		expect(playWithVideoJS.callCount).to.be.equal(1);
		expect(playWithVideoJS.calledWithMatch("streams/stream123.mp4", "mp4")).to.be.true;
		
		sinon.restore();
		
		var playViaDash = sinon.replace(player, "playViaDash", sinon.fake());
		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123/stream123.mpd")));
		
		await player.playIfExists("dash");
		expect(playViaDash.callCount).to.be.equal(1);
		expect(playViaDash.calledWithMatch("streams/stream123/stream123.mpd")).to.be.true;
		
		
		
		sinon.restore();
		var tryNextTech = sinon.replace(player, "tryNextTech", sinon.fake());
		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.reject("")));
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
		
		await player.playIfExists("hls");
		expect(tryNextTech.callCount).to.be.equal(1);
		
		
		await player.playIfExists("dash");
		expect(tryNextTech.callCount).to.be.equal(2);
		
		await player.playIfExists("vod");
		//because it will not tryNextTech if promises fails
		expect(tryNextTech.callCount).to.be.equal(2);
		
	});
	
	it("playVoD", async function() {
		//Confirming the fix for this issue
		//https://github.com/ant-media/Ant-Media-Server/issues/5137
		
		
		
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123.mp4', search: "?id=stream123.mp4" , pathname:"/", protocol:"http:" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    var checkStreamExistsViaHttp = sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123.mp4")));
	    var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
	    
	    await player.playIfExists("vod");
	    
	    expect(checkStreamExistsViaHttp.calledWithMatch(WebPlayer.STREAMS_FOLDER, "stream123.mp4", "")).to.be.true;
	    expect(playWithVideoJS.calledWithMatch("streams/stream123.mp4", "mp4")).to.be.true;
	    
	    
	    sinon.restore();
	    
	    locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123",  pathname:"/" , protocol:"http:"};
	    windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  
	    var player2 = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    checkStreamExistsViaHttp = sinon.replace(player2, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("")));
	    expect(player2.playType[0]).to.be.equal("mp4");
	    
	    player2.playIfExists("vod");
	    
	    expect(checkStreamExistsViaHttp.calledWithMatch(WebPlayer.STREAMS_FOLDER, "stream123", "mp4")).to.be.true;
	    		
	});
	
	
	it("handleWebRTCInfoMessages", async function() {
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	
		var locationComponent = { href: 'http://example.com?id=stream123.mp4', search: "?id=stream123.mp4", pathname: "/", protocol: "http:" };
		var windowComponent = {
			location: locationComponent,
			document: document,
			addEventListener: window.addEventListener
		};
	
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		var tryNextTech = sinon.replace(player, "tryNextTech", sinon.fake.returns(Promise.resolve("")));
		var cancelBackupStreamPlayerInterval = sinon.replace(player, "cancelBackupStreamPlayerInterval", sinon.fake());
		var isBackupStreamEnabledSpy = sinon.spy(player, "isBackupStreamEnabled"); // Use spy here
		var startBackupStreamPlayerInterval = sinon.replace(player, "startBackupStreamPlayerInterval", sinon.fake());
	
		var infos = {
			info: "ice_connection_state_changed",
			obj: {
				state: "completed"
			}
		};
	
		expect(player.iceConnected).to.be.false;
		player.handleWebRTCInfoMessages(infos);
		expect(player.iceConnected).to.be.true;
	
		infos = {
			info: "ice_connection_state_changed",
			obj: {
				state: "failed"
			}
		};
		player.handleWebRTCInfoMessages(infos);
	
		expect(tryNextTech.calledOnce).to.be.true;
	
		infos = {
			info: "closed",
		};
		player.handleWebRTCInfoMessages(infos);
	
		expect(tryNextTech.calledTwice).to.be.true;
	
		await player.playIfExists("webrtc");
	
		expect(player.videojsPlayer).to.not.be.null;
	
		var pauseMethod = sinon.replace(player.videojsPlayer, "pause", sinon.fake());
		var playMethod = sinon.replace(player.videojsPlayer, "play", sinon.fake());
	
		infos = {
			info: "resolutionChangeInfo",
		};
	
		player.handleWebRTCInfoMessages(infos);
	
		expect(pauseMethod.calledOnce).to.be.true;
		expect(playMethod.calledOnce).to.be.false;
	
		clock.tick(2500);
	
		expect(pauseMethod.calledOnce).to.be.true;
		expect(playMethod.calledOnce).to.be.true;
	
		infos = {
			info: "ice_connection_state_changed",
			obj: {
				state: "completed"
			}
		};
		player.backupStreamPlayerInterval = 1;
	
		player.handleWebRTCInfoMessages(infos);
	
		infos = {
			info: "ice_connection_state_changed",
			obj: {
				state: "connected"
			}
		};
	
		player.handleWebRTCInfoMessages(infos);
	
		expect(cancelBackupStreamPlayerInterval.calledTwice).to.be.true;
	
		// Set up player properties to ensure isBackupStreamEnabled returns true
		player.backupStreamId = "backupStreamId";
		player.playOrder = ["webrtc"]; // Ensure playOrder length is 1
		player.backupStreamTryCount = 1;
		player.maxBackupStreamTryCount = 5;
	
		infos = {
			info: "ice_connection_state_changed",
			obj: {
				state: "failed"
			}
		};
	
		player.handleWebRTCInfoMessages(infos);
	
		expect(isBackupStreamEnabledSpy.calledTwice).to.be.true;
		expect(isBackupStreamEnabledSpy.returned(true)).to.be.true;
		
		expect(startBackupStreamPlayerInterval.calledOnce).to.be.true;
	});

	it("testAutoPlay",async function(){
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent = { href: 'http://example.com?id=stream123.mp4', search: "?id=stream123.mp4", pathname: "/", protocol: "http:"  };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    let vjsMock = videojs(WebPlayer.VIDEO_PLAYER_ID, {
			poster: "test",
            liveui:true ,
            liveTracker: {
                trackingThreshold: 0
            },
            html5: {
                vhs: {
                    limitRenditionByPlayerDimensions: false
                }
            },
            controls: true,
            class: 'video-js vjs-default-skin vjs-big-play-centered',
            muted: false,
            preload: "auto",
            autoplay: true
		});

		const mockVideoJS = sinon.stub(window, 'videojs').callsFake(()=>{return vjsMock});
	    var muted = sinon.replace(vjsMock, "muted", sinon.fake());
		let play = sinon.stub(vjsMock, 'play').callsFake(()=>{
			return Promise.resolve();
		});
		await player.playIfExists("webrtc");  // autoplay worked with audio
		expect(play.calledOnce).to.be.true;
	    expect(muted.notCalled).to.be.true;
		
		play.restore();

		play = sinon.stub(vjsMock, 'play').callsFake(()=>{
			return Promise.reject(new DOMException("NotAllowedError","NotAllowedError"));
		});
		player.forcePlayWithAudio = true;

		await player.playIfExists("webrtc");  // autoplay failed force play with audio 
		expect(play.calledOnce).to.be.true;
	    expect(muted.notCalled).to.be.true;
			
		play.restore();


		play = sinon.stub(vjsMock, 'play').callsFake(()=>{
			return Promise.reject(new DOMException("NotAllowedError","NotAllowedError"));
		});
		player.forcePlayWithAudio = false;
		await player.playIfExists("webrtc");  // autoplay failed try to play without audio

		expect(play.calledTwice).to.be.true;
	    expect(muted.calledWithMatch(true)).to.be.true;
		
		sinon.restore();		
	})
	
	
	it("webrtc-info-event", async function() {
		
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname: "/", protocol:"http:" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	    
	    var handleWebRTCInfoMessages = sinon.replace(player, "handleWebRTCInfoMessages", sinon.fake());
	    await player.playIfExists("webrtc");
	    
	    var infos = {
			info: "closed",
		}
		
		var event = {
			data: "any"
		}
	    
	    player.videojsPlayer.trigger("webrtc-info", { infos, event});
	    
	    expect(handleWebRTCInfoMessages.calledOnce).to.be.true;
	    expect(handleWebRTCInfoMessages.calledWithMatch({ infos , event})).to.be.true;
	    
	})
	
	it("destroyVideoJSPlayer", async function() {
		
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname: "/" , protocol:"http:"};
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);

	    expect(player.videojsPlayer).to.be.null

	    await player.playIfExists("webrtc");
	    
	    expect(player.videojsPlayer).to.not.be.null;
	  
	    player.destroyVideoJSPlayer();
	    expect(player.videojsPlayer).to.be.null
	})
	
	it("sendWebRTCData", async function() {
		
		this.timeout(10000);
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		
		var videoPlayer = document.createElement("video");
		videoPlayer.id = WebPlayer.VIDEO_PLAYER_ID;
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123",  pathname: "/", hostname:"example.com", port:5080 , protocol:"http:"};
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  };
		  						  
		//videoContainer.innerHTML = STATIC_VIDEO_HTML;

		// Append the fixture element to the document body
		document.body.appendChild(videoPlayer);	
									
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		//var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());
		
		await player.playIfExists("webrtc");	
		
		
		var sendDataViaWebRTC = sinon.fake();
		player.videojsPlayer.sendDataViaWebRTC = sendDataViaWebRTC;
		
		//send data and it should increase the call count
		var result = player.sendWebRTCData("data");
		expect(sendDataViaWebRTC.callCount).to.be.equal(1);
		expect(result).to.be.true;
		
		
		sendDataViaWebRTC = sinon.fake.throws(new Error("error"));
		player.videojsPlayer.sendDataViaWebRTC = sendDataViaWebRTC;
		result = player.sendWebRTCData("data");
		expect(result).to.be.false;
		expect(sendDataViaWebRTC.callCount).to.be.equal(1);
		
		
		//destroy the player and send again, it should not increase the call count
		player.destroyVideoJSPlayer();
		result = player.sendWebRTCData("data");
		expect(result).to.be.false;
		expect(sendDataViaWebRTC.callCount).to.be.equal(1);
	});


	it("handleDashPlayBackNotAllowed", async function(){
			
	    this.timeout(10000);
		var videoContainer = document.createElement("video_container");
		  
	
 
		var player = new WebPlayer({
			streamId:"streamConfig",
		}, videoContainer, null);
		
		
		{
			player.playOrder = ["dash"];
			await player.initialize().then(()=> {
				
			}).catch((err) => {
				expect.fail("it should not fail because we skip videojs and dash is already loaded");
			});
		}

		player.dashPlayer = window.dashjs.MediaPlayer().create();

		var setMute = sinon.replace(player.dashPlayer, "setMute", sinon.fake());
		var play = sinon.replace(player.dashPlayer, "play", sinon.fake());
		var nextTech = sinon.replace(player, "tryNextTech", sinon.fake());

		expect(player.forcePlayWithAudio).to.be.false;
		player.handleDashPlayBackNotAllowed();
		expect(setMute.calledOnce).to.be.true;
		expect(play.calledOnce).to.be.true;
		expect(nextTech.notCalled).to.be.true;

		expect(setMute.calledWithExactly(true)).to.be.true;


		player.forcePlayWithAudio = true;
		player.handleDashPlayBackNotAllowed();
		expect(setMute.calledOnce).to.be.true;
		expect(play.calledOnce).to.be.true;
		expect(nextTech.calledOnce).to.be.true;

		
		
	});

	it("LL-HLS play", async function() {
		this.timeout(10000);
	
		var videoContainer = document.createElement("video_container");

		var httpBaseUrl = "http://localhost:5080/LiveApp/";
		var streamId = "streamConfig";
		var streamPath = httpBaseUrl + WebPlayer.STREAMS_FOLDER + "/" + WebPlayer.LL_HLS_FOLDER + "/" + streamId + "/" + streamId + "__master." + WebPlayer.HLS_EXTENSION;
		
		var player = new WebPlayer({
			streamId: streamId,
			httpBaseUrl: httpBaseUrl,
			playOrder: ["ll-hls"]
		}, videoContainer, null);

		var checkStreamExistsViaHttp = sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.resolves(streamPath));
		var playWithVideoJS = sinon.replace(player, "playWithVideoJS", sinon.fake());

		await player.playIfExists("ll-hls");

		expect(checkStreamExistsViaHttp.calledWithMatch(WebPlayer.STREAMS_FOLDER + "/" + WebPlayer.LL_HLS_FOLDER, streamId, WebPlayer.HLS_EXTENSION)).to.be.true;
		expect(playWithVideoJS.calledWithMatch(streamPath, WebPlayer.HLS_EXTENSION)).to.be.true;
	});
	
	it("Player events", async function() {
		this.timeout(10000)
		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123",  protocol:"http:", pathname: "/", hostname:"example.com", port:5080 };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  };
		  						  			  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	 
	    var setPlayerVisible = sinon.replace(player, "setPlayerVisible", sinon.fake());
		
		// Mock videojsPlayer
		player.videojsPlayer = {
			on: sinon.stub(),
			currentTime: sinon.stub().returns(10),
			bufferedPercent: sinon.stub().returns(0.5),
			volume: sinon.stub().returns(0.8),
			muted: sinon.stub().returns(false),
			playbackRate: sinon.stub().returns(1.0),
		};
		
		player.playerListener = sinon.stub();
		
		player.tryNextTech = sinon.stub();
		
		player.listenPlayerEvents();
		
		player.playerEvents.forEach(event => {
		  expect(player.videojsPlayer.on.calledWith(event)).to.be.true;
		});
		
		const playCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'play')[1];
		playCallback();
		expect(setPlayerVisible.calledWith(true)).to.be.true;
		expect(player.playerListener.calledWith("play")).to.be.true;
		
		const endedCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'ended')[1];
		endedCallback();
		expect(setPlayerVisible.calledWith(false)).to.be.true;
		expect(player.playerListener.calledWith("ended")).to.be.true;

		const pauseCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'pause')[1];
		pauseCallback();
		expect(player.playerListener.calledWith("pause")).to.be.true;

		const errorCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'error')[1];
		const errorEventData = { code: 4 };
		errorCallback(errorEventData);
		expect(player.playerListener.calledWith("error", errorEventData)).to.be.true;

		const timeUpdateCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'timeupdate')[1];
		timeUpdateCallback();
		expect(player.playerListener.calledWith('timeupdate', sinon.match.any, { currentTime: 10 })).to.be.true;
	
		const progressCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'progress')[1];
		progressCallback();
		expect(player.playerListener.calledWith('progress', sinon.match.any, { bufferedPercent: 0.5 })).to.be.true;
	
		const volumeChangeCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'volumechange')[1];
		volumeChangeCallback();
		expect(player.playerListener.calledWith('volumechange', sinon.match.any, { volume: 0.8, muted: false })).to.be.true;
	
		const rateChangeCallback = player.videojsPlayer.on.args.find(arg => arg[0] === 'ratechange')[1];
		rateChangeCallback();
		expect(player.playerListener.calledWith('ratechange', sinon.match.any, { playbackRate: 1.0 })).to.be.true;
		
	})

	it("Start backup stream interval", async function() {
		this.timeout(10000);
	  
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	  
		var locationComponent = {
		  href: 'http://example.com?id=stream123',
		  search: "?id=stream123",
		  pathname: "/",
		  protocol: "http:"
		};
		var windowComponent = {
		  location: locationComponent,
		  document: document
		};
	  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	  
		var tryBackupStream = sinon.replace(player, "tryBackupStream", sinon.fake());
		var tryNextTech = sinon.replace(player, "tryNextTech", sinon.fake());
		var cancelBackupStreamPlayerInterval = sinon.replace(player, "cancelBackupStreamPlayerInterval", sinon.fake());
	  
		player.playOrder = ["webrtc"];
		player.backupStreamId = "backupStreamId";
		player.currentPlayType = "webrtc";
	  
		player.startBackupStreamPlayerInterval();
	  
		expect(tryBackupStream.calledOnce).to.be.true;
		expect(player.backupStreamPlayerInterval).to.not.be.undefined;
		expect(player.backupStreamTryCount).to.equal(0);
		
		// Simulate backup stream failure after max attempts
		player.backupStreamTryCount = player.maxBackupStreamTryCount;
		player.startBackupStreamPlayerInterval();
		clock.tick(player.backupStreamPlayerIntervalMs);
		
		expect(cancelBackupStreamPlayerInterval.calledOnce).to.be.true;
		expect(tryNextTech.calledOnce).to.be.true;
	});

	it("Cancel backup stream interval on success", async function(){

		var videoContainer = document.createElement("video_container");
		  
		var placeHolder = document.createElement("place_holder");
		  			
		var locationComponent =  { href : 'http://example.com?id=stream123', search: "?id=stream123", pathname: "/", protocol:"http:" };
		var windowComponent = {  location : locationComponent,
		  						  document:  document,
		  						  addEventListener: window.addEventListener};
		  						  		 	      
	    var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		var cancelBackupStreamPlayerInterval = sinon.replace(player, "cancelBackupStreamPlayerInterval", sinon.fake());
		var checkStreamExistsViaHttp = sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.returns(Promise.resolve("streams/stream123.m3u8")));

	    player.backupStreamPlayerInterval = 1

	    await player.playIfExists("hls");
		await player.playIfExists("ll-hls");
		await player.playIfExists("dash")

		sinon.assert.calledThrice(checkStreamExistsViaHttp);
		sinon.assert.calledThrice(cancelBackupStreamPlayerInterval);

	})	

	it("Webrtc play backup stream", async function() {
		var videoContainer = document.createElement("div");
		var placeHolder = document.createElement("div");   
	
		var streamId = "stream123";
		var backupStreamId = "backupStreamId";
	
		var wsUrl = "ws://example.com/" + streamId + ".webrtc";
		var backupWsUrl = "ws://example.com/" + backupStreamId + ".webrtc";
	
		var locationComponent = {
			href: 'http://example.com?id=stream123',
			search: "?id=stream123",
			pathname: "/",
			protocol: "http:"
		};
	
		var windowComponent = {
			location: locationComponent,
			document: document,
			addEventListener: window.addEventListener
		};
	
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
	
		var vjsMock = {
			play: sinon.fake.resolves(),    // Mock play to return a resolved promise
			muted: sinon.fake(),            // Mock muted method
			controls: true,
			class: 'video-js vjs-default-skin vjs-big-play-centered',
			preload: "auto",
			autoplay: true,
			poster: "test",
			liveui: true,
			liveTracker: {
				trackingThreshold: 0
			},
			html5: {
				vhs: {
					limitRenditionByPlayerDimensions: false
				}
			},
			on: sinon.fake(),
			src: sinon.fake()
		};
	
		const mockVideoJS = sinon.stub(window, 'videojs').returns(vjsMock);
	
		sinon.replace(vjsMock, "muted", sinon.fake());
	
		player.websocketURL = wsUrl;
		player.streamId = streamId;
		player.backupStreamId = backupStreamId;
	
		var replaceStreamIdWithBackupStreamIdSpy = sinon.spy(player, "replaceStreamIdWithBackupStreamId");
		var playWithVideoJSSpy = sinon.spy(player, "playWithVideoJS");
	
		await player.playIfExists("webrtc", true);
	
		expect(playWithVideoJSSpy.calledOnce).to.be.true;
		expect(replaceStreamIdWithBackupStreamIdSpy.calledOnce).to.be.true;
	
		expect(replaceStreamIdWithBackupStreamIdSpy.returnValues[0]).to.equal("ws://example.com/" + backupStreamId + ".webrtc");
	
		expect(mockVideoJS.calledWith(WebPlayer.VIDEO_PLAYER_ID)).to.be.true;
		
		expect(vjsMock.src.calledOnce).to.be.true;
		expect(vjsMock.src.calledWith({
			src: backupWsUrl,       // Check if 'src' was called with the expected WebSocket URL
			type: 'video/webrtc',  
			withCredentials: true,
			iceServers: player.iceServers,
			reconnect: false  
		})).to.be.true;

	});
	

	it("tryBackupStream", async function() {
		this.timeout(2000);
	  
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	  
		var locationComponent = {
		  href: 'http://example.com?id=stream123',
		  search: "?id=stream123",
		  pathname: "/",
		  protocol: "http:"
		};
		var windowComponent = {
		  location: locationComponent,
		  document: document
		};
	  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		player.currentPlayType = "webrtc";

		var destroyDashPlayer = sinon.replace(player, "destroyDashPlayer", sinon.fake());
		var destroyVideoJSPlayer = sinon.replace(player, "destroyVideoJSPlayer", sinon.fake());
		var setPlayerVisible = sinon.replace(player, "setPlayerVisible", sinon.fake());
		var playIfExists = sinon.replace(player, "playIfExists", sinon.fake());

		player.tryBackupStream();
	
		expect(player.backupStreamTryCount).to.equal(1);
		sinon.assert.called(destroyDashPlayer);
		sinon.assert.called(destroyVideoJSPlayer);
		sinon.assert.calledWith(setPlayerVisible, false);
		clock.tick(600);
		sinon.assert.calledWith(playIfExists, "webrtc", true)

	  });

	  it("cancelBackupStreamPlayerInterval", async function() {
		this.timeout(2000);
	  
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	  
		var locationComponent = {
		  href: 'http://example.com?id=stream123',
		  search: "?id=stream123",
		  pathname: "/",
		  protocol: "http:"
		};
		var windowComponent = {
		  location: locationComponent,
		  document: document
		};
	  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		player.backupStreamPlayerInterval = 1
		player.backupStreamTryCount = 1

		player.cancelBackupStreamPlayerInterval()
		expect(player.backupStreamTryCount).to.equal(0);
		expect(player.backupStreamPlayerInterval).to.be.null;
	  })

	  it("playIfExists backup stream hls, dash fails", async function() {
		this.timeout(2000);
	  
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	  
		var locationComponent = {
		  href: 'http://example.com?id=stream123',
		  search: "?id=stream123",
		  pathname: "/",
		  protocol: "http:"
		};
		var windowComponent = {
		  location: locationComponent,
		  document: document
		};
	  
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		
		var destroyDashPlayer = sinon.replace(player, "destroyDashPlayer", sinon.fake());
		var destroyVideoJSPlayer = sinon.replace(player, "destroyVideoJSPlayer", sinon.fake());
		var setPlayerVisible = sinon.replace(player, "setPlayerVisible", sinon.fake());
		var isBackupStreamEnabledSpy = sinon.spy(player, "isBackupStreamEnabled"); 
		var startBackupStreamPlayerInterval = sinon.replace(player, "startBackupStreamPlayerInterval", sinon.fake());


		sinon.replace(player, "checkStreamExistsViaHttp", sinon.fake.rejects(new Error("Stream not found")));

	
		var playBackupStream = true;

		player.playOrder = ["hls"]
		player.backupStreamId = "backupStreamId"
		player.backupStreamTryCount = 0
		player.maxBackupStreamTryCount = 2

		await player.playIfExists("hls", playBackupStream)
		await player.playIfExists("dash", playBackupStream)

		expect(isBackupStreamEnabledSpy.calledTwice).to.be.true;
		expect(startBackupStreamPlayerInterval.calledTwice).to.be.true;
	  })

	  it("handleWebRTCErrorMessages", async function() {
		var videoContainer = document.createElement("video_container");
		var placeHolder = document.createElement("place_holder");
	
		var locationComponent = { href: 'http://example.com?id=stream123.mp4', search: "?id=stream123.mp4", pathname: "/", protocol: "http:" };
		var windowComponent = {
			location: locationComponent,
			document: document,
			addEventListener: window.addEventListener
		};
	
		var player = new WebPlayer(windowComponent, videoContainer, placeHolder);
		var tryNextTech = sinon.replace(player, "tryNextTech", sinon.fake.returns(Promise.resolve("")));
		var playIfExists = sinon.replace(player, "playIfExists", sinon.fake());
		var isBackupStreamEnabledSpy = sinon.spy(player, "isBackupStreamEnabled"); 
		var startBackupStreamPlayerInterval = sinon.replace(player, "startBackupStreamPlayerInterval", sinon.fake());

		var errors = {
			error: "no_stream_exist",
		};
	
		player.backupStreamId = "backupStreamId";
		player.playOrder = ["webrtc"];
		player.backupStreamTryCount = 1;
		player.maxBackupStreamTryCount = 5;


		player.handleWebRTCErrorMessages(errors);

		expect(isBackupStreamEnabledSpy.calledOnce).to.be.true;
		expect(isBackupStreamEnabledSpy.returned(true)).to.be.true;
		expect(startBackupStreamPlayerInterval.calledOnce).to.be.true;

		var errors = {
			error: "no_stream_exist",
		};

		player.backupStreamTryCount = 5;
		player.maxBackupStreamTryCount = 5;

		player.handleWebRTCErrorMessages(errors);

		expect(tryNextTech.calledOnce).to.be.true;

		var errors = {
			error: "notSetRemoteDescription",
		};

		player.handleWebRTCErrorMessages(errors);

		expect(playIfExists.calledWith("hls")).to.be.true;

	});

});




   
    