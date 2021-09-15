(()=>{var t={707:(t,e,n)=>{"use strict";n.r(e)},201:(t,e,n)=>{"use strict";n.r(e)},623:(t,e,n)=>{const r=n(311);function a(t,e,n){const[r,a]=t instanceof HTMLCanvasElement?[t,t.getContext("2d")]:[t.canvas,t],o=n.screenshotFields.map((t=>n.metadata[t])).filter((t=>"string"==typeof t)).join(" / ");r.width=e.videoWidth,r.height=e.videoHeight,a.drawImage(e,0,0,r.width,r.height),a.font="25px Arial",a.textAlign="end",a.fillStyle="#FFFFFF",a.shadowBlur=5,a.shadowColor="black",a.fillText(o,r.width-10,r.height-10),r.style.width="80%",r.style.height="auto"}t.exports={drawCanvas:a,renderScreenshot:function(t){var e=r("<div id='screenshot-overlay'><span class='close-screenshot-modal icon-close'></span><canvas id='screenshot-canvas'></canvas></div>");r("body").append(e),r(".close-screenshot-modal").bind("click",(function(){r("#screenshot-overlay").detach()})),a(document.getElementById("screenshot-canvas"),t,function(){var t=r("#metadata"),e={metadata:[]};e.screenshotFields=t.data("screenshotfields").split(",");for(var n=0;n<t.children().length;n++)t.children()[n].value.length&&(e.metadata[t.children()[n].id]=t.children()[n].value);return e}())}}},311:t=>{"use strict";t.exports=jQuery}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var o=e[r]={exports:{}};return t[r](o,o.exports,n),o.exports}n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{const t=n(311),{renderScreenshot:e}=n(623);var r,a,o,i,s;n(201),n(707);var u=function(t){var e={},n=document.createElement("a");n.href=t;var r=n.search.substring(1).split("&");if(r[0].length){for(var a=0;a<r.length;a++){var o=r[a].split("=");e[o[0]]=decodeURIComponent(o[1])}return e}return!1};function c(t){l(event.detail)}function l(t){console.error("Error code",t.code,"object",t)}function d(t){l(event.detail)}document.addEventListener("shaka-ui-loaded",(async function(){r=document.getElementById("video"),o=document.getElementsByClassName("mime-type-video")[0].getAttribute("data-url")+".mpd";const e=r.ui;a=e.getControls(),i=new shaka.Player(r),e.configure({addSeekBar:!0,controlPanelElements:["play_pause","chapters_menu","time_and_duration_frame","spacer","volume","mute","replay_10","skip_previous","skip_next","forward_10","capture","bookmark","fullscreen","overflow_menu"],overflowMenuButtons:["language","playback_rate","loop","quality","picture_in_picture","captions"],addBigPlayButton:!0,seekBarColors:{base:"rgba(255, 255, 255, 0.3)",buffered:"rgba(255, 255, 255, 0.54)",played:"rgb(255, 255, 255)",adBreaks:"rgb(255, 204, 0)"}}),window.player=i,window.ui=e,i.addEventListener("error",c),a.addEventListener("error",d),s=VideoFrame({id:"video",frameRate:25,callback:function(t){console.log("callback response: "+t)}}),t("a[data-timecode]").on("click",(function(){var e;e=t(this).data("timecode"),r.paused&&r.play(),r.currentTime=e}));try{console.log("The video has now been loaded!"),u(document.URL).timecode?await i.load(o,parseFloat(u(document.URL).timecode)):await i.load(o)}catch(t){onError(t)}})),document.addEventListener("shaka-ui-load-failed",(function(t){console.error("Unable to load the UI library!")})),document.addEventListener("keydown",(t=>{const e=document.querySelector("video");let n=r.volume;if("f"==t.key)document.fullscreenElement?document.exitFullscreen():e.requestFullscreen(),t.preventDefault();else if(" "==t.key)r.paused?r.play():r.pause(),t.preventDefault();else if("ArrowUp"==t.key){if(t.preventDefault(),1!=n)try{r.volume=n+.05}catch(t){r.volume=1}}else if("ArrowDown"==t.key){if(t.preventDefault(),0!=n)try{r.volume=n-.05}catch(t){r.volume=0}}else"p"==t.key&&(t.preventDefault(),s.seekForward(1))}));class m{}function h(){var e=document.URL,n=t("#url-field"),r=t("#url-container");e=u(e)?e+"&timecode="+a.getDisplayTime():e+"?timecode="+a.getDisplayTime(),n.val(e),r.show("fast")}m.CaptureButton=class extends shaka.ui.Element{constructor(t,n){super(t,n),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Screenshot",this.button_.textContent="photo_camera",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{e(document.getElementById("video"))}))}},m.CaptureButton.Factory=class{create(t,e){return new m.CaptureButton(t,e)}},shaka.ui.Controls.registerElement("capture",new m.CaptureButton.Factory),m.SkipNextButton=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Einzelbild zurück",this.button_.textContent="skip_next",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{s.seekForward(1)}))}},m.SkipNextButton.Factory=class{create(t,e){return new m.SkipNextButton(t,e)}},shaka.ui.Controls.registerElement("skip_next",new m.SkipNextButton.Factory),m.SkipPreviousButton=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Einzelbild zurück",this.button_.textContent="skip_previous",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{s.seekBackward(1)}))}},m.SkipPreviousButton.Factory=class{create(t,e){return new m.SkipPreviousButton(t,e)}},shaka.ui.Controls.registerElement("skip_previous",new m.SkipPreviousButton.Factory),m.Forward10Button=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="10 Sekunden vor",this.button_.textContent="forward_10",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{r.currentTime=r.currentTime+10}))}},m.Forward10Button.Factory=class{create(t,e){return new m.Forward10Button(t,e)}},shaka.ui.Controls.registerElement("forward_10",new m.Forward10Button.Factory),m.Replay10Button=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="10 Sekunden zurück",this.button_.textContent="replay_10",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{r.currentTime=r.currentTime-10}))}},m.Replay10Button.Factory=class{create(t,e){return new m.Replay10Button(t,e)}},shaka.ui.Controls.registerElement("replay_10",new m.Replay10Button.Factory),m.BookmarkButton=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.button_=document.createElement("button"),this.button_.className="material-icons-round",this.button_.title="Bookmark",this.button_.textContent="bookmark_border",this.parent.appendChild(this.button_),this.eventManager.listen(this.button_,"click",(()=>{h()}))}},m.BookmarkButton.Factory=class{create(t,e){return new m.BookmarkButton(t,e)}},shaka.ui.Controls.registerElement("bookmark",new m.BookmarkButton.Factory),m.PresentationTimeTracker=class extends shaka.ui.Element{constructor(t,e){super(t,e),this.currentTime_=document.createElement("button"),this.currentTime_.classList.add("shaka-current-time"),this.currentTime_.title="Aktuelle Laufzeit / Gesamtlaufzeit",this.setValue_("0:00"),this.parent.appendChild(this.currentTime_),this.mode=["currentTime","remainingTime","currentFrame"],this.modeActive=this.mode[0],this.eventManager.listen(this.currentTime_,"click",(()=>{switch(this.modeActive){default:this.modeActive=this.mode[1];break;case"remainingTime":this.modeActive=this.mode[2];break;case"currentFrame":this.modeActive=this.mode[0]}})),this.eventManager.listen(this.controls,"timeandseekrangeupdated",(()=>{let t=this.controls.getDisplayTime();const e=r.duration>=3600;switch(this.modeActive){default:this.updateTime_();break;case"remainingTime":this.setValue_(this.buildTimeString_(r.duration-t,e)),this.currentTime_.title="Restlaufzeit";break;case"currentFrame":this.setValue_(s.get()),this.currentTime_.title="Frame-Nummer"}}))}setValue_(t){t!=this.currentTime_.textContent&&(this.currentTime_.textContent=t)}updateTime_(){const t=r.duration>=3600;let e=this.controls.getDisplayTime(),n=this.buildTimeString_(e,t);n+=":"+("0"+s.get()%25).slice(-2),r.duration&&(n+=" / "+this.buildTimeString_(r.duration,t)),this.setValue_(n),this.currentTime=n}buildTimeString_(t,e){const n=Math.floor(t/3600),r=Math.floor(t/60%60);let a=Math.floor(t%60);a<10&&(a="0"+a);let o=r+":"+a;return e&&(r<10&&(o="0"+o),o=n+":"+o),o}},m.PresentationTimeTracker.Factory=class{create(t,e){return new m.PresentationTimeTracker(t,e)}},shaka.ui.Controls.registerElement("time_and_duration_frame",new m.PresentationTimeTracker.Factory)})()})();
//# sourceMappingURL=SxndShakaPlayer.js.map