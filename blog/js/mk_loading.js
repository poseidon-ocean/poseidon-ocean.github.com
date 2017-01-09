(function($){
	//组件的入口
	$.mkLoading = {
		init:function(options){
			var opts = $.extend({},$.mkLoading.defaults,options);
			//模板初始化
			var $loading = $.mkLoading.template(opts);	
			//居中问题
			$.mkLoading.position($loading);
			//事件绑定	
			$.mkLoading.events($loading,opts);	
		},

		template:function(opts){//模板
			var $loading = $("<div class='mkui_loading animated bounceInUp'><span>"+opts.content+"</span></div>");
			$("body").append($loading);
			return $loading;	
		},

		position :function($loading){//位置
			var winw = $(window).width();
			var winh = $(window).height();
			var lw = $loading.width();
			var lh = $loading.height();
			var left = (winw - lw)/2;
			var top = (winh - lh)/2;
			$loading.css({left:left,top:top});	
		}
	};

	//绑定事件
	$.mkLoading.events =  function($loading,opts){
		$(window).resize(function(){
			$.mkLoading.position($loading);
		});

		$loading.on("click",function(){
			if($loading.timer)clearTimeout($loading.timer);
			//css3关键帧开发的，它不支持ie678,ie678用淡入淡出
			$(this).remove("animated bounceInDown").addClass("animated bounceOutUp")[opts.animate](1000,function(){
				$(this).remove();
			});
		});
		
		//定时关闭
		if(opts.time){
			if($loading.timer)clearTimeout($loading.timer);	
			$loading.timer = setTimeout(function(){
				$loading.trigger("click");
				clearTimeout($loading.timer);	
			},opts.time * 800);
		}
	};

	//默认参数的定义
	$.mkLoading.defaults = {
		content:"请稍后，数据加载中...",
		animate:"fadeOut",
		time:0
	};

})(jQuery);