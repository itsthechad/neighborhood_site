/***** Variables ******/

	var topoffset = 50; // offset for menu height
	var slideqty = $('#featured .item').length; // how many carousel slides?
	var wheight = $(window).height(); // get the height of the window
	var mobileSize = 768; // window width
	// Google map variables
	var map;
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var mapCenter = { "lat": 33.941649, "lng": -84.279135 }; //Windwood North coords
	var markers = [];
	var infowindows = [];
	// Map locations
	var mapLocations = [
		{
			"name": "Windwood Hollow Park",
			"description": "<p>Windwood Hollow Park is a Dunwoody public park, though we tend to think of it as our own neighborhood park since it's nestled in at the entrance of the neighborhood.</p><p>Though small, the park offers two tennis courts, a pavillion, a nature trail, adult gym equipment, and an impressive, brand new playground area.</p>",
			"position": { "lat": 33.942253, "lng": -84.278242}
		}, {
			"name": "Peeler Road Linear Park",
			"description": "<p>This is the description for location 2</p>",
			"position": { "lat": 33.940143, "lng": -84.278394}
		}, {
			"name": "Winters Chapel Animal Hospital",
			"description": "<p>This is the description for location 3</p>",
			"position": { "lat": 33.940707, "lng": -84.272021}
		}
	];


// On document ready
$(function() {
	
	"use strict";

	
/***** Basic setup ******/
	
	// Set fullheight items to window height
	$('.fullheight').css('height', wheight);
	// Set map height on mobile
	var mapHeightDefault = $('.map-container').css('height');
	if ( $(window).width() < mobileSize ) {
		var mapHeight = $(window).height()*0.7;
		$('.map-container').css('height', mapHeight+'px' );
	}
	// Adjustments based on window resize
	$(window).resize( function() {
		// Adjust fullheight elements
		wheight = $(window).height(); // get the height of the window	
		$('.fullheight').css('height', wheight); // set fullhieight items to window height
		
		//Adjust map height
		if ( $(window).width() < mobileSize ) {
			// Set map height to 70% of window height
			var mapHeight = $(window).height()*0.7;
			$('.map-container').css('height', mapHeight+'px' );
		} else { // Set it to the default height
			$('.map-container').css('height', mapHeightDefault );
		}
		
		closeAllInfoWindows();
		map.panTo(mapCenter);
	});
	
	
/***** Scrollspy ******/
	
	// Activate scrollspy
	$('body').scrollspy({
		target: 'header .navbar',
		offset: topoffset
	});
	// Add or remove nav class based on where page is currently scrolled to
	var navinbody = function() {	
		var currentSection = $(document).find('li.active a').attr('href');
		if( currentSection !== '#headerimage' ) {
			$('header nav').addClass('inbody');
		} else {
			$('header nav').removeClass('inbody');
		}
	};
	// Run the function whenever the page is loaded so we start off on the right foot
	navinbody();
	// Check if we're scrolled down past featured section whenever scrollspy event fires
	$('.navbar-fixed-top').on('activate.bs.scrollspy', function() {
		navinbody();		
	});

	
/***** Smooth scrolling ******/
	
	//Use smooth scrolling when clicking on navigation
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') ===
			this.pathname.replace(/^\//, '') &&
			location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - topoffset + 2
				}, 500);
				return false;
			} //target.length
		} //click function
	}); //smooth scrolling
	
	
/***** Carousel ******/
	
	// Setup carousel
	$('.carousel').carousel({
	  interval: 4000
	});
	
	// automatically generate carousel indicators
	for (var i=0; i < slideqty; i++) {
		var insertText = '<li data-target="#featured" data-slide-to="' + i + '"';
		if (i === 0) {
			insertText += 'class="active" ';
		}
		insertText += '></li>';
		
		$('#featured ol').append(insertText);
	}
	
	// Move carousel captions to captions bucket
	function moveCaptions() {
		var currentCaption = $('.carousel-inner .item.active .carousel-caption').html();
		if (currentCaption){
			$('#caption-bucket').html(currentCaption);
			
		} else { // there is no caption for the active slide
			$('#caption-bucket').html('');
		} //if
	}
	moveCaptions();
	// Now do it automatically whenever the slide changes
	$('.carousel').on('slid.bs.carousel', function() {
		moveCaptions();		
	});

	
/***** Map and locations ******/
	
	initMap();
	
	// Setup map markers, info windows, HTML locations, and their interactivity
	// For each map location...
	for( var j=0; j < mapLocations.length; j++ ) {
		
		// Get the current one-letter label for the marker
		var currentLabel = labels[labelIndex++ % labels.length];
		
		// Create a map marker
		var marker = new google.maps.Marker({
			position: mapLocations[j].position,
			map: map,
			title: mapLocations[j].name,
			
			index: j, // Adding this data so we can later match each marker with its HTML counterpart
			icon: "http://maps.google.com/mapfiles/marker"+currentLabel+".png"
		});	
		marker.setAnimation(null);
		markers.push(marker);
		
		// Add a listener for the marker
		marker.addListener('click', markerClicked);
		
		// Add an info window
		var infowindow = new google.maps.InfoWindow({
    		content: '<h4>' + mapLocations[j].name + '</h4>' + mapLocations[j].description
  		});
		infowindows.push(infowindow);
		
		// Create an html element
		var htmlLocation = $('<li data-marker-id=' + j + ' class="location"><h4>' + mapLocations[j].name + '</h4></li>');
		$('#locations-list').append(htmlLocation);
		
	}
	
	// Listen for html location click
	$('#locations-list .location').click(locationClicked);

	
}); // document ready


//************* Google Map ****************

function initMap() {
  var customMapType = new google.maps.StyledMapType([
      {
        stylers: [
/*           {hue: '#026611'}, */
          {visibility: 'simplified'},
          {gamma: 0.5},
          {weight: 0.5}
        ]
      },
/*       {
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      }, */
      {
        featureType: 'water',
        stylers: [{color: '#51C5DF'}]
      }
    ], {
      name: 'Custom Style'
  });
  var customMapTypeId = 'custom_style';

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: mapCenter,
	disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
}


// A (html) location has been clicked
function locationClicked() {
	
	// What location was clicked?
	var clickedLocation = this.dataset.markerId;
	// Change the active location
	setActiveLocation(clickedLocation);	
} // locationClicked()


// A map marker has been clicked
function markerClicked() {

	// What location was clicked?
	var clickedLocation = this.index;

	closeAllInfoWindows();
	
	// If we're on mobile, we'll display location info via info windows rather than the
	// HTML locations list and details elements
	if ( $(window).width() < mobileSize ){
		
		// Center the map on the clicked location
		centerMapOnLocation(clickedLocation);
		// Open the appropriate infowindow
		infowindows[clickedLocation].open(map, markers[clickedLocation]);
		
	} else { // The screen is big enough to show the locations list and details sections
		setActiveLocation(clickedLocation);		
	} // if else

} // markerClicked()


// Toggle map marker animation
function toggleBounce(hoveredMarker) {
  if (hoveredMarker.getAnimation() !== null) {
    hoveredMarker.setAnimation(null);
  } else {
    hoveredMarker.setAnimation(google.maps.Animation.BOUNCE);
  }
} // toggleBounce()


// Close all infowindows
function closeAllInfoWindows() {
	for (var i=0; i<mapLocations.length; i++) {
		infowindows[i].close();
	}
} // closeAllInfoWindows()


// Change the active location to the passed in location
function setActiveLocation(clickedLocation) {
	
	// Set all locations to not active
	$('#locations-list .location').removeClass('active');
	// Set just the clicked location to active
	$(".location[data-marker-id=" + clickedLocation + "]").addClass('active');

	centerMapOnLocation(clickedLocation);
	
	// Set the map marker to bounce
	toggleBounce(markers[clickedLocation]);
	// Turn off the bounce after a short while
	setTimeout(function() {
		toggleBounce(markers[clickedLocation]);
	}, 600);

	// Display the location detail info
	// Construct the detail html from the location info array
	var htmlLocationDetail = $('<h3>' + mapLocations[clickedLocation].name + '</h3>' + mapLocations[clickedLocation].description);
	// Fade out the current html, swap it out, then fade back in
	$('#locations-detail').fadeOut(400, function() {
		$('#locations-detail').html(htmlLocationDetail);
		$('#locations-detail').fadeIn(400);
	});
	
} // setActiveLocation()

// Center map and set zoom on given location
function centerMapOnLocation(locationIndex) {
	map.panTo( mapLocations[locationIndex].position );
	map.setZoom(16);
}