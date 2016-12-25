/**
 * Created by think on 2016/12/25.
 */
var WalkerTimer = {
    main : function(){
        var args = arguments;
        /*
         定义开始时间，终止时间，回调函数
         */
        var start,end,callback;
        /*
         定义所有时间元素 以及 剩下时间
         */
        var days,hours,minutes,seconds,leftTime;

        if(args.length == 2){
            start = new Date();
            end = new Date(args[0]);
            callback = args[1];
            getDifferet(start,end,callback);
        }else if(args.length == 3){
            start = new Date(args[0]);
            end = new Date(args[1]);
            callback = args[2];
            getDifferet(start,end,callback);
        };
        function getDifferet(start,end,callback){
            leftTime = (end - start) / 1000;//将毫秒转换成秒
            function showTime(){
                if(leftTime > 0){
                    days = parseInt(leftTime/(60*60*24));
                    hours = parseInt((leftTime%(60*60*24))/(60*60));
                    minutes = parseInt((leftTime%(60*60*24))%(60*60)/60);
                    seconds = parseInt((leftTime%(60*60*24))%(60*60)%60);
                    if(callback) callback.call(this,{"days":days,"hours":getHMS(hours),"minutes":getHMS(minutes),"seconds":getHMS(seconds)});
                }else{
                    if(callback) callback.call(this,false);
                    clearInterval(timer);
                }
            };
            showTime();
            var timer = setInterval(function(){
                leftTime--;
                showTime();
            },1000);
        };
    }
};

function getHMS(hms){
    if((hms*1)<10)hms = "0"+hms;
    return hms;
}

// WalkerTimer.main(new Date(),"2016-8-14 22:40:00",function(date){
// 	console.log(date.days+"/"+date.hours+"/"+date.minutes+"/"+date.seconds);
// });