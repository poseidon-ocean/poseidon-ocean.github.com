/*此代码不要删除*/
var Global = {};

function dom(id){
	return document.getElementById(id);
};

/*dom渲染完毕执行的回调函数类似于jquery中$(function(){})*/	
function ready(b) {
	if(document.addEventListener) document.addEventListener("DOMContentLoaded", b, !1);
	else {
		var a = document.createElement("script");
		document.getElementsByTagName("head")[0].appendChild(a);
		a.defer = !0;
		a.onreadystatechange = function() {
			"complete" == a.readyState && b()
		}
	}
};


/*找到同辈元素的方法*/
function siblings(ele,callback){
	var parentObj = ele.parentElement;
	var children = parentObj.children;
	//循环的目标就是为了去排除本身
	for(var i=0,len=children.length;i<len;i++){
		if(children[i]==ele){
			continue;
		}else{
			//callback.call(children[i]);
			callback(children[i]);
		}
	}
}

/**
 * 找到对应的索引
 * @param {Object} ele
 */
function getIndex(ele){
	var parentObj = ele.parentElement;
	var children = parentObj.children;
	//循环的目标就是为了去排除本身
	var index = -1;
	for(var i=0,len=children.length;i<len;i++){
		if(children[i]==ele){
			index = i;
			break;
		}
	}
	return index;
}
	

/*根据class获取doms对象*/	
function getClass(tagName, className) {
	if (document.getElementsByClassName) {
		return document.getElementsByClassName(className);
	} else {
		var aEle = tagName.getElementsByTagName('*');
		var aResult = [];
		var re = new RegExp('\\b' + className + '\\b', 'i');

		for (var i = 0; i < aEle.length; i++) {
			if (aEle[i].className.search(re) != -1) {
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	}
}

/*判断是否已经添加了某个class*/
function hasClass(obj, cls) { 
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
} ; 
/*添加样式*/
function addClass(ele,cls) { 
	//如果已经追加过了就不再添加
	if (!this.hasClass(ele,cls)) ele.className +=" "+cls; 
} ;

/*删除class*/
function removeClass(ele,cls) { 
	if (hasClass(ele,cls)) { 
		var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
		ele.className=ele.className.replace(reg,' '); 
	} 
};

/**
 * 判断非空
 * 
 * @param val
 * @returns {Boolean}
 */
function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}

/*非空判断*/
function isNotEmpty(val) {
	return !isEmpty(val);
}

//范围随机数
function randomRange(start,end){
	return Math.floor(Math.random()*(end-start+1))+start;
};


/*随机数*/
function randomNum(num){
	return Math.floor(Math.random()*(num+1));
};


/*rgb的随机颜色*/
function randomColor(){
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	return "rgb("+r+","+g+","+b+")";//IE7不支出rgb
};

/*十六进制的随机颜色*/
function randomColor16(){
	//0-255	
	var r = Math.random(255).toString(16);
	var g = Math.random(255).toString(16);
	var b = Math.random(255).toString(16);
	//255的数字转换成十六进制
	if(r.length<2)r = "0"+r;
	if(g.length<2)g = "0"+g;
	if(b.length<2)b = "0"+b;
	return "#"+r+g+b;
};

/*mark为false或者不传递代表就是session级别*/
function setSession(key,value,mark){
	//如果浏览器支持的话 localStorage
	if(window.localStorage){
		window[mark?"localStorage":"sessionStorage"].setItem("mk_"+key,value);
	}else{
		//cookie
	}
};

function getSession(key,mark){
	//如果浏览器支持的话 localStorage
	if(window.localStorage){
		return window[mark?"localStorage":"sessionStorage"].getItem("mk_"+key);
	}else{
		//cookie
	}
};

function removeSession(key,mark){
	//如果浏览器支持的话 localStorage
	if(window.localStorage){
		window[mark?"localStorage":"sessionStorage"].removeItem("mk_"+key);
	}else{
		//cookie
	}
};


/*loading提示*/
function loading(target,mark){
	$(target).show().on("click",function(){
		$(this).hide();
	}).height(50);
	$.loading({target:$(target),mark:mark}); 
};


/*滚动事件封装*/
function loadScroll(callback){
	window.onload = window.onscroll = function(){
		//可视区域
		var clientHeight = window.innerHeight || document.documentElement.clientHeight;
		//整个文档的高度
		var bheight = document.body.clientHeight;
		//滚动条的距离
		var stop = document.documentElement.scrollTop || document.body.scrollTop;
		
		//console.log((clientHeight+stop)+"====="+bheight)
		if(!window.loadMark && clientHeight+stop+3 >= bheight){
			//加锁
			window.loadMark = true;
			//执行一个异步操作,跨域的问题,需要消耗时间
			loading("#loading",11);
			callback && callback();
		}
	};
};