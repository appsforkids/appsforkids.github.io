// Set jQuery to NoConflict Mode
jQuery.noConflict();

;(function( $, window, document, undefined ){
	"use strict";

	var $window = $(window);
	var $document = $(document);
	var $body = $('body');

	/* =============================================================================

	Custom Extensions

	============================================================================= */

	/*//////////////////////////////////////
	// Photo Proofing
	//////////////////////////////////////*/

	$.fn.vwPhotoProofing = function() {
		this.each( function( i, el ) {
			var $approveButton = $( el );
			var $postBox = $approveButton.parents( '.vw-gallery__item' );

			if ( 'approved' == $approveButton.data( 'proofing' ) ) {
				$postBox.addClass( 'vw-approved' );
			}

			$approveButton.on( 'click', function( e ) {
				e.preventDefault(); e.stopPropagation();
				var $this = $( this );

				$postBox.addClass( 'vw-approving' );

				$.ajax( {
					type: "GET",
					url: vw_main_js.ajaxurl,
					cache: false,
					data: {
						action: 'kepler_photo_proofing',
						method: $this.data( 'proofing' ) == 'approved'? 'reject': 'approve',
						galleryid: $this.data( 'galleryid' ),
						photoid: $this.data( 'photoid' ),
						_wpnonce: $( '#vw_photo_proofing_nonce' ).val(),
					},
					success: function( data ) {
						$postBox.removeClass( 'vw-approving' );

						if ( $this.data( 'proofing' ) == 'approved' ) {

							$this.data( 'proofing', 'rejected' );
							$postBox.removeClass( 'vw-approved' );

						} else {
							$this.data( 'proofing', 'approved' );
							$postBox.addClass( 'vw-approved' );
						}
					},
				} );

			} );

		} );

		$( '.vw-proofing-filter__approved' ).on( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();

			var $this = $( this );
			$this.parent().find( 'a:not( .vw-button--white )' ).addClass( 'vw-button--white' );
			$this.removeClass( 'vw-button--white' );

			$('.vw-gallery__item' ).hide().filter( '.vw-approved' ).fadeIn( 500 );

		} );

		$( '.vw-proofing-filter__rejected' ).on( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();

			var $this = $( this );
			$this.parent().find( 'a:not( .vw-button--white )' ).addClass( 'vw-button--white' );
			$this.removeClass( 'vw-button--white' );

			$('.vw-gallery__item' ).hide().filter( ':not(.vw-approved)' ).fadeIn( 500 );

		} );

		$( '.vw-proofing-filter__all' ).on( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();

			var $this = $( this );
			$this.parent().find( 'a:not( .vw-button--white )' ).addClass( 'vw-button--white' );
			$this.removeClass( 'vw-button--white' );

			$('.vw-gallery__item' ).hide().fadeIn( 500 );

		} );

	};


	/*//////////////////////////////////////
	// Category Filter
	//////////////////////////////////////*/

	$.fn.vwCategoryFilter = function() {
		this.each( function( i, el ) {
			var $categories = $( el );
			var $filters = $categories.find( 'a' );

			$filters.each( function( i, el ) {
				var $button = $( el );

				$button.on( 'click', function( e ) {
					e.preventDefault(); e.stopPropagation();

					$button.parent().find( 'a:not( .vw-button--white )' ).addClass( 'vw-button--white' );
					$button.removeClass( 'vw-button--white' );

					var slug = $button.data( 'slug' );

					Waypoint.refreshAll();
					
					if ( 'all' == slug ) {
						$('.vw-portfolios .vw-flex-grid__item' ).hide().finish().fadeIn( 500 );

					} else {
						$('.vw-portfolios .vw-flex-grid__item' ).hide().finish().filter( '[data-slugs~='+slug+']' ).fadeIn( 500 );

					}
				} );
			} );
		} );
	};


	/*//////////////////////////////////////
	// Title Parallax 
	//////////////////////////////////////*/

	$.fn.vwTitleParallax = function() {
		var t = $(window).scrollTop()
		, i = $( this )
		, n = i.parent().height();

		if ( i.length ) {

			// console.log( {t: t, i: i, 'offsettop': i.parent().offset().top, 'total': t-i.parent().offset().top});
			t -= i.parent().offset().top;

			if ( t < 0 ) t = 0;

			i.css( {
				// transform: 'translateY('+( 0.4 * t + "px")+')',
				transform: 'translate3d( 0,'+( 0.4 * t + "px")+',0)',
				// top: .4 * t + "px",
				opacity: 1 - 1 / (n / t)
			} );
		}
	}


	/*//////////////////////////////////////
	// Title Area Background 
	//////////////////////////////////////*/

	$.fn.vwTitleAreaBackground = function( options ) {
		if ( ! vw_main_js.hasOwnProperty( 'vw_backstretch_images' ) ) { return; }
		
		if ( $.fn.vegas ) {
			var $target = $( '.vw-title-area' );
			var $background = $target.find( '.vw-title-area__background' );
			if ( $target.length == 0 ) return;

			// var height = $(window).height() - $('.vw-top-bar').height() - $('.vw-site-header').height() - 60;
			var resize_handle = function() {
				$target.find( '.vw-title-area__inner' ).css( 'height', $target.height()+'px' );
			};
			resize_handle();
			$window.resize( resize_handle );

			var slides = [];
			$.each( vw_main_js.vw_backstretch_images, function( i, el ) {
				var src = { src: el };

				if ( vw_main_js.vw_backstretch_video ) {
					src.video = {
							src: [ vw_main_js.vw_backstretch_video ],
							loop: true,
							mute: true
						};
				}

				slides.push( src );
			} );

			$background.vegas( {
				autoplay: true,
				timer: false,
				'transition': vw_main_js.vw_backstretch_opt_transition,
				'transitionDuration': vw_main_js.vw_backstretch_opt_fade,
				delay: vw_main_js.vw_backstretch_opt_duration,
				slides: slides,
				animation: vw_main_js.vw_backstretch_opt_animation,
			} );

			$target.addClass( 'vw-title-area--has-bg' );

			// Captions
			var $captions = $('<div></div>', { class: 'vw-title-area__captions' } );

			$.each( vw_main_js.vw_backstretch_captions, function( i, caption ) {
				$captions.append( $('<div></div>', { class: 'vw-title-area__caption vw-caption', html: caption } ) );
			} );

			$target.append( $captions );

			// Locations
			var $locations = $('<div></div>', { class: 'vw-title-area__locations' } );

			$.each( vw_main_js.vw_backstretch_locations, function( i, location ) {
				$locations.append( $('<div></div>', { class: 'vw-title-area__location', html: location } ) );
			} );

			$target.append( $locations );

			// Show info
			$target.on( 'vegaswalk', function ( e, index, slideSettings ) {
				$target.find( '.vw-title-area__caption' )
					.removeClass( 'visible' )
					.eq( index ).addClass( 'visible' );

				$target.find( '.vw-title-area__location' )
					.removeClass( 'visible' )
					.eq( index ).addClass( 'visible' );

				// console.log("Slide index " + index + " image " + slideSettings.src);
			});


			// Navigation
			if ( slides.length > 1 ) {
				$target.find( '.vw-title-area__nav' ).removeClass( 'hidden' );
			}

			$target.find( '.vw-title-area__nav-button--next' ).on( 'click', function( e ) {
				e.preventDefault(); e.stopPropagation();
				$background.vegas("next");
			} );

			$target.find( '.vw-title-area__nav-button--prev' ).on( 'click', function( e ) {
				e.preventDefault(); e.stopPropagation();
				$background.vegas("previous");
			} );
		}
	}
	


	/*//////////////////////////////////////
	// Visible/Invisible On Scrolling
	//////////////////////////////////////*/

	$.fn.vwScroller = function( options ) {
		var default_options = {
			delay: 500, /* Milliseconds */
			position: 0.7, /* Multiplier for document height */
			visibleClass: '',
			invisibleClass: '',
		}

		var isVisible = false;
		var $document = $(document);
		var $window = $(window);

		options = $.extend( default_options, options );

		var observer = $.proxy( function () {
			var isInViewPort = $document.scrollTop() > ( ( $document.height() - $window.height() ) * options.position );

			if ( ! isVisible && isInViewPort ) {
				onVisible();
			} else if ( isVisible && ! isInViewPort ) {
				onInvisible();
			}
		}, this );

		var onVisible = $.proxy( function () {
			isVisible = true;

			/* Add visible class */
			if ( options.visibleClass ) {
				this.addClass( options.visibleClass );
			}

			/* Remove invisible class */
			if ( options.invisibleClass ) {
				this.removeClass( options.invisibleClass );
			}

		}, this );

		var onInvisible = $.proxy( function () {
			isVisible = false;

			/* Remove visible class */
			if ( options.visibleClass ) {
				this.removeClass( options.visibleClass );
			}
			
			/* Add invisible class */
			if ( options.invisibleClass ) {
				this.addClass( options.invisibleClass );
			}
		}, this );

		/* Start observe*/
		setInterval( observer, options.delay );

		return this;
	}



	/*//////////////////////////////////////
	// InView
	//////////////////////////////////////*/

	$.fn.vwInView = function() {
		var itemQueue = [];
		var delay = 70;
		var queueTimer;

		function processItemQueue() {
			if (queueTimer) return; // We're already processing the queue
			
			queueTimer = window.setInterval(function () {
				if (itemQueue.length) {
					var $img =  $(itemQueue.shift());

					if ( ! $img.hasClass( 'vw-inview--visible' ) ) {
						$img.addClass('vw-inview--visible');
					}
					processItemQueue();
				} else {
					window.clearInterval(queueTimer);
					queueTimer = null;
				}
			}, delay);
		}

		if ( ! $body.hasClass( 'vw-disable-inview' ) ) {
			this.waypoint( function() {
				itemQueue.push(this.element);
				processItemQueue();
			},{
				offset: '98%'
			} );
		}
	}



	/*//////////////////////////////////////
	// Custom Tiled Gallery
	//////////////////////////////////////*/

	$.fn.vwCustomTiledGallery = function() {
		this.each( function( i, el ) {

			var $gallery =  $( el );
			var layout = $gallery.attr( 'data-gallery-layout' );
			if ( ! ( parseInt( layout, 10 ) > 0 ) ) {
				layout = '213'; // Default layout
			}

			layout = layout.split('');
			var columnLayout = [];
			for (var i in layout ) {
				var columnCount = parseInt( layout[i], 10 );
				var columnWidth = 100.0 / columnCount;
				for ( var j = 1; j <= columnCount; j++ ) {
					columnLayout.push( columnWidth );
				}
			}

			$gallery.find( '> figure' ).each( function( i, el ) {
				var $el = $( el );
				var layoutIndex = i % columnLayout.length;
				$el.css( 'width', columnLayout[ layoutIndex ] - 1 + '%' );
			} );

		} );
	}



	/*//////////////////////////////////////
	// Fixed Tabular
	//////////////////////////////////////*/

	$.fn.vwFixedTab = function() {
		this.each( function( i, el ) {
			var $this = $( el );
			var $tabs = $this.find( '.vw-fixed-tab-title' );
			var $contents = $this.find( '.vw-fixed-tab-content' );

			$tabs.each( function( i, el ) {
				$( el ).on( 'click', function( e ) {
					e.preventDefault();

					// Manage tabs
					$this.find( '.vw-fixed-tab-title.is-active' ).removeClass( 'is-active' );
					$( this ).addClass( 'is-active' );

					// Manage contents
					$this.find( '.vw-fixed-tab-content.is-active' ).hide();
					$contents.eq( i ).show().addClass('is-active');

					$( document ).trigger( 'vw_content_height_changed' );
				} )
			} );

		} );

	}



	/*//////////////////////////////////////
	// Post Share Link
	//////////////////////////////////////*/

	$.fn.vwShareLink = function() {
		this.on( 'click', function( e ) {
			var $this = $( this );
			var url = $this.attr( 'href' );
			var width = $this.data( 'width' );
			var height = $this.data( 'height' );
			var leftPosition, topPosition;
			//Allow for borders.
			leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
			//Allow for title and status bars.
			topPosition = (window.screen.height / 2) - ((height / 2) + 50);

			var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
			window.open( url,'sharer', windowFeatures );

			return false;
		} );
	};



	/*//////////////////////////////////////
	// Ajax Pagination
	//////////////////////////////////////*/

	$.fn.vwPaginationAjax = function() {

		function bind_click_event( $placeholder ) {
			var $link = $placeholder.find( '.vw-pagination a' );
			$link.on( 'click', _on_click );

			// Auto loading for infinite scrolling
			$placeholder.find( '.vw-pagination--infinite-auto .vw-pagination__load-more' ).waypoint({
				handler: function( direction ) {
					$link.click();
				},
				offset: '90%',
			});
		}

		var _on_click = function( e ) {
			var $this = $( this );
			var link = $this.attr( 'href' );
			var $viewport = $('html, body');
			var $container = $this.closest( '.vw-content-main, .vw-post-shortcode, .vwspc-section' );
			var container_id = $container.attr( 'id' );

			if( ! container_id ) {
				console.log( 'AJAX Pagination: No container',$container );
				return;
			} else {
				e.preventDefault(); // prevent default linking
			}

			if ( $container.hasClass( 'vwspc-section' ) ) {
				var placeholder = '#'+container_id+' .vwspc-section-content';
				var $post_container = $container.find( '.vwspc-section-content .vw-loop' );
				var $controls = $container.find( '.vwspc-section-content .vw-loop > *, .vwspc-section-content .vw-pagination' );

			} else { // hasClass( 'vw-post-shortcode' )
				var placeholder = '#'+container_id;
				var $post_container = $container.find( '.vw-loop' );
				var $controls = $container.find( '.vw-loop > *, .vw-pagination' );

			}

			var $placeholder = $( placeholder );
			var is_append_items = $this.parents( '.vw-pagination' ).hasClass( 'vw-pagination--append-items' );
			var $preloader = $('<div class="vw-preloader"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>');

			if ( is_append_items ) {
				if ( ! $placeholder.find( '.vw-preloader' ).length ) {
					$placeholder.find( '.vw-loop' ).last().after( $preloader );
				}
				
				$placeholder.find( '.vw-pagination' ).remove();

				$( '<div>' ).load( link + ' ' + placeholder + '>*', function( response, status, xhr ) {
					if( status == 'success' ) {
						var $new_items = $( this ).find( '.vw-loop' );
						var $new_pagination = $( this ).find( '.vw-pagination' );
						$placeholder.find( '.vw-preloader' ).remove();

						// Insert items
						var $loop = $placeholder.find( '.vw-loop' );
						var $existing_isotope = $loop.find( '.vw-isotope' );

						if ( $loop.length == 1 && $existing_isotope.length == 1 ) {
							// Insert items into the existing isotope loop
							var $new_isotope_items = $new_items.find( '.vw-isotope > *' );
							$existing_isotope.isotope( 'insert', $new_isotope_items );
							$existing_isotope.vwIsotope( 'layout' );

						} else { // When using lead layout, append the new loop
							var $loop_outer = $loop.eq(0).parent();
							$loop_outer.append( $new_items );
							$new_items.find( '.vw-isotope' ).vwIsotope();
						}

						$container.find( '.vw-inview' ).vwInView();

						// Update pagination
						$placeholder.append( $new_pagination );
						bind_click_event( $placeholder );

					} else if( status == 'error' ) {
						console.log( 'AJAX Pagination: '+xhr.status+': '+xhr.statusText );
						
					}
				} );

			} else {
				$viewport
					.animate( { scrollTop: $container.offset().top - 60 }, 1700, "easeOutQuint")
					.on("scroll mousedown DOMMouseScroll mousewheel keyup", function (e) {
						if (e.which > 0 || e.type === "mousedown" || e.type === "mousewheel") {
							$viewport.stop().off('scroll mousedown DOMMouseScroll mousewheel keyup');
						}
					});

				$controls.fadeTo( 500, 0, function() {
					$( this ).css('visibility', 'hidden');
				} );

				$preloader.addClass( 'vw-preloader--floating' );
				$post_container.eq(0).append( $preloader );

				$( placeholder ).load( link + ' ' + placeholder + '>*', function( response, status, xhr ) {
					if( status == 'success' ) {
						$container.find( '.vw-isotope' ).vwIsotope( 'layout' );
						$container.find( '.vw-inview' ).vwInView();

						bind_click_event( $placeholder );

					} else if( status == 'error' ) {
						console.log( 'AJAX Pagination: '+xhr.status+': '+xhr.statusText );

					}
				} );
			}
		}

		bind_click_event( $( this ) );
	}



	/*//////////////////////////////////////
	// Masonry Layout
	//////////////////////////////////////*/

	$.fn.vwIsotope = function() {
		if ( $.fn.isotope ) {
			var $isotope_list = $( this );

			$isotope_list.each( function( i, el ) {
				var $this = $( el );
				
				$this.imagesLoaded( function () {
					$this.isotope( {
						layoutMode: 'packery',
						percentPosition: true,
						// stagger: 150, // ms
					} );
				} );
			} );
		}
	};


	/*//////////////////////////////////////
	// Sticky Header
	//////////////////////////////////////*/

	$.fn.vwSticky = function() {
		if ( Waypoint.Sticky ) {
			var $sticky_bar = $( this );
			var $sticky_wrapper = false;

			if ( $sticky_bar.length == 0 ) return;

			var sticky = new Waypoint.Sticky({
				stuckClass: 'vw-stuck',
				element: $sticky_bar[0],
				wrapper: '<div class="vw-sticky-wrapper" />',
			});



			/////////////////////////////////
			// Hide Header on on scroll down
			/////////////////////////////////
			var didScroll;
			var lastScrollTop = 0;
			var delta = 5;
			var navbarHeight =  $sticky_bar.outerHeight();

			$window.scroll(function(event){
				didScroll = true;
			});

			setInterval(function() {
				if (didScroll) {
					hasScrolled();
					didScroll = false;
				}
			}, 150);

			var hasScrolled = function () {
				var st = $window.scrollTop();
				
				// Make sure they scroll more than delta
				if( Math.abs( lastScrollTop - st ) <= delta )
					return;

				// If they scrolled down and are past the navbar, add class .nav-up.
				// This is necessary so you never see what is "behind" the navbar.
				if ( st > lastScrollTop && st > navbarHeight ){
					// Scroll Down
					 $sticky_bar.removeClass( 'vw-stuck--down' ).addClass( 'vw-stuck--up' );
				} else {
					// Scroll Up
					if( st + $window.height() < $document.height() ) {
						 $sticky_bar.removeClass( 'vw-stuck--up' ).addClass('vw-stuck--down' );
					}
				}

				if ( st == 0 ) { // top most
					$sticky_bar.removeClass('vw-stuck--down' );
				}
				
				lastScrollTop = st;
			}
		}
	}


	

	/*//////////////////////////////////////
	// No-touch detection
	//////////////////////////////////////*/

	var istouchable = false;

	if (!("ontouchstart" in document.documentElement)){ 
		document.documentElement.className += " no-touch";
	} else {
		document.documentElement.className += " touchable"; 
		istouchable = true;
	}


	/*//////////////////////////////////////
	// Debounce (taken from Underscore.js)
	//////////////////////////////////////*/
	function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = Date.now - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = Date.now;
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };




































	/* =============================================================================

	On Ready

	============================================================================= */

	$( document ).ready( function () {

		/*//////////////////////////////////////
		// Category Filter
		//////////////////////////////////////*/

		if ( $.fn.vwCategoryFilter ) {
			$( '.vw-category-filter' ).vwCategoryFilter();
		}

		/*//////////////////////////////////////
		// Review
		//////////////////////////////////////*/
		if ( $.fn.knob ) {
			$( '.vw-review__total--point .vw-review__dial' ).knob( {
				thickness: 0.16,
				width: 120,
				height: 120,
				min: 0,
				max: 10,
				step: 0.1,
				readOnly: true,
				displayPrevious: true,
				fgColor: vw_main_js.accent_color,
				font: 'inherit',
				fontWeight: 'inherit',
			} );

			$( '.vw-review__total--percentage .vw-review__dial' ).knob( {
				thickness: 0.16,
				width: 120,
				height: 120,
				min: 0,
				max: 100,
				step: 1,
				readOnly: true,
				displayPrevious: true,
				fgColor: vw_main_js.accent_color,
				font: 'inherit',
				fontWeight: 'inherit',
				'format' : function (v) {
					return v+'%';
				}
			} );
		}

		/*//////////////////////////////////////
		// Photo Proofing
		//////////////////////////////////////*/

		if ( $.fn.vwPhotoProofing ) {
			$( '.vw-gallery__proofing' ).vwPhotoProofing();
		}


		/*//////////////////////////////////////
		// Ticker
		//////////////////////////////////////*/

		if ( $.fn.easyTicker ) {
			$( '.vw-ticker__list' ).easyTicker( {
				visible: 1,
			} );
		}


		/*//////////////////////////////////////
		// Title Parallax Background
		//////////////////////////////////////*/

		if ( $.fn.vwTitleParallax ) {
			var $title = $( '.vw-title-area--has-bg .vw-title-area__inner' );
			var run =function() {
				$title.vwTitleParallax();
			}

			$(window).on("scroll", function() {
				window.requestAnimationFrame( run );
			} );

		}


		/*//////////////////////////////////////
		// Masonry layout
		//////////////////////////////////////*/

		if ( $.fn.vwIsotope ) {
			$( '.vw-isotope' ).vwIsotope( {
				// options
			} );
		}


		/*//////////////////////////////////////
		// Title Area Background
		//////////////////////////////////////*/

		if ( $.fn.vwTitleAreaBackground ) {
			$('body').vwTitleAreaBackground();
		}


		/*//////////////////////////////////////
		// Fix Viewport Size
		//////////////////////////////////////*/

		var $viewport = $( '.vw-viewport--full-height' );
		var curHeight = 0;

		if ( istouchable && $viewport.length ) {
			var calculate_viewport = function() {
				var newHeight = document.documentElement.clientHeight;

				if ( Math.abs( newHeight - curHeight ) > ( curHeight * 0.1 ) ) {
					$viewport.height( newHeight );
					curHeight = newHeight;
				}
			};

			$window.resize( debounce( calculate_viewport, 100 ) );
			calculate_viewport();
		}

		/*//////////////////////////////////////
		// Sliders
		//////////////////////////////////////*/

		if ( $.fn.slick ) {
			var slick_default_options = {
				arrows: true,
				dots: false,
				speed: parseInt( vw_main_js.slider_transition_speed ),
				autoplay: true,
				autoplaySpeed: parseInt( vw_main_js.slider_slide_duration ),
				useCSS: true,
				useTransform: true,
				infinite: true,
				adaptiveHeight: true,
				rtl: vw_main_js.is_rtl == '1',
			}

			// Remove loading class from all slides
			$('.vw-slides').on( 'init', function( slick ) {
				$( this ).removeClass( 'vw-slides--loading' );
			} );

			/**
			 * Carousel slider
			 */
			$( '.vw-carousel-slider-3 .vw-slides' ).slick( $.extend( {}, slick_default_options, {
				slidesToShow: 3,
				responsive: [
					{
						breakpoint: 767,
						settings: {
							slidesToShow: 2,
						}
					},
				],
			} ) );

			$( '.vw-carousel-slider-4 .vw-slides' ).slick( $.extend( {}, slick_default_options, {
				slidesToShow: 4,
				responsive: [
					{
						breakpoint: 767,
						settings: {
							slidesToShow: 2,
						}
					},
				],
			} ) );

			$( '.vw-carousel-slider-7 .vw-slides' ).slick( $.extend( {}, slick_default_options, {
				slidesToShow: 7,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							slidesToShow: 3,
						}
					},{
						breakpoint: 767,
						settings: {
							slidesToShow: 2,
						}
					},
				],
			} ) );

			/**
			 * Single slider
			 */
			$( '.vw-single-slider .vw-slides' ).slick( $.extend( {}, slick_default_options, {
				/* No Specific Option */
			} ) );
		}



		/*//////////////////////////////////////
		// Post Share Link
		//////////////////////////////////////*/

		if ( $.fn.vwShareLink ) {
			$( '.vw-post-share__link' ).vwShareLink();
		}



		/*//////////////////////////////////////
		// Scroll to top
		//////////////////////////////////////*/

		if ( $.fn.vwScroller ) {
			var $scroll_to_top = $('.vw-scroll-to-top');
			$scroll_to_top.vwScroller( { visibleClass: 'vw-scroll-to-top-visible' } );
			$scroll_to_top.on( 'click', function( e ) {
				e.preventDefault(); e.stopPropagation();

				$( 'html, body' ).animate( { scrollTop: 0 }, "easeInOut" );
			} );
		}



		/*//////////////////////////////////////
		 // More articles
		 //////////////////////////////////////*/ 

		if ( $.fn.vwScroller ) {
			var $more_articles = $('.vw-more-articles');
			$more_articles.vwScroller( { visibleClass: 'vw-more-articles--visible', position: 0.55 } )
			$more_articles.find( '.vw-more-articles__close-button' ).on( 'click', function() {
				$more_articles.hide();
			} );
		}



		/*//////////////////////////////////////
		// Mobile menu
		//////////////////////////////////////*/

		if ( $.fn.perfectScrollbar ) {
			$( '.vw-side-panel' ).perfectScrollbar();
		}

		$( '.vw-side-panel__backdrop' ).on( 'click', function( e ) {
			e.preventDefault(); e.stopPropagation();

			$( '.vw-open-side-panel' ).removeClass( 'vw-open-side-panel' );
			$( '.vw-mobile-nav-button button' ).removeClass( 'is-active' );

		} );
		
		$( '.vw-mobile-nav-button button' ).on( 'click', function( e ) {
			e.preventDefault(); e.stopPropagation();

			$( 'body' ).toggleClass( 'vw-open-side-panel' );
			$( this ).toggleClass( 'is-active' );

		} );



		var $sidemenu = $( '.vw-side-panel__menu' );
		var $sidesubmenu = $( '.vw-side-panel__sub-menu' );
		var submenutopoffset = 0;
		var mobile_pos = $( '.vw-side-panel__main-menu' ).position();
		if ( mobile_pos ) {
			submenutopoffset = mobile_pos.top;
		}

		$( '.vw-side-panel__sub-menu' ).css( 'top', submenutopoffset );

		var sidemenu_height = $sidemenu.height();
		$sidemenu.height( sidemenu_height );
		
		$( '.vw-side-panel__close-sub-menu' ).on( 'click', function( e ) {
			$sidemenu.removeClass( 'vw-side-panel__menu--opened');
			$sidemenu.height( sidemenu_height );
		} );

		$( '.vw-side-panel__main-menu .main-menu-item.menu-item-has-children' ).on( 'click', function( e ) {
			e.preventDefault(); e.stopPropagation();
			
			$sidesubmenu.find( '.sub-menu-wrapper' ).remove();
			$sidesubmenu.find( '.vw-menu-mobile' ).append( $( this ).find( '> .sub-menu-wrapper' ).clone() );
			$sidemenu.addClass( 'vw-side-panel__menu--opened');
			$sidemenu.height( $sidesubmenu.height() + submenutopoffset );
		} );


		/*//////////////////////////////////////
		// Fit video in the content area
		//////////////////////////////////////*/

		if ( $.fn.fitVids ) {
			$( [
				'.flxmap-container',
				'.comment-body',
				'.vw-main-post',
				'.vw-media-area',
				'.vw-side-media-area',
				'.vw-post-content',
				'.vw-post-media',
				'.vw-post-box__content',
				// '.wp-video-shortcode',
				'#footer',
			].join( ", " ) ).fitVids( {
				customSelector: "iframe[src*='maps.google.'], iframe[src*='soundcloud.com']",
			} );
			
		}



		
		

		/*//////////////////////////////////////
		// Share box & Image light box
		//////////////////////////////////////*/

		if ( $.fn.magnificPopup ) {
			// Add light box to featured image & all image links in post content
			var magnific_options = {
				type: 'image',
				mainClass: 'my-mfp-zoom-in',
				closeOnContentClick: true,
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload before current, and 1 after the current image
				},
				image: {
					verticalFit: true,
				},
				zoom: {
					enabled: false,
					duration: 300, // don't foget to change the duration also in CSS
				}
			};

			$.each( [
				'.vw-post-media--featured a',
				'.vw-post-content a[href*=".png"], .vw-post-content a[href*=".jpg"], .vw-post-content a[href*=".jpeg"]',
				'.vw-post-box__play',
				'.vw-post-box__zoom',
				'.vw-gallery__zoom',
			], function( i, selector ) {
				$( selector ).magnificPopup( magnific_options );
			} );
		}


		/*//////////////////////////////////////
		// Menu
		//////////////////////////////////////*/

		$( '.vw-menu-top, .vw-menu-main, .vw-menu-bottom' ).find( '.vw-menu' ).superfish( {
			popUpSelector: '.sub-menu-wrapper',
			delay: 500,
			animation: { opacity: 'show', marginTop: 0 },
			animationOut: { opacity: 'hide', marginTop: 10 },
			speed: 200,
			speedOut: 100,
			autoArrows: false,
		} );



		/*//////////////////////////////////////
		// Instant search
		//////////////////////////////////////*/
		if ( $.fn.instant_search ) {
			$( '.vw-instant-search__button' ).instant_search();
		}



		/*//////////////////////////////////////
		// Ajax pagination
		//////////////////////////////////////*/

		if ( $.fn.vwPaginationAjax ) {
			$( '.vw-content-main, .vwspc-section' ).vwPaginationAjax();
		}



		/*//////////////////////////////////////
		// Tabular widget
		//////////////////////////////////////*/

		if ( $.fn.vwFixedTab ) {
			$('.vw-fixed-tab').vwFixedTab();
		}



		/*//////////////////////////////////////
		// Hover Intent
		//////////////////////////////////////*/

		if ( $.fn.hoverIntent ) {
			$( '.vw-hoverintent' ).hoverIntent( {
				over: function() {
					$(this).addClass( 'vw-hover' );
				},
				out: function() {
					$(this).removeClass( 'vw-hover' );
				},
				timeout: 300,
			} );
		}

		

		/*//////////////////////////////////////
		// Sticky Sidebar
		//////////////////////////////////////*/

		if ( $.fn.theiaStickySidebar ) {
			var offset = 15;

			if ( $( '#wpadminbar' ) ) {
				offset += $( '#wpadminbar' ).height();
			}
			
			$('.vw-enable-sticky-sidebar .vw-content-sidebar, .vw-enable-sticky-sidebar .vwspc-section-sidebar').theiaStickySidebar({
				additionalMarginTop: offset,
			});
		}



		/*//////////////////////////////////////
		// WooCommerce Cart Button
		//////////////////////////////////////*/
		var $cart_panel = $( '.vw-cart-button-wrapper .vw-cart-button-panel' );
		$( '.vw-cart-button' ).on( 'click', function( e ) {
			e.preventDefault();

			if ( ! $cart_panel.is( ':visible' ) ) {
				$cart_panel.fadeIn( 150 );
			} else {
				$cart_panel.fadeOut( 150 );
			}

			return false;
		} );

		$( document ).mousedown( function( e ) {
			if ( ( ! $cart_panel.is(e.target) && $cart_panel.has(e.target).length === 0 ) ) {
				$cart_panel.fadeOut( 150 );
			}
		} );


		/*//////////////////////////////////////
		// Waypoint Inview
		//////////////////////////////////////*/
		setTimeout( function(){
			$( '.vw-loop:not( .vw-disable-inview )' ).each( function( i, el ) {
				$( el ).find( '.vw-inview' ).vwInView();
			} );

			$( '.vw-inview-shortcode' ).vwInView();
		}, 150 );

	} );





	$( window ).load( function() {

		/*//////////////////////////////////////
		// Sticky bar
		//////////////////////////////////////*/
		$( '.vw-enable-sticky-menu .vw-sticky-menu' ).vwSticky();
	} )

})( jQuery, window , document );