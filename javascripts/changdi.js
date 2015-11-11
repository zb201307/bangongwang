//查找指定父元素
var lastNewsId=0;    //当前读取的开始文章id

function parents(obj,oParent){
    var typeObj=typeof oParent;
    if(typeObj=="string"){
        if(obj.parentNode.tagName==oParent){
            return obj.parentNode;
        }else{
            return parents(obj.parentNode,oParent);
        }
    }
}
//设置css3
function styleCss3(obj,n,v){
    obj.style["Webkit"+upper(n)]=v;
    obj.style["moz"+upper(n)]=v;
    obj.style["ms"+upper(n)]=v;
    obj.style["o"+upper(n)]=v;
    obj.style[n]=v;
}
//查找当前元素索引
function index(obj){
    var prObj=obj.parentNode;
    for(var i= 0,m=prObj.children.length;i<m;i++){
        if(obj==prObj.children[i]){
            return i;
        }
    }
}
//首字母大写
function upper(s){
    return s.replace(/(^|\s+)\w/g,function(s){
        return s.toUpperCase();
    });
}
//相邻下一个元素
function next(obj){
    if(obj.nextSibling){
        if(obj.nextSibling.nodeType==1){
            return obj.nextSibling;
        }else{
            return next(obj.nextSibling);
        }
    }else{
        return null;
    }
}
//相邻上一个元素
function prev(obj){
    if(obj.previousSibling){
        if(obj.previousSibling.nodeType==1){
            return obj.previousSibling;
        }else{
            return prev(obj.previousSibling);
        }
    }else{
        return null;
    }
}
function addClass(obj,attr){
    var re=new RegExp('\\b'+attr+'\\b');
    if(!obj.className||!re.test(obj.className))
    {
        obj.className+=obj.className?' '+attr:attr;
    }
}
function removeClass(obj,attr){
    var re=new RegExp('\\b'+attr+'\\b','g');
    if(obj.className){
        if(re.test(obj.className))
        {
            obj.className=((obj.className.replace(re,'')).replace(/\s+/g,' ')).replace(/^\s+|\s+$/g,'');
        }
        if(!obj.className)
        {
            obj.removeAttribute('class');
        }
    }
}
//查找当前元素索引
function index(obj){
    var prObj=obj.parentNode;
    for(var i= 0,m=prObj.children.length;i<m;i++){
        if(obj==prObj.children[i]){
            return i;
        }
    }
}
/**
 * 幻灯片
 * id:标签id
 * **/

function focus(id){
    var w=window.screen.width,
        oF=document.querySelector(id),
        oUl=document.querySelector('ul.c'),
        oUl2=document.querySelector('ul.d'),
        aLi=oUl.querySelectorAll('li'),
        len=aLi.length,
        cur= 1,
        downX= 0,
        disX= 0,
        temp= 0,
        x=-cur* w,
        ident=null,
        timer=null,
        bReady=true;
    oUl.innerHTML='<li>'+aLi[len-1].innerHTML+'</li>'+oUl.innerHTML+'<li>'+aLi[0].innerHTML+'</li>';
    aLi=oUl.children;
    len=aLi.length;
    oUl.style.width=len*w+'px';
    styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
    for(var i= 0;i<len;i++){
        aLi[i].style.width=w+'px';
    }
    timer=setInterval(interval,3000);
    function start(ev){
        if(parents(ev.target,'DIV').id=id){
            if(bReady==false) return;
            bReady=false;
            clearTimeout(timer);
            ev.preventDefault();
            styleCss3(oUl,"transition","none");
            downX=ev.targetTouches[0].pageX;
            disX=downX-x;
            ident=ev.targetTouches[0].identifier;
            document.addEventListener('touchmove',move,false);
            document.addEventListener('touchend',end,false);
        }else{
            document.removeEventListener('touchmove',move,false);
            document.removeEventListener('touchend',end,false);
        }
    }
    function move(ev){
        if(ev.targetTouches[0].identifier==ident){
            x=ev.targetTouches[0].pageX-disX;
            styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
        }
    }
    function end(ev){
        if(ev.changedTouches[0].identifier==ident){
            document.removeEventListener('touchmove',move,false);
            document.removeEventListener('touchend',end,false);
            var upX=ev.changedTouches[0].pageX;
            temp=cur-1;
            if(Math.abs(upX-downX)>20){
                if(downX>upX){
                    cur++;
                }else{
                    cur--;
                }
            }
            x=-cur*w;
            styleCss3(oUl,"transition",".4s all ease");
            styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
            oUl.addEventListener('transitionend',mend,false);
            timer=setInterval(interval,3000);
        }
    }
    function mend(){
        styleCss3(oUl,"transition","none");
        if(cur==0){
            cur=len-2;
            x=-cur*w;
            styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
        }else if(cur==len-1){
            cur=1;
            x=-cur*w;
            styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
        }
        removeClass(oUl2.children[temp],'active');
        addClass(oUl2.children[cur-1],'active');
        bReady=true;
    }
    function interval(){
        if(bReady==true){
            bReady=false;
            temp=cur-1;
            cur++;
            x=-cur*w;
            styleCss3(oUl,"transition",".4s all ease");
            styleCss3(oUl,'transform','translate3d('+x+'px,0,0)');
            oUl.addEventListener('transitionend',mend,false);
        }
    }
    document.addEventListener('touchstart',start,false);
}
/**
 * 获取幻灯片数据
 * **/
function getFocusData(id,url,callback){
    ajax({
        url:url,
        type:"post",
        data:{},
        fnSucc:function(data){
            callback&&callback(id,data);
        }
    });
}

/**
 * 生成幻灯片DOM（i）
 * id:需要添加的元素id
 * data:需要填充的数据对象
 * **/
function setFocusHtml(id,data){
    var obj=document.querySelector(id),
        oCul=obj.querySelector('ul.c'),
        oDul=obj.querySelector('ul.d'),
        data=data["result"],
        html='',
        sHtml='';
    for(var i= 0,m=data.length;i<m;i++){
        html+='<li>';
        html+=  '<a href="'+data[i]["url"]+'"><img src="'+data[i]["pic"]+'"></a>';
        html+='</li>';
        if(i==0){
            sHtml+='<li class="active"></li>';
        }else{
            sHtml+='<li></li>';
        }
    }
    oCul.innerHTML=html;
    oDul.innerHTML=sHtml;
    focus(id);
}
/**
 * 生成幻灯片DOM（c）
 * id:需要添加的元素id
 * data:需要填充的数据对象
 * **/
function setFragHtml(data,id,domId){
    var newData=data["result"][id]["data"],
        obj=document.querySelector(domId),
        oCul=obj.querySelector('.c'),
        oDul=obj.querySelector('.d'),
        html='',sHtml='';
    for(var i= 0,m=newData.length;i<m;i++){
        html+='<li>';
        html+=  '<a href="'+newData[i]["url"]+'"><img src="'+newData[i]["thumb"]+'"></a>';
        html+=  '<p><a href="'+newData[i]["url"]+'">'+newData[i]["title"]+'</a></p>';
        html+='</li>';
        if(i==0){
            sHtml+='<li class="active"></li>';
        }else{
            sHtml+='<li></li>';
        }
    }
    oCul.innerHTML=html;
    oDul.innerHTML=sHtml;
    focus(domId);
}

/**
 * 将时间字符串转成时间戳2014-05-08 00:22:11
 * **/
function get_unix_time(dateStr){
    var newstr = dateStr.replace(/-/g,'/');
    var date =  new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str;
}
//jsonp
/**
 * jsonp
 * url:请求地址
 * data:json对象，包含需要传的字段
 * callback:回调名称，为空的时候会自动生成一个随机的
 * success:请求成功执行方法
 * error:请求错误执行方法
 * **/
function jsonp(json){
    var str='haiwai_jsonp_'+Math.random()+new Date().getTime(),
        data=json.data||{},
        arr=[];
    str=str.replace('.','');
    str=json.callback?json.callback:str;
    var callbackName=json.callback?json.callback:'callback';
    data[callbackName]=str;
    for(var i in data)
    {
        arr.push(i+'='+encodeURIComponent(data[i]));
    };
    json.url=json.url+'&'+arr.join('&');
    window[str]=function(backJson)  //回调函数必须是全局
    {
        oHead.removeChild(oS);
        window[str]=null;
        clearTimeout(timer);
        json.success&&json.success(backJson);
    };
    var oS=document.createElement('script');
    oS.src=json.url;
    var oHead=document.getElementsByTagName('head')[0];
    oHead.appendChild(oS);
    if(json.timeout)
    {
        var timer=setTimeout(function(){

            window[str]=null;
            oHead.removeChild(oS);
            json.error&&json.error(0);

        },json.timeout);
    };
};

/**
 * ajax封装方法
 **/
function ajax(json){
    var oAjax=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
    json.t=Math.random();
    var arr=[];
    for(var i in json.data)
    {
        arr.push(i+'='+encodeURIComponent(json.data[i]));
    }
    var str=arr.join('&');
    if(json.type=='get')
    {
        oAjax.open('get',json.url+'?'+str,true);
        oAjax.send();
    }
    else if(json.type=='post')
    {
        oAjax.open('post',json.url,true);
        oAjax.setRequestHeader('Accept','application/json, text/javascript, */*; q=0.01');
        oAjax.setRequestHeader('content-type','application/x-www-form-urlencoded');
        oAjax.send(str);
    }
    oAjax.onreadystatechange=function()
    {
        if(oAjax.readyState==4)
        {
            if(oAjax.status>=200&&oAjax.status<=300||oAjax.status==304)
            {
                json.fnSucc&&json.fnSucc(JSON.parse(oAjax.responseText));
            }
        }
        else
        {
            json.fnFaild&&json.fnFaild();
        }
    }
}

/**
 * 获取房屋列表
 * **/
function getHousList(id,url,callback,data){
    var data=data?data:{};
    ajax({
        url:url,
        type:"post",
        data:data,
        fnSucc:function(json){
            callback&&callback(id,json);
        }
    });
}
/**
 * 生成html--list
 * **/
function setHousList(id,data){
    var obj=document.querySelector(id),
        data=data["data"];
    console.log(data);
    if(data){
        for(var i= 0,m=data.length;i<m;i++){
            var oLi=document.createElement('li');
            var html='';
            html+='<a href="details.html/#'+data[i]["housingId"]+'-'+data[i]["sHousingId"]+'"><img src="'+data[i]["pic"]+'"></a>';
            html+='<h3><a href="details.html#'+data[i]["housingId"]+'-'+data[i]["sHousingId"]+'">'+data[i]["sBusinessName"]+data[i]["sProjectName"]+'</a></h3>';
            html+='<p class="l"><a href="details.html/#'+data[i]["housingId"]+'-'+data[i]["sHousingId"]+'">';
            html+=  '<span>'+data[i]["sConstructionArea"]+'㎡</span>|';
            html+=  '<span>'+data[i]["sAdministrativeRegion"]+'</span>|';
            html+=  '<span>'+data[i]["region"]+'</span>|';
            html+=  '<span class="m">'+data[i]["sRent"]+'</span>元/㎡/'+data[i]["unit"]+'</span>';
            html+='</a></p>';
            oLi.innerHTML=html;
            obj.appendChild(oLi);
        }
    }else{
        alert('暂时没有内容');
    }

}
/**
 * 生成收藏数据
 * **/
function setHousCollList(id,data){
    var obj=document.querySelector(id),
        data=data["result"];
    for(var i= 0,m=data.length;i<m;i++){
        var oLi=document.createElement('li');
        var html='';
        html+='<a href="javascript:;"><img src="'+data[i]["pic"]+'"></a>';
        html+='<h3><a href="'+data[i]["url"]+'">'+data[i]["title"]+'</a></h3>';

        html+='<p class="l"><a href="'+data[i]["url"]+'">';
        html+=  '<span>'+data[i]["ratio"]+'㎡</span>|';
        html+=  '<span>'+data[i]["fixtrue"]+'</span>|';
        html+=  '<span>'+data[i]["region"]+'</span>|';
        html+=  '<span class="m">'+data[i]["price"]+'</span>元/㎡/'+data[i]["unit"]+'</span>';
        html+='</a></p>';
        html+='<div class="y"><a href="javascript:;" data-id="">删除</a><a href="javascript:;" class="a" data-id="">预约</a></div>';
        oLi.innerHTML=html;
        obj.appendChild(oLi);
    }
    function start(ev){
        if(ev.target.nodeName=='A'){
            var i=index(ev.target);
            switch (i){
                case 0:
                    //删除
                    var oLi=parents(ev.target,'LI');
                    obj.removeChild(oLi);
                    break;
                case 1:
                    break;
            }
        }
    }
    obj.addEventListener('touchstart',start,false);
}
/**
 * 管理房源数据
 * **/
function setHousAdminList(id,data){
    var obj=document.querySelector(id),
        data=data["result"];
    for(var i= 0,m=data.length;i<m;i++){
        var oLi=document.createElement('li');
        var html='';
        html+='<a href="javascript:;"><img src="'+data[i]["pic"]+'"></a>';
        html+='<h3><a href="'+data[i]["url"]+'">'+data[i]["title"]+'</a></h3>';

        html+='<p class="l"><a href="'+data[i]["url"]+'">';
        html+=  '<span>'+data[i]["ratio"]+'㎡</span>|';
        html+=  '<span>'+data[i]["fixtrue"]+'</span>|';
        html+=  '<span>'+data[i]["region"]+'</span>|';
        html+=  '<span class="m">'+data[i]["price"]+'</span>元/㎡/'+data[i]["unit"]+'</span>';
        html+='</a></p>';
        html+='<div class="g"><a href="javascript:;" data-id="">上架</a><a href="javascript:;" data-id="">下架</a><a href="javascript:;" data-id="">编辑</a><a href="javascript:;" data-id="">删除</a></div>';
        oLi.innerHTML=html;
        obj.appendChild(oLi);
    }
    function start(ev){
        if(ev.target.nodeName=='A'){
            var i=index(ev.target);
            switch (i){
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    //删除
                    var oLi=parents(ev.target,'LI');
                    obj.removeChild(oLi);
                    break;
            }
        }
    }
    obj.addEventListener('touchstart',start,false);
}
/**
 * 生成预约清单
 * **/
function setHousAppointmentList(id,data){
    var obj=document.querySelector(id),
        data=data["result"];
    for(var i= 0,m=data.length;i<m;i++){
        var oLi=document.createElement('li');
        var html='';
        html+='<h3><a href="javascript:;" class="t"><img src="'+data[i]["headurl"]+'"></a><a href="javascript:;">'+data[i]["identity"]+'：'+data[i]["name"]+'</a><a href="javascript:;" data-l="'+data[i]["mail"]+'" class="m"></a><a href="javascript:;" data-l="'+data[i]["tel"]+'" class="tel"></a></h3>';
        html+='<div class="c">';
        html+=  '<a href="javascript:;"><img src="'+data[i]["hous"]["pic"]+'"></a>';
        html+=  '<div class="r">';
        html+=      '<h4>'+data[i]["hous"]["title"]+'</h4>';
        html+=      '<p><span>'+data[i]["hous"]["architectureRatio"]+'㎡</span>｜<span>'+data[i]["hous"]["dec"]+'</span>｜<span>'+data[i]["hous"]["dis"]+'</span>｜<span>'+data[i]["hous"]["address"]+'</span></p>';
        html+=      '<p><i>'+data[i]["hous"]["price"]+'</i>元/间/'+data[i]["hous"]["unit"]+'</p>';
        html+=      '</div>';
        html+=  '</div>';
        if(data[i]["sure"]=='0'){
            html+='<div class="b"><span>经济人未确认</span></div>';
        }else{
            html+='<div class="b"><span class="d">经济人未确认</span></div>';
        }
        oLi.innerHTML=html;
        obj.appendChild(oLi);
    }
    function start(ev){
        if(ev.target.nodeName=='A'){
            var i=index(ev.target);
            switch (i){
                case 0:
                    //删除
                    var oLi=parents(ev.target,'LI');
                    obj.removeChild(oLi);
                    break;
                case 1:
                    break;
            }
        }
    }
    obj.addEventListener('touchstart',start,false);
}
/**
 * 生成html-details
 * **/
function setDetails(id,data){
    var data=data["data"];
    console.log(data);
    var obj=document.querySelector(id);
    var oDiv=document.createElement('div');
    var html='';
    var sFloor=data['sFloor'].split("-");
    var sType=data['sServiceType'].split('-');
    html+='<div class="details2">';
    html+=  '<h1>'+data["sProjectName"]+data["sNameOffice"]+data["sBusinessName"]+'</h1>';
    html+=  '<div class="pro">';
    //for(var i= 0,m=data["label"].length;i<m;i++){
    //    html+='<span>'+data["label"][i]+'</span>';
    //}
    html+=  '</div>';
    html+=  '<div class="det">';
    html+=      '<h3><span>房源信息</span></h3>';
    html+=      '<div class="m">';
    html+=          '<div>';
    html+=              '<ul>';
    html+=                  '<li>日&ensp;租&ensp;金：'+data["sRent"]+'元/㎡/'+data["housingInformation"]+'</li>';
    html+=                  '<li>务&ensp;业&ensp;费：'+data["sPropertyManageFee"]+'元/㎡/月</li>';
    html+=                  '<li>建筑面积：'+data["sConstructionArea"]+'㎡</li>';
    html+=                  '<li>使用面积：'+data["housingInformation"]+'㎡</li>';
    html+=              '</ul>';
    html+=          '</div>';
    html+=          '<div>';
    html+=              '<ul>';
    html+=                  '<li>楼层：'+sFloor[1]+'层</li>';
    html+=                  '<li>层高：'+sFloor[0]+'层</li>';
    html+=                  '<li>朝向：'+data["housingInformation"]+'</li>';
    html+=                  '<li>装修：'+data["sPropertyDescription"]+'</li>';
    html+=              '</ul>';
    html+=          '</div>';
    html+=      '</div>';
    html+=      '<h3><span>办公设施</span></h3>';
    html+=      '<div class="m i">';
    html+=          '<div>';
    html+=              '<ul>';
    for(var i= 0,m=sType.length;i<m;i++){
        if(i%9==0 && i!=0){
            html+=              '</ul>';
            html+=          '</div>';
            html+=      '</div>';
            html+=      '<div class="m i">';
            html+=          '<div>';
            html+=              '<ul>';
            html+=                  '<li class="b'+sType[i]+'">'+sType[i]+'</li>';
        }else{
            if(i%3==0&&i!==0){
                html+=              '</ul>';
                html+=          '</div>';
                html+=          '<div>';
                html+=              '<ul>';
            }
            html+=                  '<li class="b'+sType[i]+'">'+sType[i]+'</li>';
        }
        if(i==m-1){
            html+=              '</ul>';
            html+=          '</div>';
            html+=      '</div>';
        }
    }
    html+=      '<h3><span>房源描述</span></h3>';
    html+='<div class="m">'+data["sPropertyDescription"]+'</div>';
    //html+=      '<div class="m">';
    //html+=          '<ol type="1">';
    //for(var i= 0,m=data['dec'].length;i<m;i++){
    //    html+=              '<li>'+data['dec'][i]+'</li>';
    //}
    //html+=          '</ol>';
    //html+=      '</div>';
    html+=      '<h3><span>楼盘信息</span></h3>';
    html+=      '<div class="m">';
    html+=          '<div>';
    html+=              '<ul>';
    html+=                  '<li>楼盘名称：'+data["sProjectName"]+'</li>';
    html+=                  '<li>商&emsp;&emsp;圈：'+data["sBusinessName"]+'</li>';
    html+=              '</ul>';
    html+=          '</div>';
    html+=          '<div>';
    html+=              '<ul>';
    html+=                  '<li>层数：'+sFloor[1]+'层</li>';
    html+=                  '<li>层高：'+sFloor[0]+'层</li>';
    html+=              '</ul>';
    html+=          '</div>';
    html+=      '</div>';
    html+=      '<div class="m">';
    html+=          '<div>';
    html+=              '<ul>';
    html+=                  '<li>物业公司：'+data["realInfo"]+'</li>';
    html+=              '</ul>';
    html+=          '</div>';
    html+=      '</div>';
    html+=  '</div>';
    html+='</div>';
    oDiv.className='box';
    oDiv.innerHTML=html;
    obj.appendChild(oDiv);
}

/**
 * 导航
 * **/
 function navDown(id){
    var oNav=document.querySelector(id),
        aLi=oNav.children;
    for(var i= 0,m=aLi.length;i<m;i++){
        if(aLi[i].children.length>1){
            !function(index){
                var timer=null;
                var oDl=aLi[index].children[1],
                    oA=aLi[index].children[0],
                    ad=oDl.children;
                function start(ev){
                    clearTimeout(timer);
                    aLi[index].children[0].innerHTML=ev.target.innerHTML;
                    aLi[index].children[0].setAttribute('data-type',ev.target.getAttribute('data-type'));
                    oDl.style.height=0;
                }
                function end(ev){
                    aLi[index].removeEventListener('touchstart','oliStart',false);
                    timer=setTimeout(h,2000);
                }
                function h(){
                    clearTimeout(timer);
                    oDl.style.height=0;
                }
                function oliStart(ev){
                    console.log("aaaaa")
                    clearTimeout(timer);
                    oDl.style.height="auto";
                }
                oA.addEventListener('touchstart',oliStart,false);
                oA.addEventListener('touchend',end,false);
                oDl.addEventListener('touchstart',start,false);
            }(i);
        }

    }


}


/**
 * 手机表单验证
 * **/
function getCode(){
    var oIpone=document.querySelector('#getIpone'),
        oVerCode=document.querySelector('#getVerCode'),
        oName=document.querySelector('#getName'),
        oDesc=document.querySelector('#getDesc');
    function codeStart(ev){
        var val=oIpone.value;
        ajax({
            url:url,
            type:"post",
            data:{
                "sMobilePhone":val
            },
            fnSucc:function(json){
                ver(json);
            }
        });
    }
    function ver(data){

    }
    oVerCode.addEventListener('touchstart',codeStart,false);
}




/**
 * 搜索
 * **/
function search(){

}