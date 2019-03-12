 $(document).ready(function(){
        $('#submit').click(function(e){
            
            //Stop form submission & check the validation
            e.preventDefault();
            
            // Variable declaration
            var error = false;
            var name = $('#name').val();
            var email = $('#email').val();
			var guest = $('#guest').val();
            var attend = $('#attend').val();
			
			$('#name,#email,#guest,#attend').click(function(){
				$(this).removeClass("error_input");
			});
            
         	// Form field validation
            if(name.length == 0){
                var error = true;
                $('#name').addClass("error_input");
            }else{
                $('#name').removeClass("error_input");
            }
            if(email.length == 0 || email.indexOf('@') == '-1'){
                var error = true;
                $('#email').addClass("error_input");
            }else{
                $('#email').removeClass("error_input");
            }
			if(guest.selectedIndex == 0){
                var error = true;
                $('#guest').addClass("error_input");
            }else{
                $('#guest').removeClass("error_input");
            }
            if(attend.length == 0){
                var error = true;
                $('#attend').addClass("error_input");
            }else{
                $('#attend').removeClass("error_input");
            }
            
            // If there is no validation error, next to process the mail function
            if(error == false){
               // Disable submit button just after the form processed 1st time successfully.
                $('#submit').attr({'disabled' : 'true', 'value' : 'Sending...' });
                
				/* Post Ajax function of jQuery to get all the data from the submission of the form as soon as the form sends the values to email.php*/
                $.post("email.php", $("#contact_form").serialize(),function(result){
                    //Check the result set from email.php file.
                    if(result == 'sent'){
                        //If the email is sent successfully, remove the submit button
                         $('#submit').remove();
                        //Display the success message
                        $('#mail_success').fadeIn(500);
                    }else{
                        //Display the error message
                        $('#mail_fail').fadeIn(500);
                        // Enable the submit button again
                        $('#submit').removeAttr('disabled').attr('value', 'Send The Message');
                    }
                });
            }
        });    
    });