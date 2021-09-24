/*! For license information please see SxndScripts.js.LICENSE.txt */
(()=>{var e={729:(e,t,n)=>{var i,o,r;o=[n(311)],i=function(e){var t,n,i,o,r,a,s="Close",l="BeforeClose",c="MarkupParse",d="Open",u="Change",p="mfp",f=".mfp",m="mfp-ready",g="mfp-removing",v="mfp-prevent-close",h=function(){},y=!!window.jQuery,b=e(window),C=function(e,n){t.ev.on(p+e+f,n)},w=function(t,n,i,o){var r=document.createElement("div");return r.className="mfp-"+t,i&&(r.innerHTML=i),o?n&&n.appendChild(r):(r=e(r),n&&r.appendTo(n)),r},x=function(n,i){t.ev.triggerHandler(p+n,i),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(i)?i:[i]))},k=function(n){return n===a&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),a=n),t.currTemplate.closeBtn},S=function(){e.magnificPopup.instance||((t=new h).init(),e.magnificPopup.instance=t)};h.prototype={constructor:h,init:function(){var n=navigator.appVersion;t.isLowIE=t.isIE8=document.all&&!document.addEventListener,t.isAndroid=/android/gi.test(n),t.isIOS=/iphone|ipad|ipod/gi.test(n),t.supportsTransition=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1}(),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),i=e(document),t.popupsCache={}},open:function(n){var o;if(!1===n.isObj){t.items=n.items.toArray(),t.index=0;var a,s=n.items;for(o=0;o<s.length;o++)if((a=s[o]).parsed&&(a=a.el[0]),a===n.el[0]){t.index=o;break}}else t.items=e.isArray(n.items)?n.items:[n.items],t.index=n.index||0;if(!t.isOpen){t.types=[],r="",n.mainEl&&n.mainEl.length?t.ev=n.mainEl.eq(0):t.ev=i,n.key?(t.popupsCache[n.key]||(t.popupsCache[n.key]={}),t.currTemplate=t.popupsCache[n.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,n),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.st.modal&&(t.st.closeOnContentClick=!1,t.st.closeOnBgClick=!1,t.st.showCloseBtn=!1,t.st.enableEscapeKey=!1),t.bgOverlay||(t.bgOverlay=w("bg").on("click.mfp",(function(){t.close()})),t.wrap=w("wrap").attr("tabindex",-1).on("click.mfp",(function(e){t._checkIfClose(e.target)&&t.close()})),t.container=w("container",t.wrap)),t.contentContainer=w("content"),t.st.preloader&&(t.preloader=w("preloader",t.container,t.st.tLoading));var l=e.magnificPopup.modules;for(o=0;o<l.length;o++){var u=l[o];u=u.charAt(0).toUpperCase()+u.slice(1),t["init"+u].call(t)}x("BeforeOpen"),t.st.showCloseBtn&&(t.st.closeBtnInside?(C(c,(function(e,t,n,i){n.close_replaceWith=k(i.type)})),r+=" mfp-close-btn-in"):t.wrap.append(k())),t.st.alignTop&&(r+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:b.scrollTop(),position:"absolute"}),(!1===t.st.fixedBgPos||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:i.height(),position:"absolute"}),t.st.enableEscapeKey&&i.on("keyup.mfp",(function(e){27===e.keyCode&&t.close()})),b.on("resize.mfp",(function(){t.updateSize()})),t.st.closeOnContentClick||(r+=" mfp-auto-cursor"),r&&t.wrap.addClass(r);var p=t.wH=b.height(),f={};if(t.fixedContentPos&&t._hasScrollBar(p)){var g=t._getScrollbarSize();g&&(f.marginRight=g)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):f.overflow="hidden");var v=t.st.mainClass;return t.isIE7&&(v+=" mfp-ie7"),v&&t._addClassToMFP(v),t.updateItemHTML(),x("BuildControls"),e("html").css(f),t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo||e(document.body)),t._lastFocusedEl=document.activeElement,setTimeout((function(){t.content?(t._addClassToMFP(m),t._setFocus()):t.bgOverlay.addClass(m),i.on("focusin.mfp",t._onFocusIn)}),16),t.isOpen=!0,t.updateSize(p),x(d),n}t.updateItemHTML()},close:function(){t.isOpen&&(x(l),t.isOpen=!1,t.st.removalDelay&&!t.isLowIE&&t.supportsTransition?(t._addClassToMFP(g),setTimeout((function(){t._close()}),t.st.removalDelay)):t._close())},_close:function(){x(s);var n="mfp-removing mfp-ready ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(n+=t.st.mainClass+" "),t._removeClassFromMFP(n),t.fixedContentPos){var o={marginRight:""};t.isIE7?e("body, html").css("overflow",""):o.overflow="",e("html").css(o)}i.off("keyup.mfp focusin.mfp"),t.ev.off(f),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),!t.st.showCloseBtn||t.st.closeBtnInside&&!0!==t.currTemplate[t.currItem.type]||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t.st.autoFocusLast&&t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,x("AfterClose")},updateSize:function(e){if(t.isIOS){var n=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*n;t.wrap.css("height",i),t.wH=i}else t.wH=e||b.height();t.fixedContentPos||t.wrap.css("height",t.wH),x("Resize")},updateItemHTML:function(){var n=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),n.parsed||(n=t.parseEl(t.index));var i=n.type;if(x("BeforeChange",[t.currItem?t.currItem.type:"",i]),t.currItem=n,!t.currTemplate[i]){var r=!!t.st[i]&&t.st[i].markup;x("FirstMarkupParse",r),t.currTemplate[i]=!r||e(r)}o&&o!==n.type&&t.container.removeClass("mfp-"+o+"-holder");var a=t["get"+i.charAt(0).toUpperCase()+i.slice(1)](n,t.currTemplate[i]);t.appendContent(a,i),n.preloaded=!0,x(u,n),o=n.type,t.container.prepend(t.contentContainer),x("AfterChange")},appendContent:function(e,n){t.content=e,e?t.st.showCloseBtn&&t.st.closeBtnInside&&!0===t.currTemplate[n]?t.content.find(".mfp-close").length||t.content.append(k()):t.content=e:t.content="",x("BeforeAppend"),t.container.addClass("mfp-"+n+"-holder"),t.contentContainer.append(t.content)},parseEl:function(n){var i,o=t.items[n];if(o.tagName?o={el:e(o)}:(i=o.type,o={data:o,src:o.src}),o.el){for(var r=t.types,a=0;a<r.length;a++)if(o.el.hasClass("mfp-"+r[a])){i=r[a];break}o.src=o.el.attr("data-mfp-src"),o.src||(o.src=o.el.attr("href"))}return o.type=i||t.st.type||"inline",o.index=n,o.parsed=!0,t.items[n]=o,x("ElementParse",o),t.items[n]},addGroup:function(e,n){var i=function(i){i.mfpEl=this,t._openClick(i,e,n)};n||(n={});var o="click.magnificPopup";n.mainEl=e,n.items?(n.isObj=!0,e.off(o).on(o,i)):(n.isObj=!1,n.delegate?e.off(o).on(o,n.delegate,i):(n.items=e,e.off(o).on(o,i)))},_openClick:function(n,i,o){if((void 0!==o.midClick?o.midClick:e.magnificPopup.defaults.midClick)||!(2===n.which||n.ctrlKey||n.metaKey||n.altKey||n.shiftKey)){var r=void 0!==o.disableOn?o.disableOn:e.magnificPopup.defaults.disableOn;if(r)if(e.isFunction(r)){if(!r.call(t))return!0}else if(b.width()<r)return!0;n.type&&(n.preventDefault(),t.isOpen&&n.stopPropagation()),o.el=e(n.mfpEl),o.delegate&&(o.items=i.find(o.delegate)),t.open(o)}},updateStatus:function(e,i){if(t.preloader){n!==e&&t.container.removeClass("mfp-s-"+n),i||"loading"!==e||(i=t.st.tLoading);var o={status:e,text:i};x("UpdateStatus",o),e=o.status,i=o.text,t.preloader.html(i),t.preloader.find("a").on("click",(function(e){e.stopImmediatePropagation()})),t.container.addClass("mfp-s-"+e),n=e}},_checkIfClose:function(n){if(!e(n).hasClass(v)){var i=t.st.closeOnContentClick,o=t.st.closeOnBgClick;if(i&&o)return!0;if(!t.content||e(n).hasClass("mfp-close")||t.preloader&&n===t.preloader[0])return!0;if(n===t.content[0]||e.contains(t.content[0],n)){if(i)return!0}else if(o&&e.contains(document,n))return!0;return!1}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?i.height():document.body.scrollHeight)>(e||b.height())},_setFocus:function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},_onFocusIn:function(n){if(n.target!==t.wrap[0]&&!e.contains(t.wrap[0],n.target))return t._setFocus(),!1},_parseMarkup:function(t,n,i){var o;i.data&&(n=e.extend(i.data,n)),x(c,[t,n,i]),e.each(n,(function(n,i){if(void 0===i||!1===i)return!0;if((o=n.split("_")).length>1){var r=t.find(".mfp-"+o[0]);if(r.length>0){var a=o[1];"replaceWith"===a?r[0]!==i[0]&&r.replaceWith(i):"img"===a?r.is("img")?r.attr("src",i):r.replaceWith(e("<img>").attr("src",i).attr("class",r.attr("class"))):r.attr(o[1],i)}}else t.find(".mfp-"+n).html(i)}))},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:h.prototype,modules:[],open:function(t,n){return S(),(t=t?e.extend(!0,{},t):{}).isObj=!0,t.index=n||0,this.instance.open(t)},close:function(){return e.magnificPopup.instance&&e.magnificPopup.instance.close()},registerModule:function(t,n){n.options&&(e.magnificPopup.defaults[t]=n.options),e.extend(this.proto,n.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},e.fn.magnificPopup=function(n){S();var i=e(this);if("string"==typeof n)if("open"===n){var o,r=y?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(arguments[1],10)||0;r.items?o=r.items[a]:(o=i,r.delegate&&(o=o.find(r.delegate)),o=o.eq(a)),t._openClick({mfpEl:o},i,r)}else t.isOpen&&t[n].apply(t,Array.prototype.slice.call(arguments,1));else n=e.extend(!0,{},n),y?i.data("magnificPopup",n):i[0].magnificPopup=n,t.addGroup(i,n);return i};var T,I,_,P="inline",z=function(){_&&(I.after(_.addClass(T)).detach(),_=null)};e.magnificPopup.registerModule(P,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(P),C("Close.inline",(function(){z()}))},getInline:function(n,i){if(z(),n.src){var o=t.st.inline,r=e(n.src);if(r.length){var a=r[0].parentNode;a&&a.tagName&&(I||(T=o.hiddenClass,I=w(T),T="mfp-"+T),_=r.after(I).detach().removeClass(T)),t.updateStatus("ready")}else t.updateStatus("error",o.tNotFound),r=e("<div>");return n.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(i,{},n),i}}});var E,O="ajax",M=function(){E&&e(document.body).removeClass(E)},B=function(){M(),t.req&&t.req.abort()};e.magnificPopup.registerModule(O,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(O),E=t.st.ajax.cursor,C("Close.ajax",B),C("BeforeChange.ajax",B)},getAjax:function(n){E&&e(document.body).addClass(E),t.updateStatus("loading");var i=e.extend({url:n.src,success:function(i,o,r){var a={data:i,xhr:r};x("ParseAjax",a),t.appendContent(e(a.data),O),n.finished=!0,M(),t._setFocus(),setTimeout((function(){t.wrap.addClass(m)}),16),t.updateStatus("ready"),x("AjaxContentAdded")},error:function(){M(),n.finished=n.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",n.src))}},t.st.ajax.settings);return t.req=e.ajax(i),""}}});var L,j=function(n){if(n.data&&void 0!==n.data.title)return n.data.title;var i=t.st.image.titleSrc;if(i){if(e.isFunction(i))return i.call(t,n);if(n.el)return n.el.attr(i)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var n=t.st.image,i=".image";t.types.push("image"),C("Open.image",(function(){"image"===t.currItem.type&&n.cursor&&e(document.body).addClass(n.cursor)})),C("Close.image",(function(){n.cursor&&e(document.body).removeClass(n.cursor),b.off("resize.mfp")})),C("Resize"+i,t.resizeImage),t.isLowIE&&C("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e&&e.img&&t.st.image.verticalFit){var n=0;t.isLowIE&&(n=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-n)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,L&&clearInterval(L),e.isCheckingImgSize=!1,x("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var n=0,i=e.img[0],o=function(r){L&&clearInterval(L),L=setInterval((function(){i.naturalWidth>0?t._onImageHasSize(e):(n>200&&clearInterval(L),3==++n?o(10):40===n?o(50):100===n&&o(500))}),r)};o(1)},getImage:function(n,i){var o=0,r=function(){n&&(n.img[0].complete?(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("ready")),n.hasSize=!0,n.loaded=!0,x("ImageLoadComplete")):++o<200?setTimeout(r,100):a())},a=function(){n&&(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("error",s.tError.replace("%url%",n.src))),n.hasSize=!0,n.loaded=!0,n.loadError=!0)},s=t.st.image,l=i.find(".mfp-img");if(l.length){var c=document.createElement("img");c.className="mfp-img",n.el&&n.el.find("img").length&&(c.alt=n.el.find("img").attr("alt")),n.img=e(c).on("load.mfploader",r).on("error.mfploader",a),c.src=n.src,l.is("img")&&(n.img=n.img.clone()),(c=n.img[0]).naturalWidth>0?n.hasSize=!0:c.width||(n.hasSize=!1)}return t._parseMarkup(i,{title:j(n),img_replaceWith:n.img},n),t.resizeImage(),n.hasSize?(L&&clearInterval(L),n.loadError?(i.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",n.src))):(i.removeClass("mfp-loading"),t.updateStatus("ready")),i):(t.updateStatus("loading"),n.loading=!0,n.hasSize||(n.imgHidden=!0,i.addClass("mfp-loading"),t.findImageSize(n)),i)}}});var A;e.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var e,n=t.st.zoom,i=".zoom";if(n.enabled&&t.supportsTransition){var o,r,a=n.duration,s=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+n.duration/1e3+"s "+n.easing,o={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},r="transition";return o["-webkit-"+r]=o["-moz-"+r]=o["-o-"+r]=o[r]=i,t.css(o),t},l=function(){t.content.css("visibility","visible")};C("BuildControls"+i,(function(){if(t._allowZoom()){if(clearTimeout(o),t.content.css("visibility","hidden"),!(e=t._getItemToZoom()))return void l();(r=s(e)).css(t._getOffset()),t.wrap.append(r),o=setTimeout((function(){r.css(t._getOffset(!0)),o=setTimeout((function(){l(),setTimeout((function(){r.remove(),e=r=null,x("ZoomAnimationEnded")}),16)}),a)}),16)}})),C("BeforeClose.zoom",(function(){if(t._allowZoom()){if(clearTimeout(o),t.st.removalDelay=a,!e){if(!(e=t._getItemToZoom()))return;r=s(e)}r.css(t._getOffset(!0)),t.wrap.append(r),t.content.css("visibility","hidden"),setTimeout((function(){r.css(t._getOffset())}),16)}})),C("Close.zoom",(function(){t._allowZoom()&&(l(),r&&r.remove(),e=null)}))}},_allowZoom:function(){return"image"===t.currItem.type},_getItemToZoom:function(){return!!t.currItem.hasSize&&t.currItem.img},_getOffset:function(n){var i,o=(i=n?t.currItem.img:t.st.zoom.opener(t.currItem.el||t.currItem)).offset(),r=parseInt(i.css("padding-top"),10),a=parseInt(i.css("padding-bottom"),10);o.top-=e(window).scrollTop()-r;var s={width:i.width(),height:(y?i.innerHeight():i[0].offsetHeight)-a-r};return void 0===A&&(A=void 0!==document.createElement("p").style.MozTransform),A?s["-moz-transform"]=s.transform="translate("+o.left+"px,"+o.top+"px)":(s.left=o.left,s.top=o.top),s}}});var F="iframe",H=function(e){if(t.currTemplate.iframe){var n=t.currTemplate.iframe.find("iframe");n.length&&(e||(n[0].src="//about:blank"),t.isIE8&&n.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(F,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(F),C("BeforeChange",(function(e,t,n){t!==n&&(t===F?H():n===F&&H(!0))})),C("Close.iframe",(function(){H()}))},getIframe:function(n,i){var o=n.src,r=t.st.iframe;e.each(r.patterns,(function(){if(o.indexOf(this.index)>-1)return this.id&&(o="string"==typeof this.id?o.substr(o.lastIndexOf(this.id)+this.id.length,o.length):this.id.call(this,o)),o=this.src.replace("%id%",o),!1}));var a={};return r.srcAction&&(a[r.srcAction]=o),t._parseMarkup(i,a,n),t.updateStatus("ready"),i}}});var N=function(e){var n=t.items.length;return e>n-1?e-n:e<0?n+e:e},R=function(e,t,n){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,n)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var n=t.st.gallery,o=".mfp-gallery";if(t.direction=!0,!n||!n.enabled)return!1;r+=" mfp-gallery",C(d+o,(function(){n.navigateByImgClick&&t.wrap.on("click"+o,".mfp-img",(function(){if(t.items.length>1)return t.next(),!1})),i.on("keydown"+o,(function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()}))})),C("UpdateStatus"+o,(function(e,n){n.text&&(n.text=R(n.text,t.currItem.index,t.items.length))})),C(c+o,(function(e,i,o,r){var a=t.items.length;o.counter=a>1?R(n.tCounter,r.index,a):""})),C("BuildControls"+o,(function(){if(t.items.length>1&&n.arrows&&!t.arrowLeft){var i=n.arrowMarkup,o=t.arrowLeft=e(i.replace(/%title%/gi,n.tPrev).replace(/%dir%/gi,"left")).addClass(v),r=t.arrowRight=e(i.replace(/%title%/gi,n.tNext).replace(/%dir%/gi,"right")).addClass(v);o.click((function(){t.prev()})),r.click((function(){t.next()})),t.container.append(o.add(r))}})),C(u+o,(function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout((function(){t.preloadNearbyImages(),t._preloadTimeout=null}),16)})),C(s+o,(function(){i.off(o),t.wrap.off("click"+o),t.arrowRight=t.arrowLeft=null}))},next:function(){t.direction=!0,t.index=N(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=N(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,n=t.st.gallery.preload,i=Math.min(n[0],t.items.length),o=Math.min(n[1],t.items.length);for(e=1;e<=(t.direction?o:i);e++)t._preloadItem(t.index+e);for(e=1;e<=(t.direction?i:o);e++)t._preloadItem(t.index-e)},_preloadItem:function(n){if(n=N(n),!t.items[n].preloaded){var i=t.items[n];i.parsed||(i=t.parseEl(n)),x("LazyLoad",i),"image"===i.type&&(i.img=e('<img class="mfp-img" />').on("load.mfploader",(function(){i.hasSize=!0})).on("error.mfploader",(function(){i.hasSize=!0,i.loadError=!0,x("LazyLoadError",i)})).attr("src",i.src)),i.preloaded=!0}}}});var W="retina";e.magnificPopup.registerModule(W,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,(function(e){return"@2x"+e}))},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,n=e.ratio;(n=isNaN(n)?n():n)>1&&(C("ImageHasSize.retina",(function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})})),C("ElementParse.retina",(function(t,i){i.src=e.replaceSrc(i,n)})))}}}}),S()},void 0===(r=i.apply(t,o))||(e.exports=r)},299:()=>{var e;(e=jQuery).cookieBar=function(t,n){if("cookies"==t)var i="cookies";else i="set"==t&&"set";var o={message:"We use cookies to track usage and preferences.",acceptButton:!0,acceptText:"I Understand",acceptFunction:function(e){"enabled"!=e&&"accepted"!=e&&(window.location=window.location.href)},declineButton:!1,declineText:"Disable Cookies",declineFunction:function(e){"enabled"!=e&&"accepted"!=e||(window.location=window.location.href)},policyButton:!1,policyText:"Privacy Policy",policyURL:"/privacy-policy/",autoEnable:!0,acceptOnContinue:!1,acceptOnScroll:!1,acceptAnyClick:!1,expireDays:365,renewOnVisit:!1,forceShow:!1,effect:"slide",element:"body",append:!1,fixed:!1,bottom:!1,zindex:"",domain:String(window.location.hostname),referrer:String(document.referrer)},r=(t=e.extend(o,t),new Date);r.setTime(r.getTime()+864e5*t.expireDays);var a,s,l="cb-enabled={value}; expires="+(r=r.toGMTString())+"; path=/; SameSite=Strict; Secure",c="",d=document.cookie.split("; ");for(a=0;a<d.length;a++)"cb-enabled"==(s=d[a].split("="))[0]&&(c=s[1]);if(""==c&&"cookies"!=i&&t.autoEnable?(c="enabled",document.cookie=l.replace("{value}","enabled")):"accepted"!=c&&"declined"!=c||"cookies"==i||!t.renewOnVisit||(document.cookie=l.replace("{value}",c)),t.acceptOnContinue&&t.referrer.indexOf(t.domain)>=0&&-1==String(window.location.href).indexOf(t.policyURL)&&"cookies"!=i&&"set"!=i&&"accepted"!=c&&"declined"!=c&&(i="set",n="accepted"),"cookies"==i)return"enabled"==c||"accepted"==c;if("set"==i&&("accepted"==n||"declined"==n))return document.cookie=l.replace("{value}",n),"accepted"==n;var u=t.message.replace("{policy_url}",t.policyURL);if(t.acceptButton)var p='<a href="" class="cb-enable">'+t.acceptText+"</a>";else p="";if(t.declineButton)var f='<a href="" class="cb-disable">'+t.declineText+"</a>";else f="";if(t.policyButton)var m='<a href="'+t.policyURL+'" class="cb-policy">'+t.policyText+"</a>";else m="";if(t.fixed)if(t.bottom)var g=' class="fixed bottom"';else g=' class="fixed"';else g="";if(""!=t.zindex)var v=' style="z-index:'+t.zindex+';"';else v="";(t.forceShow||"enabled"==c||""==c)&&(t.append?e(t.element).append('<div id="cookie-bar"'+g+v+"><p>"+u+p+f+m+"</p></div>"):e(t.element).prepend('<div id="cookie-bar"'+g+v+"><p>"+u+p+f+m+"</p></div>"));var h=function(n){t.acceptOnScroll&&e(document).off("scroll"),"function"==typeof n&&n(c),"slide"==t.effect?e("#cookie-bar").slideUp(300,(function(){e("#cookie-bar").remove()})):"fade"==t.effect?e("#cookie-bar").fadeOut(300,(function(){e("#cookie-bar").remove()})):e("#cookie-bar").hide(0,(function(){e("#cookie-bar").remove()})),e(document).unbind("click",b)},y=function(){document.cookie=l.replace("{value}","accepted"),h(t.acceptFunction)},b=function(t){e(t.target).hasClass("cb-policy")||y()};if(e("#cookie-bar .cb-enable").click((function(){return y(),!1})),e("#cookie-bar .cb-disable").click((function(){return function(){var e=new Date;for(e.setTime(e.getTime()-864e6),e=e.toGMTString(),d=document.cookie.split("; "),a=0;a<d.length;a++)(s=d[a].split("="))[0].indexOf("_")>=0?document.cookie=s[0]+"=0; expires="+e+"; domain="+t.domain.replace("www","")+"; path=/":document.cookie=s[0]+"=0; expires="+e+"; path=/";document.cookie=l.replace("{value}","declined"),h(t.declineFunction)}(),!1})),t.acceptOnScroll){var C,w=e(document).scrollTop();e(document).on("scroll",(function(){((C=e(document).scrollTop())>w?C-w:w-C)>=Math.round(t.acceptOnScroll)&&y()}))}t.acceptAnyClick&&e(document).bind("click",b)}},790:()=>{!function(e,t,n){function i(e,t){return typeof e===t}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):C?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function r(e){return e.replace(/([a-z])-([a-z])/g,(function(e,t,n){return t+n.toUpperCase()})).replace(/^-/,"")}function a(e,n,i,r){var a,s,l,c,d="modernizr",u=o("div"),p=function(){var e=t.body;return e||((e=o(C?"svg":"body")).fake=!0),e}();if(parseInt(i,10))for(;i--;)(l=o("div")).id=r?r[i]:d+(i+1),u.appendChild(l);return(a=o("style")).type="text/css",a.id="s"+d,(p.fake?p:u).appendChild(a),p.appendChild(u),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),u.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",c=b.style.overflow,b.style.overflow="hidden",b.appendChild(p)),s=n(u,e),p.fake?(p.parentNode.removeChild(p),b.style.overflow=c,b.offsetHeight):u.parentNode.removeChild(u),!!s}function s(e,t){return!!~(""+e).indexOf(t)}function l(e,t){return function(){return e.apply(t,arguments)}}function c(e){return e.replace(/([A-Z])/g,(function(e,t){return"-"+t.toLowerCase()})).replace(/^ms-/,"-ms-")}function d(t,n,i){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var r=e.console;null!==o?i&&(o=o.getPropertyValue(i)):r&&r[r.error?"error":"log"].call(r,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}else o=!n&&t.currentStyle&&t.currentStyle[i];return o}function u(t,i){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(t[o]),i))return!0;return!1}if("CSSSupportsRule"in e){for(var r=[];o--;)r.push("("+c(t[o])+":"+i+")");return a("@supports ("+(r=r.join(" or "))+") { #modernizr { position: absolute; } }",(function(e){return"absolute"==d(e,null,"position")}))}return n}function p(e,t,a,l){function c(){p&&(delete E.style,delete E.modElem)}if(l=!i(l,"undefined")&&l,!i(a,"undefined")){var d=u(e,a);if(!i(d,"undefined"))return d}for(var p,f,m,g,v,h=["modernizr","tspan","samp"];!E.style&&h.length;)p=!0,E.modElem=o(h.shift()),E.style=E.modElem.style;for(m=e.length,f=0;m>f;f++)if(g=e[f],v=E.style[g],s(g,"-")&&(g=r(g)),E.style[g]!==n){if(l||i(a,"undefined"))return c(),"pfx"!=t||g;try{E.style[g]=a}catch(e){}if(E.style[g]!=v)return c(),"pfx"!=t||g}return c(),!1}function f(e,t,n,o,r){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+I.join(a+" ")+a).split(" ");return i(t,"string")||i(t,"undefined")?p(s,t,o,r):function(e,t,n){var o;for(var r in e)if(e[r]in t)return!1===n?e[r]:i(o=t[e[r]],"function")?l(o,n||t):o;return!1}(s=(e+" "+P.join(a+" ")+a).split(" "),t,n)}function m(e,t,i){return f(e,n,n,t,i)}var g=[],v=[],h={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout((function(){t(n[e])}),0)},addTest:function(e,t,n){v.push({name:e,fn:t,options:n})},addAsyncTest:function(e){v.push({name:null,fn:e})}},y=function(){};y.prototype=h,(y=new y).addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect),y.addTest("picture","HTMLPictureElement"in e);var b=t.documentElement,C="svg"===b.nodeName.toLowerCase(),w=h._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];h._prefixes=w;var x="CSS"in e&&"supports"in e.CSS,k="supportsCSS"in e;y.addTest("supports",x||k),y.addTest("inlinesvg",(function(){var e=o("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)}));var S=h.testStyles=a;y.addTest("touchevents",(function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var i=["@media (",w.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");S(i,(function(e){n=9===e.offsetTop}))}return n}));var T="Moz O ms Webkit",I=h._config.usePrefixes?T.split(" "):[];h._cssomPrefixes=I;var _=function(t){var i,o=w.length,r=e.CSSRule;if(void 0===r)return n;if(!t)return!1;if((i=(t=t.replace(/^@/,"")).replace(/-/g,"_").toUpperCase()+"_RULE")in r)return"@"+t;for(var a=0;o>a;a++){var s=w[a];if(s.toUpperCase()+"_"+i in r)return"@-"+s.toLowerCase()+"-"+t}return!1};h.atRule=_;var P=h._config.usePrefixes?T.toLowerCase().split(" "):[];h._domPrefixes=P;var z={elem:o("modernizr")};y._q.push((function(){delete z.elem}));var E={style:z.elem.style};y._q.unshift((function(){delete E.style})),h.testAllProps=f;var O=h.prefixed=function(e,t,n){return 0===e.indexOf("@")?_(e):(-1!=e.indexOf("-")&&(e=r(e)),t?f(e,t,n):f(e,"pfx"))};y.addTest("objectfit",!!O("objectFit"),{aliases:["object-fit"]}),h.testAllProps=m,y.addTest("csstransforms3d",(function(){var e,t=!!m("perspective","1px",!0),n=y._config.usePrefixes;!t||n&&!("webkitPerspective"in b.style)||(y.supports?e="@supports (perspective: 1px)":(e="@media (transform-3d)",n&&(e+=",(-webkit-transform-3d)")),S("#modernizr{width:0;height:0}"+(e+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}"),(function(e){t=7===e.offsetWidth&&18===e.offsetHeight})));return t})),function(){var e,t,n,o,r,a;for(var s in v)if(v.hasOwnProperty(s)){if(e=[],(t=v[s]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=i(t.fn,"function")?t.fn():t.fn,r=0;r<e.length;r++)1===(a=e[r].split(".")).length?y[a[0]]=o:(!y[a[0]]||y[a[0]]instanceof Boolean||(y[a[0]]=new Boolean(y[a[0]])),y[a[0]][a[1]]=o),g.push((o?"":"no-")+a.join("-"))}}(),function(e){var t=b.className,n=y._config.classPrefix||"";if(C&&(t=t.baseVal),y._config.enableJSClass){var i=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(i,"$1"+n+"js$2")}y._config.enableClasses&&(t+=" "+n+e.join(" "+n),C?b.className.baseVal=t:b.className=t)}(g),delete h.addTest,delete h.addAsyncTest;for(var M=0;M<y._q.length;M++)y._q[M]();e.Modernizr=y}(window,document)},311:e=>{"use strict";e.exports=jQuery}},t={};function n(i){var o=t[i];if(void 0!==o)return o.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,n),r.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=n(311),t=n.n(e);n(790),n(299),n(729),t()((function(){t()("html").removeClass("no-js"),t()(".tx-dlf-morevolumes, .tx-dlf-hidevolumes").on("click",(function(e){t()(this).parent().toggleClass("tx-dlf-volumes-open").find(".tx-dlf-volume").slideToggle()})),t()("button.nav-open").on("click",(function(e){setTimeout((function(){t()("body").addClass("menu-open")}),25)})),t()(".perspective, button.nav-close").on("click",(function(e){t()("body").removeClass("menu-open")})),t()("figure").each((function(){const e=t()(this).find("img").attr("height")/t()(this).find("img").attr("width")<1?"landscape":"portrait";t()(this).addClass(e)})),t()(".contenttable, .ce-table").each((function(){t()(this).wrap('<div class="table-responsive" />')})),t().cookieBar({fixed:!0,message:"Diese Website nutzt Cookies. Mit der weiteren Nutzung dieser Webseite erklären Sie sich damit einverstanden, dass wir Cookies verwenden.<br>",acceptText:"Schließen.",policyButton:!1}),t()("a.totop").on("click",(function(){return t()("a.totop").removeClass("active"),t()("html,body").animate({scrollTop:0},600),!1})),t()(window).scroll((function(){t()(this).scrollTop()?t()("a.totop").addClass("active"):t()("a.totop").removeClass("active")})),t()(".ldp-member-listing figure").each((function(){const e=t()(this).find("a")[0]?'<a href="'+t()(this).find("a").attr("href")+'" target="_blank">'+t()(this).find("a").attr("title")+"</a>":t()(this).find("img").attr("title");e&&t()(this).find("figcaption").prepend("<h4>"+e+"</h4>")})),t()(".pageresource-image").each((function(){const e=t()(this).find(".pageresource-container").width();t()(".pageresource-image figcaption").css("width",e)})),t()(".news-single")[0]&&t()("body").addClass("news-details"),t()(".ce-image, .ce-textpic").each((function(){t()(this).find('a[href$="jpg"], a[href$="png"]').magnificPopup({type:"image",tClose:"Schließen (ESC)",tLoading:"Lade #%curr%...",mainClass:"mfp-img-mobile",closeBtnInside:!1,gallery:{enabled:!0,navigateByImgClick:!0,preload:[0,1],arrowMarkup:'<div title="%title%" class="mfp-ctrls btn-%dir%"><i class="arrow-%dir%"></i></div>',tPrev:"Bild zurück (Pfeiltaste links)",tNext:"Bild vor (Pfeiltaste rechts)",tCounter:"%curr% von %total%"},image:{tError:'<a href="%url%">Das Bild #%curr%</a> konnte nicht geladen werden.',titleSrc:!1,titleSrc:function(e){let t="";return e.el.find("img").attr("title")&&(t+="<h3>"+e.el.find("img").attr("title")+"</h3>"),e.el.parent().find("figcaption")[0]&&(t+="<p>"+e.el.parent().find("figcaption").html()+"</p>"),t}},zoom:{enabled:!0,duration:300,easing:"ease-in-out"}})})),t()(".tx-dlf-listview ol.tx-dlf-abstracts > li").each((function(){t()(this).find("ol.tx-dlf-volume")[0]||t()(this).addClass("no-subs")})),t()(".tx-dlf-listview ol.tx-dlf-abstracts .tx-dlf-morevolumes").on("click",(function(){t()(this).parent().toggleClass("open")})),Modernizr.objectfit||t()("figure > a, .collection-element > a").each((function(){const e=t()(this).find("img").attr("src");e&&t()(this).css("backgroundImage","url("+e+")").addClass("fix-object-fit")})),t()(".selected-logos .institute-logo")[0]&&t()(".selected-logos .institute-logo").sort((function(){return Math.round(Math.random())-.6})).slice(0,6).addClass("visible")}))})()})();
//# sourceMappingURL=SxndScripts.js.map