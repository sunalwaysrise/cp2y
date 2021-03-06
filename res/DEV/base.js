/**
 * @author luwenbin@live.com
 */
;
(function() {
    var _getScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');
        js.setAttribute('type', 'text/javascript'); 
        js.setAttribute('src', url); 
        head.appendChild(js);
        var callbackFn = function(){
                if(typeof callback === 'function'){
                    callback();
                }
            };
        if (document.all) {
            js.onreadystatechange = function() {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            }
        } else {
            js.onload = function() {
                callbackFn();
            }
        }
    }
    if(Zepto){
        $.getScript = _getScript;
    }
})();
window.scrollTo(0,0);
try{document.domain='cp2y.com';}catch(e){};
var WebAppUrl={
		RESOURCE_URL : "res/images/",
		HOME_APP_URL : 'http://m.cp2y.com',
		JS_URL:"res/js/play/",
		Icon:"res/images/icon/"
	},BT={
		kk:[10037,10038,10046,10060,10061,10062,10064,10065,10066,10067],
		lotto:[10026,10032],
		sz:[10025],
		jc:[10057,10058,10059,10039,10040,10041,10042],
		selling:[10025,10046,10064,10065,10026,10032,10060,10061,10066]
	},Loading=$("#loading"),cp2y={};
Loading.hide();
cp2y.util={
	setboll:function(x,lotteryId){
		var bolls=[],b,b1,b2,j=0,len2,len3;
		if(x){
			b=x.split("#");
			b1=b[0].split(',');
			b2=b[1];
			len2=b1.length;
		}
		if(lotteryId ==10059 || lotteryId ==10058){
			for(j;j<len2;j++){
				bolls.push('<em>'+b1[j]+'</em>');
			}
		}else{
			for(j;j<len2;j++){
				bolls.push('<b class="draw1">'+b1[j]+'</b>');
			}
		}
		if(b2){
			b2=b2.split(",");
			j=0;len3=b2.length;
			for(j;j<len3;j++){
				bolls.push('<b class="draw2">'+b2[j]+'</b>');
			}
		}
		return bolls;
	},
	setIssue1:function(s){
		var sL=s.length;
		return s.substr(sL-2,sL-1);
	},
	setIssue2:function(s){
		var sL=s.length;
		return s.substr(sL-3,sL-1);
	},
	splitNumber1:function(s){try{return "<em>"+s.split(",").join("</em><em>")+"</em>";}catch(e){}
	},
	splitNumber2:function(s){try{var s1=s.split("#"),s2=s1[0].split(",");
		return "<em>"+s2.join("</em><em>")+"</em><b>"+s1[1].split(",").join("</b><b>")+"</b>";}catch(e){}
	},
	splitBalls:function(b){
		var bolls=[],b0=b.split("#"),b1=b0[0],b2=b0[1];
		if(b2){
			bolls.push('<b class="b1">'+b1+'</b>');
			bolls.push('<b class="b2">'+b2+'</b>');			
		}else{
			bolls.push('<b class="b2">'+b1+'</b>');
		}
		return bolls.join('');
	},
	toggle:function(o,obj,t){
		if($(o).attr("data")=="0"){
			obj.show();
			$(o).html("&gt;&gt;收起").attr({"data":1});
		}else{
			obj.hide();
			$(o).html("&gt;&gt;"+t).attr({"data":0});
		}
	},
	getArgs:function(argName){
		if(!argName){return false;}
		var args = {},query = location.hash.substring(1),pairs = query.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos == -1) continue;
			var argname = pairs[i].substring(0,pos),value = pairs[i].substring(pos+1);
			value = decodeURIComponent(value);
			if(argName==argname){
				return value;
			}
		}
	},
	comp : function(n, m) {
        var n1 = 1, n2 = 1;
        for (var i = n,j = 1; j <= m; n1 *= i--,n2 *= j++);
        return n1 / n2;
    }
};
cp2y.dialog={
	alert:function(x,fn){
		if($("#DBox2").length==0){
      		$("body").append('<div id="DBox2"><div id="DBoxC2">'+x+'</div><div id="IKonw" class="DBoxB DBoxB2">知道了</div></div>');
    	}else{
    		$("#DBoxC2").html(x);
    	}
    	if(fn){
    		$("#IKonw").off().on('click',fn);
    	}else{
    		$("#IKonw").off().on('click',cp2y.dialog.closeAlert);
    	}
    	this.locked=true;
    	cp2y.dialog.lock();
    	$("#DBox2").show();
    	this.setPosition($("#DBox2"));
    	$(window).resize(function(){
    		if(cp2y.dialog.locked){
    			cp2y.dialog.setPosition($("#DBox2"));
    		}
    	});
	},
	closeAlert:function(){
		this.locked=false;
		$("#IKonw").off();
		$("#LockedBg").hide();
    	$("#DBox2").hide();
	},
	tip:function(x){
		$("#userTip3").html(x).addClass('onError');
	},
	tip1:function(x){
		$("#userTip31").html(x).addClass('onError');
	},
	clearTip:function(){
		$("#userTip3,#userTip31").html("").removeClass('onError');
	},
	loading:function(){
		Loading.show();
	},
	clearLoading:function(){
		$("#loading").hide();
	},
	setPosition:function(_obj){
		var t = document.documentElement.scrollTop || document.body.scrollTop,
			viewHeight = $(window).height(), viewWidth = $(window).width(), _objHeight = _obj.height(), _objWidth = _obj.width(),
			dialogTop = (viewHeight / 2) - (_objHeight / 2) + t,
			dialogLeft = (viewWidth / 2) - (_objWidth / 2);
		_obj.css({top : dialogTop,left : dialogLeft});
	},
	confirm:function(o,fn,fn2){
		if($("#DBox").length==0){
      		$("body").append('<div id="DBox"><div id="DBoxC">'+o+'</div><div id="DBoxFn" class="DBoxB">是</div><div id="DBoxFn2" class="DBoxB" onclick="cp2y.dialog.closeConfirm();">否</div></div>');
    	}else{
    		$("#DBoxC").html(o);
    	}
    	$("#DBox").show();
    	$("#DBoxFn").off().on('click',fn);
    	if(fn2){
			$("#DBoxFn2").off().on('click',fn2);
    	}
    	this.locked=true;
    	cp2y.dialog.lock();
    	this.setPosition($("#DBox"));
    	$(window).resize(function(){
    		if(cp2y.dialog.locked){
    			cp2y.dialog.setPosition($("#DBox"));
    		}
    	});
	},
	locked:false,
	lock:function(){
		if($("#LockedBg").length==0){
		  	$("body").append('<div id="LockedBg"></div>');
		}
		$("#LockedBg").show();
	},
	closeConfirm:function(){
		this.locked=false;
		$("#DBoxFn").off();
		$("#LockedBg").hide();
    	$("#DBox").hide();
	}
};
cp2y.input={
	box:$("#InputBox"),
	Warp:$("#Warp"),
	closeBox:function(){
		this.box.hide();
		this.Warp.show();
	},
	openBox:function(o){
		this.box.show();
		this.content(o);
		this.Warp.hide();
	},
	content:function(o){
		$('#InputBoxTitle').html(o.t);
		$('#InputBoxContent').html(o.c);
		$('#InputBoxContent input').eq(0).focus();
	}
};
cp2y.pages={
	get:function(url,op){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+url,
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				op(data);
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	cur:0
};

//原生对象扩展
$.extend(Array.prototype,{
	indexOf   : function(val){var pos=-1;$(this).each(function(i,v){if(v==val){pos=i;return;}});return pos;},
	del       : function(value){var pos = this.indexOf(value);if(pos==-1)return;this.splice(pos,1);return this;},
	max       : function(){var max;$(this).each(function(i,v){v = Number(v);max = i==0?v:(v>max?v:max);});	return max;},
	min       : function(){var min;$(this).each(function(i,v){v = Number(v);min = i==0?v:(v<min?v:min);});	return min;},
	hasRepeat : function(){var b = {};var a = this;for(var i=0,l=a.length; i<l&&!b[a[i]];b[a[i++]]=1);return i<l;	},
	clone     : function(){var a=[];for(var i=0;i<this.length;i++)a[i] = this[i];return a;},
	del       : function(value,isPos){var pos=!isPos?this.indexOf(value):value;if(pos==-1)return;this.splice(pos,1);return this;},
	random : function(o){
		o = $.extend({
		   	len    : 1,//号码长度
			repeat : false,//是否可以重复
			sort   : false,//是否需要排序
			zero   : false//是否需要补0
	    },o);
		var s=this,a=[],no;
		var r = function(){return s[Math.round(Math.random()*(s.length-1))];};
		while(a.length!=o.len){
			no = r();
			if(!o.repeat && a.indexOf(no)!=-1)continue;
			a.push(no);
		}
		return a;
	},
	inArray2:function(arr1){//判断二维数组包含关系
	    var i=0,len=this.length;
	    for(i=0;i<len;i++){
	        var j=0,jlen=this[i].length,x=0;
	        for(j;j<jlen;j++){
	            if(arr1[j]==this[i][j]){
	                x++;
	            }
	        }
	        if(x==jlen){
	            return true;
	        }
	    }
	    return false;
	}
});
$.extend(String.prototype,{
	toArray:function(s){if(s)return this.split(s);var arr=[];for(var i=0;i<this.length;i++)arr.push(this.substring(i,i+1));return arr;},
	isID:function() {
		var errors = [0, '身份证号码位数不对!', '身份证号码出生日期超出范围或含有非法字符!', '身份证号码校验错误!', '身份证地区非法!'],
			area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
			idcard = this,
			Y,
			JYM,
			S,
			M,
			idcard_array = idcard.split('');
		//地区检验
		if (!area[parseInt(idcard.substr(0, 2))]){
			return errors[4];
		}
		//身份号码位数及格式检验
		switch(idcard.length) {
			case 15:
				var ereg;
				if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 )){
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
				}else{
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
				}
				if (ereg.test(idcard)){
					return errors[0];
				}else{
					return errors[2];
				}
				break;
			case 18:
				if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)){
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
				//闰年出生日期的合
				}else{
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
				}
				//平年出生日期的合法性正则表达式
				if (ereg.test(idcard)) {
					S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
					Y = S % 11;
					M = "F";
					JYM = "10X98765432";
					M = JYM.substr(Y, 1);
					//判断校验位
					if (M == idcard_array[17]){
						return errors[0];
						//检测ID的校验位
					}else{
						return errors[3];
					}
				} else{
					return errors[2];
				}
				break;
			default:
				return errors[1];
		}
	},
	isPhone:function(){
		var r = /^\+?[1-9][0-9]*$/;
		if(!r.test(this) || this.length!=11){
			return false;
		}else{
			return true;
		}
	},
	isInt:function(){
		var r = /^\+?[1-9][0-9]*$/;
	    return r.test(this);
	}
});
$.extend(Number.prototype,{
	addZero   : function(){if(this<10){return "0"+this;}else{return this;}}
});
