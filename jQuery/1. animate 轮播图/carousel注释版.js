/* 
 * 轮播图函数参数：
 * box      轮播容器  值："#id"
 * img      图片容器  值："#id"
 * left     左导航    值："#id"
 * right    右导航    值："#id"
 * selected 被选中小圆点要添加的类名  值："class"
 */
lunbo("#carousel","#images","#prev","#next","current");

function lunbo(box,img,left,right,selected){
  let imgNum = $(img).children().length;// 获得原始图片的个数
  let imgWidth = $($(img).children()[0]).outerWidth();// 获得单张图片宽度

  // 复制辅助图，为无缝滚动作准备
  // 复制最后一张图片到最前，此时复制的这张最后一张图片为 children()[0]，为首辅助图
  $(img).children().last().clone(true).prependTo(img);
  // 此时第一张图片为 children()[1]，复制第一张图片到最后，为尾辅助图
  $($(img).children()[1]).clone(true).appendTo(img);
  $(img).width(2+imgNum+"00%");// 设置图片容器的宽度为所有图片的宽度和
  $(img).css("left",-imgWidth+"px"); // 默认显示第一张图片

  // 根据原始图片的个数创建小圆点，此处使用 ol 和 li 生成
  // 此处将 ol 添加到轮播容器 box，dom 结构修改，并且修改 css 文件中相应的小园点样式
  let $ol = $("<ol></ol>").appendTo(box);
  for (let i=0; i<imgNum; i++) {
    $("<li></li>").html('<a href="javascript:;"></a>').appendTo($ol);
  }
  // index根据图片变化而改变，小圆点样式根据index改变，它是纽带，必须是全局变量
  let index = 0;
  // 默认选中第一个小园点
  $($ol.children()[0]).addClass(selected);

  // 轮播图动画
  $(document).ready(function (){
    // 下一张动画
    function toNext(){
      // 停止图片容器动画队列，立即完成当前的动画，防止切换页面和快速点击切换导致的混乱
      $(img).stop(true,true);
      // index初始值为0，代表小圆点的索引，取值应该在 0～(imgNum-1),
      // (index+1)代表原始图片的索引，取值应该在1～imgNum之间,
      // 想要显示第x张图片，图片容器的 left 变化为 -(index+1)*imgWidth,
      // 每次执行toNext，让index自增，即可显示下一张图片.
      index++;
      $(img).animate({left: -(index+1)*imgWidth+"px"},1500,"swing",
        function (){
          // jquery的animate中的function是在动画执行完毕后再执行，
          // 为了实现无缝滚动，允许动画过渡到尾辅助图，
          // 此时索引(index+1)>imgNum，即index>imgNum-1，
          // 这种情况下，瞬间将图片容器的left重置为原始的第一张图片 -imgWidth，
          // 同时，将索引(index+1)重置为 1，即 index=0。
          if(index > imgNum-1){
            $(img).css("left",-imgWidth+"px");
            index = 0;
          }
          // 动画执行完后调用小圆点改变样式函数，函数根据index值改变小圆点样式
          // 若写在动画外面，则小圆点会先看到变化，可根据需要调整
          dotSelected();
        }
      );
    }
    // 上一张动画
    function toPrev(){
      $(img).stop(true,true);
      // 每次执行toPrev，让index自减，即可显示上一张图片.其他原理同上
      index--;
      $(img).animate({left: -(index+1)*imgWidth+"px"},1500,"swing",
        function (){
          // 为了实现无缝滚动，允许动画过渡到首辅助图，
          // 此时索引(index+1)<1，即 index<0，
          // 这种情况下，瞬间将图片容器的left重置为原始的最后一张图片 -imgNum*imgWidth，
          // 同时，将索引(index+1)重置为 imgNum，即 index=imgNum-1。
          if(index<0){
            $(img).css("left",-imgNum*imgWidth+"px");
            index = imgNum-1;
          }
          dotSelected();
        }
      );
    }

    // 自动播放
    let autoPlay = setInterval(toNext,2500);
    // 鼠标进入，停止播放；鼠标移出，继续播放
    $(box).hover(
      function (){clearInterval(autoPlay);} ,
      function (){autoPlay = setInterval(toNext,2500);}
    );
    // 点击左右导航切换图片
    $(right).click(toNext);
    $(left).click(toPrev);
    // 小圆点跟随图片切换动画函数
    function dotSelected(){
      $ol.children().removeClass(selected);
      $($ol.children()[index]).addClass(selected);
    }
    // 小圆点切换图片函数
    function dotClick(){
      $ol.children().click(
        function (){
          // 将index赋值为触发点的索引值
          index = $(this).index();
          $(img).stop(true,true);
          // 图片容器添加动画，显示第(index+1)张图片
          // 之前提到过(index+1)为图片索引
          $(img).animate({left: -(index+1)*imgWidth+"px"},500,"swing");
          dotSelected();
          // 实际上这里可以直接调用toNext()函数，
          // 也可以像现在这样自定义动画，根据需要调整。
        }
      );
    }
    dotClick();
  });
}

//  索引解释：
//  如下图，原本共有 5 张图片，首位添加了两张辅助图，图片下方对应着 5 个小圆点
//    |-----|-----|-----|-----|-----|-----|-----|
//    |  5  |  1  |  2  |  3  |  4  |  5  |  1  |
//    |-----|-----|-----|-----|-----|-----|-----|
//             o     o     o     o     o
//  现在在图片容器中，各图片实际的索引值为：
//       0     1     2     3     4     5     6
//  小圆点的索引值 index 为：
//             0     1     2     3     4
//  我们需要进行图片切换时的那 5 张原始图片的索引值即 index+1 ：
//             1     2     3     4     5
//  jQuery本身可以通过index()方法获取索引值，
//  但此处，为了建立图片与小圆点的联系、方便操作，所以使用index和index+1。