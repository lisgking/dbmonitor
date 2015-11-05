/**
Draggable
 */
define(function() {
       "use strict";
       function Draggable(target_class) {
           var draggingObj = null;
           var diffX = 0;
           var diffY = 0;

           function validateHandler(e) {
               var target = e.target;
               while (target && target.className.indexOf(target_class) == -1) {
                   target = target.parentElement;
               }
               
               if (target != null) {
                   return target.parentElement;
               } else {
                   return null;
               }
           }
           

           function mouseHandler(e) {
               switch (e.type) {
                   case 'mousedown':
                       draggingObj = validateHandler(e);
                       if (draggingObj != null) {
                           diffX = e.clientX - (draggingObj.style.left !== '' ? parseInt(draggingObj.style.left.replace('px', '')) : 0);
                           diffY = e.clientY - (draggingObj.style.top !== '' ? parseInt(draggingObj.style.top.replace('px', '')) : 0);
                       }
                       break;

                   case 'mousemove':
                       if (draggingObj) {
                           draggingObj.style.left = (e.clientX - diffX) + 'px';
                           draggingObj.style.top = (e.clientY - diffY) + 'px';
                       }
                       break;

                   case 'mouseup':
                       draggingObj = null;
                       diffX = 0;
                       diffY = 0;
                       break;
               }
           };


           document.addEventListener('mousedown', mouseHandler);
           document.addEventListener('mousemove', mouseHandler);
           document.addEventListener('mouseup', mouseHandler);

       }
    
       return Draggable;
   }
);
