
//获取随机颜色  rgb
function random_rgb(){
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return "rgb("+r+","+g+","+b+")";
}
//获取随机颜色  16进制
function randomColor16(){
    //0-255
    var r = Math.random(255).toString(16);
    var g = Math.random(255).toString(16);
    var b = Math.random(255).toString(16);
    //255的数字转换成十六进制
    if(r.length<2)r = "0"+r;
    if(g.length<2)g = "0"+g;
    if(b.length<2)b = "0"+b;
    return "#"+r+g+b;
};

//=================打印===========================
function log(content){
    if(console){
        console.log("输出结果为："+content);
    }else {
        alert(content);
    }
}

//=================过滤  取出int类型===========================
var filterInt = function (value) {
    if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
        return Number(value);
    return NaN;
}

