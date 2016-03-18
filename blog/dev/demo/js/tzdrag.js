/*
	案例：弹出层的拖拽
	知识点：
		定位：position
		鼠标事件:mousedown、mouseup、mousemove,e.clientX,e.clientY
		获取一个元素的offsetLeft  offsetTop坐标位置
		获取元素宽度和高度offsetWidth offsetHeight
		
		
		offsetLeft  当前元素相对于父元素的左边的距离
		offsetTop  当前元素相对于父元素上边的距离
		offsetWidth  当前元素的实际宽度，不包括overflow
		offsetHeight  当前元素的实际高度，不包括overflow
	改变的元素:left top的位置
	层级关系： z-index
*/

var tzWindow = (function(){
	forbiddenSelect();  //禁止窗体选中
	Array.prototype.each = function(callback){
		var i=0,len=this.length;
		for(;i<len;i+=1){
			if(callback)callback(this[i],i);
		}
	};
	
	//获取数组中最大的数字
	function maxArray(arr){
		return Math.max.apply({},arr);
	}
	//获取数组中最小的数字
	function minArray(arr){
		return Matn.max.apply({},arr);
	}
	
	return {
		//默认参数的设置
		defaults:{
			drag:true,
			width:600,
			height:360,
			title:"我是一个窗口哦",
			box:"tzwindow"
		},
		//获取所有的窗口对象
		windows:function(opts){
			var winDoms = document.getElementsByClassName(opts.box);
			var winArr = Array.prototype.slice.call(winDoms);
			return winArr;
		},
		//窗口初始化入口
		init:function(options){
			var opts = tzextend({},this.defaults,options);
			this.template(opts);//模板的初始化
			this.events(opts);//事件的初始化
			this.resize(opts);//窗口的初始化
			if(opts.drag)this.drag(opts);//拖拽的初始化
		},
		template:function(opts){
			var html = "<div class='tzwindow' style='width:"+opts.width+"px;height:"+opts.height+"px;'>"+
						"<div class='title'>"+opts.title+"</div>"+
						"<div class='buttons'>"+
						"	<a href='javascript:;'>最大化</a>"+
						"	<a href='javascript:;'>关闭</a>"+
						"</div>"+
						"<div class='resize br_resize'></div>"+
					"</div>";
			document.body.innerHTML += html; 
		},
		//获取最大的层级关系
		getMaxZindex:function(opts){
			var windows = this.windows(opts);
			var arr = [];
			windows.each(function(win){
				arr.push(win.style.zIndex);
			});
			return maxArray(arr);
		},
		//最小化和窗口改变事件
		events : function(opts){
			var $this = this;
			var windows = $this.windows(opts);
			windows.each(function(win){
				var btndom = win.getElementsByClassName("buttons")[0];
				//最大化
				btndom.firstElementChild.onclick = function(){
					//获取窗口的最大宽度和高度
					var ww = window.innerWidth - 16;
					var wh = window.innerHeight - 16;
					//点击窗口之前缓存坐标位置的高度和宽度
					var tgg = this.dataset.params;
					//获取层级关系
					zIndex = $this.getMaxZindex(opts);
					zIndex ++;
					//如果没有缓存坐标，代表点击最大化
					if(!tgg){
						var html = "";
						html += "left:" + win.offsetLeft + "px;";
						html += "top:" + win.offsetTop + "px;";
						html += "width:" + win.offsetWidth + "px;";
						html += "height:" + win.offsetHeight + "px;";
						html += "z-index:" + zIndex;
						//缓存坐标位置
						this.dataset.params = html;
						
						win.style.left = "0px";
						win.style.top = "0px";
						win.style.zIndex = zIndex;
						win.style.width = ww + "px";
						win.style.height = wh + "px";
						this.innerText = "还原";
					}else{
						//缓存重新设置给窗口
						win.setAttribute("style",tgg);
						//缓存的数据情况
						this.dataset.params = "";
						//更改文本
						this.innerText = "最大化";
					}
				};
				//关闭
				btndom.lastElementChild.onclick = function(){
					document.body.removeChild(win);
				};
				
				//最小化
			});
		},
		//改变窗口事件
		resize:function(opts){
			var $this = this;
			//获取窗口对象
			var windows = $this.windows(opts);
			windows.each(function(win){
				//窗口绑定事件
				win.onmousedown = function(e){
					var ev = e || window.event;
					//利用委托获取目标元素
					var target = ev.target || ev.srcElement;
					var className = target.className;
					//判断目标元素是不是拖动位置
					if(className.indexOf("br_resize") != -1){
						win.cmak = false;
						//获取数据点击的x、y轴的位置
						var x = ev.clientX;
						var y = ev.clientY;
						//获取窗口的宽度和高度
						var w = this.offsetWidth;
						var h = this.offsetHeight;
						//获取窗口的最大层级
						zIndex =  $this.getMaxZindex(opts);
						zIndex ++;
						//更改层级关系
						win.style.zIndex = zIndex;
						//加锁
						win.cmark = true;
						//绑定document的移动事件
						document.addEventListener("mousemove",function(e){
							if(win.cmark){
								//更改元素高度和宽度
								var nw = (e.clientX -x + w);
								var nh = (e.clientY - y +h);
								win.style.width = (nw<200?200:nw) + "px";
								win.style.height = (nh<200?200:nh) + "px";
							}
						},false);
						//鼠标松开的事件
						document.addEventListener("mouseup",function(){
							win.cmark = false;
							//document.onmousemove = null;
							//document.onmouseup = null;
						},false);
						e.stopPropagation();
					}
					ev.stopPropagation();
				}
			});
		},
		drag:function(opts){
			var windows = this.windows(opts);
			//层级关系
			var zindex = 1;
			windows.each(function(win){
				var x,y,x1,y1,l,t,mark = false; //关灯
				var ww = window.innerWidth;
				var wh = window.innerHeight;
				//获取窗口的title对象
				var titleDom = win.firstElementChild;
				//document.getElementByClassName(".title")[0];
				
				//绑定title鼠标按下事件
				titleDom.addEventListener("mousedown",function(e){
					//鼠标第一次点击的位置
					x = e.clientX;
					y = e.clientY;
					//元素所在的left和top的位置
					var pdom = this.parentElement; 
					
					l = pdom.offsetLeft;
					t = pdom.offsetTop;
					//最大边界
					var maxW = ww - pdom.offsetWidth;
					var maxH = wh - pdom.offsetHeight;
					zindex ++;
					pdom.style.zIndex = zindex;
					
					mark = true;
					document.addEventListener("mousemove",function(e){
						if(mark){
							//鼠标移动位置
							x1 = e.clientX;
							y1 = e.clientY;
							
							var nl = x1-x+l;
							var nt = y1-y+t;
							if(nl<=0)nl=1;
							if(nt<=0)nt=1;
							if(nl>=maxW)nl=maxW;
							if(nt>=maxH)nt=maxH;
							
							pdom.style.left = nl + "px";
							pdom.style.top = nt + "px";
						}
					},false);
					//鼠标松开的事件
					document.addEventListener("mouseup",function(){
						mark = false;
						//document.onmousemove = null;
						//document.onmouseup = null;
					},false);
					e.stopPropagation();
				},false);
				
			});
		},
	}
})();

/**
	作用：对象参数的继承和覆盖
	用法：var opts = tzextend(target,json1,json2,json3...,mark);
	mark的默认值是:true代表的是，后面有相同属性值会进行合并/覆盖，
	如果是false代表target对象里值追加
*/
function tzextend(target,source){
	//arguments是一个动态参数转换成一个数组
	var args = Array.prototype.slice.call(arguments);
	//删除最后一个元素并弹出
	var mark = typeof (args.length-1) === "boolean"?args.pop():true;
	var i=0;
	if(args.length === 1){
		i = -1;
	}
	//循环里面的对象
	while((source = args[i++])){
		for(var key in source){
			if(mark || !(callback in target)){
				target[key] = source[key];
			}
		}
	}
	return target;
}

/**将对象转换成json字符串*/
function jsonToString(obj) {
	var THIS = this;
	switch (typeof (obj)) {
	case 'string':
		return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
	case 'array':
		return '[' + obj.map(THIS.jsonToString).join(',') + ']';
	case 'object':
		if (obj instanceof Array) {
			var strArr = [];
			var len = obj.length;
			for (var i = 0; i < len; i++) {
				strArr.push(THIS.jsonToString(obj[i]));
			}
			return '[' + strArr.join(',') + ']';
		} else if (obj == null) {
			return 'null';

		} else {
			var string = [];
			for ( var property in obj)
				string.push(THIS.jsonToString(property) + ':'
						+ THIS.jsonToString(obj[property]));
			return '{' + string.join(',') + '}';
		}
	case 'number':
		return obj;
	case false:
		return obj;
	}
};


/**
 * 禁止窗体选中
 */
function forbiddenSelect() {
	document.onselectstart = new Function("event.returnValue=false;");
}

/** 窗体允许选中 */
function autoSelect() {
	document.onselectstart = new Function("event.returnValue=true;");
};