/* 
 * 轮播图函数参数：
 * box      轮播容器  值："#id"
 * img      图片容器  值："#id"
 * left     左导航    值："#id"
 * right    右导航    值："#id"
 * selected 被选中小圆点要添加的类名  值："class"
 */
lunbo("carousel","images","dots","prev","next","current");


function lunbo(box,img,dot,left,right,selected){
  /* 
  * 在图片列表尾部之后克隆第一张图；
  * 首部之前克隆最后一张图，实现无缝滚动。
  * 根据图片个数动态生成导航小圆点。
  */
  let carousel = document.getElementById(box);// 获取轮播图容器
  let images = document.getElementById(img);// 获取 ul
  let ulLis = images.children;// 获得所有 li 的集合
  let ulLiLength = ulLis.length;// 获得 li 的个数
  let ulLiWidth = ulLis[0].offsetWidth;// 获得单个 li 的宽度

  // 动态生成 ul 的宽度，有 a 张图片就改为 (a+2)*100%，为了无缝滚动
  // style.width 中应输入字符串，所以代码如下：
  images.style.width = (ulLiLength+2)+"00%";

  // 克隆第一张图，放到在图片列表尾部之后
  images.appendChild(images.children[0].cloneNode(true));
  // 克隆最后一张图，放到在图片列表首部之前
  images.insertBefore(images.children[ulLiLength-1].cloneNode(true),  images.children[0]);

  // 根据 li 的个数创建小圆点，此处使用 ol 和 li 生成
  let ol = document.createElement("ol");
  // 此处将 ol 添加到轮播容器 carousel，可根据实际的 dom 结构修改，并且修改 css 文  件中相应的 ol与li 样式
  ol.setAttribute("id",dot);
  carousel.appendChild(ol);
  for (let i=0; i<ulLiLength; i++) {
    let li = document.createElement("li");
    li.innerHTML = '<a href="javascript:;"></a>';
    ol.appendChild(li);
  }


  /* 
   * 轮播动画
   * 鼠标离开图片，定时轮播图片；鼠标在图片上时暂停
   * 左右两侧可点击轮播图片
   */
  let prev = document.getElementById(left);
  let next = document.getElementById(right);
  let dots = document.getElementById(dot);
  let olLis = dots.children;
  let olLiLength = olLis.length;
  let index = 0;// 设置索引，为设置与图片对应的小圆点样式作准备

  // 左右导航添加动作
  next.onclick = function () {
    next_pic();
  }
  prev.onclick = function () {
    prev_pic();
  }
  function next_pic(){
    let newLeft;
    if(images.offsetLeft === -(ulLiLength+1)*ulLiWidth){
        newLeft = -2*ulLiWidth;
    }else{
        newLeft = images.offsetLeft - ulLiWidth;
    }
    images.style.left = newLeft + "px";
    index++;// 执行下一张函数一次，index 加 1
    if(index > ulLiLength-1){// index 大于最后一张图片索引时，
      index = 0;// index 归 0
    }
    currentDot();// 执行当前小圆点函数
  }
  function prev_pic(){
  let newLeft;
  if(images.offsetLeft === 0){
      newLeft = -(ulLiLength-1)*ulLiWidth;
  }else{
    newLeft = images.offsetLeft + ulLiWidth;
  }
  images.style.left = newLeft + "px";
  index--;// 执行上一张函数一次，index 减 1
  if(index < 0){// index 小于第一张图片索引时，
      index = ulLiLength-1;// index 设置为最后一张图片索引
  }
  currentDot();// 执行当前小圆点函数
  }

  // 定时播放
  let timer = null;
  function autoPlay () {
  timer = setInterval(function (){
    next_pic();// 定时执行next_pic()，实现播放效果
  },2000);
  }
  autoPlay();

  // 鼠标移入，停止播放
  carousel.onmouseover = function (){
  clearInterval(timer);
  }
  // 鼠标移出，自动播放
  carousel.onmouseout = function (){
  autoPlay();
  }

  // 设置小圆点跟随图片变化
  // 默认第一张图对应的小圆点被选中
  olLis[0].className = selected;
  function currentDot(){
    for(let i=0; i<olLiLength; i++){// 先清除所有点的类名
      olLis[i].className = "";
    }
    olLis[index].className = selected;// 根据index变化改变选中的点
  }

  // 点击小圆点，跳到对应图片
  // 若用var定义i，请将循环中的函数写成立即执行函数
  for(let i=0; i<olLiLength; i++){
    function jump(i){
      olLis[i].onclick = function (){
        //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
        let a = index - i;
        if(index===olLiLength-1 && images.offsetLeft!==-5*ulLiWidth){
          a = a - 5;
        }
        if(index===0 && images.offsetLeft!==-ulLiWidth){
          a = 5 + a;
        }
        images.style.left = images.offsetLeft + a*ulLiWidth + "px";
        index = i;
        currentDot();
      }
    }
    jump(i);
  }
}