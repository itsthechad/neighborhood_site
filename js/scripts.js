/***** Variables ******/

	var topoffset = 50; // offset for menu height
	var slideqty = $('#featured .item').length; // how many carousel slides?
	var wheight = $(window).height(); // get the height of the window
	// Google map variables
	var map;
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var markers = [];
	// Map locations
	var mapLocations = [
		{
			"name": "Windwood Hollow Park",
			"description": "This is the description for location 1",
			"position": { "lat": 33.942253, "lng": -84.278242}
		}, {
			"name": "Peeler Road Linear Park",
			"description": "This is the description for location 2",
			"position": { "lat": 33.940143, "lng": -84.278394}
		}, {
			"name": "Winters Chapel Animal Hospital",
			"description": "This is the description for location 3",
			"position": { "lat": 33.940707, "lng": -84.272021}
		}
	];

// On document ready
$(function() {
	
	"use strict";

	
/***** Basic setup ******/
	
	// Set fullheight items to window height
	$('.fullheight').css('height', wheight); 
	// Adjust height of fullheight elements on window resize
	$(window).resize( function() {
		wheight = $(window).height(); // get the height of the window	
		$('.fullheight').css('height', wheight); // set fullhieight items to window height
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
	$('.navbar a[href*=#]:not([href=#])').click(function() {
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
	  interval: false
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
	
	// Setup map markers, HTML locations, and their interactivity
	// For each map location...
	for( var j = 0; j < mapLocations.length; j++ ) {
		
		var currentLabel = labels[labelIndex++ % labels.length];
		
		// Create a map marker
		var marker = new google.maps.Marker({
			position: mapLocations[j].position,
			map: map,
			title: mapLocations[j].name,
			label: currentLabel
		});	
		marker.setAnimation(null);
		markers.push(marker);
		
		// And create an html element
		var htmlLocation = $('<div data-marker-id=' + j + ' class="col-sm-4 location"><h4><span class="location-label">' + currentLabel + ".</span> " + mapLocations[j].name + '</h4><p>' + mapLocations[j].description + '</p></div>');
		$('#locations').append(htmlLocation);
		
	}
	
	// Listen for html location hover
	$('#locations .location').hover( function() {
		// What location is being hovered?
		var hoveredLocation = this.dataset.markerId;
		//console.log(hoveredLocation);
		toggleBounce( markers[hoveredLocation] );
	});
	
	// Listen for map marker hover
	
	
});


// Google Map

/* function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 33.943345,
			lng: -84.280186
		},
		zoom: 15
	});
} */



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
    center: {
		lat: 33.943345,
		lng: -84.280186
	},  // Windwood North
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
}


function toggleBounce(hoveredMarker) {
  if (hoveredMarker.getAnimation() !== null) {
    hoveredMarker.setAnimation(null);
  } else {
    hoveredMarker.setAnimation(google.maps.Animation.BOUNCE);
  }
}