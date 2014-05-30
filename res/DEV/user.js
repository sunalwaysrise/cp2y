/**
 * @author luwenbin@live.com
 */
var countDown={
	t:60,
	init:function(){
		if(this.t>1){
			this.t--;
			$("#resendVeri span").html(this.t);
			setTimeout("countDown.init()",1000);
		}else{
			$("#resendVeri").html('没收到？<span onclick="countDown.restart();">重新发送</span>');
		}
	},
	restart:function(){
		this.t=60;
		var val=$("#mobile").html();
		cp2y.dialog.clearTip();
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/user/sendmsg",
			data:{mobile:val},
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){cp2y.dialog.clearLoading();},
			error:function(){cp2y.dialog.clearLoading();}
		});
		$("#resendVeri").html('<span>'+this.t+"</span> 秒后重新发送");
		this.init();
	}
};
cp2y.user={
	setbalance:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/user/query_balance",
			beforeSend:function(){$("#myScoreLoading").show();},
			success:function(data){$("#myScoreLoading").hide();
				if(data.flag==1){
					$("#balance").html("余额:"+data.balance+"元<br/>彩金:"+data.hongbao+"元");
				}
			},error:function(){$("#myScoreLoading").hide();}
		});
	},
	getScore:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/user/score",
			success:function(data){
				if(data.flag==1){
					$("#myScore").html("积分:"+data.score);
				}
			}
		});
	},
	status:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/user/checkLogin",
			anysc:false,
			type:"post",
			success:function(data){
				$("#userHeader").html(data.username);
			}
		});
	},
	home:function(){
		this.status();
		this.setbalance();
		this.getScore();
		this._schemeHistory(0,5,function(data){
			var i=0,len=data.buyHistoryData.length,html=[];
			for(i;i<len;i++){
				html.push('<div>');
				if(BT.jc.indexOf(data.buyHistoryData[i].lotteryId)!=-1 && data.buyHistoryData[i].lotteryId!=10059){
					html.push('<a>');
				}else{
					html.push('<a href="schemeDetail.html#scheme='+data.buyHistoryData[i].schemeId+'&index=1">');
				}
				html.push('<p>'+data.buyHistoryData[i].lotteryName+'</p>');
				html.push('<p><b>'+data.buyHistoryData[i].schemeAmount+'元</b>');
				html.push('<span>'+data.buyHistoryData[i].issue+'期</span></p>');
				html.push('<p><b class="has'+data.buyHistoryData[i].status+'">'+data.buyHistoryData[i].statusDesc+'</b>');
				html.push('<span>'+data.buyHistoryData[i].initiateTimeStr+'</span></p></a></div>');
			}
			if(len==0){
				html.push('<div class="noRecord">暂无记录</div>');
			}
			$("#mySH").html(html.join(''));
		});
	},
	signOut:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/user/exit",
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				location.href='index.html';
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	detail:function(_this){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/user/my_info",
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				var html=[];
				$("#uname").html(localStorage.getItem('username'));
				$("#mobile").html(data.mobile+" (重新绑定)");
				if(data.isupdateuname==0){
					html.push('<div onclick="cp2y.dialog.alert(\'请联系客服\')" class="userLin mt40"><span>登录账户</span><p>'+data.username+'</p></div>');
				}else{
					html.push('<div id="changeUsername" onclick="step.s5();" class="userLin mt40"><span>登录账户</span><p id="changeUsernames">'+data.username+'</p></div>');
				}
				if(data.bindingIdentify==1){
					html.push('<div onclick="cp2y.dialog.alert(\'请联系客服\')" class="userLin wbg mt12"><span>真实姓名</span><p>'+data.name+'</p></div>');
					html.push('<div onclick="cp2y.dialog.alert(\'请联系客服\')" class="userLin wbg"><span>身份证号</span><p>'+data.identify+'</p></div>');
				}else{
					html.push('<div onclick="step.s2()" class="userLin wbg mt12"><span>真实姓名</span><p></p></div>');
					html.push('<div onclick="step.s2()" class="userLin wbg"><span>身份证号</span><p></p></div>');
				}
				$("#hasBinds").html(html.join(''));
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	updataId:function(){
		var data={
			name:$("#updataNick").val().trim(),
			identityNumber:String($("#updataId").val().trim())
		},isId=data.identityNumber.isID();
		cp2y.dialog.clearTip();
		if(isId){
			return cp2y.dialog.tip(isId);
		}else if(!data.name){
			return cp2y.dialog.tip("信息不能为空");
		}else{
			$.ajax({
				url:WebAppUrl.HOME_APP_URL+"/core/user/bind_identify_name",
				data:data,
				beforeSend:function(){cp2y.dialog.loading();},
				success:function(data){
					cp2y.dialog.clearLoading();
					if(data.flag==1){
						location.reload();
					}else{
						cp2y.dialog.tip(data.message);
					}
				},
				error:function(){cp2y.dialog.clearLoading();}
			});
		}
	},
	updataPhone:function(m){
		var validateCode=$("#veri").val().trim();
		cp2y.dialog.clearTip();
		if(!validateCode){
			return cp2y.dialog.tip('验证码不能为空');
		}else{
			$.ajax({
				url:WebAppUrl.HOME_APP_URL+"/core/user/bind_mobile_validate",
				data:{validateCode:validateCode},
				beforeSend:function(){
					cp2y.dialog.loading();
				},
				success:function(data){
					cp2y.dialog.clearLoading();
					if(data.flag==1){
						userDom.GoIndex3.click();
					}else{
						
					}
				}
			});
		}
	},
	getVeri:function(){
		var val=$("#phone").val().trim();
		cp2y.dialog.clearTip();
		if(val.isPhone()){
			$.ajax({
				url:WebAppUrl.HOME_APP_URL+"/core/user/sendMobile",
				data:{mobile:val},
				beforeSend:function(){cp2y.dialog.loading();},
				success:function(data){
					cp2y.dialog.clearLoading();
					if(data.flag==1){
						step.s31();
						$("#yourMobile").html(val);
						countDown.t=60;
						setTimeout('countDown.init()',1000);						
					}else{
						cp2y.dialog.tip(data.message);
					}
				},
				error:function(){cp2y.dialog.clearLoading();}
			});
		}else{
			return cp2y.dialog.tip('手机号码不正确');
		}
	},
	updataPassword:function(){
		var data={
			password:$("#updataPassword1").val(),
			newPassword:$("#updataPassword2").val(),
			newPassword2:$("#updataPassword3").val()
		};
		cp2y.dialog.clearTip();
		if(!data.password||!data.newPassword||!data.newPassword2){
			return cp2y.dialog.tip('以下信息均必填');
		}
		if(data.newPassword!=data.newPassword2){
			return cp2y.dialog.tip('两次输入密码不一致');
		}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+'/core/user/update_password',
			data:data,
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				if(data.flag==1){
					cp2y.dialog.tip(data.message);
					setTimeout('userDom.GoIndex3.click()',1000);
				}else{
					cp2y.dialog.tip(data.message);
				}
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	updataUsername:function(){
		var data={
			username:$("#updataUsername").val().trim()
		};
		cp2y.dialog.clearTip();
		if(!data.username){
			return cp2y.dialog.tip('不能为空');
		}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+'/core/user/updateusername',
			data:data,
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data2){
				cp2y.dialog.clearLoading();
				if(data2.flag==1){
					cp2y.dialog.tip(data2.message);
					$('#changeUsername').attr({"onclick":"cp2y.dialog.alert(\'请联系客服\')"});
					$('#changeUsernames').html(data.username);
					setTimeout('step.s1()',1000);
				}else{
					cp2y.dialog.tip(data2.message);
				}
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	_balance:function(){
		var balance=[];
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/balance.html",
			async:false,
			success:function(data){
				balance=[1,data];
			},
			error:function(){
				balance=[0,"查询错误"];
			}
		});
		return balance;
	},
	_schemeHistory:function(firstRow,fetchSize,fn){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/lottery/mySchemeHistory",
			data:{firstRow:firstRow,fetchSize:fetchSize},
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				fn(data);
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	}
};