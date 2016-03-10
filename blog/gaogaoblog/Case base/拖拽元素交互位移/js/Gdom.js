








/*	【动画封装】

	用法：
	$("对象").事件 = function(){	
				//传入对象，opacity要是整数
		move(this,{width:200,opacity:100},function(){
			move(this,{top:200});//传回调函数
			this.style.background = "red";
		});
	};
	还可以加上时间间隔，不加就是使用默认值
*/

//支持宽度，高度，坐标，淡入淡出
function move(dom,json,callback,time){
	//每次开始清除上一次的动画
	clearInterval(dom.timer);
	dom.timer = setInterval(function(){
		//所有元素执行完毕以后的状态
		var mark = true
		//循环所有动画的属性
		for(var attr in json){
			var cur = null;
			//判断是不是opacity，在做处理
			if(attr == "opacity"){
				cur = getStyle(dom,attr) * 100;//先乘100方便运算
			}else{//如果样式里面没有写，那么获取不到，就为0
				cur = parseInt(getStyle(dom,attr)) || 0;
			};
			//目标终止值
			var target = json[attr];
			var speed = (target - cur)*0.2;//缓冲效果，越来越慢
			//去除小数，通过判断条件进行上下取整，为了能最终不多不少到达目标值
			speed = (speed >0 ? Math.ceil(speed) : Math.floor(speed));
			if(cur != target){
				mark = false;
				if(attr == "opacity"){
					dom.style.opacity = (cur+speed)/100;//在还原为小数
					dom.style.filter = "alpha(opacity="+((cur+speed))+")";//兼容IE678
				}else{
					dom.style[attr] = cur+speed+"px";
				}
			}
		};
		//如果执行完毕
		if(mark){
			clearInterval(dom.timer);//清除动画
			if(callback)callback.call(dom);//然后再执行回调函数
		};
		
	},time||30);
};

//【获取样式属性值】
function getStyle(dom,attr){
	return window.getComputedStyle ? window.getComputedStyle(dom,null)[attr]:dom.currentStyle[arrt]  ; 
};
//不解释
function $(id){
	return document.querySelector("#"+id) || document.getElementById(id);
};



//【两个对象的混入】
function mixin(obj,obj2){
	for(var k in obj2){	//循环obj2的属性
		if(obj2.hasOwnProperty(k)){ //判断是否存在对象属性
			obj[k] = obj2[k];//给obj扩展新的属性，然后把obj2的属性赋给obj
		}
	}
	return obj;//最后返回包含两个对象属性的新对象。
};

//【多个对象混入】
function mix(target,source){
	var arr = [];
	var args = arr.slice.call(arguments);//把多个对象放入数组中
	var i = 1;//从第二个参数开始循环
	if(args.length == 1){//如果只有一个参数就不需要混入了直接返回
		return target;
	};
	while((source = args[i++])){//每次循环把数组内依次的对象赋给source
		for(var key in source){//把数组内的每个对象都循环
			if(source.hasOwnProperty(key)){//判断是否存在对象属性
				target[key] = source[key];//给target扩展新的属性，然后把source的属性赋给target
			}
		}
	}
	return target;//返回所有对象的混入集合
};


//【循环】
function Geach(doms,callback){
	var domArr = Array.prototype.slice.call(doms);
	domArr.forEach(function(obj,index){
		if(callback)callback.call(obj,index);
	});
};


//	    【 获取鼠标的位置，包括滚动条部分，并且兼容IE 678 】

	function getXY(e){
		var ev = e || window.event;//解决兼容
		var x=0,y=0;
		if(ev.pageX){ //可以直接获得鼠标在窗口的坐标，包括滚动条的距离
			x = ev.pageX;
			y = ev.pageY;
		}else{
			//获取当前已滚动的滚动条距离
			var sleft = 0,stop = 0;
			if(document.documentElement){//IE 678
				sleft = document.documentElement.scrollLeft;
				stop = document.documentElement.scrollTop;
			}else{//IE 9+ 谷歌
				sleft = document.body.scrollLeft;
				stop = document.body.scrollTop;
			}
//ev.clientX  只能得到当前窗口的坐标，超出部分就不能获取
//用当前窗口的坐标加上已滚动的滚动条距离就可以得到和pageY，pageX一样的效果
			x = ev.clientX + sleft;
			y = ev.clientY + stop;
		}
		return {x:x,y:y};
	};