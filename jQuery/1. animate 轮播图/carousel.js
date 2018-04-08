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
  let imgNum = $(img).children().length;
  let imgWidth = $($(img).children()[0]).outerWidth();
  $(img).children().last().clone(true).prependTo(img);
  $($(img).children()[1]).clone(true).appendTo(img);
  $(img).width(2+imgNum+"00%");
  $(img).css("left",-imgWidth+"px");
  
  let $ol = $("<ol></ol>").appendTo(box);
  for (let i=0; i<imgNum; i++) {
    $("<li></li>").html('<a href="javascript:;"></a>').appendTo($ol);
  }
  let index = 0; 
  $($ol.children()[0]).addClass(selected);

  $(document).ready(function (){
    function toNext(){
      $(img).stop(true,true);
      index++;
      $(img).animate({left: -(index+1)*imgWidth+"px"},1500,"swing",
        function (){
          if(index > imgNum-1){
            $(img).css("left",-imgWidth+"px");
            index = 0;
          }
          dotSelected();
        }
      );
    }
    function toPrev(){
      $(img).stop(true,true);
      index--;
      $(img).animate({left: -(index+1)*imgWidth+"px"},1500,"swing",
        function (){
          if(index<0){
            $(img).css("left",-imgNum*imgWidth+"px");
            index = imgNum-1;
          }
          dotSelected();
        }
      );
    }

    let autoPlay = setInterval(toNext,2500);
    $(box).hover(
      function (){clearInterval(autoPlay);} ,
      function (){autoPlay = setInterval(toNext,2500);}
    );
    $(right).click(toNext);
    $(left).click(toPrev);
    function dotSelected(){
      $ol.children().removeClass(selected);
      $($ol.children()[index]).addClass(selected);
    }
    function dotClick(){
      $ol.children().click(
        function (){
          index = $(this).index();
          $(img).stop(true,true);
          $(img).animate({left: -(index+1)*imgWidth+"px"},500,"swing");
          dotSelected();
        }
      );
    }
    dotClick();
  });
}