/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 3.8.7 Patch Level 2
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2012 vBulletin Solutions, Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
var vB_ThreadTitle_Editor=null;function vB_AJAX_Threadlist_Init(F){if(AJAX_Compatible&&(typeof vb_disable_ajax=="undefined"||vb_disable_ajax<2)){var D=fetch_tags(fetch_object(F),"td");for(var C=0;C<D.length;C++){if(D[C].hasChildNodes()&&D[C].id&&D[C].id.substr(0,3)=="td_"){var E=fetch_tags(D[C],"a");for(var A=0;A<E.length;A++){if(E[A].rel&&E[A].rel.indexOf("vB::AJAX")!=-1){var B=D[C].id.split("_");switch(B[1]){case"threadtitle":if(typeof vb_disable_ajax=="undefined"||vb_disable_ajax==0){D[C].style.cursor="default";D[C].ondblclick=vB_AJAX_ThreadList_Events.prototype.threadtitle_doubleclick}break;case"threadstatusicon":D[C].style.cursor=pointer_cursor;D[C].ondblclick=vB_AJAX_ThreadList_Events.prototype.threadicon_doubleclick;break}break}}}}}}function vB_AJAX_OpenClose(A){this.obj=A;this.threadid=this.obj.id.substr(this.obj.id.lastIndexOf("_")+1);this.imgobj=fetch_object("thread_statusicon_"+this.threadid);this.toggle=function(){YAHOO.util.Connect.asyncRequest("POST","ajax.php?do=updatethreadopen&t="+this.threadid,{success:this.handle_ajax_response,failure:vBulletin_AJAX_Error_Handler,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=updatethreadopen&t="+this.threadid+"&src="+PHP.urlencode(this.imgobj.src))};this.handle_ajax_response=function(B){if(B.responseXML){this.imgobj.src=B.responseXML.getElementsByTagName("imagesrc")[0].firstChild.nodeValue;if(iobj=fetch_object("tlist_"+this.threadid)){if(this.imgobj.src.indexOf("_lock")!=-1){iobj.value=iobj.value|1}else{iobj.value=iobj.value&~1}}}};this.toggle()}function vB_AJAX_TitleEdit(A){this.obj=A;this.threadid=this.obj.id.substr(this.obj.id.lastIndexOf("_")+1);this.linkobj=fetch_object("thread_title_"+this.threadid);this.container=this.linkobj.parentNode;this.editobj=null;this.xml_sender=null;this.origtitle="";this.editstate=false;this.progress_image=new Image();this.progress_image.src=IMGDIR_MISC+"/11x11progress.gif";this.edit=function(){if(this.editstate==false){this.inputobj=document.createElement("input");this.inputobj.type="text";this.inputobj.size=50;this.inputobj.maxLength=((typeof (titlemaxchars)=="number"&&titlemaxchars>0)?titlemaxchars:85);this.inputobj.style.width=Math.max(this.linkobj.offsetWidth,250)+"px";this.inputobj.className="bginput";this.inputobj.value=PHP.unhtmlspecialchars(this.linkobj.innerHTML);this.inputobj.title=this.inputobj.value;this.inputobj.onblur=vB_AJAX_ThreadList_Events.prototype.titleinput_onblur;this.inputobj.onkeypress=vB_AJAX_ThreadList_Events.prototype.titleinput_onkeypress;this.editobj=this.container.insertBefore(this.inputobj,this.linkobj);this.editobj.select();this.origtitle=this.linkobj.innerHTML;this.linkobj.style.display="none";this.editstate=true}};this.restore=function(){if(this.editstate==true){if(this.editobj.value!=this.origtitle){this.container.appendChild(this.progress_image);this.save(this.editobj.value)}else{this.linkobj.innerHTML=this.editobj.value}this.container.removeChild(this.editobj);this.linkobj.style.display="";this.editstate=false;this.obj=null}};this.save=function(B){YAHOO.util.Connect.asyncRequest("POST","ajax.php?do=updatethreadtitle&t="+this.threadid,{success:this.handle_ajax_response,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=updatethreadtitle&t="+this.threadid+"&title="+PHP.urlencode(B))};this.handle_ajax_response=function(B){if(B.responseXML){this.linkobj.innerHTML=B.responseXML.getElementsByTagName("linkhtml")[0].firstChild.nodeValue}this.container.removeChild(this.progress_image);vB_ThreadTitle_Editor.obj=null};this.edit()}function vB_AJAX_ThreadList_Events(){}vB_AJAX_ThreadList_Events.prototype.threadtitle_doubleclick=function(A){if(vB_ThreadTitle_Editor&&vB_ThreadTitle_Editor.obj==this){return false}else{try{vB_ThreadTitle_Editor.restore()}catch(A){}vB_ThreadTitle_Editor=new vB_AJAX_TitleEdit(this)}};vB_AJAX_ThreadList_Events.prototype.threadicon_doubleclick=function(A){openclose=new vB_AJAX_OpenClose(this)};vB_AJAX_ThreadList_Events.prototype.titleinput_onblur=function(A){vB_ThreadTitle_Editor.restore()};vB_AJAX_ThreadList_Events.prototype.titleinput_onkeypress=function(A){A=A?A:window.event;switch(A.keyCode){case 13:vB_ThreadTitle_Editor.inputobj.blur();return false;case 27:vB_ThreadTitle_Editor.inputobj.value=vB_ThreadTitle_Editor.origtitle;vB_ThreadTitle_Editor.inputobj.blur();return true}};