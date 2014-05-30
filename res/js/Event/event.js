/**
 * @author 鲁文彬
 */
cp2y.events={
	loadEvent:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/activity/getActivityList",
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				var data=data.list,i=0,len=data.length,html=[];
				for(i;i<len;i++){
					html.push('<div><a style="background-image:url('+data[i].pictureUrl+');background-color:'+data[i].color+'" class="a0 eventBanner'+i+'" href="'+data[i].link+'"></a></div>');
				}
				$("#eventList").html(html.join(''));
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	hasMyEvent:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/activity/userActivityCount",
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				if(data.myActivityCount>0){
					$("#hasMyEvent").show();
				}
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	myEvent:function(){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/activity/showValidActList",
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				var data=data.activitylist,i=0,len=data.length,html=[];
				for(i;i<len;i++){
					html.push('<div><a class="eventBanner'+i+'" href="/activity/actdetail?id='+data[i].id+'">'+data[i].activityName +'</a></div>');
				}
				$("#eventList").html(html.join(''));
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	event1:function(id){
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/activity/showlingmoney?activityId="+id,
			beforeSend:function(){cp2y.dialog.clearLoading();},
			success:function(data2){
				var data=data2.currentActivity,i=0,len=data.infos.length,html=[],status=0,on='';
				html.push('<dt><p>返还总金额:<span>'+data.money+'元</span></p><p>剩余金额:<span>'+data2.remainMoney+'元</span></p></dt>');
				for(i;i<len;i++){
					switch(data.infos[i].status){
						case "0":
						status="领取";
						on='class="a0" onclick="cp2y.events.draw(this)"';
						break;
						case "1":
						status="已领";
						on='class="a1"';
						break;
						case "2":
						status="待领";
						on='class="a2"';
						break;
						case "3":
						status="弃领";
						on='class="a3"';
						break;
					}
					html.push('<dd><div><p>'+data.infos[i].money+'</p><p>领取时间:'+data.infos[i].dateDesc+'</p></div><a data="'+id+'" '+on+'>'+status+'</a></dd>');
				}
				$("#event1").html(html.join(''));
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	},
	draw:function(o){
		var o=$(o),id=o.attr("data");
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/core/user/activityDraw?activityId="+id,
			beforeSend:function(){cp2y.dialog.clearLoading();},
			success:function(data){
				if(data.flag==1){
					cp2y.dialog.alert(data.message);
					cp2y.events.event1(id);
				}else{
					cp2y.dialog.alert(data.message);
				}
			},
			error:function(){cp2y.dialog.clearLoading();}
		});
	}
};
