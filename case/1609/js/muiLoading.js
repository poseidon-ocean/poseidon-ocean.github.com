/**
 * Created by think on 2016/9/12.
 */
(function($){
    $.muiLoading = function(options){
        var opts = $.extend({}, $.muiLoading.defaults, options);
        //模版初始化
        var $loading = $.muiLoading.template(opts);
        //居中定位
        $.muiLoading.position($loading);
        //事件绑定
        $.muiLoading.events($loading, opts);

    }

    //组件模版
    $.muiLoading.template = function(opts){
        var $loading = $("<div class='mui_loading'><span>"+opts.content+"</span></div>");
        $("body").append($loading);
        return $loading;
    }

    //定位loading
    $.muiLoading.position = function($loading){
        var ww = $(window).width();
        var wh = $(window).height();
        var lw = $loading.width();
        var lh = $loading.height();
        var left = (ww - lw)/2;
        var top = (wh - lh)/2;
        $loading.css({left:left,top:top});

    }

    //给loading组件绑定事件
    $.muiLoading.events = function($loading, opts){
        //窗口变化时  位置相应变化
        $(window).resize(function(){
            $.muiLoading.position($loading);
        });

        $loading.on("click", function(){
            if($loading.timer) clearTimeout($loading.timer);
            //css3关键帧  不支持IE678  可以使用淡入淡出解决
            $(this).removeClass("animated bounceInDown").addClass("animated bounceOutUp")[opts.animate](1000,function(){
                $(this).remove();
            });

            /**
             * [opts.animate]  这一块是两种表现形式都行
             * $(this)[opts.animate]();
             * $(this).fadeOut();
             */
        });

        //定时关闭
        if(opts.time){
            if($loading.timer) clearTimeout($loading.timer);
            $loading.timer = setTimeout(function(){
                $loading.trigger("click");
                clearTimeout($loading.timer);
            }, opts.time * 800);
        }
    }

    //默认参数的定义
    $.muiLoading.defaults = {
        content : "请稍候，数据加载中...",
        animate : "fadeOut",
        time : 0
    };
})(jQuery);