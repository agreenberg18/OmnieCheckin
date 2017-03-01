$(document).ready(function () {
	
	function convertTime(unixMilliseconds){
	time = moment(unixMilliseconds).format('h:mm:a');
	format = time.replace(/:([^:]*)$/,'$1');
	format = format.toUpperCase();
	return format;
	}

	
	$.ajaxSetup({ 'cache': true });
	var name;
	var empObj;
	var authResponse;
	var getResponse;
	var empId;
	var count;
	var filename;
	var time1, time2, time3, time4
	var checkin, checkout;
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

	//updates the clock every second with a blinking colon;
	function updateClock() {
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
		minutes = minutes < 10 ? '0' + minutes : minutes;
		checkInTime = [hours, minutes, ampm];

		dateForFb = months[month_value] + date_value;
		timeForFb = hours + ":" + minutes + " " + ampm;

		$('.insideDate').html("Today - " + weekdays[weekday_value] + ", " + months[month_value] + " " + date_value + ', ' + year_value);
		$('.hours').html(hours);
		$('.minutes').html(minutes);
		$('.ampm').html(ampm);
		//blinking :
		if ($('.colon').text() == (':')) {
			$('.colon').html('&nbsp;');
		}
		else {
			$('.colon').html(':');
		}
		setTimeout(updateClock, 1000); //keeps updating the time
	}
	updateClock();

	$('.loginClick').click(function () {
		$('.login').slideToggle("slow", function () { })
	});

	$('.cancel').click(function () {
		$('.login').slideToggle("slow", function () { })
	});

	$('.registerText').click(function () {
		window.location.replace("./signup.html");
	})

	$('.loginBtn').click(function () {
		var emailUnformatted = $('#userEmail').val();
		email = emailUnformatted.toUpperCase();
		var pass = $('#userPassword').val();
		if (emailUnformatted == "" || pass == "") {
			alert("Enter all fields please")
		}
		else {
			console.log(email + pass);
			empId = email;
			authenticate(email, pass);
		}
	})

	//Input listeners for camera picture
	document.getElementById("checkinPicture").addEventListener("change", readFile);
	document.getElementById("checkinPicture2").addEventListener("change", readFile);
	document.getElementById("checkinPicture3").addEventListener("change", readFile);
	document.getElementById("checkinPicture4").addEventListener("change", readFile);
	//Reads image file, converts to base 64, and sends attendance
	function readFile() {

		if (this.files && this.files[0]) {
			var FR = new FileReader();

			FR.addEventListener("load", function (e) {
				document.getElementById("img").src = e.target.result;
				var base64 = document.getElementById("b64").innerHTML = e.target.result;
				var res = base64.replace("data:image/jpeg;base64,", "");
				var correctImage = document.getElementById("b64").innerHTML = res;

				console.log(checkinObj);
				var theImage = new Image()
				theImage.src = document.getElementById("img").src;
				var canvas = document.getElementById("myCanvas");
				canvas.width = 300;
				canvas.height = 300;
				var ctx=canvas.getContext("2d");
				ctx.drawImage(theImage, 0,0, 300,300)
				var newDataUrl = canvas.toDataURL("image/jpeg");
				var newRes = base64.replace("data:image/jpeg;base64,", "");
				var correctImage = document.getElementById("b64").innerHTML = newRes;
				console.log(newDataUrl);
				
				var checkinObj = {
					"empId": empId,
					"imageData": newDataUrl
				};				
				
				$.ajax({

					type: 'POST',
					url: 'http://121.243.75.240:8080/attendance/api/employeeattendence',
					dataType: 'json',
					contentType: 'application/json',
					crossDomain: true,
					//           processData: false,
					data: JSON.stringify(checkinObj),
					timeout: 8000,
					xhr: function() {
					var xhr = $.ajaxSettings.xhr();
					xhr.upload.onprogress = function(e) {
						$('#progress').show();
						$('#progress').html((e.loaded / e.total *100) + '%');
						console.log(Math.floor(e.loaded / e.total *100) + '%');
					};
					return xhr;
				},
					success: function (responseData) {
						$('#progress').hide();
						console.log("data uploaded successfully " + responseData + checkinObj)
						getTodaysData();
						console.log("response" + JSON.stringify(responseData));
					},
					error: function (jqXHR, textStatus) {
						alert("error" + JSON.stringify(jqXHR));
					}
				});

			});

			FR.readAsDataURL(this.files[0]);
		}
	}



	//Authenticate
	function authenticate(email, pass) {

		var data = { "empId": email, "password": pass };

		empObj = data;
		console.log(empObj);
			$.ajax({
			type : 'POST',
			url : 'http://121.243.75.240:8080/attendance/api/login',
			dataType: 'json',
			contentType:'application/json',
			crossDomain: true,
			data : JSON.stringify(empObj),
			timeout : 5000,
			success : function(responseData) {
			console.log(responseData.employeeId);
			loggedIn(responseData.firstName);
			getTodaysData();
			},
			error : function(jqXHR, textStatus) {
			alert("I'm sorry, wrong username or password please try again.")
			console.log(("error"+JSON.stringify(jqXHR)));
			}
		});
	}
	function getTodaysData() {
		console.log(empId);
		$.ajax({
			type: 'GET',
			url: 'http://121.243.75.240:8080/attendance/api/employeeattendence/' + empId + '/',
			dataType: 'json',
			contentType: 'application/json',
			crossDomain: true,
			timeout: 5000,
			success: function (responseData) {
				console.log('success');
				count = Object.keys(responseData).length;
				console.log(count);
				getResponse = responseData;

				if (count == 1) {
					time1 = convertTime(getResponse[0].attendaceTime);
					displayTimesAndCheck(count,time1);
				}
				else if (count == 2) {
					time1 = convertTime(getResponse[0].attendaceTime);
					time2 = convertTime(getResponse[1].attendaceTime);
					displayTimesAndCheck(count,time1,time2);
				}
				else if (count == 3) {
					time1 = convertTime(getResponse[0].attendaceTime);
					time2 = convertTime(getResponse[1].attendaceTime);
					time3 = convertTime(getResponse[2].attendaceTime);
					displayTimesAndCheck(count,time1,time2,time3);
				}
				if (count == 4) {
					time1 = convertTime(getResponse[0].attendaceTime)
					time2 = convertTime(getResponse[1].attendaceTime)
					time3 = convertTime(getResponse[2].attendaceTime)
					time4 = convertTime(getResponse[3].attendaceTime)
					displayTimesAndCheck(2,time1,time2,time3,time4);
				}
				else {
					$('.loginContainer').hide();
					count == 0
					console.log('here');
					displayTimesAndCheck(count)
				}
			},
			error: function (jqXHR, textStatus) {
				//console.log(("error"+JSON.stringify(jqXHR)));
				console.log('failed');
			}
		});
	}

	function loggedIn(name) {
		$('.replaceName').html(name)
		$('.welcomeName').fadeIn("fast");

	}

	function displayTimesAndCheck(count,time1,time2,time3,time4) {
		if (count == 1) {
			console.log('correctly here');
			$('.loginContainer').hide("fast");
			$('checkInContainer').hide();
			$('.textCheckin').html(time1);
			$('.checkinTime').fadeIn("fast");
			$('.checkTimeContainer').fadeIn("fast");

			$('.checkOutContainer3').show();
			document.getElementById("hideMe").style.display = "none";
			//Redudencies
			$('.checkInContainer').hide()
			$('.checkInContainer2').hide()
			$('.checkOutContainer4').hide()
		}
		else if (count == 2) {
			$('.loginContainer').hide("fast");
			$('.textCheckin').html(time1);
			$('.two').html(time2);
			$('.checkinTime').fadeIn("fast");
			$('.checkinTime2').fadeIn("fast");
			$('.checkTimeContainer').fadeIn("fast");

			$('.checkOutContainer3').fadeOut("fast");
			$('.checkInContainer2').fadeIn("fast");

			//Redudencies
			$('.checkInContainer').hide()
			$('.checkOutContainer3').hide()
			$('.checkOutContainer4').hide()
		}
		else if (count == 3) {
			console.log("i'm in display Times and check Count 3")
			$('.loginContainer').hide("fast");
			$('.textCheckin').html(time1);
			$('.two').html(time2);
			$('.three').html(time3)
			$('.checkinTime').fadeIn("fast");
			$('.checkinTime2').fadeIn("fast");
			$('.checkinTime3').fadeIn("fast");
			$('.checkTimeContainer').fadeIn("fast");

			$('.checkInContainer2').fadeOut("fast");
			$('.checkOutContainer4').fadeIn("fast");

			//Redudencies
			$('.checkOutContainer3').hide()
			$('.checkInContainer2').hide()
			$('.checkInContainer').hide()
		}
		else if (count == 4) {
			$('.loginContainer').hide("fast");
			$('.textCheckin').html(time1);
			$('.two').html(time2);
			$('.three').html(time3);
			$('.four').html(time4);
			$('.checkinTime').fadeIn("fast");
			$('.checkinTime2').fadeIn("fast");
			$('.checkinTime3').fadeIn("fast");
			$('.checkinTime4').fadeIn("fast");
			$('.checkTimeContainer').fadeIn("fast");

			$('.checkOutContainer4').fadeOut("fast");
			$('.exceedCheck').fadeIn("fast");

			//Redudencies
			$('.checkInContainer').hide();
			$('.checkOutContainer3').hide();
			$('.checkInContainer2').hide();
			$('.checkOutContainer4').hide();
		}
		else if(count== 0){
			console.log("hereeeee")
			$('.loginContainer').hide();
			$('.checkInContainer').fadeIn()

			// Redudencies
			$('.checkOutContainer3').hide();
			$('.checkInContainer2').hide();
			$('.checkOutContainer4').hide();
		}
	}

})