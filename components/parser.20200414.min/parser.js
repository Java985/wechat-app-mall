// 小程序富文本插件 https://github.com/jin-yufeng/Parser
"use strict";function _defineProperty(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function hash(t){for(var e=t.length,i=5381;e--;)i+=(i<<5)+t.charCodeAt(e);return i}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},cache={},Parser=require("./libs/MpHtmlParser.js"),fs=wx.getFileSystemManager&&wx.getFileSystemManager();try{var dom=require("./libs/document.js")}catch(t){}Component({options:{pureDataPattern:/^[acdgtux]|W/},properties:{html:{type:null,observer:function(t){this._refresh?this._refresh=!1:this.setContent(t,!1,!0)}},autosetTitle:{type:Boolean,value:!0},autopause:{type:Boolean,value:!0},compress:Number,domain:String,gestureZoom:Boolean,lazyLoad:Boolean,selectable:Boolean,tagStyle:Object,showWithAnimation:Boolean,useAnchor:Boolean,useCache:Boolean,xml:Boolean},relations:{"../parser-group/parser-group":{type:"ancestor"}},created:function(){this.imgList=[],this.imgList.setItem=function(t,e){var i=this;if(t&&e){if(0==e.indexOf("http")&&this.includes(e)){for(var s,a="",n=0;(s=e[n])&&("/"!=s||"/"==e[n-1]||"/"==e[n+1]);n++)a+=Math.random()>.5?s.toUpperCase():s;return a+=e.substr(n),this[t]=a}if(this[t]=e,e.includes("data:image")){var r=e.match(/data:image\/(\S+?);(\S+?),(.+)/);if(!r)return;var o=wx.env.USER_DATA_PATH+"/"+Date.now()+"."+r[1];fs&&fs.writeFile({filePath:o,data:r[3],encoding:r[2],success:function(){return i[t]=o}})}}},this.imgList.each=function(t){for(var e=0,i=this.length;e<i;e++)this.setItem(e,t(this[e],e,this))}},detached:function(){this.imgList.each(function(t){t&&t.includes(wx.env.USER_DATA_PATH)&&fs&&fs.unlink({filePath:t})}),clearInterval(this._timer)},methods:{navigateTo:function(t){var e=this;if(!this.data.useAnchor)return t.fail&&t.fail({errMsg:"Anchor is disabled"});this.createSelectorQuery().select(".top"+(t.id?">>>#"+t.id:"")).boundingClientRect().selectViewport().scrollOffset().exec(function(i){if(!i[0])return e.group?e.group.navigateTo(e.i,t):t.fail&&t.fail({errMsg:"Label not found"});t.scrollTop=i[1].scrollTop+i[0].top,wx.pageScrollTo(t)})},getText:function(){for(var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data.html,i="",s=0;t=e[s++];)if("text"==t.type)i+=t.text.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");else if("br"==t.type)i+="\n";else{var a="p"==t.name||"div"==t.name||"tr"==t.name||"li"==t.name||"h"==t.name[0]&&t.name[1]>"0"&&t.name[1]<"7";a&&i&&"\n"!=i[i.length-1]&&(i+="\n"),t.children&&(i+=this.getText(t.children)),a&&"\n"!=i[i.length-1]?i+="\n":"td"!=t.name&&"th"!=t.name||(i+="\t")}return i},getVideoContext:function(t){if(!t)return this.videoContexts;for(var e=this.videoContexts.length;e--;)if(this.videoContexts[e].id==t)return this.videoContexts[e]},setContent:function(t,e,i){var s=this,a={};if(t)if("string"==typeof t){var n=new Parser(t,this.data);if(this.data.useCache){var r=hash(t);cache[r]?a.html=cache[r]:(a.html=n.parse(),cache[r]=a.html)}else a.html=n.parse();this._refresh=!0,this.triggerEvent("parse",a.html)}else if(t.constructor==Array){if(t.length&&"Parser"!=t[0].PoweredBy){var o=new Parser("",this.data);!function t(e){for(var i,s=0;i=e[s];s++)if("text"!=i.type){i.attrs=i.attrs||{};for(var a in i.attrs)"string"!=typeof i.attrs[a]&&(i.attrs[a]=i.attrs[a].toString());o.matchAttr(i),i.children&&(o.STACK.push(i),t(i.children),o.popNode(o.STACK.pop()))}}(t),a.html=t}i||(a.html=t)}else{if("object"!=(void 0===t?"undefined":_typeof(t))||!t.nodes)return console.warn("错误的 html 类型："+(void 0===t?"undefined":_typeof(t)));a.html=t.nodes,console.warn("错误的 html 类型：object 类型已废弃")}else{if(i||e)return;a.html=""}e?(this._refresh=!0,a.html=(this.data.html||[]).concat(a.html)):this.data.showWithAnimation&&(a.showAm="animation: show .5s"),(a.html||a.showAm)&&this.setData(a),this.data.html.length&&this.data.html[0].title&&this.data.autosetTitle&&wx.setNavigationBarTitle({title:this.data.html[0].title}),this.imgList.length=0,this.videoContexts=[],dom&&(this.document=new dom(this.data.html,"html",this));for(var h,l=this.selectAllComponents(".top,.top>>>._node"),c=0;h=l[c++];){h.top=this;for(var m,f=0;m=h.data.nodes[f++];)if(!m.c)if("img"==m.name)this.imgList.setItem(m.attrs.i,m.attrs.src);else if("video"==m.name||"audio"==m.name){var u;u="video"==m.name?wx.createVideoContext(m.attrs.id,h):h.selectComponent("#"+m.attrs.id),u&&(u.id=m.attrs.id,this.videoContexts.push(u))}}(wx.nextTick||setTimeout)(function(){return s.triggerEvent("load")},50);var d;clearInterval(this._timer),this._timer=setInterval(function(){s.createSelectorQuery().select(".top").boundingClientRect(function(t){s.rect=t,t.height==d&&(s.triggerEvent("ready",t),clearInterval(s._timer)),d=t.height}).exec()},350)},preLoad:function(t,e){if("string"==typeof t){var i=hash(t);t=new Parser(t,this.data).parse(),cache[i]=t}var s,a=[];!function t(e){for(var i,s=0;i=e[s++];)"img"==i.name&&i.attrs.src&&!a.includes(i.attrs.src)&&a.push(i.attrs.src),t(i.children||[])}(t),e&&(a=a.slice(0,e)),this._wait=(this._wait||[]).concat(a),this.data.imgs?this.data.imgs.length<15&&(s=this.data.imgs.concat(this._wait.splice(0,15-this.data.imgs.length))):s=this._wait.splice(0,15),s&&this.setData({imgs:s})},_load:function(t){this._wait.length&&this.setData(_defineProperty({},"imgs["+t.target.id+"]",this._wait.shift()))},_tap:function(t){if(this.data.gestureZoom&&t.timeStamp-this._lastT<300){var e=t.detail.y-t.currentTarget.offsetTop;if(this._zoom)this._scaleAm.translateX(0).scale(1).step(),wx.pageScrollTo({scrollTop:(e+this._initY)/2-t.touches[0].clientY,duration:400});else{var i=t.detail.x-t.currentTarget.offsetLeft;this._initY=e,this._scaleAm=wx.createAnimation({transformOrigin:i+"px "+this._initY+"px 0",timingFunction:"ease-in-out"}),this._scaleAm.scale(2).step(),this._tMax=i/2,this._tMin=(i-this.rect.width)/2,this._tX=0}this._zoom=!this._zoom,this.setData({scaleAm:this._scaleAm.export()})}this._lastT=t.timeStamp},_touchstart:function(t){1==t.touches.length&&(this._initX=this._lastX=t.touches[0].pageX)},_touchmove:function(t){var e=t.touches[0].pageX-this._lastX;if(this._zoom&&1==t.touches.length&&Math.abs(e)>20){if(this._lastX=t.touches[0].pageX,this._tX<=this._tMin&&e<0||this._tX>=this._tMax&&e>0)return;this._tX+=e*Math.abs(this._lastX-this._initX)*.05,this._tX<this._tMin&&(this._tX=this._tMin),this._tX>this._tMax&&(this._tX=this._tMax),this._scaleAm.translateX(this._tX).step(),this.setData({scaleAm:this._scaleAm.export()})}}}});