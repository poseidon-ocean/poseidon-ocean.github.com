/* tzLoading V1.0 @CopyRight poseiton 2015-9-6 */
/*
	定义插件的格式
	(function(){})(jQuery);
	插件名：$.tzLoading
*/
$.tzLoading = function(opts){
	
	//openUpLeft  swap
	var magic = ['openUpLeft','swap','openDownLeftRetourn','perspectiveDown','perspectiveRight','perspectiveLeftRetourn',
	'puffIn','rotateLeft','slideLeft','slideRightRetourn','vanishIn','foolishIn','bombLeftOut'];
	
	var len = magic.length;
	
	//创建模板
	var $loading = $("<div class='tz_loading magictime "+magic[getRandomNum(len)]+"'>"+opts.content+"</div>");
	
	$(".tz_loading").remove();
	//追加模板
	$("body").append($loading);
	
	//动态设置宽度和高度
	if(opts.width){$loading.width = opts.width;}
	if(opts.height){$loading.height = opts.height;}
	
	//居中定位插件
	tz_center_loading($loading);
	//浏览器窗口改变的时候居中显示
	initEvent($loading);
}
//设置动态居中的算法
function tz_center_loading($loading){
	var width = $loading.width();
	var height = $loading.height();
	
	var ww = $(window).width();
	var wh = $(window).height();
	
	
	
	var left = (ww - width)/2;
	var top = (wh - height)/2;
	$loading.css({top:top,left:left});  //设置loading的位置
}

//浏览器窗口改变的时候居中显示
function initEvent($loading){
	$(window).resize(function(){
		tz_center_loading($loading)
	});
}

//获取随机数
function getRandomNum(len){
	return Math.floor(Math.random()*len);
}

