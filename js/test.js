$(document).ready(function(){
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	var nodeExistFlag;
	var username;
	var existRef;
	var time1, time2, time3, time4, count;
	var auth,email,pass;
	var userEmail;
	var laymanName;
	var formattedEmail;

	statusKnown = false;
	var alertFlag=false;
	var signupFlag=false;
	
	var weekdays = new Array(7);
	weekdays[0] = "Sunday";
	weekdays[1] = "Monday";
	weekdays[2] = "Tuesday";
	weekdays[3] = "Wednesday";
	weekdays[4] = "Thursday";
	weekdays[5] = "Friday";
	weekdays[6] = "Saturday"; //for the boys

	var months = new Array(12);
	months[0] = "January";
	months[1] = "February";
	months[2] = "March";
	months[3] = "April";
	months[4] = "May";
	months[5] = "June";
	months[6] = "July";
	months[7] = "August";
	months[8] = "September";
	months[9] = "October";
	months[10] = "November";
	months[11] = "December";

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCx-oL-c4MZyfZpRu6ay-SFiUPpLv7JBlc",
		authDomain: "checkinapp-dc892.firebaseapp.com",
		databaseURL: "https://checkinapp-dc892.firebaseio.com",
		storageBucket: "checkinapp-dc892.appspot.com",
		messagingSenderId: "761473046167"
	};
	firebase.initializeApp(config);
	logout();

	function logout(){
	firebase.auth().signOut().then(function() {
  // Sign-out successful.
  	console.log('signed out');
}, function(error) {
  // An error happened.
});
}

	//updates the clock every second with a blinking colon;
	function updateClock(){
		var current_date = new Date();	
		weekday_value = current_date.getDay();
		month_value = current_date.getMonth();
		date_value = current_date.getDate();
		year_value = current_date.getFullYear();
		hours = current_date.getHours();
		minutes = current_date.getMinutes();
		ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		checkInTime = [hours, minutes, ampm];
		
		dateForFb = months[month_value]  + date_value;
		timeForFb = hours+ ":" + minutes + " " + ampm;

		$('.insideDate').html("Today - "+ weekdays[weekday_value] + ", " + months[month_value] + " " + date_value + ', ' + year_value);
		$('.hours').html(hours);
		$('.minutes').html(minutes);
		$('.ampm').html(ampm);
		//blinking :
		if ($('.colon').text()==(':')) {
			$('.colon').html('&nbsp;');
		}
		else{
			$('.colon').html(':');
		}
		setTimeout(updateClock, 1000); //keeps updating the time
	}
	updateClock();

	$('.loginClick').click(function(){
		$('.login').slideToggle("slow",function(){})
	});

	$('.cancel').click(function(){
		$('.login').slideToggle("slow",function(){})
	});

	//When user logs in
	$('.loginBtn').click(function(){
		auth =firebase.auth();
		email = $('#userEmail').val();
		var emailLower = email.toLowerCase();  
		userEmail = emailLower.replace(/\./g, "-");
		pass = $('#userPassword').val();
		var toLower = email.toLowerCase();
		username = toLower.replace(/\./g, "-");
		// username = username.capitalize();
		authenticate(email, pass);
	
	})

	$('.checkInContainer').click(function(){
		$('#checkinPicture').on("change", function(e){
				createNode();
			})
	})

	
	$('#checkOutContainer').click(function(){
		//Update and display new checkout time
		userRef = firebase.database().ref('Users/' + username +'/' + dateForFb)
		userRef.update({
	  			"timeOut1": timeForFb,
	  			"checkinNumber": "2",
	  		})
		//get new Time
		ref=firebase.database().ref('Users/' + username +'/' + dateForFb)
		ref.once("value", function(snapshot){
			var checkinsSnap = snapshot.val();
			//console.log(checkinsSnap);
			time1 = checkinsSnap.timeIn1;
			time2 =checkinsSnap.timeOut1;
			count = checkinsSnap.checkinNumber;
			//console.log(time2);
			displayTimes(time1,time2,count);
		})
		function displayTimes(time1, time2, count){
		$('.title').hide();
		$('.checkTimeContainer').show();
		if (count==2){
			$('.textCheckin').html(time1)
			$('.checkinTime').fadeIn("slow");			
			$('.textCheckout').html(time2)
			$('.checkinTime2').fadeIn("slow");			
		}
	}
	checkInScreen2();
	})

	$('.checkInContainer2').click(function(){
		$('#checkinPicture2').on("change", function(e){
		var userRef=firebase.database().ref('Users/' + username +'/' + dateForFb)
		storageRef = firebase.storage().ref('Users/' + username + '/' + dateForFb)
		var image = $('.inputfile2').get(0).files[0]; //First Checkin Picture is stored here
		checkPicture = storageRef.child('checkin2.jpg');
		//Send image to database
		checkPicture.put(image).then(function(snapshot){
	  		console.log('photoUploaded');
	  	})
		  	//send time to database
		  	userRef.update({
	  			"timeIn2": timeForFb,
	  			"checkinNumber": "3",
	  		})

	  		//read time from database
	  		userRef.once("value", function(snapshot){
			var checkinsSnap = snapshot.val();
			//console.log(checkinsSnap);
			time1 = checkinsSnap.timeIn1;
			time2 =checkinsSnap.timeOut1;
			time3 = checkinsSnap.timeIn2;
			count = checkinsSnap.checkinNumber;
			//console.log(time2);
			displayTimes(time1,time2,time3,count);
		})
		function displayTimes(time1, time2, time3, count){
			$('.title').hide();
			$('.checkTimeContainer').show();
			if (count==3){
				$('.textCheckin').html(time1)
				$('.checkinTime').fadeIn("slow");			
				$('.textCheckout').html(time2)
				$('.checkinTime2').fadeIn("slow");	
				$('.three').html(time3)
				$('.checkinTime3').fadeIn("slow");							
			}
		}
		checkOutScreen2()
	  	})	


	})

	$('#checkOutContainer2').click(function(){
		//Update and display new checkout time
		userRef = firebase.database().ref('Users/' + username +'/' + dateForFb)
		userRef.update({
	  			"timeOut2": timeForFb,
	  			"checkinNumber": "4",
	  		})
		//get new Time
		ref=firebase.database().ref('Users/' + username +'/' + dateForFb)
		ref.once("value", function(snapshot){
			var checkinsSnap = snapshot.val();
			//console.log(checkinsSnap);
			time1 = checkinsSnap.timeIn1;
			time2 =checkinsSnap.timeOut1;
			time3 = checkinsSnap.timeIn2;
			time4 = checkinsSnap.timeOut2;
			count = checkinsSnap.checkinNumber;
			displayTimes(time1,time2,time3,time4,count);
		})
		function displayTimes(time1, time2,time3,time4,count){
		$('.title').hide();
		$('.checkTimeContainer').show();
		if (count==4){
				$('.textCheckin').html(time1);
				$('.checkinTime').fadeIn("slow");			
				$('.textCheckout').html(time2)
				$('.checkinTime2').fadeIn("slow");	
				$('.three').html(time3);
				$('.checkinTime3').fadeIn("slow");	
				$('.four').html(time4);
				$('.checkinTime4').fadeIn("slow");	
				$('#checkOutContainer2').fadeOut("slow");
				$('.checkInContainer').hide();
				//console.log('this is on checkOutContainerClick');		
				$('.exceedCheck').show();				
		}
	}

	})

	//Authenticate
	function authenticate(email,pass){
		const promise = auth.signInWithEmailAndPassword(email,pass);
		var user = firebase.auth().currentUser;

		existRef=firebase.database().ref('Users/' + username + '/' + dateForFb);		
		promise.catch(e=>console.log(e.message));
		setTimeout(function (){firebase.auth().onAuthStateChanged(firebaseUser =>{
			//jQuery('.loginContainer').unbind();
			if (firebaseUser) {
				if (firebase.auth().currentUser.emailVerified) {
					signUpFlag = true;
                    console.log('You are verified');
                    emailRef = firebase.database().ref('Emails/' + userEmail)
					emailRef.on("value",function(snapshot){
						var emailSnap = snapshot.val();
						laymanName = emailSnap;
						laymanName.capitalize();
						displayName(laymanName);
					})
                	existRef.once('value', function(snapshot){
						if (snapshot.hasChildren()){
							nodeExistFlag = true;
							checkFlag(nodeExistFlag);
						}
						else{
							nodeExistFlag = false;
							$('.login').slideToggle("slow",function(){});
							checkInScreen();
						}
					});
				}	
				else{
					if (!alertFlag){
						alert("Must verify email");
						alertFlag = true;
						}
					}
                	
				}
			else{
					// while (!alertFlag && firebase.auth().currentUser == null){
						
				alert("Please register")
				// alertFlag = true;
					// }	
				
			}
		})
	},1500)	
	}



	function checkFlag(nodeExists){
		if(nodeExists){
			console.log('user and node exists');
			//userEmail= email.replace(/\./g, "-");
			//emailRef = firebase.database().ref('Emails/' + userEmail)
			//console.log(userEmail);
			userRef=firebase.database().ref('Users/' + username +'/' + dateForFb)
			// emailRef.once("value",function(snapshot){
			// 	var emailSnap = snapshot.val();
			// 	laymanName = emailSnap;
			// 	laymanName.capitalize();
			// 	displayName(laymanName);
			// })
			//console.log(laymanName);
			userRef.once("value", function(snapshot){
				var checkinsSnap = snapshot.val();
				count = checkinsSnap.checkinNumber;
				makeDecision(count);
			})
		}

	}

	function displayName(laymanName){
			$('.title').hide();
			$('.replaceName').text(laymanName);	
			$('.welcomeName').show();
	}

	function makeDecision(count){
		//displayName(laymanName);
		if (count==1){
			checkOutScreen1();
				$('.loginContainer').hide();
				$('#checkOutContainer').show();	
		}
		else if (count ==2){
			jQuery('.loginContainer').unbind();
			$('.loginContainer').hide();
			$('.checkInContainer').hide();
			$('.checkInContainer2').show();
			//console.log('here');
			//read time from database
			UserRef = firebase.database().ref('Users/' + username +'/' + dateForFb)
	  		UserRef.once("value", function(snapshot){
			var checkinsSnap = snapshot.val();
			//console.log(checkinsSnap);
			time1 = checkinsSnap.timeIn1;
			time2 =checkinsSnap.timeOut1;
			displayTimes(time1,time2);
		})
		function displayTimes(time1, time2){
			$('.title').hide();
			$('.checkTimeContainer').show();
			if (count==2){
				$('.loginContainer').hide();
				$('.checkInContainer').hide();
				$('.checkInContainer2').show();
				$('.textCheckin').html(time1)
				$('.checkinTime').fadeIn("slow");			
				$('.textCheckout').html(time2)
				$('.checkinTime2').fadeIn("slow");							
			}
		}
		}
		else if (count ==3){
		$('.loginContainer').hide();	
		$('.checkInContainer').hide();
		$('#checkOutContainer2').show();
		//read time from database
		UserRef = firebase.database().ref('Users/' + username +'/' + dateForFb)
  		UserRef.once("value", function(snapshot){
		var checkinsSnap = snapshot.val();
		time1 = checkinsSnap.timeIn1;
		time2 =checkinsSnap.timeOut1;
		time3 = checkinsSnap.timeIn2;
		count = checkinsSnap.checkinNumber;
		displayTimes(time1,time2,time3,count);
	})
	function displayTimes(time1, time2,time3,count){
		$('.title').hide();
		$('.checkTimeContainer').show();
		if (count==3){
			$('.textCheckin').html(time1)
			$('.checkinTime').fadeIn("slow");			
			$('.textCheckout').html(time2)
			$('.checkinTime2').fadeIn("slow");
			$('.three').html(time3)
			$('.checkinTime3').fadeIn("slow");							
		}
	}
		
	}
		else if (count==4){
			$('.loginContainer').hide();			
			$('.checkInContainer').hide();
			$('.exceedCheck').show();	
			//console.log('it should have showed');
						//read time from database
		UserRef = firebase.database().ref('Users/' + username +'/' + dateForFb)
  		UserRef.once("value", function(snapshot){
		var checkinsSnap = snapshot.val();
		time1 = checkinsSnap.timeIn1;
		time2 =checkinsSnap.timeOut1;
		time3 = checkinsSnap.timeIn2;
		time4 = checkinsSnap.timeOut2;
		count = checkinsSnap.checkinNumber;
		displayTimes(time1,time2,time3,time4,count);
	})
	function displayTimes(time1, time2,time3,time4,count){
		$('.title').hide();
		$('.checkTimeContainer').show();
		if (count==4){
			$('.textCheckin').html(time1)
			$('.checkinTime').fadeIn("slow");			
			$('.textCheckout').html(time2)
			$('.checkinTime2').fadeIn("slow");
			$('.three').html(time3)
			$('.checkinTime3').fadeIn("slow");
			$('.four').html(time4)
			$('.checkinTime4').fadeIn("slow");
			$('.checkInContainer').hide();
			console.log('this is on already authenticated with node display');
			$('.exceedCheck').show();										
		}
	}
			$('.checkInContainer').hide();	

		}	
	}
	

	function checkInScreen(){
		jQuery('.loginContainer').unbind();
		$('.loginContainer').hide();
		$('.checkInContainer').show();	


	}

	function checkInScreen2(){
		$('#checkOutContainer').hide();
		$('.checkInContainer2').show();
	}

	function checkOutScreen2(){
		$('.checkInContainer2').hide();
		$('#checkOutContainer2').show();		

	}
	function createNode(){
		var ref=firebase.database().ref('Users/' + username +'/' + dateForFb)
		storageRef = firebase.storage().ref('Users/' + username + '/' + dateForFb)
		var image = $('.inputfile').get(0).files[0]; //First Checkin Picture is stored here
		checkPicture = storageRef.child('checkin1.jpg');
		//Send image to database
		checkPicture.put(image).then(function(snapshot){
	  		console.log('photoUploaded');
	  	})
		//Send node to database
  		ref.set(
		{
			"timeIn1": timeForFb,
			"checkinNumber":"1",
		}
		)

		checkOutScreen1();	

	}

	function checkOutScreen1(){
		$('.checkInContainer').hide();
		$('#checkOutContainer').show();	
		//Here I'm pulling from database and putting in checkin times
		ref=firebase.database().ref('Users/' + username +'/' + dateForFb)
		ref.once("value", function(snapshot){
			var checkinsSnap = snapshot.val();
			//console.log(checkinsSnap);
			time1 =checkinsSnap.timeIn1;
			count = checkinsSnap.checkinNumber;
			displayTimes(time1,count);
		})

		function displayTimes(time,count){
		$('.title').hide();
		$('.checkTimeContainer').show();
		if (count==1){
			$('.textCheckin').html(time1)
			$('.checkinTime').fadeIn("slow");			
		}
	}
	

	}

	$('.registerText').click(function(){
		window.location.replace("./signup.html");
	})

			$(document).keypress(function(e) {
    if(e.which == 13) {
        if (($('#userEmail').val() != undefined) && ($('#userPassword').val() != undefined) ){
        	$('.loginBtn').click();
        }
        else{
        	alert('Enter all information')
        }
    }
});

	
});	