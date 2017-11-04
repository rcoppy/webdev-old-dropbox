// global variables - access explicitly using using 'window'
var coordsArray = [];
var map; 
var LocEnum = { // location enumerators - corresponds with order of locations in locations.txt (don't mess with this)

    SCIENCE_CENTER: 0, 
    PMAC: 1, 
    LANPHIER_CENTER: 2,
    HUMANITIES: 3,
    STEELE_HALL: 4, 
    DINING_HALL: 5, 
    LIBRARY: 6, 
    DEANS_ROW: 7, 
    HEALTH_CENTER: 8, 
    ATHLETIC_CENTER: 9, 
    TRACK: 10, 
    SAC: 11, 
    POOL: 12, 
    BROWNELL: 13, 
    ARCHBOLD: 14

};
var appointmentList = [];
var eventMarker; // little red dot on the map


init(); 

// refresh timer is initialized here 
initAppointments();


function init() {
    // load in the JSON data using an XMLHTTP Request
    // From http://www.w3schools.com/json/json_http.asp 
    /*
    var xmlhttp = new XMLHttpRequest();
    var url = "locations.txt"; // url can't be a locally stored file - security issue, needs to point to a URL for a server

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("Working so far!");

            // ran into problems with asynchronous program flow here.  
            // relevant StackOverflow: http://stackoverflow.com/questions/13487437/change-global-variable-inside-javascript-closure
            window.coordsArray = JSON.parse(xmlhttp.responseText);   

            google.maps.event.addDomListener(window, 'load', initialize(window.coordsArray[LocEnum.SCIENCE_CENTER].lat, window.coordsArray[LocEnum.SCIENCE_CENTER].long)); 

            console.log(window.coordsArray[LocEnum.SCIENCE_CENTER].name);
            populateDropdown(window.coordsArray);
  
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    */

    /* so it's like two years later now, November 4th, 2017--sticking this all on GitHub cause Public dropbox folder got axed

    cross-origin requests are complicated, so I'm gonna be lazy and for the sake of preventing future 404s just dump 'locations.txt' right here as JSON
    */

    window.coordsArray = [
        {
        "name": "Science Center",
        "lat": 41.459364, 
        "long": -72.808642
        },

        {
        "name": "PMAC",
        "lat": 41.458070, 
        "long": -72.808548
        },

        {
        "name": "Lanphier Center",
        "lat": 41.459416, 
        "long": -72.809993
        },

        {
        "name": "Humanities",
        "lat": 41.459393, 
        "long": -72.813157
        },

        {
        "name": "Steele Hall", 
        "lat": 41.458857, 
        "long": -72.814053
        },

        {
        "name": "Dining Hall",
        "lat": 41.458289, 
        "long": -72.814002
        },

        {
        "name": "Library",
        "lat": 41.458385, 
        "long": -72.813173
        },

        {
        "name": "Dean's Row",
        "lat": 41.457939, 
        "long": -72.813477
        },

        {
        "name": "Health Center", 
        "lat": 41.458134, 
        "long": -72.815049
        },

        {
        "name": "Athletic Center",
        "lat": 41.455125, 
        "long": -72.809534
        },

        {
        "name": "Track", 
        "lat": 41.455515, 
        "long": -72.807388
        },

        {
        "name": "SAC",
        "lat": 41.458778, 
        "long": -72.809881
        },

        {
        "name": "Pool", 
        "lat": 41.455998, 
        "long": -72.811207
        },

        {
        "name": "Brownell", 
        "lat": 41.459360, 
        "long": -72.806968
        },

        {
        "name": "Archbold",
        "lat": 41.458778, 
        "long": -72.809881
        }
    ];

    google.maps.event.addDomListener(window, 'load', initialize(window.coordsArray[LocEnum.SCIENCE_CENTER].lat, window.coordsArray[LocEnum.SCIENCE_CENTER].long)); 

    console.log(window.coordsArray[LocEnum.SCIENCE_CENTER].name);
    populateDropdown(window.coordsArray);
}

// fill the location menu.
function populateDropdown(arr) {
    // http://www.codecademy.com/en/skills/make-an-interactive-website/topics/jquery-dom-manipulation/jquery-appendTo/1
    
    // http://stackoverflow.com/questions/11794105/set-new-value-for-a-attribute-using-jquery 
    
    // fill dropdown menu with locations read off from JSON file
    var i;
    for (i = 0; i < arr.length; i++) {
        var item = $('<li>'); 
        var link = $('<a>');
        
        item.attr('role', 'presentation');
        link.attr('role', 'menuitem');
        link.attr('tabindex', '-1'); 
        link.attr('href', '#');
        
        link.text(arr[i].name); 
        
        // when this link is clicked, it sends GMap to its location coords.
        link.attr('onclick', 'changeLocation('+arr[i].lat+','+arr[i].long+')'); // bad coding practice  - is there a better way of storing values in an element? 
         
        
        link.appendTo(item);
        item.appendTo('#coords-dropdown-menu'); 
        
        // add locations to 'add event' dropdown form
        $('#location-select').append($('<option>').text(arr[i].name)); 
        
        console.log("item "+i+", named "+arr[i].name); 
    }
}

// function called to set up Google Maps 
function initialize(latitude, longitude) {

    console.log("lat and long: "+latitude+","+longitude); 
    console.log("initialize is running."); 

    var mapOptions = {
      
      center: { lat: latitude, lng: longitude }, // coords for the science center
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true    
    
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    
    // https://developers.google.com/maps/documentation/javascript/markers
    eventMarker = new google.maps.Marker({
        position: map.getCenter(),
        map: null, // we'll set this to 'map' later to add marker to the map
        draggable: false,
        title:"Event"
    });
    
    console.log(map); 
}

// function that pops us over to next map location 
function changeLocation(lat, long) { 
    //http://stackoverflow.com/questions/12699300/move-google-map-center-javascript-api
    
    var center = new google.maps.LatLng(lat, long);
    // using global variable:
    map.panTo(center);
    
    console.log("Location changed to "+lat+", "+long); 
}

// calendar events are stored as appointment objects.
function Appointment(subject, location, startDate, endDate, reminderMinutes, notes, hasAlerted) {
    
    this.subject = subject; //subject: "", // e.g. math class
    this.location = location; //location: 0, // e.g. window.LocEnum.SCIENCE_CENTER
    this.startDate = startDate; //startDate: new Date(), // by default initializes with current date and time
    this.endDate = endDate; //endDate: new Date(),
    this.reminderMinutes = reminderMinutes; //reminderMinutes: 0, // int, minutes before event to alert; e.g. 15; put in a check for catching negative numbers?
    this.notes = notes; // e.g. 'Assignment due this period' or 'Test Today'
    
    this.isActive = false; // will be true for one cycle, and then be deactivated again - is a trigger 
    this.hasAlerted = hasAlerted;
    this.hasReminded = false;
    
    this.update = function() {
        
        // for some reason had to add 'this' in front of everything - otherwise vars not initialized or something 
        
        // debug 
        // console.log(this.subject + " is updating"); 
        
        this.isActive = false; // kill trigger
        
        // check to see if reminder has fired
        if (!this.hasReminded) {
            var reminderMillsecs = reminderMinutes * 60000; // convert minutes to milliseconds
            var currentTime = new Date().getTime(); 
        
            var startTime = this.startDate.getTime(); 
            
            if (currentTime >= (startTime - reminderMillsecs)) { // compare dates with milliseconds
                if (!this.hasReminded) {
                    this.isActive = true; 
                    this.hasReminded = true; 
                    console.log("reminder for "+this.subject); 
                }
            }
        }
        
        // check to see if event has fired - could happen at same time as reminder
        if (!this.hasAlerted) { // not using else-if b/c reminderMinutes could be zero
            var currentTime = new Date().getTime(); 
    
            if (currentTime >= this.startDate.getTime()) { // compare dates with milliseconds
                if (!this.hasAlerted) {
                    this.isActive = true; 
                    this.hasAlerted = true; 
                    console.log(this.subject+" happening now"); 
                }
            }
        }
        
    }

}



function initAppointments() {
    
    // import calendar from localStorage
    appointmentList = importCalendar(); 
    if (appointmentList.length > 0) { // debug
        console.log("loaded in appt. list: " + appointmentList[0].subject); 
    }
    
    // start the interval timer to update appointments
    window.setInterval(function() { updateAppointments() }, 1000);  
    
    console.log("initAppointments()"); 
    
    updateAppointments();
}

function updateAppointments() {
    var i; 
    for (i = 0; i < appointmentList.length; i ++) {
        appointmentList[i].update();  
        
        var app = appointmentList[i]; 
        
        // check to see if action should be taken 
        if (app.isActive) { 
            if (app.hasReminded && !app.hasAlerted && app.reminderMinutes > 0) { // only fire a reminder if it's actually scheduled (more minutes than 0) 
                // display reminder
                var suffix = " minutes"; 
                
                if (app.reminderMinutes === 1) {
                    suffix = " minute"; 
                }
                
                alert(app.subject + " starts in " + app.reminderMinutes + suffix + " in the " + window.coordsArray[app.location].name + "."); 
            }
            else if (app.hasAlerted) { 
                // update DOM elements
                $('#label-event').text(app.subject); 
                $('#label-time').text(formatAMPM(app.startDate)+" to "+formatAMPM(app.endDate)); 
                $('#label-location').text(window.coordsArray[app.location].name); 
                $('#label-notes').text(app.notes); 
                
                // have alert occur before map update - less jarring loading sequence
                alert(app.subject + " starts now in the " + window.coordsArray[app.location].name + "."); 
                
                // update map
                changeLocation(window.coordsArray[app.location].lat, window.coordsArray[app.location].long); 
                
                // update the marker - should this be inside of changeLocation()? 
                if (eventMarker.getMap() === null) {
                    eventMarker.setMap(map); 
                }
                eventMarker.setPosition(map.getCenter()); 
                eventMarker.setTitle(app.subject); 
                
                exportCalendar(); // updates storage file stating that this event has fired - won't repeat on relaunch. 
            }
        }
        
    }
    
    console.log("updateAppointments()"); 
}

// Copy-pasted almost completely from stack overflow. 
// http://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
// Displays time in 12-hour AM/PM format.
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM'; // if hours is greater than/equal to 12:00, choose PM, else choose AM - if statement shorthand
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


// function to process input from addEvent form.
function addEventFromForm() {
    
    // handle AM/PM discrepancy
    var hour = parseInt($('#hour-select').val(), 10); // convert form input to base-10 int 
    if ($('#am-pm-select').val() === 'PM') {
        if (hour < 12) { // 12:00 PM stays 12:00 PM
            hour += 12;
        } 
        console.log("PM conversion " + hour); 

    }
    else if (hour === 12) { // 12:00 AM becomes 00:00 AM
        hour = 0; 
    }

    var dateStr = $('#month-select').val() + " " + $('#day-select').val() + ", " + $('#year-select').val() + " " + hour + ":" + $('#minute-select').val() + ":00";  
    var startDate = new Date(dateStr); 

    //console.log(dateStr); 
    //console.log(date); 

    var subject = $('#event-name-select').val();  

    // convert location string to number
    var locationStr = $('#location-select').val();  
    var location = window.LocEnum.SCIENCE_CENTER; // an int enum; 

    for (var i = 0; i < window.coordsArray.length; i ++) {
        if (window.coordsArray[i].name === locationStr) { 
            location = i; 
        }
    }

    var notes = $('#notes-text').val(); 

    // schedule should be loaded from an external file
    var millsecs = startDate.getTime(); 
    var duration = $('#duration-select').val() * 60000; // convert minutes to millsecs
    var endDate = new Date(millsecs+duration); 

    var reminderMinutes = $('#reminder-select').val(); 

    var apt = new Appointment(subject, location, startDate, endDate, reminderMinutes, notes);
    window.appointmentList.push(apt); 

    console.log("Appointment added.");
    console.log(apt); 
    
    // save calendar changes to disk.
    exportCalendar(); 
}

// convert calendar as a string, then save it to disk
function exportCalendar() {
    var calendarString = JSON.stringify(window.appointmentList);
    console.log(calendarString); 
    
    // write string to localStorage
    // http://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webstorage_local
    if (typeof(Storage) != "undefined") {
        // Store
        localStorage.setItem("calendarData", calendarString);
    } 
    else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}

// read calendar from local storage, then parse it
function importCalendar() { 
    var calendarString = "";
    
    
    // read string from localStorage
    // http://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webstorage_local
    if (typeof(Storage) != "undefined") {
        // Store
        calendarString = localStorage.getItem("calendarData");
        var json = JSON.parse(calendarString);
        
        console.log(json);  
        
        var array = []; // the parsed-in Appointment objects don't retain their function variables. So we need to reinstantiate them.
        
        if (json != null) { // possibility that localStorage is empty
            for (var i = 0; i < json.length; i ++) { 
                var a = json[i]; 
                array.push(new Appointment(a.subject,a.location,new Date(a.startDate),new Date(a.endDate),a.reminderMinutes,a.notes,a.hasAlerted)); // also need to reinstantiate date objects
                console.log(array[i].startDate); 
            }
        }
        
        return array; 
    } 
    else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
    
    return []; // empty array if function fails
     
}

// take event out of calendar, export new calendar
function removeEventFromForm() {
    
    // http://stackoverflow.com/questions/3628210/how-to-get-the-selected-index-of-a-drop-down
    var eventIndex = document.getElementById("eventRemove-select").selectedIndex; // for some reason $() doesn't work here
    
    console.log("eventIndex: "+eventIndex); 
    
    // http://www.w3schools.com/js/js_array_methods.asp
    window.appointmentList.splice(eventIndex, 1); // delete from array 
    
    updateRemoveList(); 
    
    exportCalendar(); 
}

// refresh list of events to remove in remove modal 
function updateRemoveList() { 
    
    var dropdown = $('#eventRemove-select'); 
    
    dropdown.empty(); // remove all events
    
    // add refreshed list
    for (var i = 0; i < appointmentList.length; i ++) { 
        dropdown.append($('<option>').text(appointmentList[i].subject + " at " + formatAMPM(appointmentList[i].startDate))); 
    }
}

