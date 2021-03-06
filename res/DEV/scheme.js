/**
 * @author luwenbin@live.com
 * 方案详情
 */
var schemeDom={
	t:$("#schemeTitle")
};
cp2y.user={
	init:function(){
		var i=cp2y.util.getArgs('scheme'),p=cp2y.util.getArgs('index'),Btn=$('#closeBtn'),href='/limit/user/';
		if(p==1){
			href+='index';
		}else if (p==2){
			href+='withdrawlist';
		}else{
			href+='betRecords';
		}
		Btn.attr({"href":href});
		if(i){this.scheme(i);}
	},
	scheme:function(sId){
		if(!sId){return false;}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/lottery/scheme_detail",
			data:{schemeId:sId},
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				var html=[],logStep=1,k1,k2="出票成功",k3="兑奖",isT='追号中';
				schemeDom.t.html(data.lotteryName+"-方案");
				switch(data.schemeStatus){
					case 101://认购中
					logStep=1;k1="认购中";
					break;
					case 201://委托中
					logStep=1;k1="委托中";
					break;
					case 301://出票成功
					logStep=3;k1="待出票";
					break;
					case 401://追号中
					logStep=4;k1="待出票";
					break;
					case 501://中奖
					logStep=5;k1="待出票";k3="中"+data.schemeData.schemePrize+"元";
					break;
					case 601://未中奖
					logStep=6;k1="待出票";k3="未中奖";
					break;
					case 701://撤单
					isT="撤单";
					logStep=7;k1="待出票";k3="撤单";
					break;
				}
				html.push('<div class="logStep logStep'+logStep+'"><span></span><span></span><span></span><i></i><i></i><i></i><a>'+k1+'</a><a>'+k2+'</a><a>'+k3+'</a><code>'+isT+'</code></div>');
				if(BT.jc.indexOf(data.lotteryId)!=-1){
					/* 竞彩足球 */
					html.push('<p class="jcScheme1">'+data.schemeData.schemeType+data.traceData[0].issue+'期，'+data.schemeData.numberType+'，'+data.schemeData.schemeContent[0].matchCount+'场，'+data.schemeData.schemeContent[0].pass+','+data.traceData[0].multiple+'倍，共'+data.traceData[0].money+'元</p>');
					var tf=false;
					if(data.schemeData.open==4 ){
						if(data.schemeStatus==501 || data.schemeStatus==701){
							tf=true;
						}
					}
					if(data.schemeData.open==1 || tf){
						if(data.isJingCai==1){
							html.push('<table class="jcScheme2"><thead><tr><td>投注球队</td><td>赔率</td><td>是否中奖</td></tr></thead><tbody>');
							var i=0,td=data.schemeData.schemeContent[0].matches,len=td.length,dd='';
							for(i;i<len;i++){
								if(!td[i].matchResult){
									dd="";
								}else{
									dd=td[i].matchResult;
								}
							html.push('<tr><td>'+td[i].hostName+'</td><td>'+td[i].rate+'</td><td>'+dd+'</td></tr>');
							}
							html.push('</body></table>');
						}else{
							html.push('<table class="jcScheme2"><thead><tr><td>场次</td><td>对阵</td><td>投注</td><td>彩果</td>');
							var i=0,td=data.schemeData.schemeContent[0].matches,len=td.length,ss='--',dd='',hasDan=false;
							for(i;i<len;i++){
								if(td[i].dan){hasDan=true;break;}
							}
							if(hasDan){
								html.push('<td>定胆</td>');
							}
							html.push('</tr></thead><tbody>');
							i=0;
							for(i;i<len;i++){
								if(data.schemeData.numberType!='胜平负复式'){
									if(td[i].rate>0){
										dd="<span class='red'>+"+td[i].rate+"</span>";
									}else{
										dd="<span class='green'>"+td[i].rate+"</span>";
									}
								}
								var matchResult=td[i].matchResult,w='';
								if(matchResult){
									matchResult=matchResult.split('/').join('<br/>');
								}else{
									matchResult='待定';
								}
								w=new Date(td[i].sellEndTime).getDay();
								switch(w){
									case 0:
										w='周日';
										break;
									case 1:
										w='周一';
										break;
									case 2:
										w='周二';
										break;
									case 3:
										w='周三';
										break;
									case 4:
										w='周四';
										break;
									case 5:
										w='周五';
										break;
									case 6:
										w='周六';
										break;
								}
								html.push('<tr><td>'+w+'<br/>'+td[i].matchCode.substr(8,3)+'</td><td>'+td[i].hostName+dd+'<br/>'+(td[i].lastScore?td[i].lastScore:'--')+'<br/>'+td[i].guestName+'</td><td>'+td[i].msg+'</td><td>'+matchResult+'</td>');
								if(hasDan){
									html.push('<td>'+(td[i].dan?"√":"×")+'</td>');
								}
								html.push('</tr>');
							}
							html.push('</body></table>');
						}
					}else{
						html.push('<div class="userTip4">该方案未公开</div>');
					}
				}else{
					/* 非竞彩 */
					//方案内容展示Start 
					var i=0,len=data.schemeData.schemeContent.length;
					html.push('<div class="userTip4">投'+data.schemeData.schemeNumberUnit+'注，共'+data.schemeData.buyAmount+'元</div>');
					html.push('<div class="schemeDetail mt10">');
					if(len>3){
						for(i;i<3;i++){
							html.push(data.schemeData.schemeContent[i].content);
						}
						html.push('</div><div class="schemeDetail oHidden" id="hiddenScheme">');
						for(i;i<len;i++){
							html.push(data.schemeData.schemeContent[i].content);
						}
						html.push('</div><p class="toggleScheme" onclick="cp2y.util.toggle(this,$(\'#hiddenScheme\'),\'展开全部方案\')" data="0">&gt;&gt;展开全部方案</p>');
					}else{
						for(i;i<len;i++){
							html.push(data.schemeData.schemeContent[i].content);
						}
						html.push('</div>');
					}
					//方案内容展示End
					
					//追号列表展示Start
					i=0;len=data.traceData.length;
					if(data.schemeData.issueCount==1){
						html.push('<div class="userTip4 mt10">期号详情');	
					}else{
						html.push('<div class="userTip4 mt10">追'+data.schemeData.issueCount+'期');
					}
					if(data.prizeStop){
						html.push('，累计中奖≥'+data.prizeStop+'元，停止追号');
					}
					html.push('</div>');
					html.push('<div class="traceDetail">');
					if(len>1){
						var len2=len;
						if(len2>3){len2=3;}
						for(i;i<len2;i++){
							html.push('<div class="traceDetailL"><div><p>'+data.traceData[i].issue+'期：'+data.traceData[i].multiple+'倍，'+data.traceData[i].money+'元</p><p>开奖号码：'+data.traceData[i].drawNumber+'</p></div><div>');
							if(data.traceData[i].prize){
								html.push('<p>'+data.traceData[i].status+'</p><p class="has501">'+data.traceData[i].prize+'元</p>');
							}else{
								html.push('<p class="spanRow1">'+data.traceData[i].status+'</p>');
							}
							html.push('</div></div>');
						}
						if(len==3){
							html.push('</div><div class="traceDetail oHidden" id="hiddenTrace"></div>');
							html.push('<p class="toggleScheme" onclick="cp2y.user.hiddenTrace('+data.schemeData.schemeId+','+data.schemeData.type+');cp2y.util.toggle(this,$(\'#hiddenTrace\'),\'查看更多\')" data="0">&gt;&gt;查看更多</p>');
						}
					}else{//未追号
						for(i;i<len;i++){
							html.push('<div class="traceDetailL"><div><p>'+data.traceData[i].issue+'期：'+data.traceData[i].multiple+'倍，'+data.traceData[i].money+'元</p><p>开奖号码：'+data.traceData[i].drawNumber+'</p></div><div>');
							if(data.traceData[i].prize){
								html.push('<p>'+data.traceData[i].status+'</p><p class="has501">'+data.traceData[i].prize+'元</p>');
							}else{
								html.push('<p class="spanRow1">'+data.traceData[i].status+'</p>');
							}
							html.push('</div></div>');
						}
						html.push('</div>');
					}
					//追号列表展示End
				}
				//合买列表展示Start
				if(data.schemeData.type==200 ||data.schemeData.type==201||data.schemeData.type==202||data.schemeData.type==203){
					html.push('<div class="userTip4 mt10">'+data.schemeParticipantData.totalCount+'人参与合买</div>');
					i=0;len=data.schemeParticipantData.listData.length;
					var tlen=len;
					if(len>3){
						tlen=3;
					}
					for(i;i<tlen;i++){
						cp2y.user.participantId.push(data.schemeParticipantData.listData[i].participantId);
						html.push('<div class="Participant"><span>'+data.schemeParticipantData.listData[i].userName+'</span>');
						html.push('<p>认购'+data.schemeParticipantData.listData[i].money+'元</p>');
						html.push('<span>占股'+data.schemeParticipantData.listData[i].proportion+'%</span></div>');
					}
					if(len>2){
					html.push('<div class="traceDetail oHidden" id="Participant"></div>');
					html.push('<p class="toggleScheme" onclick="cp2y.user.Participant('+data.schemeData.schemeId+','+data.lotteryId+');cp2y.util.toggle(this,$(\'#Participant\'),\'查看更多\')" data="0">&gt;&gt;查看更多</p>');
					}
				}
				//合买End
				
				//方案详情Start
				html.push('<div class="userTip4 mt10">方案详情</div>');
				if(data.schemeData.remuneration){
				html.push('<div class="schemeD1"><span>盈利佣金：</span><p>'+data.schemeData.remuneration+'%</p></div>');
				}
				html.push('<div class="schemeD1"><span>发起人：</span><p>'+data.schemeData.userName+'</p></div>');
				html.push('<div class="schemeD1"><span>发起时间：</span><p>'+data.schemeData.initiateTime+'</p></div>');
				if(data.schemeData.schemeDesc){
				html.push('<div class="schemeD1"><span>方案描述：</span><p>'+data.schemeData.schemeDesc+'</p></div>');
				}
				html.push('<div class="schemeD1 pb40"><span>方案编号：</span><p>'+data.schemeData.schemeNumber+'</p></div>');
				//方案详情end
				
				//底部状态
				if(data.schemeData.canCancel==1){//可撤单
					var isH=1;
					if(data.schemeData.type==200 ||data.schemeData.type==201 ||data.schemeData.type==202 ||data.schemeData.type==203){
						isH=2;
					}
					if(BT.selling.indexOf(data.lotteryId)!=-1){
						html.push('<div class="fixBottom schemeBtns"><a class="scB1" onclick="cp2y.user.cancelScheme('+isH+','+data.schemeData.schemeId+')">撤单</a>');
						if(data.lotteryId==10059){
							if(data.isJingCai==1){
								html.push('<a class="scB1" href="buyGJJC.html">继续购买</a></div>');
							}else{
								html.push('<a class="scB1" href="buyJCZQ.html#lottery=10059&type=a0">继续购买</a></div>');
							}
						}else{
							html.push('<a class="scB1" href="buySZC.html#lottery='+data.lotteryId+'&type=a0">继续购买</a></div>');
						}
					}
				}else if(data.schemeData.type==200 ||data.schemeData.type==201||data.schemeData.type==202||data.schemeData.type==203){//合买
					if(data.ownPrize && data.ownPrize>0){//中奖
						html.push('<div class="fixBottom schemeBtns schemeBtns2">');
						html.push('<a>我中了'+data.ownPrize+'元</a>');
						html.push('<a href="index.html">去大厅</a>');
						html.push('</div>');
					}else if(BT.selling.indexOf(data.lotteryId)!=-1){//未中奖
						html.push('<div class="fixBottom schemeBtns"><a href="buySZC.html#lottery='+data.lotteryId+'&type=a0">继续购买</a></div>');
					}
				}else{
					if(BT.selling.indexOf(data.lotteryId)!=-1){
						if(data.lotteryId==10059){
							if(data.isJingCai==1){
								html.push('<div class="fixBottom schemeBtns"><a href="buyGJJC.html">继续购买</a></div>');
							}else{
								html.push('<div class="fixBottom schemeBtns"><a href="buyJCZQ.html#lottery=10059&type=a0">继续购买</a></div>');
							}
						}else{
							html.push('<div class="fixBottom schemeBtns"><a href="buySZC.html#lottery='+data.lotteryId+'&type=a0">继续购买</a></div>');
						}
					}
				}
				$("#schemeDetail").html(html.join(''));//显示详细
			}
		});
	},
	cancelScheme:function(i,s){
		var url=WebAppUrl.HOME_APP_URL,data={schemeId:s};
		if(i==1){
			url+='/core/lottery/scheme_cancel';
		}else if(1==2){
			url+='/core/lottery/scheme_remove';
		}else{
			return false;
		}
		$.ajax({
			url:url,
			data:data,
			beforeSend:function(){cp2y.dialog.loading();},
			success:function(data){
				cp2y.dialog.clearLoading();
				cp2y.dialog.alert(data.message);
				if(data.flag==1){
					setTimeout('location.reload()',1000);
				}
			}
		});
	},
	hiddenTrace:function(id,t){
		var hT=$("#hiddenTrace");
		if(hT.children("div").size()>0){
			return false;
		}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/lottery/scheme_join_trace_detail",
			data:{"schemeId":id,"type":t},
			success:function(data){
				var i=3,len=data.traceData.length,html=[];
				for(i;i<len;i++){
					html.push('<div class="traceDetailL"><div><p>'+data.traceData[i].issue+'期：'+data.traceData[i].multiple+'倍，'+data.traceData[i].money+'元</p><p>开奖号码：'+data.traceData[i].drawNumber+'</p></div><div>');
					if(data.traceData[i].prize){
						html.push('<p>'+data.traceData[i].status+'</p><p class="has501">'+data.traceData[i].prize+'元</p>');
					}else{
						html.push('<p class="spanRow1">'+data.traceData[i].status+'</p>');
					}
					html.push('</div></div>');
				}
				hT.html(html.join(''));
			}
		});
	},
	participantId:[],
	Participant:function(id,t){
		var hT=$("#Participant");
		if(hT.children("div").size()>0){
			return false;
		}
		$.ajax({
			url:WebAppUrl.HOME_APP_URL+"/lottery/scheme_join_Participant_detail",
			data:{"schemeId":id,"lotteryId":t},
			success:function(data){
				var i=0,len=data.schemeParticipantData.listData.length,html=[];
				for(i;i<len;i++){
					if(cp2y.user.participantId.indexOf(data.schemeParticipantData.listData[i].participantId)==-1){
						html.push('<div class="Participant"><span>'+data.schemeParticipantData.listData[i].userName+'</span>');
						html.push('<p>认购'+data.schemeParticipantData.listData[i].money+'元</p>');
						html.push('<span>占股'+data.schemeParticipantData.listData[i].proportion+'%</span></div>');
					}
				}
				hT.html(html.join(''));
			}
		});
	}
};