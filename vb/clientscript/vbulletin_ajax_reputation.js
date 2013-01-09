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
function vbrep_register(A){if(typeof vBrep=="object"&&typeof A!="undefined"){return vBrep.register(A)}}function vB_Reputation_Handler(){this.reps=new Array();this.ajax=new Array()}vB_Reputation_Handler.prototype.register=function(B){if(AJAX_Compatible&&(typeof vb_disable_ajax=="undefined"||vb_disable_ajax<2)){this.reps[B]=new vB_Reputation_Object(B);var A;if(A=fetch_object("reputation_"+B)){A.onclick=vB_Reputation_Object.prototype.reputation_click;return this.reps[B]}}};vBrep=new vB_Reputation_Handler();function vB_Reputation_Object(A){this.postid=A;this.divname="reputationmenu_"+A+"_menu";this.divobj=null;this.postobj=fetch_object("post"+A);this.vbmenuname="reputationmenu_"+A;this.vbmenu=null;this.xml_sender_populate=null;this.xml_sender_submit=null}vB_Reputation_Object.prototype.onreadystatechange_submit=function(I){if(I.responseXML){if(!this.vbmenu){this.vbmenu=vbmenu_register(this.vbmenuname,true);fetch_object(this.vbmenu.controlkey).onmouseover="";fetch_object(this.vbmenu.controlkey).onclick=""}var H=I.responseXML.getElementsByTagName("error");if(H.length){this.vbmenu.hide(fetch_object(this.vbmenuname));alert(H[0].firstChild.nodeValue)}else{this.vbmenu.hide(fetch_object(this.vbmenuname));var B=I.responseXML.getElementsByTagName("reputation")[0];var A=B.getAttribute("repdisplay");var G=B.getAttribute("reppower");var D=B.getAttribute("userid");var F=fetch_tags(document,"span");var E=null;for(var C=0;C<F.length;C++){if(E=F[C].id.match(/^reppower_(\d+)_(\d+)$/)){if(E[2]==D){F[C].innerHTML=G}}else{if(E=F[C].id.match(/^repdisplay_(\d+)_(\d+)$/)){if(E[2]==D){F[C].innerHTML=A}}}}alert(B.firstChild.nodeValue)}}};vB_Reputation_Object.prototype.onreadystatechange_populate=function(E){if(E.responseXML){var B=E.responseXML.getElementsByTagName("error");if(B.length){alert(B[0].firstChild.nodeValue)}else{if(!this.divobj){this.divobj=document.createElement("div");this.divobj.id=this.divname;this.divobj.style.display="none";this.divobj.onkeypress=vB_Reputation_Object.prototype.repinput_onkeypress;this.postobj.parentNode.appendChild(this.divobj);this.vbmenu=vbmenu_register(this.vbmenuname,true);fetch_object(this.vbmenu.controlkey).onmouseover="";fetch_object(this.vbmenu.controlkey).onclick=""}this.divobj.innerHTML=E.responseXML.getElementsByTagName("reputationbit")[0].firstChild.nodeValue;var A=fetch_tags(this.divobj,"input");for(var D=0;D<A.length;D++){if(A[D].type=="submit"){var F=A[D];var C=document.createElement("input");C.type="button";C.className=F.className;C.value=F.value;C.onclick=vB_Reputation_Object.prototype.submit_onclick;F.parentNode.insertBefore(C,F);F.parentNode.removeChild(F);C.name=F.name;C.id=F.name+"_"+this.postid}}this.vbmenu.show(fetch_object(this.vbmenuname))}}};vB_Reputation_Object.prototype.reputation_click=function(B){B=B?B:window.event;do_an_e(B);var C=this.id.substr(this.id.lastIndexOf("_")+1);var A=vBrep.reps[C];if(A.vbmenu==null){A.populate()}else{if(vBmenu.activemenu!=A.vbmenuname){A.vbmenu.show(fetch_object(A.vbmenuname))}else{A.vbmenu.hide()}}return true};vB_Reputation_Object.prototype.submit_onclick=function(B){B=B?B:window.event;do_an_e(B);var C=this.id.substr(this.id.lastIndexOf("_")+1);var A=vBrep.reps[C];A.submit();return false};vB_Reputation_Object.prototype.repinput_onkeypress=function(A){A=A?A:window.event;switch(A.keyCode){case 13:vBrep.reps[this.id.split(/_/)[1]].submit();return false;default:return true}};vB_Reputation_Object.prototype.populate=function(){YAHOO.util.Connect.asyncRequest("POST","reputation.php?p="+this.postid,{success:this.onreadystatechange_populate,failure:this.handle_ajax_error,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&p="+this.postid+"&ajax=1")};vB_Reputation_Object.prototype.handle_ajax_error=function(A){vBulletin_AJAX_Error_Handler(A)};vB_Reputation_Object.prototype.submit=function(){this.psuedoform=new vB_Hidden_Form("reputation.php");this.psuedoform.add_variable("ajax",1);this.psuedoform.add_variables_from_object(this.divobj);YAHOO.util.Connect.asyncRequest("POST","reputation.php?do=addreputation&p="+this.psuedoform.fetch_variable("p"),{success:this.onreadystatechange_submit,failure:vBulletin_AJAX_Error_Handler,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&"+this.psuedoform.build_query_string())};