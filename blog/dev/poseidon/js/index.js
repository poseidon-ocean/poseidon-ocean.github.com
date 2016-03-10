$(function(){
	(function(){
		//左侧菜单切换
		$(".first").click(function(){
			$(this).find("li").toggle("slow");
		});
		
		
		//banner轮播
		$(".banner .menu li").mouseover(function(){
			$(this).addClass("sel").siblings().removeClass("sel");
			var _index = $(this).index();
			index = _index;
			$(".pic").find("li").eq(_index).addClass("pel").siblings().removeClass("pel");
			clearInterval(timer);
		});
		$(".banner .menu li").mouseleave(function(){
			time();
		});
		
		var index = 0;
		var timer = "";
		function time(){
			timer = setInterval(function(){
				index ++;
				var len = $(".menu").find("li").length;
				
				if(index > len-1){
					index = 0;
				}
				$(".menu").find("li").eq(index).addClass("sel").siblings().removeClass("sel");
				$(".pic").find("li").eq(index).addClass("pel").siblings().removeClass("pel");
				
				
			},3000);
		}
		time();
	
	
	}());
	
});
