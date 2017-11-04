// global variable - access using window.coordsArray
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
var eventMarker;


// load in the JSON data using an XMLHTTP Request
// From http://www.w3schools.com/json/json_http.asp 
var xmlhttp = new XMLHttpRequest();
var url = "https://dl.dropboxusercontent.com/u/103042952/webdev/plannerApp/locations.txt"; // url can't be a locally stored file - security issue, needs to point to a URL for a server

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log("Working so far!");
        //var myArr = JSON.parse('[{"name": "Tom","long": "12","lat": "34"},{"name": "Tom","long": "12","lat": "34"}]');

        // this runs asynchronously, which screws everything up - have to put GMaps initialization inside of here, or it will try to access window.coordsArray before it's initialized. 
        // relevant StackOverflow: http://stackoverflow.com/questions/13487437/change-global-variable-inside-javascript-closure
        window.coordsArray = JSON.parse(xmlhttp.responseText);   

        //alert(window.coordsArray[LocEnum.SCIENCE_CENTER].lat); 

        // event 'load' will never trigger we're doing this in the head - after the DOM has loaded (I think i have no idea screw this)
        google.maps.event.addDomListener(window, 'load', initialize(window.coordsArray[LocEnum.SCIENCE_CENTER].lat, window.coordsArray[LocEnum.SCIENCE_CENTER].long)); // i'm inputting lat for long and long for lat - idk why that works - other way around I get a point in Antarctica. screw js. 

        //initialize(); 
        
        console.log(window.coordsArray[LocEnum.SCIENCE_CENTER].name);
        populateDropdown(window.coordsArray);
        
        // wait until document is fully loaded to start appointment timer
        $(document).ready(function() { initAppointments() } ); 
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

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
        console.log("item "+i+", named "+arr[i].name); 
    }
}

// function called to set up Google Maps - need to call this in the body 
function initialize(latitude, longitude) {

    console.log("lat and long: "+latitude+","+longitude); 
    console.log("initialize is running."); 

    var mapOptions = {
      
      center: { lat: latitude, lng: longitude }, // coords for the science center
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    
    // https://developers.google.com/maps/documentation/javascript/markers
    eventMarker = new google.maps.Marker({
        position: map.getCenter(),
        map: null, // we'll set this to 'map' later to add it to the map
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

function Appointment(subject, location, startDate, endDate, reminderMinutes) {
    
    this.subject = subject; //subject: "", // e.g. math class
    this.location = location; //location: 0, // e.g. window.LocEnum.SCIENCE_CENTER
    this.startDate = startDate; //startDate: new Date(), // by default initializes with current date and time
    this.endDate = endDate; //endDate: new Date(),
        //startTime: new Date(),
        //endTime: new Date(),
    this.reminderMinutes = reminderMinutes; //reminderMinutes: 0, // int, minutes before event to alert; e.g. 15; put in a check for catching negative numbers?
    
    this.notes = ""; // e.g. 'Assignment due this period' or 'Test Today'
    this.isActive = false; // will be true for one cycle, and then be deactivated again - is a trigger 
    this.hasAlerted = false;
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
        
            if (currentTime >= this.startDate.getTime() - reminderMillsecs) { // compare dates with milliseconds
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
    
    // schedule should be loaded from an external file
    var millsecs = new Date().getTime() + 10000; 
    appointmentList.push(new Appointment("Computer Science", LocEnum.LANPHIER_CENTER, new Date(millsecs), new Date(millsecs+120000), 0.125));
    
    millsecs += 8000; 
    appointmentList.push(new Appointment("Lice Check", LocEnum.HEALTH_CENTER, new Date(millsecs), new Date(millsecs+120000), 0));

    millsecs += 8000;
    appointmentList.push(new Appointment("History of Jazz", LocEnum.PMAC, new Date(millsecs), new Date(millsecs+120000), 0.125));

    millsecs += 8000;
    appointmentList.push(new Appointment("FOOD FIGHT!!!", LocEnum.DINING_HALL, new Date(millsecs), new Date(millsecs+120000), 0.125));

    millsecs += 8000;
    appointmentList.push(new Appointment("Detention", LocEnum.BROWNELL, new Date(millsecs), new Date(millsecs+120000), 0.125));

    
    // 'push' adds to the array  
    
    
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
