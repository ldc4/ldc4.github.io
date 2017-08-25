# 首页

结合之前的首页，再来个必应每日壁纸和粒子效果

# 参考资料

如何获取必应图：

http://leil.plmeizi.com/archives/%E5%BF%85%E5%BA%94%E4%BB%8A%E6%97%A5%E7%BE%8E%E5%9B%BE%E7%9A%84%E8%8E%B7%E5%8F%96%E5%B1%95%E7%A4%BA/


高清图Url接口：（通过抓包可以获取）

https://stackoverflow.com/questions/10639914/is-there-a-way-to-get-bings-photo-of-the-day

https://www.bing.com/HpImageArchive.aspx?format=xml&idx=0&n=1&mkt=zh-CN

https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN

https://cn.bing.com/az/hprichbg/rb/GustavAntiquities_ZH-CN9624291648_1920x1080.jpg
 

发现一个专门做必应壁纸接口的git：

https://github.com/xCss/bing

https://bing.ioliu.cn/v1/blur?w=1920&h=1080&r=1

![](https://bing.ioliu.cn/v1/blur?w=1920&h=1080&r=1)

# 样式

背景图片：

```
background: url('https://bing.ioliu.cn/v1/blur?d=0&w=1920&h=1080&r=1') center center no-repeat #666;
background-size: cover;
background-attachment: fixed;
```


垂直居中：
```
position: absolute;
top: 50%;
left: 50%;
min-height: 350px;
width: 960px;
padding-top: 50px;
margin-top: -200px;
margin-left: -480px;
```


蒙层：
```
position: fixed;
width: 100%;
height: 100%;
top: 0px;
bottom: 0px;
background-color: rgba(255, 255, 255, 0.5);
```
