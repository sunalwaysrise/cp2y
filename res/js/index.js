/**
 * @author luwenbin@live.com
 */
cp2y.closeBanner=function(){
	$("#banner").hide();
	sessionStorage.setItem('isShowBanner', 1);
};
cp2y.loadBanner=function(){
	$.ajax({
		url:WebAppUrl.HOME_APP_URL+"/activity/getActivityList?first=1",
		success:function(data){
			if(data.flag==1){
				var i=0,len=data.list.length,html=[];
				html.push('<i onclick="cp2y.closeBanner();" id="closeBanner"></i>');
				html.push('<ul id="bannerWarp" ontouchstart="touch.touchStart(event)" ontouchmove="touch.touchMove(event);" ontouchend="touch.touchEnd();" >');
				for(i;i<len;i++){
					html.push('<li><a href="'+data.list[i].link +'" target="_blank"><img src="'+data.list[i].pictureUrl+'" /></a></li>');
				}
				html.push('</ul>');
				cp2y.banner.len=len;
				$('#banner').html(html.join(''));
				var bannerWarp=$("#bannerWarp");
				html=[];i=0;
				bannerWarp.css({width:len*100+"%"});
				bannerWarp.children().css({width:100/len+"%"});
				for(i;i<len;i++){
					html.push('<a></a>');
				}
				$('#banner').append('<nav id="bannerNav">'+html.join('')+'</nav>');
				cp2y.banner.init();
			}
		}
	});
};
var touch = {
	tX : [],
	touchStart : function(a) {
		this.tX.push(a.touches[0].pageX);
	},
	touchMove : function(c) {
		this.tX.push(c.touches[0].pageX);
		//c.preventDefault();
	},
	touchEnd : function() {
		if (this.tX[0] - this.tX[this.tX.length - 1] > 100) {
			cp2y.banner.left();
		}else if ( this.tX[this.tX.length - 1] - this.tX[0] > 100){
			cp2y.banner.right();
		}
		this.tX = [];
	}
}
cp2y.banner={
	len:1,
	setNav:function(i){
		var k=$('#bannerNav a.cur').index();
		k=k+i;
		//console.log(i,k);
		if(k<0){
			k=this.len-1;
		}else if(k>this.len-1){
			k=0;
		}
		$('#bannerNav a').removeClass('cur');
		$('#bannerNav a').eq(k).addClass('cur');
	},
	left:function(){
		var that=$("#bannerWarp").children("li").eq(0).clone();
		$("#bannerWarp").children("li").eq(0).remove();
		$("#bannerWarp").append(that);
		this.setNav(-1);
//		$("#bannerWarp").children("li").eq(0).animate({width:0},{duration:200,complete:function(){
//				$("#bannerWarp").children("li").eq(0).remove();
//				$("#bannerWarp").append(that);
//				cp2y.banner.setNav(-1);
//			}
//		});
	},
	right:function(){
		var that=$("#bannerWarp").children("li").eq(-1).clone();
		$("#bannerWarp").children("li").eq(-1).remove();
		$("#bannerWarp").prepend(that);
		this.setNav(1);
	},
	init:function(){
		$('#bannerNav a').eq(0).addClass('cur');
		setInterval('cp2y.banner.left()',3000);
	}
};
cp2y.mainPage=function(){
	$.ajax({
		url:WebAppUrl.HOME_APP_URL+"/lottery/lottery_list",
		beforeSend:function(){cp2y.dialog.loading();},
		success:function(data){
			cp2y.dialog.clearLoading();
			var i=0,len=data.list.length,html=[],hot="a0",tmp='';
//			if(sessionStorage.getItem('isShowBanner')!=1){
//				html.push('<div class="banner" id="banner"></div>');
//			}
			for(i;i<len;i++){
				if(data.list[i].lotteryId!=10059){
				tmp='';
				switch(data.list[i].lotteryId){
					case 10032:
					case 10026:
						tmp='<p><span>'+cp2y.util.setIssue2(data.list[i].lastIssue)+'期奖号:</span>'+cp2y.util.splitNumber2(data.list[i].drawNumber)+'</p>';
						break;
					case 10046:
					case 10025:
					case 10066:
					case 10061:
					case 10060:
					case 10064:
					case 10065:
						tmp='<p><span>'+cp2y.util.setIssue1(data.list[i].lastIssue)+'期奖号:</span>'+cp2y.util.splitNumber1(data.list[i].drawNumber)+'</p>';
						break;
					case 10059:
						tmp='<p>周日加奖15%,赚翻了！</p>';
						break;
				}
				switch(data.list[i].lotteryId){
					case 10032:
						hot='a0';
						break;
					case 10026:
						hot='a0';
						break;
					case 10046:
						hot='a14';
						break;
					case 10025:
						hot='a0';
						break;
					case 10066:
						hot='a14';
						break;
					case 10061:
						hot='a11';
						break;
					case 10060:
						hot='a14';
						break;
					case 10064:
						hot='a12';
						break;
					case 10065:
						hot='a3';
						break;
					case 10059:
						hot='a0';
						break;
				}
				if(data.list[i].isStop==0){
					if(data.list[i].lotteryId==10059){
						html.push('<a href="buyJCZQ.html#lottery='+data.list[i].lotteryId+'&type='+hot+'"><div class="playType">');
					}else{
						html.push('<a href="buySZC.html#lottery='+data.list[i].lotteryId+'&type='+hot+'"><div class="playType">');
					}
					html.push('<div class="img2"><img src="'+WebAppUrl.Icon+data.list[i].lotteryId+'.png" /><span>'+data.list[i].lotteryName+'</span></div><div class="playTypeArea">');
					html.push('<p class="p11">'+data.list[i].message);
					if(data.list[i].event){
						html.push('<i class="hot">'+data.list[i].event+'</i>');
					}
					html.push('</p>');
					html.push(tmp);
					html.push('</div></div></a>');
					}
				}
			}
			html.push('<a href="buyGJJC.html"><div class="playType">');
			html.push('<div class="img2">');
			html.push('<img src="'+WebAppUrl.Icon+'10059cgy.png" /><span>冠军竞猜</span>');
			html.push('</div>');
			html.push('<div class="playTypeArea">');
			html.push('<p class="p11">冠军竞猜</p>');
			html.push('<p>世界杯冠军、欧冠杯冠军</p>');
			html.push('</div></div></a>');
			// html.push('<a href="http://m.cp2y.com" target="_blank"><div class="playType">');
			// html.push('<div class="img2">');
			// html.push('<img src="'+WebAppUrl.Icon+'more.png" style="margin-top:13px" />');
			// html.push('</div>');
			// html.push('<div class="playTypeArea">');
			// html.push('<p class="p11">更多彩种</p>');
			// html.push('<p>老时时彩、七乐彩、幸运赛车...</p>');
			// html.push('</div></div></a>');
			$("#mainPage").html(html.join(''));
			window.scrollTo(0,0);
//			if(sessionStorage.getItem('isShowBanner')!=1){
//				cp2y.loadBanner();
//			}
		}
	});
	$.get(WebAppUrl.HOME_APP_URL+"/user/checkLogin",function(isLogin){
		if(isLogin.flag==1){
			$("#indexNav").append('<p id="imLogin"><a href="home.html">'+isLogin.username+'</a></p>');
			localStorage.setItem('username', isLogin.username);
			$.get(WebAppUrl.HOME_APP_URL+"/activity/userActivityCount",function(data){
				if(data.myActivityCount>0){
					if($("#unRead").size()==0){
						$("#hasActive").append('<i class="unRead" id="unRead"></i>');
					}
				}
			});//有无私有活动
		}else{
			$("#imLogin").remove();
			localStorage.removeItem("username");
		}
	});//用户状态
	if(localStorage.getItem('has')!=1){
		$("#hasActive").append('<i class="unRead" id="unRead"></i>');
		$("#hasActive").click(function(){
			localStorage.setItem('has',1);
		});
	}
};
cp2y.mainPage();