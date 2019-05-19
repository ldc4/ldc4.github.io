/**
* by ldc4
* 实现格言随机加载，配置文件为assets目录下的motto.json
* 添加粒子效果
*/
$(document).ready(function(){

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
