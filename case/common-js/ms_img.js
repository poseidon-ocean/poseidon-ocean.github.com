/**
 * 图片预览
 * 初始化：
 * var options = {};
 * $.ms_img.init(options);
 */
;(function($,window,top){
    $.ms_img = {
    	/****  全局参数   ****/
    	opts : {},
        /****  初始化   ****/
        init : function(options){
            //初始化参数 混合
            this.opts = $.extend({},$.ms_img.defaults,options);
            if(this.opts.single){
            	var $img = this.template2();
            }else{
            	var $img = this.template();
            	this.touchKey($img);
            }
            this._position($img);
            this.events($img);
        },
        /****  触发键盘事件   ****/
        touchKey : function($img){
        	var _this = this;
        	$(document).keydown(function(event){ 
        		var e = event || window.event; 
        		var k = e.keyCode || e.which; 
        		
        		if(k == 37){ //左
        			_this.rotateLeft($img);
        		}
        		if (k == 38){ //上
        			_this.selectPic($img,-1);
        		} 
        		if (k == 39){ 	//右
        			_this.rotateRight($img);
        		} 
        		if(k == 40){ 	//下
        			_this.selectPic($img,1);
        		}
        	}); 
        },
        /****  切换图片   ****/
        selectPic : function($img,chg){
        	this.turnReset($img);
        	var closeTouchKey = this.opts.closeTouchKey;
        	if (chg == 1) {//下一张
				var curPicNum = parseInt($.trim($img.find("#curNum").text()), 10);
				var allPicNum = parseInt($.trim($img.find("#allNum").text()), 10);
				
				if (curPicNum == allPicNum  && closeTouchKey) {
					alert("已经是最后一张！");
				} else {
					$img.find("#picImg").attr("src", this.opts.picAry[curPicNum]);
					$img.find("#curNum").text(curPicNum + chg);
				}
			} else {
				var curPicNum = parseInt($.trim($img.find("#curNum").text()), 10);
				if (curPicNum == 1 && closeTouchKey) {
					alert("已经是第一张！");
				} else {
					$img.find("#picImg").attr("src", this.opts.picAry[curPicNum + chg - 1]);
					$img.find("#curNum").text(curPicNum + chg);
				}
			}
        	
        },
        /****  重置图片位置   ****/
        turnReset : function($img){
        	//高版本浏览器不支持滤镜--使用css3自带方法
			if (!document.body.filters) {
				$img.find("#picImg").css('transform', 'rotate(0deg)');
				this.opts.num = 0;
			}
			var img = $img.find("#picImg").get(0);
			var imgindex = 0;
			img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(Rotation=" + imgindex + ")";
        },
        /****  左转   ****/
        rotateLeft : function($img){
        	//高版本浏览器不支持滤镜--使用css3自带方法
			if (!document.body.filters) {
				if (this.opts.num == -3) {
					$img.find("#picImg").css("transform", "rotate(0deg)");
					this.opts.num = 0;
				} else {
					$img.find("#picImg").css("transform","rotate(" + 90 * (this.opts.num - 1) + "deg)");
					this.opts.num--;
				}
				return;
			}
			
			var img = $img.find("#picImg").get(0);
			var tmpFilter = img.style.filter;
			var imgindex = 3;
			imgindex = parseInt(tmpFilter.charAt(tmpFilter.length - 2));
			if (!isFinite(imgindex)) { //first time
				imgindex = 3;
			} else {
				imgindex = imgindex - 1;
				if (imgindex < 0) {
					imgindex = 3;
				}
			}
			img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(Rotation="
					+ imgindex + ")";
        },
        /****  右转   ****/
        rotateRight : function($img){
        	//高版本浏览器不支持滤镜--使用css3自带方法
			if (!document.body.filters) {
				if (this.opts.num == 3) {
					$img.find("#picImg").css("transform", "rotate(0deg)");
					this.opts.num = 0;
				} else {
					$img.find("#picImg").css("transform","rotate(" + 90 * (this.opts.num + 1) + "deg)");
					this.opts.num ++;
				}
				return;
			}

			var index = 0;
			var img = $img.find("#picImg").get(0);
			var tmpFilter = img.style.filter;
			var imgindex = 0;
			imgindex = parseInt(tmpFilter.charAt(tmpFilter.length - 2));
			if (!isFinite(imgindex)) {
				imgindex = 1;
			} else {
				imgindex = imgindex + 1;
				if (imgindex > 3) {
					imgindex = 0;
				}
			}
			img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(Rotation="
					+ imgindex + ")";
        },
        /****  关闭图片预览   ****/
        ltclose : function($img){
        	this.opts.closeTouchKey = false;
        	$img.addClass("bounceOut").removeClass("bounceIn");
    		setTimeout(function(){
    			$img.next().remove();
        		$img.remove();
			},1000);
        },
        /****  删除图片   ****/
        deletePic : function($img){
        	var _this = this;
        	top.$.jBox.confirm("您确定要删除吗?",'系统提示',function(v,h,f){
        		if(v=='ok'){
        			var curPicNum = parseInt($.trim($img.find("#curNum").text()), 10);
        			var allPicNum = parseInt($.trim($img.find("#allNum").text()), 10);
        			if (window.deleteOnePhoto(_this.opts.picIdAry[curPicNum - 1]) == 0) {
        				if (curPicNum == 1) {
        					if (allPicNum == 1) {
        						_this.ltclose($img);//无图片可显示，直接关闭窗口
        					} else {
        						$img.find("#picImg").attr("src", this.opts.picAry[curPicNum]);
        						$img.find("#allNum").text(allPicNum - 1);
        					}
        				} else if (curPicNum == allPicNum) {//删除的是最后一张
        					if (allPicNum == 1) {
        						_this.ltclose($img);//无图片可显示，直接关闭窗口
        					} else {
        						$img.find("#picImg").attr("src", pics[curPicNum - 2]);
        						$img.find("#curNum").text(allPicNum - 1);
        						$img.find("#allNum").text(allPicNum - 1);
        					}
        				} else {
        					$img.find("#picImg").attr("src", _this.opts.picAry[curPicNum]);
        					$img.find("#allNum").text(allPicNum - 1);
        				}
        				_this.opts.picIdAry.splice(curPicNum - 1, 1);
        				_this.opts.picAry.splice(curPicNum - 1, 1);
        			} else {
        				alertx("删除失败！");
        			}
        		}
        	},{buttonsFocus:1, closed:function(){
        		if (typeof closed == 'function') {
        			closed();
        		}
        	}});
        },
        /****  初始化事件   ****/
        events : function($img){  
        	var _this = this;
        	//上一张
        	$img.find(".prev").on("click",function(){
        		_this.selectPic($img,-1);
        	}); 
        	//下一张
        	$img.find(".next").on("click",function(){
        		_this.selectPic($img,1);
        	});
        	//左转
        	$img.find(".rotateLeft").on("click",function(){
        		_this.rotateLeft($img);
        	}); 
        	//右转
        	$img.find(".rotateRight").on("click",function(){
        		_this.rotateRight($img);
        	});
        	//关闭  
        	$img.find(".ltclose").on("click",function(){
        		_this.ltclose($img);
        	});
        	//删除
        	$img.find(".deletePic").on("click",function(){
        		_this.deletePic($img);
        	});
        	//点击遮罩层时关闭预览
        	top.$("#imgOverlay").on("click",function(){
        		_this.ltclose($img);
        	});
        	
        },
        /****  居中定位   ****/
		_position:function($img){
			var ww = top.window.innerWidth || top.$(window).width();
			var wh = top.window.innerHeight || top.$(window).height();
			var _left = (ww - $img.width())/2;
			var _top = (wh - $img.height())/2;
			$img.css({left:_left,top:_top});
		},
        /****  图片预览模板   ****/
        template : function(){
        	var curNum = this.opts.curNum;
        	var picAry = this.opts.picAry;
        	var picIdAry = this.opts.picIdAry;
        	var curPicId = this.opts.curPicId;
        	var allNum = picIdAry.length;
        	for ( var i = 0; i < allNum; i++) {
				if (curPicId == picIdAry[i]) {
					curNum = i + 1;
					break;
				}
			}
        	var imgSrc = picAry[curNum-1]
        	var html = $("    <div id='imgView'>"+
	            "        <div class='imgshow'>"+
	            "            <img src='"+imgSrc+"' id='picImg' width='500' height='500' >"+
	            "        </div>"+
	            "        <ul class='imgul'>"+
	            "            <li>"+
	            "                <input type='button' value='上一张' class='prev'>"+
	            "            </li>"+
	            "            <li>"+
	            "                <span id='curNum'>"+curNum+"</span>/<span id='allNum'>"+allNum+"</span>"+
	            "            </li>"+
	            "            <li>"+
	            "                <input type='button' value='下一张' class='next'>"+
	            "            </li>"+
	            "            <li>"+
	            "                <input type='button' value='左  旋' class='rotateLeft'>"+
	            "            </li>"+
	            "            <li>"+
	            "                <input type='button' value='右  旋' class='rotateRight'>"+
	            "            </li>"+
	            "            <li>"+
	            "                <input type='button' value='删  除' class='deletePic'>"+
	            "            </li>"+
	            "            <li>"+
	            "                <input type='button' value='关  闭' class='ltclose'>"+
	            "            </li>"+
	            "        </ul>"+
	            "    </div>");
        	html.addClass("animated").addClass("bounceIn").removeClass("bounceOut");
            top.$("body").append(html).append("<div id='imgOverlay'></div>");
            return html;  
        },
        /****  图片预览模板   ****/
        template2 : function(){
        	var imgSrc = this.opts.imgSrc;
        	var html = $("    <div id='imgView'>"+
			            "        <div class='imgshow'>"+
			            "            <img src='"+imgSrc+"' id='picImg' width='500' height='500' >"+
			            "        </div>"+
			            "        <ul class='imgul'>"+
			            "            <li>"+
			            "                <input type='button' value='关  闭' class='ltclose'>"+
			            "            </li>"+
			            "        </ul>"+
			            "    </div>");
        	html.addClass("animated").addClass("bounceIn").removeClass("bounceOut");
            top.$("body").append(html).append("<div id='imgOverlay'></div>");
            return html;  
        }
        
        
    };

    //默认参数
    $.ms_img.defaults = {
        num : 0, //高版本IE浏览器（10、11）旋转标示
        curNum : 1,  //当前图片num
        picIdAry:[],  //所有图片id集合
		picTypeAry:[],  //所有图片类型集合
		picAry:[],  //所有图片集合
		curPicId:"",  //当前图片id
		single : false, //单张图片预览  默认有多张展示
		imgSrc : "", //  单张展示时的图片路径
		closeTouchKey : true 	//关闭触发键盘事件
    };
})(jQuery,window,top);