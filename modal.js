var template='<div class="m-modal">\
      <div class="modal_aIgn"></div>\
      <div class="modal_wrap">\
        <div class="bk"></div>\
        <div class="modal_body">\
          <h3>登录网易云课堂</h3>\
          <div class="form1">\
            <input id="username" value="账号">\
          </div>\
          <div class="form2">\
            <input id="password" value="密码">\
          </div>\
          <button class="submit">登录</button>\
        </div>\
      </div>\
    </div>'
function $(id){
  return document.getElementById(id);
}
function setCookie (key, value, t) { 
    var oDate = new Date();//获取当前时间
    oDate.setDate( oDate.getDate() + t);//getdate为获取日期，set为设置日期，超出的时间会自动转成月份和年（即在当前时间加上100年）
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();//转换成格林威治时间,expirse为文档的失效时间
}

function getCookie (key) { 
    var arr1 = document.cookie.split('; ');//以分号分隔把字符串分解成数组
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if(arr2[0] === key ){
            return decodeURI(arr2[1]);//把url中带%20之类的换成其对应的符号
        }
    }
}
function removeCookie (key) {  //  删除cookie
  setCookie(key,'',-1); 
}
function popup(){ //隐藏通知栏，并设置cookie
  var Popup1=$('j-wrap');
  var Popup2=$('m-top');
  var Butt=Popup1.getElementsByTagName('p')[1];
  if (getCookie('off')) {
    Popup.style.display='none';
  }
  else{
    Butt.addEventListener('click',function(){
      Popup2.style.display='none';
      setCookie('off',true,36500);  
    })
  }
}
popup();
function seriaIze (data) {  // 设置参数
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
 
function get(url,options,callback){  //get方法
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert("request failed : " + xhr.status);
            }
        }
    };
    xhr.open("get",url + "?" + seriaIze(options),true);
    xhr.send(null);
}

function login(){
  var oAttention=$("j-input");
  var oCancel=$("ocancel");
  var log=$("login");
  var oInput=log.getElementsByTagName('input');
  var oButton=$("submit");
  document.querySelector('.bk').onclick=function(){
    log.style.display='none';
  }
  if( !getCookie ('loginSuc') ){   //判断登录的 cookie 是否已设置
    oAttention.onclick=function(){
      log.style.display='block';
    }
  }else{
    oAttention.value = '以关注';
    oAttention.disabled = false;
    oAttention.className = 'active f-fl';
    oCancel.style.display = 'block';
  }
  oButton.onclick = function(){   //点击登录
    var userName1 = hex_md5(oInput[0].value);
    var password1 = hex_md5(oInput[1].value);
    get('https://study.163.com/webDev/login.htm',{userName:userName1,password:password1},function(a){ 
      if( a === '1' ){
        log.style.display = 'none';
        setCookie ('loginSuc', '1', 36500);
        get('https://study.163.com/webDev/attention.htm','', function(b){
          if( b === '1' ){
            setCookie ('followSuc', '1', 36500);
            oAttention.value = '以关注';
            oAttention.disabled = true;
            oAttention.className = 'act';
            oCancel.style.display = 'inline';
          }
          
        })
        
      }else{
        alert( '帐号密码错误，请重新输入')
      }
     });
  };
  oCancel.onclick = function(){  //取消关注
    setCookie('followSuc','',-1);
    setCookie('loginSuc','',-1);
    oAttention.value = '关注';
    oAttention.disabled = false;
    oAttention.className = 'attention';
    this.style.display = 'none';
  };
}
login();

function slide(){   
    var oBanner = $('slide');
    var oLink = oBanner.getElementsByTagName('a')[0];
    var oImg = oBanner.getElementsByTagName('img')[0];
    var oDiv = oBanner.getElementsByTagName('div')[0];
  var aI = oBanner.getElementsByTagName('i');
    var data = [
        { link: 'http://open.163.com/' , src : 'images/banner1.jpg' },
        { link: 'http://study.163.com/' , src : 'images/banner2.jpg' },
        { link: 'http://www.icourse163.org/' , src : 'images/banner3.jpg' }
    ];
  
  
    for (var i = 0; i < data.length; i++) { 
        var oI = document.createElement('i');
        var aNum = document.createTextNode(i+1);
    var num = 0;
        oLink.href = data[0].link;
        oImg.src = data[0].src;
    aI[0].className = 'current';
    
    aI[i].index = i;
    aI[i].onclick =function(){   
      num = this.index;
      slideshow(this.index);
    };
  }
  
  function slideshow(index){ 
    oImg.style.opacity = 0;//opacity为透明度
    oImg.style.transition = ''; 
    for (var i = 0; i < aI.length; i++) {
        aI[i].className = '';
      }
    oLink.href = data[index].link;
    oImg.src = data[index].src;
    aI[index].className = 'current';
    setTimeout( function  () {
      oImg.style.transition = '0.5s';
      oImg.style.opacity = 1;
    },30);//过三十毫秒执行
  }
  function autoplay(){   
        timer = setInterval(
            function(){
                num = (num+1)%aI.length;
                slideshow(num);
            },5000);
    }
  oBanner.onmouseover = function(){ 
        clearInterval(timer);
    };
    oBanner.onmouseout = function(){  
        autoplay();
    };
    autoplay();
}
slide();

function tab(){ 
  var aTabhd = document.getElementsByClassName('tab');
  var aTabbtn = document.getElementsByClassName('btn');
  var aContent = document.getElementsByClassName('g-content');
  var aDesign = document.getElementsByClassName('design');
  var aLanguage = document.getElementsByClassName('language');
  
  
  function setData(num,element){
    
  get('https://study.163.com/webDev/couresByCategory.htm',{pageNo:1,psize:20,type:num},function(data){  
    var data = JSON.parse(data)
    for( var i=0; i<data.list.length; i++){
      var oTeam = document.createElement('div');
      oTeam.className = 'm-team'
      element.appendChild(oTeam);
      var oImg = document.createElement('img');
      var oP = document.createElement('p');
      var oDiv = document.createElement('div');
      var oSpan = document.createElement('span');
      var oStrong = document.createElement('strong');
      var oA = document.createElement('a');
      oImg.src = data.list[i].middlePhotoUrl;
      oP.className = 'coursename f-toe';
      oP.innerHTML = data.list[i].name;
      oDiv.className = 'provider';
      oDiv.innerHTML = data.list[i].provider;
      oSpan.innerHTML = data.list[i].learnerCount;
      if(!data.list[i].categoryName){
          data.list[i].categoryName = '无';
      }
  
      oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h3>' + data.list[i].name + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者:' + data.list[i].provider + '</br>分类' + data.list[i].categoryName + '</p><p class="description">' +  data.list[i].description + '</p>';
      if( data.list[i].price == 0){
        oStrong.innerHTML = '免费';
      }else{
      oStrong.innerHTML = '￥' + data.list[i].price;
      }
      oTeam.appendChild(oImg);
      oTeam.appendChild(oP);
      oTeam.appendChild(oDiv);
      oTeam.appendChild(oSpan);
      oTeam.appendChild(oStrong);
      oTeam.appendChild(oA);
      
    }
  });
  }
  setData(10,aDesign[0]);
  setData(20,aLanguage[0]);
  
  aTabbtn[0].onclick = function(){
    aDesign[0].style.display = 'block';
    this.className = 'btn button1 active';
    aLanguage[0].style.display = 'none';
    aTabbtn[1].className = 'btn button2';
    
  };
  aTabbtn[1].onclick = function(){
    aDesign[0].style.display = 'none';
    aTabbtn[0].className = 'btn button1 ';
    aLanguage[0].style.display = 'block';
    this.className = 'btn button2 active';
  };
}
tab();

function playvideo(){
   var oList = $('im2');
   var oClose = $('close');
   var oPopupvideo = document.getElementsByClassName('popupvideo');
   oList.onclick = function(){
     oPopupvideo[0].style.display = 'block';
   };
   oClose.onclick=function(){
     oPopupvideo[0].style.display = 'none';
   };
 }
playvideo();

function setList(){ 
  var oListwrap = document.getElementsByClassName('m-wrap2');
  get('https://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
    var arr = JSON.parse(data);
    for( var i=0; i<20; i++){
      var oA = document.createElement('a');
      oA.innerHTML = '<div><img src="' + arr[i].smallPhotoUrl + '" /></div><p>' + arr[i].name + '</p><span>' + arr[i].learnerCount + '</span>';
      oListwrap[0].appendChild(oA); 
    }
  });
}
setList();
function getStyle (obj,attr) {  //鑾峰彇鏍峰紡
        if( obj.currentStyle ){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj)[attr];
        }
    }
function change(){
  var oListwrap = document.getElementsByClassName('m-wrap2');
  var oListbox = document.getElementsByClassName('m-list');
  var timer;
    function autoplay(){
    timer = setInterval(function(){
      if( oListwrap[0].style.top == '-700px'){
        oListwrap[0].style.top = 0;
      }
      else{
        oListwrap[0].style.top = parseFloat(getStyle(oListwrap[0],'top')) - 70 + 'px';
        }
    },5000);
    }
    autoplay();
  oListbox[0].onmouseover = function(){
    clearInterval( timer );
    };
  oListbox[0].onmouseout = function(){
    autoplay();
    };
}
change();