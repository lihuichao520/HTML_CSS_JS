
// 实现灯的动画
// 亮灯关灯的操作动画
var lamp = {
        elem:$('.b_background'),
        bright:function(){
              this.elem.addClass('lampBright');
        },
        dark:function(){
              this.elem.removeClass('lampBright');
        }
};



// 将门的行为和属性加以封装
function doorAction(leftDoor, rightDoor, time){
    var count = 2;          // 利用count技术监听动画完成
    var $door = $('.door');
    var doorLeft = $('.doorLeft');
    var doorRight = $('.doorRight');

    var defer = $.Deferred();

    // 等待开门完成
    var complete = function(){                     
       if(count === 1){
            defer.resolve();
            return ;
        }
       count--;

    };

             
    doorLeft.transition({
        'left':leftDoor
    }, time,complete);

           
    doorRight.transition({
        'left':rightDoor
    }, time, complete);

    return defer;
}
// 开门
function openDoor(){
    return doorAction('-50%', '100%', 2000);
}
// 关门
function closeDoor(){
    return doorAction('0%','50%',2000);
}

 
//将小男孩的行为和属性加以封装
var distanceX ;
function BoyWalk(){

	    var container = $("#content");
        // 页面可视区域
        var visualWidth = container.width();
        var visualHeight = container.height();

	   //获取数据
        var getValue = function(className){
        	var $elem = $(''+className +'');
        	return {
                  height:$elem.height(),
                  top:$elem.position().top
        	};
        };
	 	
	 	//路的Y轴
	 	var pathY = function(){
	 		var data = getValue('.a_background_middle');
	 		return data.top + data.height/2;
	 	}();

	 	var $boy = $("#boy");
	 	var boyWidth = $boy.width();
	 	var boyHeight = $boy.height();

	 	//修正小男孩的正确位置
	 	$boy.css({
	 		top:pathY - boyHeight + 25
	 	});


        //用animation实现小男孩动作变化的精灵动画
        function slowWalk(){
        	$boy.addClass('slowWalk');
        }
        
        //用transition实现小男孩的走路行为
        function stratRun(options,runTime){

            var dfdplay = $.Deferred();
        	//恢复走路
        	restoreWalk();
           //让坐标发生变化的方式有两种：（1）传统的修改left，top的值；（2）使用CSS3中的transform属性
           //我们使用CSS3中的transition来修改left的值，实现人物坐标变化，从而结合精灵动画就实现了人物走动
           $boy.transition(
           	options,
           	runTime,
           	'linear',
           	function(){
               dfdplay.resolve();                 //动画完成
           	});
         
         return dfdplay;

        }

        //暂停小男孩的走路
        function pauseWalk(){
           /*transition的暂停：一般都是程序开始就设定好的目标点，因此这个其实不需要控制，这个只是一个动画的过渡效果。
            *浏览器只提供了一个动画结束的回调。此处强制做了一个设置left的处理，实现暂停效果，但是存在一定问题：
            *下一次的启动必须等上一次的动画完成。
            */
               
        	// var left = $boy.css('left'); 
        	// $boy.css('left',left);    //强制的做了一个对目标left的修改，动画要运行10秒才结束，所以此时动画还没有结
        	//在此动态增加暂定的样式
        	$boy.addClass('pauseWalk');
        }

        //恢复小男孩的走路
        function restoreWalk(){
        	$boy.removeClass('pauseWalk');
        }

	 	//开始实现走路（动画加位置移动）
        function walkRun(time, dist, disY){

            time = time || 3000;

            //步行动作（动画）
            slowWalk();
             
            var options  = {
                left:dist + 'px',
                top:disY?disY:undefined
            };
            var dfd = stratRun(options, time);

            return dfd;
        }

        //计算移动距离
        function calculateDist(direction, proportion){

             return (direction == "x"? visualWidth:visualHeight)*proportion;
        }

        // 走进商店
        function walkToShop(time){
             
             var door = $('.door');

             // 门的坐标
             var offsetDoor = door.offset();
             var doorOffsetLeft = offsetDoor.left;

             // 小男孩的坐标
             var offsetBoy = $boy.offset();
             var boyOffsetLeft = offsetBoy.left;

             // 需要移动的坐标
             distanceX = (doorOffsetLeft + door.width()/2) - (boyOffsetLeft + $boy.width()/2);
             
             var defer = $.Deferred();
             // 开始进门
             var comIn = stratRun({
             	transform:'translateX(' + distanceX + 'px),scale(0.3,0.3)',
             	opacity:0.1
             },2000);

             // 进门完毕
             comIn.done(function(){
             	$boy.css({
             		opacity:0
             	});
             	defer.resolve();
             });

             return defer;
        }

        // 走出商店
        function walkOutShop(time){

            var defer = $.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay = stratRun({
                 transform: 'translateX(' + distanceX + 'px),scale(1,1)',
                 opacity: 1
                 }, time);
            //走路完毕
            walkPlay.done(function() {
            defer.resolve();
            });
           return defer;       
        }

        // 取花
        function takeOfFlower(){
             var defer = $.Deferred();
           
             // 增加延时效果,等待1秒后执行函数
             setTimeout(function(){

                  $boy.addClass("getFlower");
                  defer.resolve();

             }, 1000);
             
             return defer;
        }
        return {

        	//开始走路
        	walkTo:function(time, proportionX, proportionY){
                var distX = calculateDist('x', proportionX);
                var distY = calculateDist('y',proportionY);
                
                return walkRun(time,distX, distY);
        	},

        	//停止走路
        	stopWalk:function(){
        		pauseWalk();
        	},

        	//设置背景颜色
        	setColor:function(value){
                $boy.css('background-color',value);
        	},

        	// 走进商店的行为
        	comInShop:function(){
        	 	return  walkToShop.apply(null, arguments);
        	 },

        	// 走出商店
        	outOfShop:function(){
        	    return walkOutShop.apply(null, arguments);
            },

            // 取花
            takeFlowers:function(){
            	return takeOfFlower();
            },
             // 获取男孩的宽度信息
             getWidth:function(){
             	return $boy.width();
             },

             // 男孩的转身行为
             turnBack:function(callback){
                // 之前停止了步伐让动画设置为pause，会影响后面
             	restoreWalk();
                 $boy.addClass('boyTurnBack');
                 // 通过JQuery.on的方法监听一个动画结束事件，转身动画完成之后会调用该回调函数
                 if(callback){
                    $boy.on(animationEnd, function(){
                    	callback();
                    	$(this).off();
                    });
                 }
             },
             // 让男孩停止步伐并且之后不再走路，恢复到初始状态
             backToOriginal:function(){
             	this.stopWalk();
             	// 恢复原始图片
             	$boy.removeClass('slowWalk getFlower').addClass('boyOriginal');
             }
        }
}  

// 飘落的花瓣的处理
// 花瓣数量多，有渐变，旋转、轨迹运动、落地消失等变化
// 解决方法：
// 通过js动态随机生成花瓣节点
// 通过transition来实现渐变、旋转、轨迹活动和落地消失的动画
var flowerSlideURL=["images/snowflake1.png",
                     "images/snowflake2.png",
                     "images/snowflake3.png",
                     "images/snowflake4.png",
                     "images/snowflake5.png",
                     "images/snowflake6.png"];

// 实现花落
function flowersSlide(){
	var visualWidth = $('#content').width();
    var visualHeight = $('#content').height();
    var $flowersContainer = $('#flowerSlide');

    // 随机函数，从六张图中随机选择一张
    function getRandomImage(){
        return flowerSlideURL[[Math.floor(Math.random() * 6)]];
    }

    // 创建一个花瓣元素
    function createflowerDOM(){
        var url = getRandomImage();

        return $('<div class="flowerDom"/>').css({
                 'width':41 + 'px',
                 'height':41 + 'px',
                 'position':'absolute',
                 'bacground-size':'cover',
                 'z-Index':10000,
                 'top':'-41px',
                 'background-image':'url('+ url + ')'
        }).addClass('flowerRoll');
    }

    // 实现开始飘花,利用window下的间歇调用
    setInterval(function(){
        // 给花瓣制定随机运动轨迹
        var startPositionLeft = Math.random() * visualWidth - 100;
        var startOpacity = 1;
        var endPositionTop = visualHeight -40;
        var endPositionLeft = startPositionLeft - 100 + Math.random() * 500;
        var duration = visualHeight * 10 + Math.random() * 5000;

        // 产生随机透明度,但是不小于0.5
        var randomStartOpacity = Math.random();
        randomStartOpacity = randomStartOpacity < 0.5? startOpacity:randomStartOpacity;

        //动态创建一个花瓣
        var $flower = createflowerDOM();

        // 花瓣的初始位置
        $flower.css({
         	left:startPositionLeft,
         	opacity:randomStartOpacity
        });

        // 将该花瓣节点插入到父容器内部
        $flowersContainer.append($flower);

            // 执行渐变，落地消失的动画
            $flower.transition({
         	    left:endPositionLeft,
         		top:endPositionTop,
         		opacity:0.7
         	}, duration, 'ease-out', function(){
         	    // 动画执行完毕后删除节点，从而实现花瓣落地消失
         	    $(this).remove();
         	});
    }, 200);
}
