
var map;
var google;
var geocoder;
var markers = [];
var Template;
var Session;
var Meteor;


function initialize(){
    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    geocoder = new google.maps.Geocoder();
    Session.set("add_depart", false);
    Session.set("add_arrive", false);
    Session.set("inc", 0);
    
}



function placeMarker(location, map) {
	var marker = new google.maps.Marker({
   	position: location,
   	map: map,
   });
   var infowindow = new google.maps.InfoWindow({
   	content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
   });
 	infowindow.open(map,marker);
 	google.maps.event.addListener(marker,'click',function() {
		marker.setMap(null);
	});
}
function codeDepart(string) {
	  var address = string;
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
	      var indexOf = markers.length;
	      markers.push(new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location,
	          title: "depart"
	      }));
	      google.maps.event.addListener(markers[indexOf], 'click', function(){
	      	map.setCenter(markers[indexOf].getPosition());
	      	map.setZoom(12);
	      });
	      map.setZoom(12);
	      var x = Session.get("inc");
	      x++;
	      Session.set("inc", x);
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
}
function codeArrive(string){
	var address = string;
	geocoder.geocode({'address':address}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
			var indexOf = markers.length;
	      markers.push(new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location,
	          title : "arrive"
	      }));
	      google.maps.event.addListener(markers[indexOf], 'click', function(){
	      	map.setCenter(markers[indexOf].getPosition());
	      	map.setZoom(12);
	      });
	      map.setZoom(12);
	      var x = Session.get("inc");
	      x++;
	      Session.set("inc", x);
		}	else{
			alert("Geocode was not successful for the following reason "+status);
		}
	});
}
function calcRoute(){
	var locations = [];
	for(var i = 0; i<markers.length; i++){
		if(markers[i].getTitle() == "arrive")
			locations[1] = markers[i].getPosition();
		if(markers[i].getTitle() == "depart")
			locations[0] = markers[i].getPosition();
	}
	var flightPath = new google.maps.Polyline({path:locations, strokeColor:"#0000FF", strokeOpacity:0.8, strokeWeight:2});
	flightPath.setMap(map);
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locations.length; i++) {
	    bounds.extend(locations[i]);
	}
	map.fitBounds(bounds);
}

function focusText(i, val){
      i.focus();
      i.value = val?val:"";
      i.select();
  }


Template.addressFinder.events({
    'click #depart': function(e, t){
        Session.set("add_depart", true);
        Meteor.flush();
        focusText(t.find("#add-depart"));
    },
    'click #arrive':function(e, t){
        Session.set("add_arrive", true);
        Meteor.flush();
        focusText(t.find("#add-arrive"));
    }, 
    'click #calcRoute':function(e, t){
        if(Session.get("inc")>=2){
            calcRoute();
        }
        else{
            console.log("Please set Arriving and Departing Locations");
        }
    },
    'keyup #add-depart':function(e, t){
        if(e.which === 13){
            var depart = String(e.target.value || "");
            codeDepart(depart);
            Session.set('add_depart', false);
        }
    },
    'keyup #add-arrive':function(e, t){
        if(e.which === 13){
            var arrive = String(e.target.value || "");
            codeArrive(arrive);
            Session.set("add_arrive", false);
            
        }
    }
});

Template.addressFinder.add_depart = function(){
    return Session.equals("add_depart", true);
};
Template.addressFinder.add_arrive = function(){
    return Session.equals("add_arrive", true);
};