/**
 * Created by think on 2016/12/25.
 */
var parseMusic = {
    analyser:null,
    source:null,
    garr:[],
    randomcolor : getRGBColor(0.6),
    randomcolor2 : getRGBColor(0.6),
    randomcolor3 : getRGBColor(0.6),
    mark:true,
    rmark:true,
    playmark:true,
    index:0,
    percent:0,
    audioDom:null,
    currentTime:0,
    init:function(){
        try{
            //1:音频上下文
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            /*动画执行的兼容写法*/
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
            //2:初始化音轨对象
            var audioContext = new window.AudioContext();
            return audioContext ;
        }catch(e){
            console.log(e);
        }
    },
    parse:function(audioContext,callback){
        try{
            var audioBufferSouceNode = audioContext.createMediaElementSource(this.audioDom);
            this.analyser = audioContext.createAnalyser();
            //将source与分析器连接
            audioBufferSouceNode.connect(this.analyser);
            //将分析器与destination连接，这样才能形成到达扬声器的通路
            this.analyser.connect(audioContext.destination);
            //播放
            this.source = audioBufferSouceNode;
            if (!audioBufferSouceNode.start) {
                audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
                audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOn method
            };
            //是否设置循环播放.默认是false
            this.audioDom.onended = function() {
                parseMusic.mark = false;
                parseMusic.rmark = false;
                var canvas = dom("canvas");
                var context = canvas.getContext("2d");
                canvas.width = window.innerWidth;
                context.clearRect(0,0,canvas.width,canvas.height);
                $("#caudio_play").show();
                $("#caudio_pause").hide();
            };
            parseMusic.data(this.analyser,callback);
        }catch(e){
            console.log(e);
        }
    },
    data:function(analyser,callback){
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        if(parseMusic.mark){
            if(callback)callback(array);
            requestAnimationFrame(function(){
                parseMusic.data(analyser,callback);
            });
        }else{
            var canvas = dom("canvas");
            canvas.width = window.innerWidth;
            var context = canvas.getContext("2d");
            context.clearRect(0,0,canvas.width,canvas.height);
        }
    },
    format:function(time){
        var m = Math.floor(time / 60);
        var s = Math.floor(time %60);
        if(m<10)m="0"+m;
        if(s<10)s="0"+s;
        return m+":"+s;
    },
    loadMusic: function(callback){
        var audioDombox = document.getElementById("audiobox");
        this.audioDom = document.createElement("audio");
        this.audioDom.src =rootPath+"/"+$(audioDombox).data("src");
        audioDombox.innerHTML = "";
        audioDombox.appendChild(this.audioDom);
        this.audioDom.play();
        this.audioDom.volume = 0.48;
        if(getBroswerVersion().version=="firefox" || getBroswerVersion().version=="chrome"){
            var audioContext = parseMusic.init();
            this.audioDom.onplay = function(){
                parseMusic.mark = true;
                parseMusic.rmark = true;
                parseMusic.parse(audioContext,callback);
            };

            this.audioDom.onpause = function(){
                parseMusic.rmark = false;
            };
        }
    }
};


/*音轨的js调用方法*/
function playmusic(obj){
    var canvas = dom("canvas");
    canvas.width = window.innerWidth;
    var context = canvas.getContext("2d");
    var cheight = canvas.height;
    var cwidth = canvas.width;
    var mw = 2;
    var cells = Math.ceil(cwidth / mw);
    $(obj).hide();
    $("#caudio_pause").show();
    parseMusic.loadMusic(function(data){
        context.clearRect(0,0,cwidth,cheight);
        var grd = context.createLinearGradient(0,cheight/2,mw,cheight);
        grd.addColorStop(1, parseMusic.randomcolor);
        grd.addColorStop(0.5, parseMusic.randomcolor2);
        grd.addColorStop(0,  parseMusic.randomcolor3);
        //填充音轨数据
        for(var i=0;i<cells;i++){
            var value = data[i];
            context.strokeStyle ="#333";
            context.lineWidth = 1;
            context.strokeRect(i*mw,cheight-value,mw,cheight);
            context.fillStyle=grd;
            context.fillRect(i*mw,cheight-value,mw,cheight);
        }
    });

};

function stopMusic(obj){
    var mark = $(obj).data("mark");
    $(obj).show();
    $("#caudio_play").hide();
    if(isEmpty(mark)){
        parseMusic.audioDom.pause();
        $(obj).removeClass("rotate").data("mark",1);
    }else{
        parseMusic.audioDom.play();
        $(obj).addClass("rotate").removeData("mark");
    }

}


/*音乐播放器*/
var kekePlay ={
    arr:[],
    init:function(){
        var mw = 4;
        var boxDom = document.getElementById("mubox");
        var meterNum = Math.ceil(boxDom.offsetWidth / mw);
        boxDom.innerHTML = "";
        for(var i=1;i<=meterNum;i++){
            kekePlay.arr.push(i);
        };
    }
};
