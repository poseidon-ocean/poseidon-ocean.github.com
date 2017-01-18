//验证器
var mkValiator = {
	isEmpty:function(val){
		if(!val){
			return true;
		}
	},
	isNotEmpty:function(val){
		return !this.isEmpty(val);
	},
	email:function(val){
		return !/xxxxx/.test(val);
	},
	
	telephone:function(val){
		return !/xxxxx/.test(val);
	},
	
	post:function(val){
		return !/xxxxx/.test(val);
	},
	
	ip:function(val){
		return !/xxxxx/.test(val);
	},
	
	url:function(val){
		return !/xxxxx/.test(val);
	},
	
	username:function(val){
		return !/xxxxx/.test(val);
	},
	
	password:function(val){
		return !/xxxxx/.test(val);
	},
	
	number:function(value){
		return !/xxxxx/.test(val);
	}
	
};

var mkValidator = function(formId,validator,callback){
	var mkForm = {
	 	formId:formId,
	 	init:function(){
	 		var that = this;
	 		dom("saveBtn").onclick = function(){
				that.validate();
			};
		},
		publicMethod:function(){
			var that = this;
			return {
				data:function(){
					return that.params();
				},
				ele:function(name){
					return that.getElement(name);
				},
				val:function(name){
					return that.getValue(name);
				},
				cval:function(name){
					return that.getCheckValue(name);
				},
				dataArr:function(){
					return that.params2();
				}
			};
		},
		validate:function(){
			var pjson = this.publicMethod();
			if(validator.call(pjson)){
				var params = this.params();
				callback.call(pjson,params);
			}else{
				return false;
			}
		},
		params:function(){//$("#form").serialize()
			var userFormDom = dom(this.formId);
			var elements = userFormDom.elements;
			var params = "";
			for (var i = 0; i < elements.length; i++) {
				if(elements[i].type!="button" && elements[i].type!="submit" &&
					elements[i].type!="reset"
				){
					if(elements[i].type=="checkbox"){
						var carr = this.getCheckValue(elements[i].name);
						for (var j= 0; j < carr.length; j++) {
							params+="&"+elements[i].name+"="+carr[j];
						}
						break;
					}else{	
						params+="&"+elements[i].name+"="+this.getValue(elements[i].name);
		    		}
				}
			}
				return params.substr(1);
		},
			
		params2:function(){//$("#form").serializeArray()
			var userFormDom = dom(this.formId);
			var elements = userFormDom.elements;
			var arr = [];
			for (var i = 0; i < elements.length; i++) {
				if(elements[i].type!="button" && elements[i].type!="submit" &&
						elements[i].type!="reset"
					){
					if(elements[i].type=="checkbox"){
						var carr = this.getCheckValue(elements[i].name);
						for (var j= 0; j < carr.length; j++) {
							var json = {};
							json.name = elements[i].name;
							json.value = carr[j];
							arr.push(json);
						}
						break;
					}else{	
						var json = {};
						json.name = elements[i].name;
						json.value = elements[i].value;
						arr.push(json);
					}
				}
			}
			
			return arr;
		},
		
		
		getElement: function (name){
			var userFormDom = dom(this.formId);
			return userFormDom[name];
		},
	
	
		getValue : function (name){
			var userFormDom = dom(this.formId);
			return userFormDom[name].value;
		},
		
	
		getCheckValue:function (name){
			var userFormDom = dom(this.formId);
			var checkboxs = userFormDom[name];
			var arr = [];
			for (var i = 0; i < checkboxs.length; i++) {
				if(checkboxs[i].checked){
					arr.push(checkboxs[i].value);
				}
			}
			return arr;
		}
	};
	
	mkForm.init();
		
};


