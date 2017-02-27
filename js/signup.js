$(document).ready(function(){
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCx-oL-c4MZyfZpRu6ay-SFiUPpLv7JBlc",
		authDomain: "checkinapp-dc892.firebaseapp.com",
		databaseURL: "https://checkinapp-dc892.firebaseio.com",
		storageBucket: "checkinapp-dc892.appspot.com",
		messagingSenderId: "761473046167"
	};
	firebase.initializeApp(config);


	$('.submitBtn').click(function(){
		var emailSignup = $('#emailSignup').val();
		var toLower = emailSignup.toLowerCase();
		var emailFormat = toLower.replace(/\./g, "-");
		console.log(emailFormat);
		var passwordSignup = $('#passwordSignup').val();
		var nameSignup = $('#nameSignup').val();
		firebase.auth().createUserWithEmailAndPassword(emailSignup, passwordSignup).catch(function(error) { 
		});
		//setTimeout(
		createdUser(emailFormat,nameSignup)//,2000);
	});

		$('.goBack').click(function(){
			window.location.replace("./index.html");
		});

	function createdUser(emailFormat, nameSignup){
		firebase.auth().onAuthStateChanged(firebaseUser =>{
			var user = firebase.auth().currentUser;
			if (firebaseUser) {
				if (firebase.auth().currentUser.emailVerified) {
	                console.log('You are verified');
	            } 
				else {
					console.log('user but not verified')
					$('.verifyText').show();					
					user.sendEmailVerification();
					var nameEmail = {};

					nameEmail[emailFormat]=nameSignup;
					console.log(nameSignup);
					userRef = firebase.database().ref('Emails/')
					userRef.update(nameEmail)
					$('.signUpForm').hide();
					$('.submitBtn').hide();
					$('.lineText').hide();
					$('.cancelText').text('Go back')

				}
			}
			else{
				console.log('wrong email/password');
			}
			
		})			
	}

	$('.cancelBtn').click(function(){
		window.location.replace("./index.html");
	})

				$(document).keypress(function(e) {
    if(e.which == 13) {
        if (($('#emailSignup').val() != undefined) && ($('#passwordSignup').val() != undefined) && ($('#nameSignup').val() !=undefined) ){
        	$('.loginBtn').click();
        }
        else{
        	alert('Enter all information')
        }
    }
});

})