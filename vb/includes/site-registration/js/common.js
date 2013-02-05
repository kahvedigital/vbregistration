AJAX_Compatible = true;

var md5_loaded = false;

var spinner = '<img id="ajax-spinner" src="includes/site-registration/img/ajax-loader.gif" />';
var spinner_secondary = '<img id="ajax-spinner-secondary" src="includes/site-registration/img/ajax-loader.gif" />';


jQuery.getScript("includes/site-registration/js/bootbox.min.js", function () {});



/**
 * check if something exists
 */
jQuery.fn.exists = function () {
    return this.length > 0;
}






/**
 * bind function to check if enter is pressed
 */
jQuery.fn.enterKey = function (fnc) {
    return this.each(function () {
        jQuery(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev); 
            }
        })
    })
}

$.fn.realVal = function () {
    var $obj = $(this);
    var val = $obj.val();
    var type = $obj.attr('type');
    if (type && type === 'checkbox') {
        var un_val = $obj.attr('data-unchecked');
        if (typeof un_val === 'undefined') un_val = '';
        return $obj.prop('checked') ? val : un_val;
    } else {
        return val;
    }
};

//alternative function to close a facebox thru a trigger
function closeTnC() {
    jQuery(document).trigger('close.facebox');
}

/**
 * close term and conditions dialog
 */
function closeTnCAccept() {
    jQuery(document).trigger('close.facebox');
    jQuery('#terms-and-conditions').attr('checked', true);
}

/**
 * Try to set the default value for timezone on last step
 */
function get_time_zone_offset() {
    var current_date = new Date();
    var gmt_offset = (current_date.getTimezoneOffset() * -1) / 60;
    return gmt_offset;
}


/**
 * Clear errors
 */
function clear_errors() {

    if (jQuery('.error-label').exists()) {
        jQuery('.error-label').empty();
    }

    if (jQuery('.large-input-error-container').exists()) {
        jQuery('.large-input-error-container').removeClass("large-input-error-container");
    }

    if (jQuery('.input-error-container').exists()) {
        jQuery('.input-error-container').removeClass("input-error-container");
    }

    if (jQuery('.terms-and-conditions-input-error-container').exists()) {
        jQuery('.terms-and-conditions-input-error-container').removeClass("terms-and-conditions-input-error-container");
    }

    if (jQuery('span.add-on').exists()) {
        jQuery('span.add-on').removeClass("input-error");
    }

    if (jQuery('.input-error').exists()) {
        jQuery('.input-error').removeClass("input-error");
    }

}


/**
 * Show spinners
 */
function initialize_spinner() {
    if (jQuery('#ajax-loader').exists()) {
        jQuery('#ajax-loader').empty();
        jQuery('#ajax-loader').append(spinner);
    }
}


/**
 *   AJAX error handling ACP-455
 **/
jQuery.ajaxSetup({
    error: function (jqXHR, exception) {
        if (jQuery('#ajax-spinner').exists()) {
            jQuery('#ajax-spinner').remove();
        }

        if (jqXHR.status === 0) {
            msg = 'Please try again later.\n Not connected.\n Verify Network connectivity.';
        } else if (jqXHR.status == 404) {
            msg = 'Please try again later.\n Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Please try again later.\n Internal Server Error [500].';
        } else if (exception === 'parsererror') {
        
            var ct = jqXHR.getResponseHeader("content-type") || "";
            
            if (ct != "application/json") {
                var xml = jqXHR.responseText,
                xmlDoc = $.parseXML( xml ),
                $xml = $( xmlDoc ),
                $error = $xml.find( "error" );
                
                msg  = $error.text();
            }else{
                 msg = 'Please try again later.\n Requested JSON parse failed.';
            }
            
  
        } else if (exception === 'timeout') {
            msg = 'Please try again later.\n Time out error.';
        } else if (exception === 'abort') {
            msg = 'Please try again later.\n Ajax request aborted.';
        } else {
            msg = 'Please try again later.\n Uncaught Error.\n' + jqXHR.responseText;
        }


        if(msg){
            bootbox.alert(msg);
        }
        

    }
});


 


/**
 * lazy load and bootstrap all elements
 */
jQuery(document).ready(function (jQuery) {

    //jQuery(':input[placeholder]').placeholder();

    //try to automatically assign timezone
    if (jQuery("#timezone").exists()) {
        try {
            jQuery("#timezone").val(get_time_zone_offset());
        } catch (e) {

        }
    }

    if (jQuery('input[id*="password"]').exists() && !md5_loaded) {
        jQuery.getScript("includes/site-registration/js/md5.js", function () {
            md5_loaded = true;
        });
    }

    //initialize any facebox
    if (jQuery('a[rel*=facebox]').exists()) {
        jQuery.getScript("includes/site-registration/facebox/facebox.js", function () {
            jQuery('a[rel*=facebox]').facebox({
                loadingImage: 'includes/site-registration/facebox/loading.gif',
                closeImage: 'includes/site-registration/facebox/closelabel.png'
            });
        });

    }

    //feature to alternatively close facebox
    if (jQuery('a[class*=close-facebox]').length > 0) {
        jQuery('a[class*=close-facebox]').bind('click', function () {
            jQuery(document).trigger('close.facebox');
        });
    }

    // initialize date picker
    if (jQuery("#datepicker").exists()) {
        var current_year = new Date().getFullYear();
        var year = 1970;

        var offset = current_year - year;
        var default_date = "-" + offset + "y";

        jQuery.getScript("includes/site-registration/jquery-ui/js/jquery-ui-1.9.2.custom.min.js", function () {
            jQuery(function () {
                jQuery("#datepicker").datepicker({
                    autoSize: true,
                    minDate: '-120y',
                    maxDate: '-13y',
                    changeYear: true,
                    changeMonth: true,
                    constrainInput: true,
                    hideIfNoPrevNext: false,
                    yearRange: '1900:2100',
                    onSelect: function (date) {
                        if (jQuery("#placeholder-datepicker").exists()) {
                            jQuery("#placeholder-datepicker").remove();
                        }
                    },
                    defaultDate: default_date
                });
            });
        });

        //check if the calendar icon exists and bind the click action
        // to show datepicker
        if (jQuery('.add-on').exists()) {
            jQuery('.add-on').bind('click', function () {
                jQuery("#datepicker").datepicker("show");
            });
        }
    }


    //regenerate token to avoid getting security errors
    if (jQuery('#token').exists()) {
        jQuery(function () {
            function update() {
                jQuery.getJSON("includes/site-registration/php/index.php?op=regenerate_security_token",

                function (json) {
                    jQuery('#token').val(json.token);
                });
            }
            setInterval(update, 30000);
            update();
        });
    }

    //refresh captcha on click
    if (jQuery('#refresh-captcha').exists()) {
        jQuery("#refresh-captcha").bind('click', function () {
            var token = escape(jQuery("#token").val());
            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=regenerate_token",
                context: document.body,
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: 'securitytoken=' + token,
                beforeSend: function () {
                    jQuery('#ajax-loader-secondary').empty();
                    jQuery('#ajax-loader-secondary').append('<img id="ajax-spinner-secondary" src="includes/site-registration/img/ajax-loader.gif" />');

                },
                success: function (response) {

                    var src = response.url;
                    jQuery("#imagereg").attr('src', src);


                    if (jQuery('#ajax-spinner-secondary').exists()) {
                        jQuery('#ajax-spinner-secondary').remove();
                    }

                }
            });

        });
    }


    //assign default image to upload file   
    if (jQuery("#use-default").exists()) {
        jQuery("#use-default").bind('click', function () {

            //set hidden to use default image
            jQuery("#use-default-image").val("true");
            jQuery("input[name=use_default_image]").val("true");

            //change image preview thumb
            jQuery("#selected-avatar").attr("src", "images/misc/unknown.gif");
        });


    }


    if (jQuery(".fileupload-exists").exists()) {
        jQuery(".fileupload-exists").bind('click', function () {

            //set hidden to use default image
            jQuery("#use-default-image").val("true");
            jQuery("input[name=use_default_image]").val("true");

            //change image preview thumb
            jQuery("#selected-avatar").attr("src", "images/misc/unknown.gif");
        });
    }


    if (jQuery(".fileupload-new").exists()) {
        jQuery(".fileupload-new").bind('click', function () {

            //set hidden to use default image
            jQuery("#use-default-image").val("");
            jQuery("input[name=use-default-image]").val("");

        });
    }






    //activates account on last step
    if (jQuery("#save-account-activated").exists()) {
        //bind enter event to  fields
        jQuery("#secret_question").enterKey(function () {
            jQuery("#save-account-activated").trigger('click');
        });

        jQuery("#secret_answer").enterKey(function () {
            jQuery("#save-account-activated").trigger('click');
        });

        // prepare Options Object 
        var options = {
            type: 'POST',
            dataType: 'json',
            beforeSubmit: function () {
                jQuery("#progress-indicator-container").addClass("progress-striped active");

                initialize_spinner();
            },
            success: function (response) {
                if (jQuery('#ajax-spinner').exists()) {
                    jQuery('#ajax-spinner').remove();
                }

                if (response.valid_entries == false) {
                    jQuery("#progress-indicator-container").removeClass("progress-striped active");

                    clear_errors();

                    jQuery.each(response.messages.fields, function (index, value) {
                        if (value == 'photoimg') {
                            jQuery('#' + value + '-wrapper').addClass("terms-and-conditions-input-error-container");
                        } else {
                            jQuery('#' + value + '-wrapper').addClass("input-error-container");
                        }

                        jQuery('#' + value).addClass("input-error");
                        jQuery('#' + value + '-error-label').empty();
                        jQuery('#' + value + '-error-label').append(response.messages.errors[index]);
                    });

                } else {
                    //valid entries
                    for (i = 50; i <= 100; i++) {
                        jQuery('#progress-indicator').css("width", i + '%');
                        jQuery('#percentage-indicator').html(i);
                    }

                    try {
                        clear_errors();
                    } catch (e) {

                    }

                    jQuery('#would-you-like').hide();
                    jQuery('#show-great').empty();
                    jQuery('#show-great').html("Thanks!");
                    jQuery('#complete-your-profile-form').remove();
                    jQuery("#progress-indicator-container").removeClass("progress-striped active");
                    jQuery("#icon-ok").removeClass('hidden');
                    jQuery("#icon-ok").show();
                    jQuery("#user-cp").removeClass('hidden');
                    jQuery("#user-cp").show();

                }
            }
        };

        jQuery('#complete-your-profile-form').ajaxForm(options);
    }



    //site account details
    if (jQuery("#site-account-deails-create-account").exists()) {
        //bind enter event to already have an account fields
        jQuery("#username").enterKey(function () {
            jQuery("#site-account-deails-create-account").trigger('click');
        });

        jQuery("#password").enterKey(function () {
            jQuery("#site-account-deails-create-account").trigger('click');
        });
        
        jQuery("#confirm-password").enterKey(function () {
            jQuery("#site-account-deails-create-account").trigger('click');
        });

        jQuery("#security-code").enterKey(function () {
            jQuery("#site-account-deails-create-account").trigger('click');
        });



        //submit and validate fields
        jQuery("#site-account-deails-create-account").bind('click', function () {
            jQuery('#have-account-error').empty();
            var username = escape(jQuery("#username").val());
            var password = md5(jQuery("#password").val());
            var confirm_password = md5(jQuery("#confirm-password").val());
            var security_code = escape(jQuery("#security-code").val());
            var terms_and_conditions = jQuery("#terms-and-conditions").is(':checked') ? 1 : 0;
            var token = escape(jQuery("#token").val());

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=validate_site_account_details",
                context: document.body,
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: 'username=' + username + '&password=' + password + '&confirm_password=' + confirm_password + '&security_code=' + security_code + '&terms_and_conditions=' + terms_and_conditions + '&securitytoken=' + token,
                beforeSend: function () {
                    initialize_spinner();
                },
                success: function (response) {

                    if (jQuery('#ajax-spinner').exists()) {
                        jQuery('#ajax-spinner').remove();
                    }

                    if (response.valid_entries == false) {

                        clear_errors();

                        jQuery.each(response.messages.fields, function (index, value) {

                            if (value == 'terms-and-conditions') {
                                jQuery('#' + value + '-wrapper').addClass("terms-and-conditions-input-error-container");
                            } else {
                                jQuery('#' + value + '-wrapper').addClass("input-error-container");

                            }
                            jQuery('#' + value).addClass("input-error");
                            jQuery('#' + value + '-error-label').empty();
                            jQuery('#' + value + '-error-label').append(response.messages.errors[index]);
                        });

                    } else {
                        try {
                            clear_errors();
                        } catch (e) {}

                        //redirect user to proper url
                        var url = response.url;
                        jQuery(location).attr('href', url);
                    }
                }
            }).done(function () {
                if (jQuery('#ajax-spinner').exists()) {
                    jQuery('#ajax-spinner').remove();
                }
            });
        });

    }




    //already have an account features
    if (jQuery("#login-button").exists()) {

        //bind enter event to already have an account fields
        jQuery("#username").enterKey(function (e) {
            jQuery("#login-button").trigger('click');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
 
        });

        jQuery("#password").enterKey(function (e) {
            jQuery("#login-button").trigger('click');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        //submit and validate authentication
        jQuery("#login-button").bind('click', function (e) {
            jQuery('#have-account-error').empty();
            var form = jQuery('#already-have-an-account-form');
            var username = escape(jQuery("#username").val());
            var password = md5(jQuery("#password").val());
            var s = '';
            var login = 'do'; 
            
            var securitytoken = escape(jQuery('#token').val());
            
            if(securitytoken == ''){
                securitytoken = 'guest';
            }

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=validate_login",
                context: document.body,
                type: 'POST',
                cache: false,
                data: 'vb_login_username=' + username + '&vb_login_password=' + password + '&s=' + s + '&login=' + login + '&securitytoken=' + securitytoken,
                beforeSend: function () {
                    jQuery('#ajax-loader-secondary').empty();
                    jQuery('#ajax-loader-secondary').append('<img id="ajax-spinner-secondary" src="includes/site-registration/img/ajax-loader.gif" />');
                },
                success: function (response, status, xhr) {

                    if (jQuery('#ajax-spinner-secondary').exists()) {
                        jQuery('#ajax-spinner-secondary').remove();
                    }

                    var ct = xhr.getResponseHeader("content-type") || "";

                    if (ct == "application/json") {
                        if (response.valid_login == false) {
                            //mark elements as invalid
                            jQuery('#have-account-error').html(response.message);
                            jQuery('#have-account-spacer').addClass("clear_15");

                            jQuery('#username').addClass("input-error").wrap('<div class="large-input-error-container" />');
                            jQuery('#password').addClass("input-error").wrap('<div class="large-input-error-container" />');

                        } else {
                            //redirect user to proper url
                            var url = response.url;
                            jQuery(location).attr('href', url);
                        }
                    } else {
                        var error = '<b>Wrong username or password.</b> You have used up your failed login quota! <br /><br /> Please wait 15 minutes before trying again.';

                        jQuery('#have-account-error').empty();
                        jQuery('#have-account-error').html(error);
                        jQuery('#have-account-spacer').addClass("clear_15");

                        jQuery('#username').addClass("input-error").wrap('<div class="large-input-error-container" />');
                        jQuery('#password').addClass("input-error").wrap('<div class="large-input-error-container" />');
                    }



                }
            }).done(function () {

            });
 

        });
        
        
        
    }



    //resens email functionality 
    if (jQuery("#resend-email").exists()) {
        jQuery("#resend-email").bind('click', function () {

            var token = escape(jQuery('#token').val());

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=resend_email",
                context: document.body,
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: 'securitytoken=' + token,
                beforeSend: function () {
                    jQuery('#email-sent').empty();
                    initialize_spinner();
                },
                success: function (response) {
                    if (jQuery('#ajax-spinner').exists()) {
                        jQuery('#ajax-spinner').remove();
                    }
                    jQuery('#email-sent').empty();
                    jQuery('#email-sent').append(response.message);
                }
            });
        });

    }


    //create site account functionality
    if (jQuery("#create-new-account-button").exists()) {
        jQuery('#create-new-account-error').empty();


        //bind enter event to already have an account fields
        jQuery("#email").enterKey(function () {
            jQuery("#create-new-account-button").trigger('click');
        });

        jQuery("#datepicker").enterKey(function () {
            jQuery("#create-new-account-button").trigger('click');
        });


        jQuery("#create-new-account-button").bind('click', function () {
            var email = escape(jQuery("#email").val());
            var birthdate = escape(jQuery("#datepicker").val());
            
            
            var token = escape(jQuery('#token').val());
            
            if(token == ''){
                token = 'guest';
            }

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=create_site_account_first_step",
                context: document.body,
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: 'email=' + email + '&birthdate=' + birthdate + '&securitytoken='+token,
                beforeSend: function () {
                    if (jQuery('#ajax-loader').exists()) {
                        initialize_spinner();
                    }
                },
                success: function (response) {
                    if (response.valid_entries == false) {
                        //mark elements as invalid

                        clear_errors();

                        jQuery.each(response.messages.fields, function (index, value) {
                            jQuery('#' + value + '-wrapper').addClass("input-error-container");
                            jQuery('#' + value).addClass("input-error");
                            jQuery('#' + value + '-error-label').empty();
                            jQuery('#' + value + '-error-label').append(response.messages.errors[index]);

                            if (value == 'datepicker') {
                                jQuery('span.add-on').addClass("input-error");
                            }


                        });

                    } else {
                        //redirect user to proper url
                        var url = response.url;
                        jQuery(location).attr('href', url);
                    }
                }
            }).done(function () {
                if (jQuery('#ajax-spinner').exists()) {
                    jQuery('#ajax-spinner').remove();
                }
            });
        });


    }

    //Log-in
    if (jQuery("#log-in").exists()) {
        jQuery("#log-in").bind('click', function () {
            var username = escape(jQuery("#username").val());
            var email = escape(jQuery("#email").val());
            var birthdate = escape(jQuery("#datepicker").val());
            var avatar = escape(jQuery("#avatar").val());
            var terms_and_conditions = jQuery("#terms-and-conditions").is(':checked') ? 1 : 0;
            var token = escape(jQuery('#token').val());

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=activate",
                context: document.body,
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: 'from=facebook&avatar=' + avatar + '&username=' + username + '&email=' + email + '&birthdate=' + birthdate + '&securitytoken=' + token + '&terms_and_conditions=' + terms_and_conditions,
                beforeSend: function () {
                    if (jQuery('#ajax-loader').exists()) {
                        jQuery('#ajax-loader').append(spinner);
                    }
                },
                success: function (response) {
                    if (response.valid_entries == false) {
                        //mark elements as invalid

                        clear_errors();

                        jQuery.each(response.messages.fields, function (index, value) {
                            if (value == 'terms_and_conditions') {
                                jQuery('#' + value + '-wrapper').addClass("terms-and-conditions-input-error-container");
                            } else {
                                jQuery('#' + value + '-wrapper').addClass("large-input-error-container");
                            }

                            jQuery('#' + value).addClass("input-error");
                            jQuery('#' + value + '-error-label').empty();
                            jQuery('#' + value + '-error-label').append(response.messages.errors[index]);

                            if (value == 'datepicker') {
                                jQuery('span.add-on').addClass("input-error");
                            }



                        });

                    } else {
                        //redirect user to proper url
                        var url = response.url;
                        jQuery(location).attr('href', url);
                    }
                }
            }).done(function () {
                if (jQuery('#ajax-spinner').exists()) {
                    jQuery('#ajax-spinner').remove();
                }
            });
        });
    }

    //Log-in
    if (jQuery("#link-account").exists()) {
        jQuery("#link-account").bind('click', function () {
            var username = escape(jQuery("#username-member").val());
            var password = md5(jQuery("#password-member").val());
            var token = escape(jQuery('#token').val());
            
            if(token == ''){
                token = 'guest';
            }

            jQuery.ajax({
                url: "includes/site-registration/php/index.php?op=linkaccount",
                context: document.body,
                type: 'POST',
                cache: false,
                data: 'securitytoken='+token+'&username='+ username + '&password='+ password + '&security_token='+ token,
                beforeSend: function(){
                    if(jQuery('#ajax-loader-secondary').exists()){
                        jQuery('#ajax-loader-secondary').append(spinner_secondary);
                    }
                },
                success: function (response, status, xhr) {

                    var ct = xhr.getResponseHeader("content-type") || "";

                    if (ct == "application/json") {
                        if (response.valid_entries == false) {
                            //mark elements as invalid

                            clear_errors();

                            jQuery.each(response.messages.fields, function (index, value) {
                                jQuery('#' + value + '-wrapper').addClass("large-input-error-container");
                                jQuery('#' + value).addClass("input-error");
                                jQuery('#' + value + '-error-label').empty();
                                jQuery('#' + value + '-error-label').append(response.messages.errors[index]);

                                if (value == 'datepicker') {
                                    jQuery('span.add-on').addClass("input-error");
                                }
                            });

                        } else {
                            //redirect user to proper url
                            var url = response.url;
                            jQuery(location).attr('href', url);
                        }
                    } else {
                        var error = '<b>Wrong username or password.</b> You have used up your failed login quota! <br /><br /> Please wait 15 minutes before trying again.';

                        jQuery('#password-member-error-label').empty();
                        jQuery('#password-member-error-label').html(error);

                        jQuery('#username-member').addClass("input-error").wrap('<div class="large-input-error-container" />');
                        jQuery('#password-member').addClass("input-error").wrap('<div class="large-input-error-container" />');
                    }

                }
            }).done(function () {
                if (jQuery('#ajax-spinner-secondary').exists()) {
                    jQuery('#ajax-spinner-secondary').remove();
                }
            });
        });
    }


});
