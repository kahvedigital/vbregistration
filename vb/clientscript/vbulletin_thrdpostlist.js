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
var ie5;if(document.all&&navigator.appVersion.charAt(navigator.appVersion.indexOf("MSIE")+5)>=5&&navigator.userAgent.toLowerCase().indexOf("opera")==-1){ie5=true}else{ie5=false}var pd=new Array();var pn=new Array();var pu=new Array();var imgStringCache=new Array();var imgCache=new Array();if(document.dir=="rtl"){imgCache={I:'<img src="'+imgdir_misc+'/tree_ir.gif" alt="" />',L:'<img src="'+imgdir_misc+'/tree_rtl.gif" alt="" />',T:'<img src="'+imgdir_misc+'/tree_tr.gif" alt="" />'}}else{imgCache={I:'<img src="'+imgdir_misc+'/tree_i.gif" alt="" />',L:'<img src="'+imgdir_misc+'/tree_ltr.gif" alt="" />',T:'<img src="'+imgdir_misc+'/tree_t.gif" alt="" />'}}function showPrevNextPost(A){info=pn[curpostid].split(",");showPost(info[A])}function setQRpostid(A){if(quickreply){fetch_object("qr_postid").value=A}}function navToPost(B,A){if(B!=0&&!A){window.location="showthread.php?"+SESSIONURL+"p="+B+"#poststop"}}function showPost(C,A){if(typeof pd[C]!="undefined"){try{if(quickreply){fetch_object("qr_postid").value=C}fetch_object("link"+curpostid).style.fontWeight="normal";fetch_object("div"+curpostid).className="alt1";fetch_object("link"+C).style.fontWeight="bold";fetch_object("div"+C).className="alt2";try{fetch_object("links").scrollIntoView(true)}catch(B){}fetch_object("posts").innerHTML=pd[C];PostBit_Init(fetch_object("post"+C),C);FIRSTPOSTID=C;LASTPOSTID=C}catch(B){navToPost(C,A)}}else{navToPost(C,A)}curpostid=C;return false}function writeLink(A,F,E,D,B,I,H,J,G){if(A==curpostid||G){bgclass="alt2"}else{bgclass="alt1"}document.write('<div class="'+bgclass+'" id="div'+A+'">');if(!imgStringCache[B]){imgStringCache[B]="";imgArray=B.split(",");for(var C in imgArray){if(!YAHOO.lang.hasOwnProperty(imgArray,C)){continue}curType=imgArray[C];if(isNaN(curType)){imgStringCache[B]+=imgCache[curType]}else{imgStringCache[B]+='<img src="'+cleargifurl+'" width="'+(curType*20)+'" height="20" alt="" />'}}}document.write(imgStringCache[B]);if(F==1){statusicon="new"}else{statusicon="old"}document.write('<img src="'+imgdir_statusicon+"/post_"+statusicon+'.gif" alt="" /> ');if(H=="more"){document.write('<a href="showthread.php?p='+A+highlightwords+"#post"+A+'" id="link'+A+'"><i>'+morephrase+"</i></a></div>\n")}else{if(E==1){document.write('<img src="'+imgdir_misc+'/paperclip.gif" alt="PaperClip" title="Attachment" /> ')}if(typeof pu[D]!="undefined"){document.write(pu[D].bold()+" ")}else{document.write(guestphrase+" ")}if(A==curpostid){titlestyle=' style="font-weight:bold;"'}else{titlestyle=""}document.write('<a href="showthread.php?p='+A+highlightwords+"#post"+A+'" onclick="return showPost('+A+')" id="link'+A+'"'+titlestyle+">"+I+"</a> ");if(ie5&&typeof pd[A]!="undefined"){iscached="."}else{iscached=""}document.write(H+', <span class="time">'+J+iscached+"</span>");document.write("</div>\n")}};