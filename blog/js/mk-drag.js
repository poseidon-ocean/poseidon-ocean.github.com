//fn的组件定义的方式
//定义格式：$.fn.组件名称  =function(){}--javascript--模块模式
(function($){
	//组件的入口
	$.fn.mkDrag = function(options){
		//this---指向就你调用者 
		var opts = $.extend({},$.fn.mkDrag.methods,$.fn.mkDrag.defaults,options);
		return this.each(function(){
			opts.init($(this),opts);
		});
	};	

	//事件绑定
	$.fn.mkDrag.methods = {
		init:function($object,opts){
			$object.off("mousedown").on("mousedown",function(e){
				//目标对象
				var $obj = $(this);
				//获取目标对象的left和top的位置
				var left = $obj.offset().left;//this.offsetLeft;
				var top = $obj.offset().top;//this.offsetTop
				//获取鼠标的位置
				var x = getXY(e).x;
				var y = getXY(e).y;
				//获取目标元素left和top位移的最大位置
				var maxleft = $(window).width()-$obj.width();
				var maxTop = $(window).height()-$obj.height();
				//3:给document绑定onmousemove和onmouseup
				$(document).off("mousemove").on("mousemove",function(e){
					//获取鼠标移动的位置	
					var nx = getXY(e).x;
					var ny = getXY(e).y;
					//计算出新的位置
					var cleft = nx - x + left;
					var ctop = ny - y + top;
					//目标元素的最大位置和最小的控制
					if(cleft<=0)cleft = 1;
					if(ctop<=0)ctop = 1;
					if(cleft >=maxleft)cleft = maxleft;
					if(ctop >=maxTop)ctop = maxTop;
					//改变物体的位置
					if(opts.arrow=="left"){
						$obj.css({left:cleft});
					}else if(opts.arrow=="top"){
						$obj.css({top:ctop});
					}else{
						$obj.css({left:cleft,top:ctop});
					}
				}).off("mouseup").on("mouseup",function(e){
					//这个如果有业务
					//释放鼠标的移动事件
					$(document).off("mousemove");
					$(document).off("mouseup");
					if(opts.callback)opts.callback.call($obj);
				});
			});
		}
	};
	
	//默认参数
	$.fn.mkDrag.defaults = {
		arrow:"",
		callback:null
	};

	/*
		pageX  和clientX
		pageX--只有ie才支持的值等于 e.clientX + document.body.scrollLeft
		pageY同理
	*/
	function getXY(e){
		var x = e.pageX || (e.clientX + document.body.scrollLeft);//如果你的定位采用的absolute的话
		var y = e.pageY || (e.clientY + document.body.scrollTop);
		return {x:x,y:y};
	};

})(jQuery);