$(document).ready(function(){

	$('.submitBtn').click(function(){
		var emailSignup = $('#emailSignup').val();
		var passwordSignup = $('#passwordSignup').val();
		var passwordSignup2 = $('#passwordSignup2').val();
		var emailUpper = emailSignup.toUpperCase();
		var signupObj={};
		if ((emailSignup != "" && (passwordSignup == passwordSignup2))){
			signupObj= {
			"empId": emailUpper,
			"password" : passwordSignup
			}
			signUp(signupObj);
		}
		else{
			alert("Enter all fields and make sure passwords match eachother")
		}
	});

	function signUp(signupObj){
				console.log(signupObj);
				$.ajax({
					type : 'POST',
					url : 'http://121.243.75.240:8080/attendance/api/login/register',
					dataType: 'json',
					contentType:'application/json',
					crossDomain: true,
					//	 processData: false,
					data : JSON.stringify(signupObj),
					timeout : 5000,
					success : function(responseData) {
					console.log(("response"+JSON.stringify(responseData)));
					console.log("success");
					alert("Registration Successful! Please Log-in");
					window.location.replace("./index.html")
					},
					error : function(jqXHR, textStatus) {
					console.log(("error"+JSON.stringify(jqXHR)));
					}
				});
	}

		$('.goBack').click(function(){
			window.location.replace("./index.html");
		});

	$('.cancelBtn').click(function(){
		window.location.replace("./index.html");
	})

				$(document).keypress(function(e) {
    if(e.which == 13) {
        if (($('#emailSignup').val() != undefined) && ($('#passwordSignup').val() != undefined)){
        	$('.loginBtn').click();
        }
        else{
        	alert('Enter all information')
        }
    }
});

})