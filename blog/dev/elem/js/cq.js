
//加载完毕后的回调时间
window.onload = function(){
	var uScore = 0;
	var cScore = 0;
	//继承方法封装
	Function.prototype.extends = function(obj1,obj2){
		for(var pro in obj1){
			this.prototype[pro] = obj1.prototype[pro];
		}
		for(var pro in obj2){
			this.prototype[pro] = obj2[pro];
		}
	}
	//玩家构建
	function Player(name){
		this.name = name;
		this.point = -1;
	}
	Player.prototype = {
		//猜拳
		guess : function(){}
	}
	//人玩家
	function User(name){
		Player.call(this,name);
	}
	User.extends(Player,{
		guess : function(point){
			return this.point;
		}
	})
	//电脑玩家
	function Comp(name){
		Player.call(this,name);
	}
	Comp.extends(Player,{
		guess : function(){
			return (Math.random()*100<<2)%3;
		}
	})
	
	var normalPlayer = new User('孙悟饭');
	var computPlayer = new Comp('比克大魔王');
	var count = 0;
	//猜拳系统
	function System(u,c){
		this.user = u;
		this.comp = c;
		this.initial();
	}
	//初始化
	System.prototype.initial = function(){
		var name = document.getElementsByClassName('name');
		name[0].innerText = '我：'+ this.user.name;
		name[1].innerText = '电脑：'+ this.comp.name;
	}
	//开始游戏
	System.prototype.play = function(){
		
		this.ToggleBanBtn();//禁用按钮
		this.StartAnimate();//开始猜拳动画
	}
	//禁用按钮
	System.prototype.ToggleBanBtn = function(){
		var btn = document.getElementById('play');
		if(btn.disabled){
			btn.disabled = false;
			btn.className = 'btn';
		}else{
			btn.disabled = true;
			btn.className = 'disabled';
		}
	}
	//猜拳面板
	System.prototype.StartAnimate = function(){
		var anim = document.getElementById('transImg');
		anim.style.display = 'block';
		this.changeText('请出拳...');
		this._clearTime = setInterval(function(){
			var anim = document.getElementsByClassName('cartoon');
			anim[0].className = 'cartoon guess'+(count++)%3;
			anim[1].className = 'cartoon guess'+(count++)%3;
		},1000)
	}
	//文本修改
	System.prototype.changeText = function(con){
		var txt = document.getElementById('text');
		txt.innerText = con;
	}
	system = new System(normalPlayer,computPlayer);
	//胜负裁决
	System.prototype.verdict = function(user){
		var userScore = document.getElementById('userScore');
		var compScore = document.getElementById('compScore');
		window.clearInterval(this._clearTime);
		var anim = document.getElementById('transImg');
		anim.style.display = 'none';
		var car = document.getElementsByClassName('cartoon');
		var comp = this.comp.guess();
		car[0].className = 'cartoon guess'+user;
		car[1].className = 'cartoon guess'+comp;
		res = user - comp;
		switch(res){
			case 0:
				this.changeText('平局！');
				break;
			case -1:
			case 2:
				userScore.innerText = ++uScore;
				this.changeText('Yea~~我赢了！！！');
				break;
			case -2:
			case 1:
				compScore.innerText = ++cScore;
				this.changeText('555~~我输了！！！');
				break;
		}
		var btn = document.getElementById('play');
		btn.innerText = '再来一局';
		this.ToggleBanBtn();
	}
	
}
	var system;

