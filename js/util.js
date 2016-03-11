







//获取随机颜色  rgb
function random_rgb(){
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return "rgb("+r+","+g+","+b+")";
}

//=================打印===========================
function log(content){
    if(console){
        console.log("输出结果为："+content);
    }else {
        alert(content);
    }
}