//页面滑动


/*

    Swipe Description
    @param:containter 页面容器节点
*/

function Swipe(containter){
   

   var element = containter.find(":first");

   var swipe = {};                      /*创建滑动对象*/

   var slides = element.find("li");     /*li页面数量*/

   var width = containter.width();       /*获取容器的尺寸*/
   var height = containter.height();

   element.css({                         /*设置li的页面总宽度*/

   	  width:(slides.length * width) +'px',
   	  height:height + 'px'
   });

   $.each(slides,function(index){         /*设置每个li页面的宽度*/
           
        var slide = slides.eq(index);     /*获取到每一个li元素*/

       slide.css({

       	     width:width + 'px',
       	     height:height + 'px'
       });
   });

   //监控完成与移动
   swipe.scrollTo = function(x, speed){

   	   //执行动画移动
   	   element.css({
              'transition-timing-function': 'linear',
               'transition-duration': speed + 'ms',
               'transform': 'translate3d(-' + x + 'px,0px,0px)' //设置页面X轴移动
             });

   	  
   };
    
   return swipe;
}