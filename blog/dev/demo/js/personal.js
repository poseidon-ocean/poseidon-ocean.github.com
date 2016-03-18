(function(window,undefined){
	/* 鼠标移上移开事件 */
	$('.header-tu-img,.header-tool-conf-link,.header-tool-cal-link,.header-tool-news-num').mouseenter(function(){
		$(this).nextAll('div:eq(0)').css('display','block');
	});
	$('.header-tool-user,.header-tool-config,.header-tool-cal,.header-tool-news').mouseleave(function(){
		$(this).find('div:eq(0)').css('display','none');
	});
	/*滚动效果初始化*/
	window.sr = new scrollReveal();
	
	/* 设置当前星期与农历日期 */
	$('#week').html('周'+'日一二三四五六'.charAt(new Date().getDay()));
	var cDate = new Date();
	var cal = calendar.solar2lunar(cDate.getFullYear(),cDate.getMonth()+1,cDate.getDate());
	$('#lunar').html('农历'+cal.IMonthCn + cal.IDayCn);
	
	/* 头像 隐藏与显示 */
	$('.ibx-uc-uimg-mask').mouseenter(function(){$('.ibx-uc-ulink').css('display','block')});
	$('.ibx-uc-uimg-mask').mouseleave(function(){$('.ibx-uc-ulink').css('display','none')});
})(window);