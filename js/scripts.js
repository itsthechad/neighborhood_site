/***** Variables ******/

	var topoffset = 50; // offset for menu height
	var slideqty = $('#featured .item').length; // how many carousel slides?
	var wheight = $(window).height(); // get the height of the window
	var mobileSize = 768; // window width
	// Google map variables
	var map;
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var mapCenter = { "lat": 33.942649, "lng": -84.278135 }; //Windwood North coords
	var markers = [];
	var infowindows = [];
	// Map locations
	var mapLocations = [
		{
			"name": "Windwood Hollow Park",
			"description": "<p>Windwood Hollow Park is a Dunwoody public park, though we tend to think of it as our own neighborhood park since it's nestled in at the entrance of the neighborhood.</p><p>The park offers two tennis courts, a pavillion, a nature trail, adult gym equipment, and an impressive, brand new playground area.</p>",
			"position": { "lat": 33.942253, "lng": -84.278242}
		}, {
			"name": "Peeler Road Linear Park",
			"description": "<p>A beautiful, tree-lined walking path along the serene DeKalb County Water Works.</p>",
			"position": { "lat": 33.940143, "lng": -84.278394}
		}, {
			"name": "Brookrun Park",
			"description": "<p>A huge park with playgrounds, a dog park, fields, community gardens, and much more.</p><p>Brookrun is the location of many fun events throughout the year, including Food Truck Thursdays, Lemonade Days, and Howl-O-Weenie.</p>",
			"position": { "lat": 33.93522447, "lng": -84.29584265}
		}, {
			"name": "Winters Chapel Animal Hospital",
			"description": "<p>Great people and a convenient location for your pets' medical needs.</p>",
			"position": { "lat": 33.940707, "lng": -84.272021}
		}, {
			"name": "Walmart Neighborhood Market",
			"description": "<p>This is not Walmart, the super-sized shopping center. Neighborhood Market is a nice and convenient grocery store, just down the street.</p>",
			"position": { "lat": 33.94196255, "lng": -84.26985741}
		}, {
			"name": "Perimeter Mall",
			"description": "<p>One of Atlanta's premier shopping malls is only 10 minutes away. Around the mall are more shops, restaurants, and businesses.</p>",
			"position": { "lat": 33.92382993, "lng": -84.34094667}
		}, {
			"name": "Dunwoody Village",
			"description": "<p>Great restaurants and shops. Dunwoody Village is undergoing big changes with hopes of becoming the next Decatur Square.</p>",
			"position": { "lat": 33.9481839, "lng": -84.33408022}
		}, {
			"name": "Marcus Jewish Community Center",
			"description": "<p>Offering swimming, tennis, gym, preschool, summer camps, sporting events, and more, the MJCC is open to all.</p>",
			"position": { "lat": 33.946101, "lng": -84.30449}
		}, {
			"name": "Georgetown Shopping Center",
			"description": "<p>Groceries, restaurants, and shopping.</p>",
			"position": { "lat": 33.92234319, "lng": -84.3153584}
		}, {
			"name": "Williamsburg Shopping Center",
			"description": "<p>Groceries, restaurants, and shopping.</p>",
			"position": { "lat": 33.95823144, "lng": -84.30352449}
		}, {
			"name": "Market Place Shopping Center",
			"description": "<p>Groceries, restaurants, and shopping.</p>",
			"position": { "lat": 33.95153025, "lng": -84.23232794}
		}, {
			"name": "Spalding Corners Shopping Center",
			"description": "<p>Groceries, restaurants, and shopping.</p>",
			"position": { "lat": 33.96849135, "lng": -84.26028728}
		}, {
			"name": "The Forum on Peachtree Parkway",
			"description": "<p>Shop and eat in style at this classy outdoor shopping complex.</p>",
			"position": { "lat": 33.981723, "lng": -84.216352}
		}, {
			"name": "Kingsely Elementary School",
			"description": "<p>Our local elementary school.</p>",
			"position": { "lat": 33.948146, "lng": -84.297169}
		}, {
			"name": "Peachtree Middle School",
			"description": "<p>Our local middle school.</p>",
			"position": { "lat": 33.931143, "lng": -84.29621}
		}, {
			"name": "Dunwoody High School",
			"description": "<p>Our local high school. Go Wildcats!</p>",
			"position": { "lat": 33.94549605, "lng": -84.31549788}
		}, {
			"name": "Dunwoody Library",
			"description": "<p>Part of the DeKalb County Public Library System</p>",
			"position": { "lat": 33.944299, "lng": -84.331709}
		}, {
			"name": "Third Rail Studios at Assembly",
			"description": "<p>Recently announced and now under development, this future destination will feature a Hollywood-style movie studio, shops, and restaurants.</p>",
			"position": { "lat": 33.9047941, "lng": -84.28318262}
		}, {
			"name": "I-285",
			"description": "<p>From Windwood North, you can be on I-285 in just 5 minutes. From there, all of Atlanta is yours.</p>",
			"position": { "lat": 33.91295029, "lng": -84.28629398}
		}, {
			"name": "Atlanta",
			"description": "<p>As one of America's most happening cities, there's never a lack of great fun and tasty food in Atlanta. Just a 20-25 minute drive away, all of Atlanta is easily accessible.</p><p>Optionally, drop the car off at a local MARTA station, and ride into the city.</p>",
			"position": { "lat": 33.76380757, "lng": -84.39302444}
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
	$('nav a[href*=#]:not([href=#])').click(function() {
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
	    interval: 4000,
		pause: false
	});
	
	//replace IMG inside carousels with a background image
    $('#featured .item img').each(function() {
        var imgSrc = $(this).attr('src');
        $(this).parent().css({'background-image': 'url('+imgSrc+')'});
        $(this).remove();
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
/* 	function moveCaptions() {
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
	}); */

	
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
		$('#locations-list ul').append(htmlLocation);
		
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
    zoom: 14,
    center: mapCenter,
	disableDefaultUI: true,
	scrollwheel: false,
	scaleControl: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
	
  initHoodPoly();
}


// Create the polygon representing the neighborhood
function initHoodPoly() {
	
	// Define the LatLng coordinates for the polygon's path.
	var polyCoords = [{
		lat: 33.9401735,
		lng: -84.27852631
	}, {
		lat: 33.9402447,
		lng: -84.27752852
	}, {
		lat: 33.94291492,
		lng: -84.27579045
	}, {
		lat: 33.94359136,
		lng: -84.27518964
	}, {
		lat: 33.94693789,
		lng: -84.27780747
	}, {
		lat: 33.94711589,
		lng: -84.27950263
	}, {
		lat: 33.94578086,
		lng: -84.28214192
	}, {
		lat: 33.94469502,
		lng: -84.28190589
	}, {
		lat: 33.94385838,
		lng: -84.28379416
	}, {
		lat: 33.94291492,
		lng: -84.28351521
	}, {
		lat: 33.94191805,
		lng: -84.2847383
	}, {
		lat: 33.94156202,
		lng: -84.28448081
	}, {
		lat: 33.94245209,
		lng: -84.28209901
	}, {
		lat: 33.94159762,
		lng: -84.28149819
	}, {
		lat: 33.94200705,
		lng: -84.28021073
	}, {
		lat: 33.9401735,
		lng: -84.27881598
	}, {
		lat: 33.9401735,
		lng: -84.27852631
	}];

	// Construct the polygon.
	var neighborhood = new google.maps.Polygon({
		paths: polyCoords,
		strokeColor: '#6FB942',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#C0FFAD',
		fillOpacity: 0.35
	});
	neighborhood.setMap(map);
	
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
	}, 1400);

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
	//map.setZoom(14);
}