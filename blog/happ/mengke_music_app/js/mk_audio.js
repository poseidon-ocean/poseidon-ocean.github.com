/*
 * @author:keke
 * @description:音乐播放器
 * @依赖模块：
 * @date:2016年11月30日 22:40
 * @tel:15074816437
 * @QQ:1571828260
 * 
 * audio和video标签属性：
 * src:播放的文件
 * autoplay:auto:自动播放
 * controls:"是否显示控件"
 * loop:循环播放，默认是false
 * preload:预加载,当页面加载完以后吗，如何加载数据.默认值自动，如果none 不预加载,缓冲数据.
 * 
 * video特有的：
 * poster:"设置封面图"
 * width/height:可以改变video的宽和高
 * 
 * 
 * 用javascript获取媒体对象操作接口(对象)属性：
 * 
 *	currentSrc:当前播放的src
 * currentTime:获取当前播放的时间
 * duraion:总时长
 * volume:0-0.5-1的小数
 * muted:是否静音 true静音 false，非静音
 * played:不是返回true,和false,返回的是一个timeranges的对象,该对象包括了播放的开始时间和结束时间.
 * paused:是否暂停 返回true /false
 * buffer
 * 
 * 方法
 * play() 播放
 * pause() 暂停
 * 接口事件：
	 * canPlayType();判断浏览器是否支持媒体类型
	 * canplaythrough :当前播放器不需要缓冲，就执行回调函数，用来计算总时长
	 * timeupdate:监听播放中的一个事件
	 * ened:监听播放完毕执行的事件
	 * play:当对象调用play()方法的时候执行回调函数
	 * pause()当对象调用pause()方法的时候执行回调函数
	 * error:播放出错执行回调函数
	 * ratechange:当你改变的播放速度或者快进执行的回调函数
	 * volumechange:当你改变的改变音量执行的回调函数
 * */
(function(){
	//注册--模块划分
	Global.audio={};
	
	//初始化音乐播放器对象
	var audioDom = null;
	var currentIndex = 0;//播放的索引
	var clen = 0;//播放的总数
	//当页面中的dom元素渲染完毕执行的回调函数
	var totalTime = 0;//播放器的总时长
	ready(function(){
		audioDom = dom("audio");
		
		//加载缓存中设定的音乐
		Global.audio.getCache();
		
		//设置默认音量,如果你缓存里面有音量，那么久就用你设定的
		audioDom.volume = getSession("audio_volume",true)||0.5;
		dom("vrange").value =  (getSession("audio_volume",true)||0.5) * 10;
		
		//初始化播放的总数
		clen = dom("mk_musiclist").children.length;
		
		//当audioDom加载到数据缓冲的时候执行的回调函数
		audioDom.addEventListener("canplaythrough",function(){
			totalTime = this.duration;
			dom("ptime").innerHTML = dom("ttime").innerHTML = Global.audio.format(totalTime);
		});
		
		//监听音乐的播放中的回调函数
		audioDom.addEventListener("timeupdate",function(){
			var ctime = this.currentTime;
			dom("stime").innerHTML = Global.audio.format(ctime);
			dom("ptime").innerHTML = Global.audio.format(totalTime - this.currentTime);
			
			//把当前播放的时间记录起来,并且播放的索引也记录起来，
			Global.audio.setCache({
				ctime:ctime,
				index:currentIndex
			});
		});
		
		
		
		//监听播放完毕执行的回调函数
		audioDom.addEventListener("onended",function(){
			currentIndex++;
			currentIndex = currentIndex%clen;
			Global.audio.playIndex(currentIndex);
		});
		
		
		/*
		audioDom.addEventListener("play",function(){
			
			
		});*/
		
		
		
		/*
		audioDom.addEventListener("pause",function(){
			alert("有人暂停我了...");
		});
		*/
	});
	
	Global.audio ={
		//时间格式化
		format:function(ctime){
			var m = parseInt(ctime / 60,10);
			var s = parseInt(ctime % 60,10);
			if(m<10)m="0"+m;
			if(s<10)s="0"+s;
			return m+":"+s;
		},
		//根据播放索引进行点播
		playIndex:function(index,ctime){
			//拿到播放器列表的所以的 dl对象,在找到要操作的 a
			var obj = dom("mk_musiclist").children[index].children[0];
			var link = obj.getAttribute("data-link");
			audioDom.src = link;
			//有问题？
			//if(ctime)audioDom.currentTime = ctime;
			//播放
			audioDom.play();
			//同辈元素样式互斥的问题
			siblings(obj.parentElement,function(sobj){
				removeClass(sobj.children[0],"selected");
			});
			//添加播放选中状态样式，
			addClass(obj,"selected");
		},
		//播放暂停的控制
		play:function(obj){
			//obj代表当前点击的对象--a
			//获取当前我们点击的播放音乐文件
			var link = obj.getAttribute("data-link");
			//给播放器添加音乐文件，
			//点同一个，没有继续播放 01.mp3 
			if(audioDom.src.indexOf(link)!=-1 && !audioDom.paused){//暂停进入
				removeClass(obj,"selected");
				audioDom.pause();
			}else{//播放进入
				//你当前播放的地址和之前的地址不一样的话，我们才更改播放地址
				if(audioDom.src.indexOf(link)==-1)audioDom.src = link;
				//播放
				audioDom.play();
				
				//同辈元素样式互斥的问题
				siblings(obj.parentElement,function(sobj){
					removeClass(sobj.children[0],"selected");
				});
				//添加播放选中状态样式，
				addClass(obj,"selected");
				
				//把当前点击的元素的索引赋值给当前播放的currentIndex。进行记录
				currentIndex = getIndex(obj.parentElement);
			}
		},
		//设置音量
		setV:function(obj){
			var vnum = obj.value/10;
			audioDom.volume = vnum;
			setSession("audio_volume",vnum,true);
		},
		setCache:function(obj){
			setSession("audio_cache",JSON.stringify(obj),true);
		},
		getCache:function(){
			var jsonString = getSession("audio_cache",true);
			if(jsonString){
				var json = JSON.parse(jsonString);
				this.playIndex(json.index,json.ctime);
			}
		}
	} ;
})();