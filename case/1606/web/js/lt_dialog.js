/**
  * 描述:jq弹窗插件的封装 v1.0.0
  * 作者:lt
  */
(function($){
	$.ltdialog = {
		zindex:100,
		alert:function(options){
			var $dialog = this.init(options);     
			$dialog.find(".lt_cancel").remove();
		},
		sure:function(options){
			var $dialog = this.init(options);
			$dialog.find(".lt_sure").remove();
			$dialog.find(".lt_cancel").remove();
		},
		confirm:function(options){
			var $dialog = this.init(options);
		},
		init:function(options){
			this.zindex ++;
			//对象参数的覆盖
			var opts = $.extend({},$.ltdialog.defaults,options);
			var $dialog = this.template(opts);
			//更改样式
			$dialog.css({
				width:opts.width,
				height:opts.height,
				zIndex:this.zindex,
				border:opts.border,
				background:opts.background
			}).next().css({
				zIndex:(this.zindex-1)
			});
			//是否自适应高度
			if(opts.autoHeight)$dialog.height("auto");
			//居中定位
			this._position($dialog);
			//窗口改变
			this._resize($dialog);
			//是否拖拽
			if(opts.drag)this._drag($dialog);
			//事件初始化
			this.events($dialog,opts);
			
			return $dialog;
		},
		//居中定位
		_position:function($dialog){
			var ww = window.innerWidth || $(window).width();
			var wh = window.innerHeight || $(window).height();
			var _left = (ww - $dialog.width())/2;
			var _top = (wh - $dialog.height())/2;
			$dialog.css({left:_left,top:_top});
		},
		//窗口改变  实时改变窗口位置
		_resize:function($dialog){
			var _this = this;
			$(window).resize(function(){
				_this._position($dialog);
			});
		},
		//拖拽事件
		_drag:function($dialog){
			$dialog.find(".lt_title").mousedown(function(ev){
				var e = ev || window.event;
				var x = e.clientX - $dialog.offset().left;
				var y = e.clientY - $dialog.offset().top;
				var dw = $dialog.width();
				var dh = $dialog.height();
				
				var ww = window.innerWidth || $(window).width();
				var wh = window.innerHeight || $(window).height();
				var mw = ww - dw - 2;
				var mh = wh - dh -2 ;
				
				$(document).mousemove(function(ev){
					var e = ev || window.event;
					var l = e.clientX - x;
					var t = e.clientY - y;
					if(l<0) l = 0;
					if(t<0) t = 1;
					if(l>mw) l = mw;
					if(t>mh) t = mh;
					$dialog.css({left:l,top:t});
				});
				
				$(document).mouseup(function(){
					$(document).off("mousemove");
					$(document).off("mouseup");
				});
			});
		},
		events:function($dialog,opts){
			//确定按钮
			$dialog.find(".lt_sure").on("click",function(){
				if(opts.callback) opts.callback($dialog,true);
				//关闭阴影层
				$dialog.next().remove();
				//关闭弹窗
				$dialog.remove();
			});
			
			//取消按钮
			$dialog.find(".lt_cancel,.lt_close").on("click",function(){
				if(opts.callback) opts.callback($dialog,false);
				//关闭阴影层
				$dialog.next().remove();
				//关闭弹窗
				$dialog.remove();
			});
			
			//点击阴影是否关闭弹窗
			if(opts.overlayClose){
				//关闭阴影层
				$dialog.next().remove();
				//关闭弹窗
				$dialog.remove();
			}
		},
		//模板，更改的话  直接换模板就行
		template:function(opts){
			var html = $("<div class='lt_dialog'>"+
				"	<div class='lt_title'>"+opts.title+"</div>"+
				"	<a href='javascript:;' class='lt_close'>×</a>"+
				"	<div class='lt_content'>"+
				"		<div class='lt_body'>"+opts.content+"</div>"+
				"	</div>"+
				"	<div class='lt_btns'>"+  
				"		<a href='javascript:;' class='lt_btn lt_sure'>确定</a>"+
				"		<a href='javascript:;' class='lt_btn lt_cancel'>取消</a>"+
				"	</div>"+
				"  </div>");
			$("body").append(html).append("<div class='lt_overlay'></div>");
			return html;
		}
	};
	
	
	$.ltdialog.defaults = {
		width:360, //宽度
		height:200,//高度
		autoHeight:true,//是否自适应高度,默认true
		title:"提示",//标题提示
		drag:true,//是否可拖拽
		background:"#1F53A0",//背景色
		overlayClose:false,//点击阴影是否关闭弹窗，默认false
		border:"1px solid #111",
		content:"您是否确定删除吗",
		callback:function(sure){}//回调函数
	};
})(jQuery);