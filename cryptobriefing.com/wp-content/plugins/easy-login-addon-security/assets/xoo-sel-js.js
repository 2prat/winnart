window.xooElRecaptchaCallback = function(){
	window.xooElNotExecuted = 1;
}

jQuery(document).ready(function($){

	var recaptchaBy = xoo_sel_localize.recaptchaBy;


	function setFormResponseToken( $el, token ){
		if( !$el.closest('form').find('input[name="g-recaptcha-response"]').length ){
			$('<input name="g-recaptcha-response">').insertBefore($el);
		}
		var $responseInput = $el.siblings('input[name="g-recaptcha-response"]');
		$responseInput.val(token);
	}

	if( xoo_sel_localize.grForms.length ){
		
		//Load recaptcha
		window.xooElRecaptchaCallback = function(){

			$('.xoo-el-recaptcha').each( function (index, $el ){

				if( recaptchaBy === 'google' && xoo_sel_localize.recaptcha.grVersion === 'v2' ){
					grecaptcha.render( $el, xoo_sel_localize.recaptcha );
				}
				else if( recaptchaBy === 'cloudflare' ){
					turnstile.render( $el, xoo_sel_localize.recaptcha );
				}
				else if( recaptchaBy === 'friendly' ){
					new friendlyChallenge.WidgetInstance( $el, xoo_sel_localize.recaptcha );
				}

			})
		}

	
		if( window.xooElNotExecuted || recaptchaBy === 'friendly' ){
			window.xooElRecaptchaCallback();
		}
	}


	var captchaVerified = false;

	$('.xoo-el-form-container').on( 'submit', '.xoo-el-action-form', function(e){

		if( xoo_sel_localize.recaptcha.grVersion !== 'v3' || captchaVerified || !xoo_sel_localize.grForms.length || !xoo_sel_localize.grForms.includes( $(this).find('input[name="_xoo_el_form"]').val() ) ){
			return;
		}

		var $form = $(this);

		e.preventDefault();
		e.stopImmediatePropagation();

		$form.find('button[type="submit"]').addClass('xoo-el-processing');

        grecaptcha.ready( function(){
			grecaptcha.execute( xoo_sel_localize.recaptcha.sitekey, {action: 'xoo_sel_recaptcha_submit'} ).then( function(token) {
				captchaVerified = true;
			 	$form.prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">');
                $form.submit();
			} );
        });

	} );
})