// 完成整个动画的一个流程
window.onload =startAnimation;
function startAnimation(){
	var visualWidth = $('#content').width();
    var visualHeight = $('#content').height();
    var swipe = Swipe($("#content"));

    //小男孩动画处理
    var boy = BoyWalk();

    // 实现鸟飞
    var bird = {
        elem:$(".bird"),
        fly:function(){
        	this.elem.addClass("flying");
        	this.elem.transition({
        	 	right:visualWidth
        	}, 15000, 'linear');
        }
    };

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

    /************************************/
    // 背景音乐
    /************************************/
    // 音乐配置
    var audioConfig = {
        enable:true,
        playURL:'music/happy.wav',
        circleURL:'music/circulation.wav'
    };
    function HTML5Audio(url, isLoop){
        var audio = new Audio(url);
        // 是否自动播放
        audio.autoPlay = true;
        // 是否循环播放
        audio.loop = isLoop || false;
        audio.play();

        return {
           // 暴露一个end接口，绑定一个ended事件，当音乐播放完毕之后调用回调函数，实现多个音频的连续调用
           end:function(callback){
               audio.addEventListener('ended', function(){
                     callback();
               }, false);
           }
        };
    }

    /************************************/
    // 女孩的行为和数据处理
    /************************************/
    // 获取数据的函数
    var getValue = function(className){
        var $elem = $(''+className +'');
        return{
            height:$elem.height(),
            top:$elem.position().top
        };
    };

    // 获取桥的顶部值
    var bridgeY = function(){
        var data = getValue('.c_background_middle');
        return data.top;
    }();

    // 小女孩的位置修正
    var girl = {
            elem:$('.girl'),
            getHeight:function(){
            	return this.elem.height();
            },
             getWidth:function(){
             	return this.elem.width();
             },
            setOffset:function(){
            	this.elem.css({
            		left:visualWidth/2,
            		top: bridgeY - this.getHeight()
            	});
            },
             getOffset:function(){
             	return this.elem.offset();
             },
             // 小女孩转身动作
             turnBack:function(){
             	this.elem.addClass('girlTurnBack');
             }
    };

                       		
    // 修正小女孩的位置
    girl.setOffset();

    //页面滚动到指定位置
	function scrollTo(time, proportionX){
               
        var distX = $("#content").width() * proportionX;
        swipe.scrollTo(distX, time);
	}

    /*******************************/
    // 整个动画实现的全部流程
    /*******************************/ 
	//实现太阳公转
    $("#sun").addClass('rotation');
    //实现天空的浮云飘动
    $(".cloud:first").addClass('cloud1Anim');
    $(".cloud:last").addClass('cloud2Anim');
    var audio = HTML5Audio(audioConfig.playURL);
    audio.end(function(){
        HTML5Audio(audioConfig.circleURL, true);
    });
    // 男孩第一次开始走动
    boy.walkTo(2000, 0.5)
       .then(function(){
            // 男孩走到可视区域的20%时页面滚动
            scrollTo(4000, 1);
            // 鸟飞
            bird.fly();
        }).then(function(){
            // 男孩第二次走动
            return boy.walkTo(4000, 0.5);
        }).then(function(){

            // 暂停走路
            boy.stopWalk();
        }).then(function(){
            // 开门
            return openDoor();
        }).then(function(){
            // 开灯
            lamp.bright();
        }).then(function(){
            // 走进商店
            return boy.comInShop(2000);
        }).then(function(){
            // 取花
            return boy.takeFlowers();
        }).then(function(){
            // 出商店
            return boy.outOfShop(2000);
        }).then(function(){
            // 关门
            return closeDoor();
        }).then(function(){
            // 关灯
            lamp.dark();
        }).then(function(){
            // 页面滚动到第三个页面
            scrollTo(4000, 2);
        }).then(function(){
            // 男孩走到第三个页面的时候的处理
            return boy.walkTo(4000, 0.15);
        }).then(function(){ 
            // 第二次走路到桥上，此时最终的top和女孩的top一样,但是要换算成比例
            return boy.walkTo(4000, 0.25, (bridgeY - girl.getHeight())/visualHeight); 
        }).then(function(){
            // 第三次在桥上直行靠近女孩
            var proportionX = (girl.getOffset().left - boy.getWidth() - girl.getWidth()/5 )/visualWidth;
            return boy.walkTo(4000, proportionX);
        }).then(function(){
            // 停止男孩的步伐并且恢复男孩的原始状态
            boy.backToOriginal();
        }).then(function(){
            // 给男孩女孩添加转身动作,并通过定时器模拟一个暂停的时间，让人感觉有一个等待转身的效果
            setTimeout(function(){
                girl.turnBack();
                boy.turnBack(
                    // 落花
                 	flowersSlide()
                );
            }, 1000);
                 		
        });
}