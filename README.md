# HTML_CSS_JS
## 结构的搭建与切换
- 页面的横向布局:页面整体布局结构
  - 页面是横向的:float:left;
  - 包含了三个主题页面,用一个祖父元素div包含，样式里面利用"overflow:hidden;"隐藏其余两个页面，再利用父元素包含三个主题页面，便于移动
  - 三个主题页面无缝拼接：使用相对定位，或是margin
  - 页面还要能滚动:通过JS动态设置每个元素的尺寸大小  
  
- 页面之间的卷滚切换效果
  - 移动父容器，改变父容器的坐标
  - 移动每一个子容器的坐标<br/>
**修改坐标的两种方法:**<br/>
   1. 传统的对top，left坐标修改<br/>
   2. CSS3中利用transform属性进行平移（也可以进行旋转，缩放，或倾斜）
  - 整个过程的实现思路：<br/>
    1. 移动父元素的横轴坐标，实现页面切换<br/>
    2. 利用CSS3的transfrom属性的translated3d（x,y,z）值来控制元素的位置在页面上的三轴位置，该情况下就只是X轴<br/>
    3. transfrom属性只是静态属性，不是动画属性，因此其会直接显示最终结果，无变化过程<br/>
    4. 为了实现平滑过渡效果，使用CSS3的transition方法，transition是一个简单的动画属性。利用transition设置某些参数，实现transfrom的平滑变化
- 页面切换部分的代码封装
  - 封装，隐藏对象的属性和实现细节，仅仅对外公开接口，增强安全性和简化编程。 <br>
          利用工厂方法实现对页面切换部分的封装，产生一个页面对象，并提供该页面对象的切换接口
  - JavaScript没有抽象类和接口的支持，所以靠闭包实现
  - ECMASript同时也没有接口继承，只有实现继承）
## 小男孩的动作实现与封装
- 布局与自适应
  - 背景图是靠百分比控制的，会随分辨率的变化而变化。
  - 小男孩走路走过三个页面，所以小男孩不属于任何一个页面，应该与包含三个页面的父元素是并列结构
  - 小男孩是采用合成的"雪碧图"，通过坐标取图，从而不能使用CSS处理自适应布局。人物是固定尺寸，只能通过js动态调整计算人物坐标。
  - 采用动画的元素需要设置绝对定位（absolute）
- 精灵动画的实现
  - CSS Sprites：即CSS精灵，原理是靠不断切换的图片让人的视觉上感觉不断在变化。传统的靠定时器不断更换图片（background-image），会使得加载较慢，且占用大量网络资源。
  - 雪碧图： 将所有图片合成一张大图，再利用background-position进行数字精确定位背景图片的位置。
  - CSS动画：animation。利用animation的8个属性可以定义一下动画的参数，从而实现想要的动画效果。<br/>
   1. 利用animation-name绑定一个@keyframes规则。<br/>
   2. 在@key-frames规则中，利用百分比来规定变化发生的时间。
- 走路动画的实现
  - 引入jquery.transit插件。
  - 利用CSS3的transition实现对left的修改，从而实现走路的效果
- 运动的状态控制
  - CSS3的animation动画属性直接提供一个animation-play-state属性来控制动画的暂定处理
  - transition动画属性的暂定方式：一般都是实现设定好，其就是实现一个动画过渡效果。但也可以强制改变目标过渡值来暂停，但有遗留问题（动画再次开始，必须等上次的结束）。
- 路径动画的坐标计算
  
  
## 流程的编写与控制
- 异步编程的处理
  - 传统的异步操作会在操作完成之后，使用回调函数传回结果。所以将回调函数中包含了后续所作的工作。
  - jQuery引入了Promise的概念。通过Promise我们可以像写同步代码一样去写异步代码。具体使用如下：<br/>
      var def = $.Deferred();//创建 <br/>
      def.resolve();//成功<br/>
      def.then();   //执行回调<br/>
  - $.Deferred的使用没有了回调的嵌套，将执行的流程交给了Deferred进行处理。
- 小男孩部分代码的封装
- 页面与人物之间形成的视觉差效果
  
  
## 第一幅图
- 太阳的结构与动画效果
- 通过animation实现动画
- 通过transfrom实现坐标变化
- 即利用关键帧来设置transfrom的值，实现位置移动
- 云的结构与动画效果
   
   
## 第二幅图
- 页面布局搭建
- 开关门效果的实现<br/>
   1. trasition修改left，right值，并利用Deferred实现异步编程  
- 灯光处理
- 灯光效果的实现
- 人物进出商店的坐标计算
- 等待取花
- 鸟动画的实现<br/>
   1. 利用 雪碧图和animation实现精灵动画，使用transition来修改right值实现位置移动
   
## 第三幅图
- 页面布局
- 星星与水波<br/>
**渐变动画效果可以有两种情况实现：**<br>
  - 利用transiton做平滑过渡，实现渐变
  - 利用animation做渐变动画<br/>
**两者的区别：**<br/>
  - transition是需要事件进行触发的
  - animation是不需要触发，可以自动触发完成动画，而且功能更为强大，可以实现状态的控制，事件等等
- 运动轨迹处理
- 飘花效果的实现
  - 花瓣数量多，有渐变，旋转、轨迹运动、落地消失等变化
  - 解决方法：
    1. 通过js动态随机生成花瓣节点
    2. 通过transition来实现渐变、旋转、轨迹活动的动画
    3. 通过jquery删除生成的DOM节点实现落地消失
    4. setInterval的定时调用
##  背景音乐
- HTML5 audio
