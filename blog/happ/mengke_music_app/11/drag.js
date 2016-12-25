var mkDrag = (function(){
	var zindex = 1;
	function mk_Drag(dom){
		var parentDom = dom;
		//第一步：拿到拖拽元素
		var dragDom = dom;
		//获取你指定的拖拽的第几个孩子
		var dragIndex = dom.getAttribute("dragindex");
		//你要委托子元素去拖拽
		if(dragIndex)dragDom = dom.children[dragIndex*1-1];
		//拖拽三部曲：
		//1:给元素加position:absolute/fixed; 改变top,left的值
		//2:给拖拽元素绑定onmousedown事件
		dragDom.onmousedown = function(e){
			//操作永远外层盒子
			var x = e.clientX;
			var y = e.clientY;
			var cleft = parentDom.offsetLeft;
			var ctop  = parentDom.offsetTop;
			var maxLeft = window.innerWidth - parentDom.offsetWidth;
			var maxTop = window.innerHeight - parentDom.offsetHeight;
			parentDom.style.zIndex = ++zindex;
			//3:给document绑定onmousemove 和onmouseup事件
			document.onmousemove = function(e){
				var nleft = e.clientX -x +cleft;
				var ntop = e.clientY -y+ctop;
				if(ntop<=0)ntop=0;
				if(nleft<=0)nleft=0;
				if(ntop>=maxTop)ntop=maxTop;
				if(nleft>=maxLeft)nleft=maxLeft;
				parentDom.style.left = nleft+"px";
				parentDom.style.top = ntop+"px";
			};
			document.onmouseup = function(e){
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	};
	return mk_Drag;
})();
