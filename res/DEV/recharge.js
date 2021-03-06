/**
 * @author luwenbin@live.com
 */
cp2y.user={
	step1:function(){
		$("#userPartTitle").html('充值');
		$("#stepB1").show();$("#stepB2").hide();
		$("#step1").show();
		$("#step2").html('').hide();
	},
	step2:function(t,h){
		$("#step1").hide();
		$("#stepB1").hide();$("#stepB2").show();
		$("#step2").html(h).show();
		$("#userPartTitle").html(t);
	},
	rechargeBox:function(title,type){
		var html=[],k=['','每日支付金额最高2000元','单卡单笔限额10000元，单卡单日限额10000元','单卡单笔限额10000元，单卡单日限额10000元'];
		html.push('<div class="userPartBox1"><div id="userTip3"></div>');
		html.push('<input type="tel" id="rechargeMoney" placeholder="至少1元" class="input4 mt40" />');
		html.push('<input type="hidden" id="payType" value="'+type+'" />');
		html.push('<a id="recharge" onclick="cp2y.user.recharge()" class="btn1 mt10">确认</a>');
		html.push('<p>'+k[type]+'</p>');
		html.push('</div>');
		this.step2(title+"充值",html.join(''));
	},
	recharge:function(){
		var Money=$("#rechargeMoney"),money=Money.val(),payType=$("#payType").val();
		if(!money.isInt()){
			return cp2y.dialog.tip("必须为整数");
		}else if(Money.val()>10000){
			Money.val(10000);money=10000;
		}
		if(payType==1){
			url="/core/user/aliPay?money="+money;
		}else{
			url="/core/user/lianlianPay?money="+money+"&payType="+payType;
		}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+url,
			beforeSend:function(){
				cp2y.dialog.clearTip();
				cp2y.dialog.loading();
			},
			success:function(data){
				cp2y.dialog.clearLoading();
				if(data.flag==1){
					//document.location.href=data.payUrl;
					
					window.open( data.payUrl, "_system");
					navigator.app.loadUrl(url,{ openExternal:true }); 
				}else{
					cp2y.dialog.tip(data.message);
					return cp2y.quick.user.signInBox();
				}
			},error:function(){cp2y.dialog.clearLoading();
				return cp2y.quick.user.signInBox();}
		});
	}
};