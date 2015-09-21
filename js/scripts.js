$(function() {
	
	"use strict";
	
	var topoffset = 50; // offset for menu height
	var slideqty = $('#featured .item').length; // how many carousel slides?
	var wheight = $(window).height(); // get the height of the window

	
	// Set fullhieight items to window height
	$('.fullheight').css('height', wheight); 
	
	
	// Adjust height of fullheight elements on window resize
	$(window).resize( function() {
		wheight = $(window).height(); // get the height of the window	
		$('.fullheight').css('height', wheight); // set fullhieight items to window height
	});
	
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
	
	// automatically generate carousel indicators
	for (var i=0; i < slideqty; i++) {
		var insertText = '<li data-target="#featured" data-slide-to="' + i + '"';
		if (i === 0) {
			insertText += 'class="active" ';
		}
		insertText += '></li>';
		
		$('#featured ol').append(insertText);
	}
	
	// Setup carousel
	$('.carousel').carousel({
	  interval: false
	});
	
	// Move captions content to captions bucket
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
	
});



