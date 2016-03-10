var TzMusic = (function(){
	//特权属性 id
	function _tzMusic(id,src,title,author){
		//this new当然_tzMusic 如果没有this---window
		//对象 .instanceof.类--判断当前对象是不是没个类所创建的对象
		if(this instanceof _tzMusic){//对象的检查
			this.id = id;
			this.src = src;
			this.title= title;
			this.author = author;
		}else{
			return new _tzMusic(id,src,title,author);
		}
	};
	
	 //公有方法和属性
	_tzMusic.prototype = {
		constructor:_tzMusic,
		audioDom : null,
		init:function(opts,callback){
			this.audioDom = document.createElement("audio");
			this.audioDom.src = this.src;
			//this.audioDom.controls = "controls";
			dom(this.id).appendChild(this.audioDom);
			this.event(callback);
			for(var key in opts){
				this.drag(opts[key],key,function(mark,dom,sbit){
					if(mark){
						//如果音乐正在播放，就调用暂停方法
						if(dom.key=="bar"){
							if(this.played)this.pause();
							this.currentTime = this.duration * sbit;

						}else{
							this.volume = sbit;	
						}
						var per = _tzMusic.formatPercent(sbit)+"%";
						dom.previousElementSibling.style.width =per;
						dom.children[0].innerHTML = per;
					}else{
						if(dom.key=="bar"){
							this.play();
						}
					}
				},function(sbit,dom){
					if(dom.key=="bar"){
						this.currentTime = this.duration * sbit;
					}else{
						this.volume = sbit;	
					}
				});
			}
		},
		//播放
		play:function(){
			this.audioDom.play();
		},
		//暂停
		stop:function(){
			this.audioDom.pause();
		},
		//静音
		stopVolome:function(callback){
			this.audioDom.muted = !this.audioDom.muted;
			if(callback)callback(this.audioDom.muted);
		},
		event:function(callback){
			//总时长 oncanplaythrough
			var json = {};
			this.audioDom.oncanplaythrough = function(){
				json.totaltime = this.duration;
				json.ftime = _tzMusic.format(this.duration);
				if(callback)callback.call(json,"time");
			};
			
			//播放时间 ontimeupdate
			this.audioDom.ontimeupdate = function(){
				json.playtime = this.currentTime;
				json.backtime  = this.duration - this.currentTime;
				json.fptime = _tzMusic.format(json.playtime);
				json.btime =  _tzMusic.format(json.backtime);
				json.percent = ((json.playtime / this.duration)*100).toFixed(0)||0;
				if(callback)callback.call(json,"play");
			};
			//播放完毕执行的事件:onended
		},
		drag:function(targetDom,key,callback,callback2){
			//获取音乐播放器对象
			var adom  = this.audioDom;
			//滚动bar
			var smallDom = targetDom;
			smallDom.key = key;
			smallDom.onmousedown = function(e){
				var ev = e || window.event;
				var pos = getXY(ev);
				var l = pos.x - this.offsetLeft;
				//获取最大走动的位置
				var maxL = this.parentElement.offsetWidth - this.offsetWidth;
				//元素拖拽事件
				document.onmousemove = function(e){
					var ev = e || window.event;
					var pos = getXY(ev);
					var nleft = pos.x - l
					if(nleft<=0)nleft=0;
					if(nleft>=maxL)nleft=maxL;
					//滚动条最终的位置
					smallDom.style.left = nleft+"px";
					var sbit = nleft / maxL;
					if(callback)callback.call(adom,true,smallDom,sbit);
				};

				//释放鼠标事件
				document.onmouseup= function(){
					document.onmousemove = null;
					document.onmouseup = null;
					//如果音乐正在暂停，就调用播放方法
					//if(adom.paused)adom.play();
					if(callback)callback.call(adom,false,smallDom);
				}
			};

			smallDom.nextElementSibling.onmousedown = function(e){
				var ev = e || window.event;
				//获取鼠标距离浏览器的位置
				var pos = getXY(ev);
				var x = pos.x;
				//拿到父元素的距离浏览器的位置
				var left = this.parentElement.offsetLeft;
				//获取当前鼠标在滚动条的位置
				var px = x - left;
				//拿到盒子整个宽度
				var pwidth = this.parentElement.offsetWidth;
				//用当前鼠标的位置除以盒子宽度计算出当前的百分比
				var sbit = px / pwidth;
				var percent = Math.ceil((sbit*100))+"%";
				var cwidth = pwidth - this.previousElementSibling.offsetWidth;
				this.previousElementSibling.style.left = (cwidth*sbit)+"px";
				this.previousElementSibling.children[0].innerHTML = percent;
				this.previousElementSibling.previousElementSibling.style.width = percent;
				if(callback2)callback2.call(adom,sbit,smallDom);
			}
		}
		
	};
	
	//静态方法和属性
	_tzMusic.time = "";
	//格式化日期
	_tzMusic.format = function(time){
		var m = Math.floor(time / 60);
		var s = Math.floor(time % 60);
		if(m<10)m = "0"+m;
		if(s<10)s = "0"+s;
		return m +":"+s;
	};
	//格式化百分比
	_tzMusic.formatPercent = function(sbit){
		return Math.ceil(sbit * 100);	
	};

	return _tzMusic;//返回一个类 function
})();

/*
	成员变量: 
	id :播放器存放于某个容器中
	src:播放的地址
	title:歌名
	author:演唱者

	currentSrc
	buffered
	readyState 
	seeking
	currentTime:当前播放的时间
	duration:总时长
	paused：暂停
	defaultPlaybackRate:
	playbackRate:快进和后退
	played:播放状态，当调用play()它是true,如果是pasue()那么就是false
	ended:播放结束的状态,当调用onended()就是true了
	autoplay:自动播放，默认是false,设置成 autoplay="autoplay" 
	loop:控制是否循环播放 loop="loop";
	controls:控制播放器是否显示，默认是"controls"
	volume:设置声音 0-0.5-1
	muted:设置静音
	defaultMuted:默认音量 0.5


	事件：
	play();
	pause();
*/
