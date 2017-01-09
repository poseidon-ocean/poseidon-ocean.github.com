//$(function(){//}) 的原理如下 检查页面中dom加载完毕执行的回调函数;
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


function getClass(tagName, className) {
    if (document.getElementsByClassName) {
    	var elements = document.getElementsByClassName(className);
        return Array.prototype.slice.call(elements);
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
};

function hasClass(obj, cls) { 
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
};


function addClass(ele,cls) { 
    if (!this.hasClass(ele,cls)) ele.className +=" "+cls; 
};

function removeClass(ele,cls) { 
    if (hasClass(ele,cls)) { 
        var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
        ele.className=ele.className.replace(reg,' '); 
    } 
};

//取位置
function gPos(obj) {
    var res = {
        l: 0,
        t: 0
    };

    while (obj) {
        res.l += obj.offsetLeft || 0;
        res.t += obj.offsetTop || 0;

        obj = obj.offsetParent;
    }

    return res;
};

function gotoTop(min_height){
	try{
		document.getElementById("sidetop").onclick = function(){
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		};
		
		
	}catch(e){
		
	}
};

