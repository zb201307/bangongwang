/**
 * Created by zhangbin on 2015/8/17.
 */
;!function (doc, win) {
    "use strict";
    var fontScale;
    fontScale = function(){
        var innerWidth = win.innerWidth;
        if (!innerWidth) {
            return false;
        }
        if(innerWidth<=768){
            doc.documentElement.style.fontSize = (16 * innerWidth / 320)  + 'px';
        }else{
            doc.documentElement.style.fontSize='16px'
        }
    }
    fontScale();
    if(win.addEventListener){
        win.addEventListener('resize', fontScale, false);
        win.addEventListener('load',fontScale,false);
    }

}(document, window);
