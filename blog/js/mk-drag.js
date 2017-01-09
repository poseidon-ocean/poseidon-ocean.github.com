//fn���������ķ�ʽ
//�����ʽ��$.fn.�������  =function(){}--javascript--ģ��ģʽ
(function($){
	//��������
	$.fn.mkDrag = function(options){
		//this---ָ���������� 
		var opts = $.extend({},$.fn.mkDrag.methods,$.fn.mkDrag.defaults,options);
		return this.each(function(){
			opts.init($(this),opts);
		});
	};	

	//�¼���
	$.fn.mkDrag.methods = {
		init:function($object,opts){
			$object.off("mousedown").on("mousedown",function(e){
				//Ŀ�����
				var $obj = $(this);
				//��ȡĿ������left��top��λ��
				var left = $obj.offset().left;//this.offsetLeft;
				var top = $obj.offset().top;//this.offsetTop
				//��ȡ����λ��
				var x = getXY(e).x;
				var y = getXY(e).y;
				//��ȡĿ��Ԫ��left��topλ�Ƶ����λ��
				var maxleft = $(window).width()-$obj.width();
				var maxTop = $(window).height()-$obj.height();
				//3:��document��onmousemove��onmouseup
				$(document).off("mousemove").on("mousemove",function(e){
					//��ȡ����ƶ���λ��	
					var nx = getXY(e).x;
					var ny = getXY(e).y;
					//������µ�λ��
					var cleft = nx - x + left;
					var ctop = ny - y + top;
					//Ŀ��Ԫ�ص����λ�ú���С�Ŀ���
					if(cleft<=0)cleft = 1;
					if(ctop<=0)ctop = 1;
					if(cleft >=maxleft)cleft = maxleft;
					if(ctop >=maxTop)ctop = maxTop;
					//�ı������λ��
					if(opts.arrow=="left"){
						$obj.css({left:cleft});
					}else if(opts.arrow=="top"){
						$obj.css({top:ctop});
					}else{
						$obj.css({left:cleft,top:ctop});
					}
				}).off("mouseup").on("mouseup",function(e){
					//��������ҵ��
					//�ͷ������ƶ��¼�
					$(document).off("mousemove");
					$(document).off("mouseup");
					if(opts.callback)opts.callback.call($obj);
				});
			});
		}
	};
	
	//Ĭ�ϲ���
	$.fn.mkDrag.defaults = {
		arrow:"",
		callback:null
	};

	/*
		pageX  ��clientX
		pageX--ֻ��ie��֧�ֵ�ֵ���� e.clientX + document.body.scrollLeft
		pageYͬ��
	*/
	function getXY(e){
		var x = e.pageX || (e.clientX + document.body.scrollLeft);//�����Ķ�λ���õ�absolute�Ļ�
		var y = e.pageY || (e.clientY + document.body.scrollTop);
		return {x:x,y:y};
	};

})(jQuery);