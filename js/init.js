/**
* by ldc4
* 实现格言随机加载，配置文件为assets目录下的motto.json
* 添加粒子效果
*/
$(document).ready(function(){
	// 设置背景
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var formatStr = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
	$("body").css("background", "url('http://static.weedust.com/bing_" + formatStr + "') center center no-repeat rgba(255,255,255, 0.75)");
	$("body").css("background-size", "cover");
	$("body").css("background-attachment", "fixed");

	// 随机格言
	$.get('assets/motto.json').success(
		function(content){
			var data = eval(content);
			var h = $(".header");
			$.each(data,function(){
				h.append("<div class=\"quote show\"><p class=\"quote-text \">"+this.quote.text+"</p><p class=\"quote-author \">"+this.quote.author+"</p></div>");
			});
			var showDivs = $(".show");
			var num = showDivs.size();
			var i = Math.floor(Math.random()*num + 1);
			var select = 0;
			showDivs.each(
				function(){
					select++;
					if(select!=i)
						$(this).hide();
					else
					{
						$(this).children().each(function(){
							$(this).addClass("animate-init");
						});
					}
				}
			);
			ani();
		}
	);

	// 粒子效果
	// particlesJS.load('particles-js', 'assets/particles.json');
	
	// 黑洞效果
	blackhole();

});
