jQuery.fn.inView = function(inViewType){
	var viewport = {};
	viewport.top = jQuery(window).scrollTop();
	viewport.bottom = viewport.top + jQuery(window).height();
	var bounds = {};
	bounds.top = this.offset().top;
	bounds.bottom = bounds.top + this.outerHeight();
	switch(inViewType){
	  case 'bottomOnly':
		return ((bounds.bottom <= viewport.bottom) && (bounds.bottom >= viewport.top));
	  case 'topOnly':
		return ((bounds.top <= viewport.bottom) && (bounds.top >= viewport.top));
	  case 'both':
		return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom));         
	  default:     
		return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom));        
	}
};

function contentWrapperH() {

	jQuery(document).on('ready', function() {
		var contentWrapper = jQuery('.iv-layout.content-wrapper');
		if (jQuery('#all-site-wrapper').height() <= jQuery(window).height()) {
			contentWrapper.css('min-height', 400);
		};
	});
};
contentWrapperH();

function iv_cancelZoom() {
	"use strict";

	var d = document,
		viewport,
		content,
		maxScale = ',maximum-scale=',
		maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;
 
	// this should be a focusable DOM Element
	if(!this.addEventListener || !d.querySelector) {
		return;
	}
 
	viewport = d.querySelector('meta[name="viewport"]');
	content = viewport.content;
 
	function changeViewport(event)
	{
		// http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
		viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
	}
 
	// We could use DOMFocusIn here, but it's deprecated.
	this.addEventListener('focus', changeViewport, true);
	this.addEventListener('blur', changeViewport, false);
}


jQuery.fn.cancelZoom = function() {
	return this.each(iv_cancelZoom);
};
/* Media Query Vars */

var _window_width = jQuery(window).width();

var iv_device_xs = false;
if( _window_width < 768 )
	iv_device_xs = true;

var iv_device_sm = false;
if( _window_width >= 768 && _window_width < 992 )
	iv_device_sm = true;

var iv_device_md = false;
if( _window_width >= 992 && _window_width < 1200 )
	iv_device_md = true;

var iv_device_lg = false;
if( _window_width >= 1200)
	iv_device_lg = true;


function smoothScroll(scrollTime, scrollDistance){
		
	var scrollTime = scrollTime;			//Scroll time
	var scrollDistance = scrollDistance;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll

	if (navigator.userAgent.indexOf('Mac') != -1 || navigator.userAgent.indexOf('Firefox') > -1 || jQuery('body').hasClass('is-horizontal')) {
		return;
	};
	jQuery(window).on("mousewheel DOMMouseScroll", function(event){
		
		event.preventDefault();	
										
		var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
		var scrollTop = jQuery(window).scrollTop();
		var finalScroll = scrollTop - parseInt(delta*scrollDistance);
			
		TweenMax.to(jQuery(window), scrollTime, {
			scrollTo : { y: finalScroll, autoKill:true },
				ease: Expo.easeOut,	//For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
				autoKill: true,
				overwrite: 5							
			});
					
	});
		
};

/*
 *	Recalculate Sticky Wrapper Height
 */
function ivan_recalc_sticky_height() {
	"use strict";

	var _h = jQuery('.iv-layout.header').outerHeight( false );
	jQuery('.header-sticky-wrapper').css('height', _h + 'px');
}

/*!
 * Init 
 *Sideheader
 */
function sideHeaderInit() {
	var sideheader = jQuery('#sideheader');
	sideheader.show();
	if ( jQuery('.header-left-area').find('.sideheader-trigger').length ) {
		var liSideheaderTrigger = jQuery('.header-left-area').find('.sideheader-trigger').wrap('<li class="li-sideheader-trigger" />');
		jQuery('.li-sideheader-trigger').appendTo('#menu-primary-menu');
	};
	if (sideheader.length) {
		sideheader.perfectScrollbar();
		jQuery('.sideheader-trigger a').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			sideheader.toggleClass('is-visible');
			jQuery('body').toggleClass('sideheader-visible');
			if (jQuery('.header').hasClass('stuck')) {
				jQuery('.header').addClass('fadeOutUp');
			};
		});
		jQuery(document).on('click', function(e) {

			var _element = sideheader;

			if (!_element.is(e.target) // if the target of the click isn't the container...
				&& _element.has(e.target).length === 0 ) // ... nor a descendant of the container
			{
				sideheader.removeClass('is-visible');
				jQuery('body').removeClass('sideheader-visible');
			}
		});
		jQuery(window).on('scroll', function(e) {

			sideheader.removeClass('is-visible');
			jQuery('body').removeClass('sideheader-visible');
		});
	};
}
/* Calls Sideheader Init script  */
sideHeaderInit();


/*!
 * Flexible Header Height
 *
 * Function used to turn header height half the actual size depending of Window Scroll
 *
 */
function ivan_fixed_header() {
	"use strict";
	

	if( jQuery('.header-fixed').length > 0 ) {

		if (jQuery('.iv-layout.header').hasClass('style5') == true) {

			jQuery('.negative-push').css('height', jQuery('.iv-layout.header').height());
		};

		var _animTopDest = '0px';

		jQuery('.header-fixed').find('.logo').imagesLoaded(function() {

			var $headerFixed = jQuery('.iv-layout.header'),
				_logoHeight = $headerFixed.find('.logo img:visible').outerHeight(),
				_headerHeight = $headerFixed.outerHeight(),
				_foldHeight = -_logoHeight - 150,
				_window = jQuery(window),
				_classFold = '',
				headerHeight,
				_class = '';

			if( $headerFixed.hasClass('light') )
				_class = 'light';
			if( $headerFixed.hasClass('dark') )
				_class = 'dark';
			if(_logoHeight == 0) {
				setTimeout( function() { ivan_fixed_header(); }, 500 );
				return;
			}
			if( $headerFixed.hasClass('display-after-fold') ) {
				_classFold = 'display-after-fold';

				_foldHeight = -jQuery.waypoints('viewportHeight') + (_headerHeight - 1);
			}

			if ( jQuery('.iv-layout.top-header').length ) {
				headerHeight = jQuery('.iv-layout.top-header').outerHeight() + _headerHeight;
			} else {
				headerHeight = _headerHeight;
			};

			$headerFixed.addClass('not-stuck');

			_window.on('scroll', function() {
				if ( _window.scrollTop() >= headerHeight ){
					$headerFixed.removeClass('not-stuck').addClass('stuck');
					jQuery('body').addClass('header-stuck');

					ivan_fix_header_area_height();

					$headerFixed.removeClass( _class );
					$headerFixed.removeClass( _classFold );
			
					if( $headerFixed.hasClass('hide-container') == true ) {
						$headerFixed.find('.to-hide').css('display', 'none');
					}

					if(_logoHeight > 0) {
						$headerFixed.find('.logo img').css({ maxHeight: (_logoHeight * 0.7) + 'px'});
					}
				} else {
					$headerFixed.addClass('not-stuck').removeClass('stuck');
					jQuery('body').removeClass('header-stuck');

					$headerFixed.find('.logo img').css({ maxHeight: 'inherit'});
					$headerFixed.addClass( _class );
					$headerFixed.addClass( _classFold );

					if( $headerFixed.hasClass('hide-container') == true ) {
						$headerFixed.find('.to-hide').css('display', 'block');
						//ivan_recalc_sticky_height();
					}

					$headerFixed.parent('.sticky-wrapper').outerHeight(_headerHeight);
				}
			});
		}); // imagesLoaded Logic
	}

	// Or in aside menu case...
	if( jQuery('.aside-header-wrapper .fixed-height').length > 0 ) {

		var $headerFixed = jQuery('.aside-header-wrapper .fixed-height');

		$headerFixed.waypoint('sticky', {
			wrapper: '<div class="aside-sticky-wrapper aside-header-sticky-wrapper" />',
			stuckClass: 'aside-stuck'
		});	
	}
}

/*!
 * 
 * Function used to enable vertical header
 *
 */
function verticalHeader() {
	var header = jQuery('.header.vertical').not('.modern');

	if (header.length) {
		header.perfectScrollbar()

		header.find('li').children('a').on('click', function(event) {
			var $this = jQuery(this),
				subMenu = $this.siblings('ul');
			if(subMenu.length) {
				event.preventDefault();
				subMenu.slideToggle();
				header.perfectScrollbar('update');
				$this.parent().toggleClass('open');
			}
		});
	};
}
verticalHeader();

/*!
 * Init Live Search
 *
 * Function used to enable live search effects
 *
 */
function ivan_live_search_init() {
	"use strict";
	var searchTopStyle = jQuery('.live-search.search-top-style'),
		searchfullScreen = jQuery('.live-search.search-full-screen-style'),
		searchfullScreenAlt = jQuery('.live-search.search-full-screen-alt-style'),
		formCloseBtn = jQuery('.live-search').find('.form-close-btn');

	jQuery('.live-search .trigger').click( function(e) {

		e.preventDefault();

		var _element = jQuery(this).siblings('.inner-wrapper');

		if ( jQuery(this).parents('.live-search').hasClass('search-top-style') == true ) {
			jQuery('body').addClass('top-search-active');
			if ( jQuery('.iv-layout.header.stuck').length ) {
				jQuery('.iv-layout.header.stuck').addClass('top-search-active');
			};
		};

		_element.toggleClass('visible');

		if (!jQuery(this).parents('.iv-layout').hasClass('top-header') == true) {
			jQuery('.top-header').addClass('beneath');
		} else if (jQuery(this).parents('.iv-layout').hasClass('top-header') == true) {
			jQuery('.top-header').removeClass('beneath');
		}

		setTimeout(function(){
			_element.find('#s').focus().end()
		}, 300);
		
	});

	if ( searchTopStyle.length && jQuery(window).width() >= 992 ) {
		jQuery(window).on('scroll', function() {
			if ( searchTopStyle.find('.inner-wrapper').hasClass('visible') ) {
				searchTopStyle.find('.inner-wrapper').removeClass('visible');
				jQuery('body').removeClass('top-search-active');
			};
		});
	};

	jQuery(document).mouseup( function(e) {

		var _element = jQuery('.inner-wrapper.visible');

		if (!_element.is(e.target) // if the target of the click isn't the container...
			&& _element.has(e.target).length === 0 ) // ... nor a descendant of the container
		{

			if(jQuery(this).parents('.header.simple-left-right').length == 0) {
				if( _element.hasClass('visible') ) {
					_element.removeClass('visible');
				}
			} else {
				if( _element.hasClass('visible') ) {
					_element.removeClass('visible');
				}
			}
			if ( searchTopStyle.length ) {
				// jQuery('#all-site-wrapper').css('top', 0);
				jQuery('body').removeClass('top-search-active');
				if ( jQuery('.iv-layout.header.stuck').length ) {
					jQuery('.iv-layout.header.stuck').removeClass('top-search-active');
				};
			};
		}

	});

	formCloseBtn.on('click', function() {
		var _element = jQuery('.inner-wrapper.visible');
		_element.removeClass('visible');
		if ( jQuery('.iv-layout.header.stuck').length ) {
			jQuery('.iv-layout.header.stuck').removeClass('top-search-active');
		};
		setTimeout(function(){
			jQuery('.top-header').removeClass('beneath')	
		}, 500);
	});

	if ( searchTopStyle.length ) {
		searchTopStyle.find('.form-close-btn').css('right', searchTopStyle.find('form').offset().left);
		formCloseBtn.on('click', function() {
			var _element = jQuery('.inner-wrapper.visible');
			_element.removeClass('visible');
			jQuery('body').removeClass('top-search-active');
		});
	};


	jQuery('.live-search .submit-form').click( function(e) {

		e.preventDefault();

		jQuery(this).parents('form').submit();

	});
}

/*!
 * Init Woo Cart
 *
 * Function used to enable cart effects
 *
 */
function ivan_woo_cart_init() {
	"use strict";

	if(jQuery(window).width() > 992) {
		
		jQuery('.woo-cart').hover( function() {

			var _element = jQuery(this).find('.inner-wrapper');

			_element.addClass('visible');

			if(jQuery(this).parents('.header.simple-left-right').length == 0) {
				_element.animate( { opacity: 1 }, 400 );
			} else {
				_element.css('opacity', '1');
			}

		}, function() {

			var _element = jQuery(this).find('.inner-wrapper');

			if(jQuery(this).parents('.header.simple-left-right').length == 0) {
				_element.animate( { opacity: 0 }, 150, function() {
					_element.removeClass('visible');
				} );
			} else {
				_element.css('opacity', '0');
				_element.removeClass('visible');
			}

		});

	} // End window size logic

}

/*!
 * Init Woo Cart
 *
 * Function used to enable cart effects
 *
 */
function ivan_wpml_languages_dropdown_init() {
	"use strict";
		
		jQuery('.wpml-lang-dropdown').hover( function() {

			var _element = jQuery(this).find('.inner-wrapper');

			_element.addClass('visible');

			_element.css('opacity', '1');


		}, function() {

			var _element = jQuery(this).find('.inner-wrapper');

				_element.css('opacity', '0');
				_element.removeClass('visible');

		});

}

/*!
 * Init Login with AJAX
 *
 * Function used to enable live search effects
 *
 */
function ivan_login_ajax_init() {
	"use strict";

	jQuery('.login-ajax .trigger').click( function(e) {

		var _element = jQuery(this).siblings('.inner-wrapper');

		_element.addClass('visible');

		_element.find('#lwa_user_login').focus();

		e.preventDefault();
	});

	jQuery(document).mouseup( function(e) {

		var _element = jQuery('.inner-wrapper.visible');

		if (!_element.is(e.target) // if the target of the click isn't the container...
			&& _element.has(e.target).length === 0 ) // ... nor a descendant of the container
		{
			_element.removeClass('visible');
		}

	});
}

/*!
 * Init Responsive Menus
 *
 * Function used to enable responsive menus
 *
 */
function ivan_responsive_menus_init() {
	"use strict";

	setTimeout(function() {
		
		jQuery('.mobile-menu-trigger').each( function() {

			var _selector = jQuery(this).attr('data-selector');
			var _id = jQuery(this).attr('data-id');
			var _menuExists = true;

			if( jQuery(_selector + ' .menu').length <= 0 ) {
				_menuExists = false;
			}

			if( _menuExists == true ) {

				_selector += ' .menu';

				jQuery('body').prepend('<div class="iv-mobile-menu-wrapper" id="' + _id + '"><div class="iv-mobile-menu-holder"><div class="iv-mobile-menu-inner"><div class="iv-mobile-menu-close"><a href="#"><span class="icon-arrow-left xbig"></span></a></div><div class="modules"></div><div class="menu-wrap"></div></div></div></div>');

				jQuery('#' + _id + ' .iv-mobile-menu-inner .modules').append( jQuery( _selector ).parents('.iv-layout').find('.social-icons, .custom-text').clone().removeClass('hidden-xs hidden-sm') );

				jQuery('#' + _id + ' .iv-mobile-menu-inner .menu-wrap').append( jQuery( _selector ).clone().removeClass('mega_main_menu_ul').attr('id', '') );

				jQuery('#' + _id).find('.post_type_dropdown .mega_dropdown, .grid_dropdown .mega_dropdown, .widgets_dropdown  .mega_dropdown').remove();

				jQuery('#' + _id).find('.menu > .menu-item-has-children > .item_link').click(function(e) {

					if(jQuery(this).hasClass('opened') == false) {
						e.preventDefault();

						jQuery(this).siblings('ul').slideToggle('slow')

						jQuery(this).addClass('opened');
					} else {
						return true;
					}

				});
			} else {

				// Special code used when 
				jQuery('body').prepend('<div class="iv-mobile-menu-wrapper" id="' + _id + '"><div class="iv-mobile-menu-holder"><div class="iv-mobile-menu-inner"><div class="iv-mobile-menu-close"><a href="#"><span class="arrow_left"></a></div><div class="modules"></div><div class="menu-wrap"></div></div></div></div>');

				jQuery('#' + _id + ' .iv-mobile-menu-inner .modules').append( jQuery( _selector ).find('.social-icons, .custom-text').clone().removeClass('hidden-xs hidden-sm') );
			}

			jQuery(this).on('click', function(e) {

				e.preventDefault();

				jQuery('#' + _id).addClass('slideIn');

			});

		});

		jQuery('.iv-mobile-menu-close').click( function(e) {

			e.preventDefault();

			jQuery(this).parents('.iv-mobile-menu-wrapper').removeClass('slideIn');

		});
		
	}, 1000);
}
/*!
 * Init Overlay Menus
 *
 * Function used to enable responsive menus
 *
 */
function ivan_overlay_menus_init() {
	"use strict";

	setTimeout(function() {
		
		jQuery('.overlay-menu-trigger').each( function() {

			var _selector = jQuery(this).attr('data-selector');
			var _id = jQuery(this).attr('data-id');
			var _menuExists = true;

			if( jQuery(_selector + ' .menu').length <= 0 ) {
				_menuExists = false;
			}

			if( _menuExists == true ) {

				_selector += ' .menu';

				jQuery('body').prepend('<div class="iv-mobile-menu-wrapper  iv-overlay-menu-wrapper" id="' + _id + '"><div class="iv-mobile-menu-holder"><div class="iv-mobile-menu-inner"><div class="iv-mobile-menu-close"><a href="#"><span class="icon-minimize xbig"></span></a></div><div class="modules"></div><div class="menu-wrap"></div></div></div></div>');

				jQuery('#' + _id + ' .iv-mobile-menu-inner .modules').append( jQuery( _selector ).parents('.iv-layout').find('.social-icons, .custom-text').clone().removeClass('hidden-xs hidden-sm') );

				jQuery('#' + _id + ' .iv-mobile-menu-inner .menu-wrap').append( jQuery( _selector ).clone().removeClass('mega_main_menu_ul').attr('id', '') );

				jQuery('#' + _id).find('.post_type_dropdown .mega_dropdown, .grid_dropdown .mega_dropdown, .widgets_dropdown  .mega_dropdown').remove();

				jQuery('#' + _id).find('.menu > .menu-item-has-children > .item_link').click(function(e) {

					if(jQuery(this).hasClass('opened') == false) {
						e.preventDefault();

						jQuery(this).siblings('ul').slideToggle('slow')

						jQuery(this).addClass('opened');
					} else {
						return true;
					}

				});
			} else {

				// Special code used when 
				jQuery('body').prepend('<div class="iv-mobile-menu-wrapper" id="' + _id + '"><div class="iv-mobile-menu-holder"><div class="iv-mobile-menu-inner"><div class="iv-mobile-menu-close"><a href="#"><span class="arrow_left"></a></div><div class="modules"></div><div class="menu-wrap"></div></div></div></div>');

				jQuery('#' + _id + ' .iv-mobile-menu-inner .modules').append( jQuery( _selector ).find('.social-icons, .custom-text').clone().removeClass('hidden-xs hidden-sm') );
			}

			jQuery(this).on('click', function(e) {

				e.preventDefault();

				jQuery('#' + _id).addClass('slideIn');
				jQuery('body').addClass('overflow-hidden-menu');

			});

		});

		jQuery('.iv-mobile-menu-close').click( function(e) {

			e.preventDefault();

			jQuery(this).parents('.iv-mobile-menu-wrapper').removeClass('slideIn');
			jQuery('body').removeClass('overflow-hidden-menu');

		});
		
	}, 1000);
}

/*!
 * Init Responsive Menus Selects
 *
 * Function used to enable responsive menus inside a select
 *
 */
function ivan_responsive_menus_select_init() {
	"use strict";

	jQuery('.responsive-menu-select').each( function() {

		var _selector = jQuery(this).attr('data-selector');
		
		jQuery(_selector).tinyNav({
			active: 'dummy',
			header: ' ',
			indent: '- ',
			place: jQuery(this).find('.receptor')
		});

	});

}

/*!
 * Init FullWidth MegaMenu
 *
 * Function used to fix megamenu fullwidth sizes
 *
 */
function ivan_megamenu_init() {
	"use strict";

	if(iv_device_md == true || iv_device_lg == true) {

		if( jQuery('body').hasClass('ivan-m-l-aside') == false ) {

			var _container;

			if (jQuery('.iv-layout.header').find('.container').length) {
				_container = jQuery('.iv-layout.header').find('.container');
			} else {
				_container = jQuery('.container').first();
			}

			var _containerWidth = parseInt(_container.width(), 10),
				_containerOffset = parseInt(_container.offset().left, 10),
				_containerPadding = parseInt(_container.css("padding-left"), 10);

			jQuery('.header .mega_main_menu:not(.direction-vertical), .top-header .mega_main_menu').each(function() {			

				jQuery(this).find('.mega_main_menu_ul > .submenu_full_width > .mega_dropdown').each( function(e) {

					var $this = jQuery(this);

					$this.css('width', '');
					$this.css('left', '');

					var _offWrapper = $this.offset().left,
						_offset = _offWrapper - _containerOffset - _containerPadding,
						_offsetN = -(Math.abs(_offWrapper - _containerOffset));

					$this.css("width", _containerWidth);
					$this.css("left", _offsetN);
				});
			});
		}
	}
}

 /*!
 * Init Negative Height
 *
 * Function used to add negative height header support
 *
 */

var ivan_title_paddingTop = null;
var ivan_header_marginTop = 0;
var ivan_negative_header_calls = 0;
function ivan_negative_height_init() {
	"use strict";

	var ivLayoutHeader = jQuery('.iv-layout.header');

	if( ivLayoutHeader.hasClass('negative-height') == true ) {

		var _h;

		if(ivLayoutHeader.hasClass('header-fixed')) {
			_h = jQuery('.header-sticky-wrapper').outerHeight( true );

			_h += ivan_header_marginTop;
		}
		else
			_h = jQuery('.iv-layout.header.negative-height').outerHeight( true );

		// Specific to when title wrapper is on
		if( jQuery('.iv-layout.title-wrapper').length > 0 ) {

			ivLayoutHeader.css('display', 'block');

			if( jQuery('.iv-layout.title-wrapper').length > 0 ) {

				if( ivLayoutHeader.hasClass('show-after-fold') == false ||
					ivLayoutHeader.hasClass('keep-logo-before-fold') == true ) {

					if( ivan_title_paddingTop == null )
						ivan_title_paddingTop = parseInt( jQuery('.iv-layout.title-wrapper').css('padding-top').replace("px", "") );

				}
			}

		} else {

			ivLayoutHeader.css('display', 'block');

		}

		ivLayoutHeader.find('.logo').imagesLoaded(function(){
			ivan_negative_height_init();
		});
	}
}
function headerTitleFade(){
	var topBanner = jQuery('.iv-layout.title-wrapper-large'),
		title = topBanner.find('h2'),
		titleDesc = topBanner.find('.title-description'),
		breadcrumbs = topBanner.find('.ivan-breadcrumb'),
		introSectionHeight = topBanner.outerHeight(),
		opacitySpeed = 1; 
	var MQ = 991;

	triggerAnimation();
	jQuery(window).on('resize', function(){
		triggerAnimation();
	});
	function triggerAnimation(){
		if(jQuery(window).width()>= MQ) {
			jQuery(window).on('scroll', function(){
				window.requestAnimationFrame(animateIntro);
			});
		} else {
			jQuery(window).off('scroll');
		}
	}
	function animateIntro () {
		var scrollPercentage = (jQuery(window).scrollTop()/introSectionHeight).toFixed(5);

		if( jQuery(window).scrollTop() < introSectionHeight) {
			title.css({
				'opacity': 1 - scrollPercentage * 2
			});
			titleDesc.css({
				'opacity': 1 - scrollPercentage * 2
			});
			breadcrumbs.css({
				'opacity': 1 - scrollPercentage * 2
			});
		}
	};
};

/*!
 *
 * Sticky Footer
 *
 */
function stickyFooter(){
	var stickyFooterEnabled = jQuery('body').hasClass('sticky-footer'),
		mainFooter = jQuery('.iv-layout.footer'),
		bottomFooter = jQuery('.iv-layout.bottom-footer'),
		contentWrapper = jQuery('.iv-layout.content-wrapper'),
		relatedProjectsHolder = jQuery('.ivan-related-projects-holder'),
		mainFooterH = 0,
		bottomFooterH = 0;

	if (mainFooter.length && bottomFooter.length && jQuery('body').hasClass('sticky-footer')) {
		jQuery('.iv-layout.footer, .iv-layout.bottom-footer').imagesLoaded(function(){
			mainFooterH = parseInt(mainFooter.outerHeight(), 10);
			bottomFooterH = parseInt(bottomFooter.outerHeight(), 10);
			
			mainFooter.css('bottom', bottomFooterH);
			if (relatedProjectsHolder.length) {
				relatedProjectsHolder.css({
					'margin-bottom': mainFooterH + bottomFooterH - 1
				});
			} else {
				contentWrapper.css({
					'margin-bottom': mainFooterH + bottomFooterH - 1
				});
			};
		});
	} else if (mainFooter.length && ! bottomFooter.length && jQuery('body').hasClass('sticky-footer')) {
		mainFooter.imagesLoaded(function(){
			mainFooterH = parseInt(mainFooter.outerHeight(), 10);
			if (relatedProjectsHolder.length) {
				relatedProjectsHolder.css({
					'margin-bottom': mainFooterH
				});
			} else {
				contentWrapper.css({
					'margin-bottom': mainFooterH
				});
			};
		});
	} else if (! mainFooter.length && bottomFooter.length && jQuery('body').hasClass('sticky-footer')) {
		mainFooter.imagesLoaded(function(){
			bottomFooterH = parseInt(bottomFooter.outerHeight(), 10);
			if (relatedProjectsHolder.length) {
				relatedProjectsHolder.css({
					'margin-bottom': bottomFooterH
				});
			} else {
				contentWrapper.css({
					'margin-bottom': bottomFooterH
				});
			};
		});
	};
}

/*!
 * Post Formats init
 *
 * Function used to start carousels and lightboxes of posts
 *
 */
function ivan_post_formats_init() {
	"use strict";

	var _autoHeight = true;

	if(jQuery('.ivan-mansory-blog').length > 0)
		_autoHeight = false;

	if(jQuery('.post-gallery-carousel').length > 0) {
		jQuery('.post-gallery-carousel').imagesLoaded(function(){

			jQuery('.post-gallery-carousel').owlCarousel({
				theme: "style-outline-circle",
				singleItem: true,
				items: 1,
				loop: true,
				nav: true,
				navText: ["<div class='carousel-left'><svg class='icon icon--prev'><use xlink:href='#icon-prev'></use></svg></div>","<div class='carousel-right'><svg class='icon icon--next'><use xlink:href='#icon-next'></use></svg></div>"],
				autoHeight: true,
				pagination: true
			});
		});
	}

	//'.format-gallery .thumbnail .post-gallery-carousel-item a, .format-image .thumbnail a')

	jQuery('.format-gallery, .format-image, .single-post .format-standard').each(function() {
		jQuery(this).find('.thumbnail a').magnificPopup({
			type: 'image',
			gallery:{
				enabled: true
			}
		});
	});
	
}

/*!
 * Gallery Shortcode Improved
 *
 * Function used to start lightbox in gallery items and mansory
 *
 */
function ivan_post_wp_gallery_init() {
	"use strict";

	var container = document.querySelector('.gallery');

	if( null != container) {

		jQuery('.gallery').each(function() {

			jQuery(this).find('.gallery-item a').magnificPopup({
				type: 'image',
				image: {
					verticalFit: false
				},
				gallery:{
					enabled: true
				}
			});

		}); 

		var pckry;

		imagesLoaded( container, function() {
			pckry = new Packery( container, {
				itemSelector: '.gallery-item',
				gutter: 0
			});
		});
	}

	/* PrettyPhoto replaced by Magnific */
	jQuery('a.prettyphoto').unbind('click.prettyphoto');
	jQuery('a.prettyphoto').unbind('click');
	jQuery('.prettyphoto').each(function() {
		jQuery(this).prettyPhoto({
			overlay_gallery: false,
			markup: '<div class="pp_pic_holder"> \
					<div class="pp_content_container"> \
						<div class="pp_right"> \
							<div class="pp_content"> \
								<div class="pp_loaderIcon"></div> \
								<div class="pp_fade"> \
									<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
									<div id="pp_full_res"></div> \
								</div> \
							</div> \
						</div> \
					</div> \
					<div class="pp_bottom"> \
						<div class="pp_left"> \
							<a href="#" class="pp_arrow_previous">Previous</a> \
							<a href="#" class="pp_arrow_next">Next</a> \
						</div> \
						<div class="pp_middle"> \
							<p class="currentTextHolder">0/0</p> \
						</div> \
						<div class="pp_right"> \
							<a class="pp_close" href="#">Close</a> \
						</div> \
					</div> \
				</div> \
				<div class="pp_overlay"></div>'
		});
	});

	/* Tiled Gallery JetPack */
	jQuery('.tiled-gallery a').magnificPopup({
		type: 'image',
		image: {
			verticalFit: false
		},
		gallery:{
			enabled: true
		}
	});	

	/* PrettyPhoto replaced by Magnific */
	jQuery('.ivan-lightbox a, a.ivan-lightbox').each(function() {
		jQuery(this).magnificPopup({
			type: 'image',
			image: {
				verticalFit: false
			},
			gallery:{
				enabled: true
			}
		});
	});
}

/*!
 * Load Back to Top Button
 *
 * Function used to display and configure back to top button
 *
 */
function ivan_back_to_top_init() {
	"use strict";

	var $back_top = jQuery('#back-top');

	var $next_prev_fixed = jQuery('.post-nav-fixed');

	// When user click it, animate to top
	$back_top.click( function(e) {
		e.preventDefault();

		jQuery('body, html').animate( {scrollTop: 0}, jQuery(window).scrollTop() / 3, 'linear' );
	});

	var _windowHeight = jQuery.waypoints('viewportHeight');
	var _windowHeightPart = jQuery.waypoints('viewportHeight') * 0.5;

	// Add class on and off according to 
	jQuery(window).scroll( function() {

		var _currentScroll = jQuery(this).scrollTop();

		if($back_top.length > 0 ) {
			if( _currentScroll > _windowHeight ) {
				$back_top.removeClass('off');
				$back_top.addClass('on');
			} else {
				$back_top.removeClass('on');
				$back_top.addClass('off');
			}
		}

		if($next_prev_fixed.length > 0 ) {
			if( _currentScroll > _windowHeightPart ) {
				$next_prev_fixed.removeClass('off');
				$next_prev_fixed.addClass('on');
			} else {
				$next_prev_fixed.removeClass('on');
				$next_prev_fixed.addClass('off');
			}
		}

	});
	
}

function initWow(){
	if ( jQuery('.wow').length ) {
		var wow = new WOW({mobile: false});
		wow.init();
	};
};
initWow();

/*!
* Floated Contact Form
*
*/
function floatedContactForm(){
	var el = jQuery('.floated-contact-form'),
		trigger = el.find('.form-trigger');

	trigger.on('click', function(event) {
		event.preventDefault();
		if ( el.length ) {
			el.toggleClass('visible-form');
		}
	});
	jQuery(document).on('click', function(e) {

		if (!el.is(e.target) // if the target of the click isn't the container...
			&& el.has(e.target).length === 0 ) // ... nor a descendant of the container
		{
			if ( el.length ) {
				el.removeClass('visible-form');
			};
		};

	});
	// Add class on and off according to 
	jQuery(window).scroll( function() {

		if ( jQuery('#back-top').hasClass('on') == true ) {
			el.addClass('slideIn');
		} else if ( jQuery('#back-top').hasClass('off') == true ) {
			el.removeClass('slideIn');
		};

	});
}


/*!
 * Initializing Videos
 *
 */

function mediaElmenetsVideos() {
	var video = jQuery('video'),
		fullwidthVideo = jQuery('.video-fullwidth');

	if (video.length && typeof jQuery.fn.mediaelementplayer == 'function') {
		video.mediaelementplayer();
	};
	if (fullwidthVideo.length && typeof jQuery.fn.mediaelementplayer == 'function') {
		fullwidthVideo.each(function() {
			var $this = jQuery(this),
				middleContent = $this.find('.content-middle'),
				bottomContent = $this.find('.content-bottom');
			$this.find('video').on('play', function(){
				middleContent.fadeOut('200');
				bottomContent.fadeOut('200');
			});
			$this.find('video').on('pause', function(){
				middleContent.fadeIn('200');
				bottomContent.fadeIn('200');
			});
		});
	}
}


/*!
 * Initializing Tweets Slider
 *
 */

function tweetsSlider() {
	var el = jQuery('.tweets-slider');

	if (el.length && typeof jQuery.fn.owlCarousel == 'function') {
		el.children('ul').owlCarousel({
			items: 1,
			singleItem: true,
			dots: true
		});
	};
}

/*!
 * Initializing Video Popup
 *
 */
function videoPopup() {
	var el = jQuery('.video-fullwidth');

	if (el.length) {
		el.find('.video-play-trigger').magnificPopup({
			type: 'iframe'
		});
	};
};

/*!
 * Circular Countdown
 *
 */

function circularCountdown() {
	var el = jQuery('.ccounter'),
		targetDate = el.data('target-date'),
		targetTime = el.data('target-time');
	if (el.length) {
		targetDate = targetDate.split(',');
		targetTime = targetTime.split(':');
		el.ccountdown(targetDate[0],targetDate[1],targetDate[2],'' + targetTime[0] + ':' + targetTime[1] + '');
	};
};
circularCountdown();

/*!
 * Steps Function
 *
 */
function steps() {
	var el = jQuery('.step');
	if (el.length) {
		el.imagesLoaded(function(){
			el.each(function() {
				var $this = jQuery(this),
					topSec = $this.find('figure'),
					topSecH = topSec.outerHeight(),
					details = $this.find('.details'),
					detailsH = details.outerHeight();

				$this.on('mouseenter', function() {
					details.css({
						'-webkit-transform': 'translateY(' + -(detailsH / 2) + 'px) translateX(-50%)',
						'-ms-transform': 'translateY(' + -(detailsH / 2) + 'px) translateX(-50%)',
						'transform': 'translateY(' + -(detailsH / 2) + 'px) translateX(-50%)',
						opacity: 1,
						visibility: 'visible'
					});
					topSec.css({
						'-webkit-transform': 'translateY(' + -(detailsH / 2) + 'px)',
						'-ms-transform': 'translateY(' + -(detailsH / 2) + 'px)',
						'transform': 'translateY(' + -(detailsH / 2) + 'px)'
					});
				}).on('mouseleave', function(){
					details.css({
						'-webkit-transform': 'translateY(0) translateX(-50%)',
						'-ms-transform': 'translateY(0) translateX(-50%)',
						'transform': 'translateY(0) translateX(-50%)',
						opacity: 0,
						visibility: 'hidden'
					});
					topSec.css({
						'-webkit-transform': 'translateY(0)',
						'-ms-transform': 'translateY(0)',
						'transform': 'translateY(0)'
					});
				});
			});
		})
	};
};
steps();


/*!
 * Tab Function
 *
 */
function tabsInit(){
	"use strict";

	var Tab = function (element) {
	  this.element = jQuery(element)
	}

	Tab.VERSION = '3.3.5'

	Tab.TRANSITION_DURATION = 600

	Tab.prototype.show = function () {
	  var jQuerythis    = this.element
	  var jQueryul      = jQuerythis.closest('ul:not(.dropdown-menu)')
	  var selector = jQuerythis.data('target')

	  if (!selector) {
		selector = jQuerythis.attr('href')
		selector = selector && selector.replace(/.*(?=#[^\s]*jQuery)/, '') // strip for ie7
	  }

	  if (jQuerythis.parent('li').hasClass('active')) return

	  var jQueryprevious = jQueryul.find('.active:last a')
	  var hideEvent = jQuery.Event('hide.bs.tab', {
		relatedTarget: jQuerythis[0]
	  })
	  var showEvent = jQuery.Event('show.bs.tab', {
		relatedTarget: jQueryprevious[0]
	  })

	  jQueryprevious.trigger(hideEvent)
	  jQuerythis.trigger(showEvent)

	  if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

	  var jQuerytarget = jQuery(selector)

	  this.activate(jQuerythis.closest('li'), jQueryul)
	  this.activate(jQuerytarget, jQuerytarget.parent(), function () {
		jQueryprevious.trigger({
		  type: 'hidden.bs.tab',
		  relatedTarget: jQuerythis[0]
		})
		jQuerythis.trigger({
		  type: 'shown.bs.tab',
		  relatedTarget: jQueryprevious[0]
		})
	  })
	}

	Tab.prototype.activate = function (element, container, callback) {
	  var jQueryactive    = container.find('> .active')
	  var transition = callback
		&& jQuery.support.transition
		&& (jQueryactive.length && jQueryactive.hasClass('fade') || !!container.find('> .fade').length)

	  function next() {
		jQueryactive
		  .removeClass('active')
		  .find('> .dropdown-menu > .active')
			.removeClass('active')
		  .end()
		  .find('[data-toggle="tab"]')
			.attr('aria-expanded', false)

		element
		  .addClass('active')
		  .find('[data-toggle="tab"]')
			.attr('aria-expanded', true)

		if (transition) {
		  element[0].offsetWidth // reflow for transition
		  element.addClass('in')
		} else {
		  element.removeClass('fade')
		}

		if (element.parent('.dropdown-menu').length) {
		  element
			.closest('li.dropdown')
			  .addClass('active')
			.end()
			.find('[data-toggle="tab"]')
			  .attr('aria-expanded', true)
		}

		callback && callback()
	  }

	  jQueryactive.length && transition ?
		jQueryactive
		  .one('bsTransitionEnd', next)
		  .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
		next()

	  jQueryactive.removeClass('in')
	}


	// TAB PLUGIN DEFINITION
	// =====================

	function Plugin(option) {
	  return this.each(function () {
		var jQuerythis = jQuery(this)
		var data  = jQuerythis.data('bs.tab')

		if (!data) jQuerythis.data('bs.tab', (data = new Tab(this)))
		if (typeof option == 'string') data[option]()
	  })
	}

	var old = jQuery.fn.tab

	jQuery.fn.tab             = Plugin
	jQuery.fn.tab.Constructor = Tab


	// TAB NO CONFLICT
	// ===============

	jQuery.fn.tab.noConflict = function () {
	  jQuery.fn.tab = old
	  return this
	}


	// TAB DATA-API
	// ============

	var clickHandler = function (e) {
	  e.preventDefault()
	  Plugin.call(jQuery(this), 'show')
	}

	jQuery(document)
	  .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
	  .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

	function transitionEnd() {
	  var el = document.createElement('bootstrap')

	  var transEndEventNames = {
		WebkitTransition : 'webkitTransitionEnd',
		MozTransition    : 'transitionend',
		OTransition      : 'oTransitionEnd otransitionend',
		transition       : 'transitionend'
	  }

	  for (var name in transEndEventNames) {
		if (el.style[name] !== undefined) {
		  return { end: transEndEventNames[name] }
		}
	  }

	  return false // explicit for ie8 (  ._.)
	}

	// http://blog.alexmaccaw.com/css-transitions
	jQuery.fn.emulateTransitionEnd = function (duration) {
	  var called = false
	  var jQueryel = this
	  jQuery(this).one('bsTransitionEnd', function () { called = true })
	  var callback = function () { if (!called) jQuery(jQueryel).trigger(jQuery.support.transition.end) }
	  setTimeout(callback, duration)
	  return this
	}

	jQuery(function () {
	  jQuery.support.transition = transitionEnd()

	  if (!jQuery.support.transition) return

	  jQuery.event.special.bsTransitionEnd = {
		bindType: jQuery.support.transition.end,
		delegateType: jQuery.support.transition.end,
		handle: function (e) {
		  if (jQuery(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
		}
	  }
	})

	jQuery('.tab-nav').find('li').find('a').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		jQuery(this).tab('show');
	});
}

/*!
 * Animated Blocks
 *
 */
 function animatedBlock(){
	var currentTallest = 0,
		currentRowStart = 0,
		rowDivs = [],
		$el,
		topPosition = 0,
		animatedBlock = jQuery('.animated-block'),
		pushValue = animatedBlock.find('.hidden-part').height();

	if (animatedBlock.length) {
		animatedBlock.imagesLoaded(function(){
			animatedBlock.each(function() {

				$el = jQuery(this);
				topPosition = $el.position().top;
			   
				if (currentRowStart != topPosition) {

				// we just came to a new row.  Set all the heights on the completed row
				for (currentDiv = 0;currentDiv < rowDivs.length ; currentDiv++) {
					rowDivs[currentDiv].height(currentTallest);
				}

				// set the variables for the new row
				rowDivs.length = 0; // empty the array
				currentRowStart = topPosition;
				currentTallest = $el.height();
				rowDivs.push($el);

				} else {

				// another div on the current row.  Add it to the list and check if it's taller
				rowDivs.push($el);
				currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);

			} 
			// do the last row
			for (currentDiv = 0;currentDiv < rowDivs.length ; currentDiv++) {
				rowDivs[currentDiv].height(currentTallest);
			}
			   
			$el.find('.visible-part').css('padding-top', pushValue / 2 );
			});
		});
		animatedBlock.on('mouseenter', function() {
			$this = jQuery(this);
			$this.find('.visible-part').css({
					'-webkit-transform': 'translateY(-' + pushValue / 2 + 'px)',
					'-ms-transform': 'translateY(-' + pushValue / 2 + 'px)',
					'transform': 'translateY(-' + pushValue / 2 + 'px)'
				 });
			$this.find('.hidden-part').css({
					'-webkit-transform': 'translateY(-' + pushValue / 2 + 'px)',
					'-ms-transform': 'translateY(-' + pushValue / 2 + 'px)',
					'transform': 'translateY(-' + pushValue / 2 + 'px)'
				 });
		}).on('mouseleave', function() {
			$this = jQuery(this);
			$this.find('.visible-part').css({
					'-webkit-transform': 'translateY(0)',
					'-ms-transform': 'translateY(0)',
					'transform': 'translateY(0)'
				 });
			$this.find('.hidden-part').css({
					'-webkit-transform': 'translateY(0',
					'-ms-transform': 'translateY(0',
					'transform': 'translateY(0)'
				 });
		});
	};

};

/*!
 * Start Smooth Link Functionality
 *
 * Function used to go from one section to another smoothly
 *
 */
function ivan_smooth_links_init() {
	"use strict";

	var header_offset = 0;

	if( jQuery('.header-fixed').length > 0 ) {
		header_offset = jQuery('.header-fixed').outerHeight(false) * 0.57;
	}

	// Go to present hashtags
	if(window.location.hash) {

		var header_offset = 0;

		if( jQuery('.header-fixed').length > 0 ) {
			header_offset = jQuery('.header-fixed').outerHeight(false);
		}

		var target = jQuery(window.location.hash);

		if( target.length ) {
			if( target.offset().top < 150)
				header_offset = 0;

			jQuery(document).scrollTop( target.offset().top - header_offset );
		}

	} else {
		// Fragment doesn't exist
	}

	// Smooth scrolling to internal anchors
	jQuery('a[href*=#]:not([href=#]):not([href*=#tab]):not([href*=#comments])').click(function() {

		if( header_offset == 0 ) {
			header_offset = jQuery('.header-fixed').outerHeight(false) * 0.57;
		}

		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
			|| location.hostname == this.hostname) {

			var target = jQuery(this.hash);
			target = target.length ? target : jQuery('[name=' + this.hash.slice(1) +']');
			   if (target.length) {

				if( target.offset().top < 150)
					header_offset = 0;

				jQuery('html,body').animate({
					scrollTop: target.offset().top - header_offset
				}, 600);

				return false;
			}
		}
	});
	
}

/**
 * Floating Contact Form
 * @returns 
 */
function ivan_floating_contact_form_init() {
	"use strict";
	
	var $ff = jQuery('#floating-contact-form');
	var $ff_submited = false;
	
	if ($ff.length < 1) {
		return;
	}
	
	jQuery('#ff-submit').on('click', function(event) {
		event.preventDefault();
		$ff.submit();
	});
	
	$ff.submit(function (e) {
		
		e.preventDefault();
		
		if ($ff_submited == true) {
			jQuery('#ff-notice').html(ivan_lang.form_already_submitted);
			return false;
		}

		jQuery('#ff-submit').html(ivan_lang.sending);
		$ff_submited = true;
		
		jQuery.ajax({
			url: ivan_theme_scripts.ajaxurl,
			data: {
				name: jQuery('#ff-name').val(),
				email: jQuery('#ff-email').val(),
				message: jQuery('#ff-message').val(),
				action: 'ff_submit',
				nonce: jQuery('#ff-nonce').val(),
				recaptcha_response: jQuery('#g-recaptcha-response').val()
			},
			type: 'POST',
			dataType: 'JSON',
			success: function (data) {
				
				//configuration error
				if (data.error == 3) {
					
					jQuery('#ff-submit').html(ivan_lang.send);
					jQuery('#ff-notice').html(ivan_lang.failed_config_error);
					$ff_submited = false;
				
				//server error, wp_mail failed
				} else if (data.error == 2) {
					
					jQuery('#ff-submit').html(ivan_lang.send);
					jQuery('#ff-notice').html(ivan_lang.failed_server_error);
					$ff_submited = false;
				
				//form error
				} else if (data.error == 1) {
					
					if (data.errors.name == 1) {
						jQuery('#ff-name').css('border','1px solid #FF0000');
					} else {
						jQuery('#ff-name').removeAttr( 'style' );
					}
					
					if (data.errors.email == 1) {
						jQuery('#ff-email').css('border','1px solid #FF0000');
					} else {
						jQuery('#ff-email').removeAttr( 'style' );
					}
					
					if (data.errors.message == 1) {
						jQuery('#ff-message').css('border','1px solid #FF0000');
					} else {
						jQuery('#ff-message').removeAttr( 'style' );
					}
					
					if (data.errors.recaptcha == 1) {
						jQuery('.g-recaptcha').find('iframe').css('border','1px solid #FF0000');
					} else {
						jQuery('.g-recaptcha').find('iframe').removeAttr( 'style' );;
					}
					
					jQuery('#ff-submit').html(ivan_lang.send);
					jQuery('#ff-notice').html(ivan_lang.fill_all_required_fields);
					$ff_submited = false;
				//email sent
				} else {
					jQuery('#ff-name').removeAttr( 'style' );
					jQuery('#ff-email').removeAttr( 'style' );
					jQuery('#ff-message').removeAttr( 'style' );
					jQuery('.g-recaptcha').find('iframe').removeAttr( 'style' );;
					
					jQuery('#ff-notice').html(ivan_lang.thank_you);					
					jQuery('#ff-submit').html(ivan_lang.sent);
					$ff_submited = true;
				}
			}
		})
		
	});
}

/**
 * Portfolio modern init
 * @returns 
 */
function ivan_portfolio_modern_init() {
	"use strict";
	
	var $portfolio_container = jQuery("#portfolio");
	var	$portfolio_items = jQuery("#portfolio .item");
	var	$active_filter = jQuery(".ivan-vc-filters a.current");

	if ($portfolio_container.length > 0) {
		
		jQuery('body').append('<div id="portfolio-responsive"><div id="portfolio-responsive-2"></div><div id="portfolio-responsive-1"></div></div>');
		var $pr1 = jQuery("#portfolio-responsive-1");
		var $pr2 = jQuery("#portfolio-responsive-2");
		
		$portfolio_container.imagesLoaded(function() {
			var column_width = ivan_get_portfolio_column_width();
			
			$portfolio_items.each(function() {
				jQuery(this).width(column_width * jQuery(this).data("factor"))
			});
			$portfolio_container.isotope({
				itemSelector: ".item",
				masonry: {
					columnWidth: column_width
				},
				isResizeBound: false
			});
			
			jQuery(window).resize(function() {
				var column_width = ivan_get_portfolio_column_width();
				var elems = $portfolio_container.isotope("getItemElements");
				for (var i = 0; i < elems.length; i++) jQuery(elems[i]).width(column_width * jQuery(elems[i]).data("factor"));
				$portfolio_container.isotope({
					masonry: {
						columnWidth: column_width
					}
				})
			}).trigger("resize")
		});
		
		jQuery(".ivan-vc-filters").find("a").click(function(e) {
			
			$active_filter.removeClass("current");
			$active_filter = jQuery(this);
			$active_filter.addClass("current");
			var f = jQuery(this).data("filter");
			
			$portfolio_container.isotope({
				filter: f
			});
			e.preventDefault()
		});
	}
	if (window.addEventListener) window.addEventListener("orientationchange", function() {
		setTimeout(function() {
			jQuery(window).trigger("resize")
		}, 500)
	}, false);

	function ivan_get_portfolio_column_width() {
		var colWidth = 0;
		
		var container_width = $portfolio_container.closest('.wpb_wrapper').width();
		if ($pr1.css("display") == "block") {
			return container_width;
		} else if ($pr2.css("display") == "block") {
			return (container_width / 2 - 1);
		} else {
			return (container_width / 3 - 1);
		}
	}
}

function blogMasonryReveal() {

	var el = jQuery('.masonry-posts.ivan-posts').find('.ivan-post');

	if (el.length) {

		el.each(function() {
			var $this = jQuery(this);
			$this.appear(function(){
				$this.addClass('visible')
			});
		});
	};

};
blogMasonryReveal();

function modernBlog() {
	var el = jQuery('.post.modern-fullwidth');

	el.each(function() {
		var $this = jQuery(this),
			title = $this.find('header h2 a'),
			readMore = $this.find('.read-more'),
			readMoreTxt = readMore.find('span').html();
		jQuery(readMore).add(title).on('click', function(event) {
			event.preventDefault();
			ivan_post_wp_gallery_init();
			$this.find('.post-content').stop().slideToggle(400, function(){
				jQuery(window).data('plugin_stellar').destroy();
				setTimeout(function(){
					jQuery(window).data('plugin_stellar').init();
				},200);
				ivan_post_wp_gallery_init();
			}).end().toggleClass('post-content-showing');
		});
	});
};
modernBlog();


/**
 * Portfolio Style2
 */
function portfolio_style2() {
	var portfolioContainer = jQuery('.portfolio.style2'),
		itemsContainer = portfolioContainer.find('.items-container'),
		filtersWrapper = portfolioContainer.find('.filters-wrapper');

	if (portfolioContainer.length) {
		itemsContainer.imagesLoaded(function() {
			
			itemsContainer.isotope({
				itemSelector: ".portfolio-item",
				percentPosition: true,
				masonry: {
					columnWidth: '.grid-sizer'
				}
			});
			filtersWrapper.on('click', 'li', function() {
				var $this = jQuery(this),
					filterValue = $this.attr("data-filter");
				
				$this.addClass('active')
					 .siblings('li').removeClass('active');
				
				itemsContainer.isotope({
					filter: filterValue
				});
			});
		});		
	};	
}

/* Active Panr */
function activePanr() {
	var el = jQuery('.panr-active');

	if (!el.length || typeof jQuery.fn.panr != 'function') {
		return
	} else {
		el.each(function() {
			var $this = jQuery(this),
				sensitivityValue = $this.attr('data-sensitivity'),
				scaleValue = $this.attr('data-scaleto');
			if (sensitivityValue === null || sensitivityValue === undefined) {
				sensitivityValue = 30;
			} else {
				sensitivityValue = $this.attr('data-sensitivity');
			};
			if (scaleValue === null || scaleValue === undefined) {
				scaleValue = 1.1;
			} else {
				scaleValue = $this.attr('data-scaleto');
			};
			$this.imagesLoaded(function(){
				$this.find('.panr-element').panr({
					sensitivity: sensitivityValue,
					scale: false,
					scaleOnHover: true,
					scaleTo: scaleValue,
					scaleDuration: .5,
					panY: true,
					panX: true,
					panDuration: 1.25,
					moveTarget: $this,
					resetPanOnMouseLeave: false
				});
			})
		});
	};
};
activePanr();

/*!
 * Init Mansory Styled Blog
 *
 * Function used to display blog in styled way
 *
 */
function ivan_init_mansory_style_blog() {
	"use strict";

	var container = document.querySelector('.ivan-mansory-blog');

	if( null != container) {

		var pckry;

		imagesLoaded( container, function() {
			pckry = new Packery( container, {
				itemSelector: '.post-wrapper'
			});

			setTimeout(function() {
				if(jQuery('body').hasClass("ivan-m-l-aside")) {
					jQuery('.ivan-mansory-blog').packery();
				}
			}, 1500);

		});

	}
	
}

/*!
 * Calculate Correct Header Area Sizes
 *
 * Function used to fix height that should be used
 *
 */
function ivan_fix_header_area_height() {
	"use strict";

	if( jQuery('.header').length > 0 ) {
		jQuery('.calc-height-area').each( function() {
			jQuery('.header-center-area').imagesLoaded(function(){
				jQuery(this).outerHeight( jQuery('.header-center-area').outerHeight() );
			});
		});
	};
};

// Update properly the layout after added by AJAX
function ivan_update_mansory_style_blog() {
	"use strict";

	jQuery('.ivan-mansory-blog').packery();
	jQuery('.ivan-mansory-blog').packery('reloadItems');

}

/**********************************************************
***********************************************************
***********************************************************/

// Visual Composer Container Size
function ivan_vc_full_width_container() {
	"use strict";

	var _w = jQuery(window).width();

	jQuery('.entry-content > .wpb_row').each( function() {

		var _rowW = jQuery(this).width();

		var _diff = (_w - _rowW) / 2 + 15;

		jQuery(this).css({
			marginLeft: '-' + _diff + 'px',
			paddingLeft: _diff + 'px',
			marginRight: '-' + _diff + 'px',
			paddingRight: _diff + 'px',
		});

	});
}


/**********************************************************
***********************************************************
***********************************************************/

// Fix Menu Areas that can't be fixed
ivan_fix_header_area_height();

/*
 * Window Load Event
 */
jQuery(window).load( function() {
	"use strict";

	// Fix Menu Areas that can't be fixed
	ivan_fix_header_area_height();

	ivan_vc_full_width_container();

});
jQuery(window).on('resize', function() {

	if ( jQuery('.live-search.search-top-style').length ) {
		jQuery('.form-close-btn').css('right', jQuery('.live-search').find('form').offset().left);
	};
	ivan_megamenu_init();

	blogMasonryReveal();

	portfolioHorizontal();

	horizontalLayout();

	moveDown();

	stickyFooter();

	ivanScrollTo();
});

function ivan_theme_script_load() {
	"use strict";

	// Fix Menu Areas that can't be fixed
	ivan_fix_header_area_height();

	ivan_vc_full_width_container();
}

/*
 * Document Ready Event
 */
jQuery(document).ready( function() {
	"use strict";

	ivan_theme_script_ready();

	headerTitleFade();

});

function ivan_theme_script_ready() {
	"use strict";

	var ivLayoutHeader = jQuery('.iv-layout.header');

	/* Small fix to empty p in content */
	jQuery('.entry-content > p:empty').remove();


	/* Init Back to Top Button */
	ivan_back_to_top_init();

	floatedContactForm();

	mediaElmenetsVideos();

	tweetsSlider();

	videoPopup();

	steps();

	initWow();

	/* Calls Negative Height init script */
	if(ivLayoutHeader.hasClass('negative-height'))
		ivan_header_marginTop = parseInt( jQuery('.iv-layout.header.negative-height').css("marginTop").replace('px', '') );

	ivLayoutHeader.find('.logo').imagesLoaded(function(){
		ivan_negative_height_init();
	});

	/* Calls Live Search init script */
	ivan_live_search_init();

	/* Calls Woo Cart init script */
	ivan_woo_cart_init();
	
	/* Calls WPMLLanguages dropdown init script */
	ivan_wpml_languages_dropdown_init();

	/* Calls Login AJAX init script */
	ivan_login_ajax_init();

	/* Calls Responsive Menu init script */
	ivan_responsive_menus_init();
	
	/* Calls Overlay Menu init script */
	ivan_overlay_menus_init();

	/* Calls Responsive Menu Select init script */
	ivan_responsive_menus_select_init();

	/* Calls MegaMenu init script */
	setTimeout(function() { ivan_megamenu_init(); }, 1000);

	stickyFooter();

	/* Call init function to post formats */
	ivan_post_formats_init();

	/* Init Mansory Blog */
	ivan_init_mansory_style_blog();

	/* Init default WP Gallery shortcode lightbox and mansory layout */
	ivan_post_wp_gallery_init();

	/* Flexible Header */
	ivan_fixed_header();
	
	/* Flexible Header */
	ivan_portfolio_modern_init();

	/* Portfolio Style2 */
	portfolio_style2();
	
	/* Flexible Header */
	ivan_floating_contact_form_init();

	/* Tabs Init */
	tabsInit();

	/* Animated Blocks Init */
	animatedBlock();

	/* Fix iOS Zoom problems */
	jQuery('input:text,select,textarea').cancelZoom();
}

// Infinite Scroll
jQuery( document.body ).on( 'post-load', function () {
	"use strict";


	imagesLoaded( jQuery('#post-list'), function() {

		ivan_post_formats_init();

		ivan_update_mansory_style_blog();

		setTimeout(function() { ivan_update_mansory_style_blog(); }, 1000);

	});
	
});

if(ivan_theme_scripts.preload) {
	/*
	 * Fade In/Out Effect
	 */
	jQuery(window).bind("load", function() {
		"use strict";

		jQuery('#page-loader').fadeOut();
	});

	jQuery(window).bind('beforeunload', function(e){
		"use strict";

		jQuery('#page-loader').fadeIn();
	});
}

/*
 * Debounced Resize Event
 */
jQuery(window).on('debouncedresize', function( event ) {

	ivan_recalc_dimensions();

});

function ivan_recalc_dimensions() {
	"use strict";

	ivan_negative_height_init();

	ivan_recalc_sticky_height();

	ivan_vc_full_width_container();
}

 /*!
 * Skip Input Focus Fix
 *
 * Fix odd focus behavior in mobile devices
 *
 */
( function() {

	"use strict";

	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
		is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
		is_ie	 = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) )
					element.tabIndex = -1;

				element.focus();
			}
		}, false );
	}
})();

/* Initial Stellar */
function initStellar() {

	if (jQuery(window).width() >= 768) {
		jQuery.stellar({
			responsive: true,
			hideDistantElements: false,
			positionProperty: 'transform',
			horizontalScrolling: false,
			horizontalOffset: 0,
			verticalOffset: 0
		});
	};
};
initStellar();

function horizontalLayout() {
	var el = jQuery('body.is-horizontal'),
		horizontalElement = jQuery('.portfolio-horizontal'),
		footer = jQuery('.iv-layout.footer'),
		bottomFooter = jQuery('.iv-layout.bottom-footer'),
		footerHeight,
		bottomFooterHeight;
	if (footer.length) {
		footer.imagesLoaded(function(){
			footerHeight = footer.outerHeight();
		});
	} else {
		footerHeight = 0;	
	};
	if (bottomFooter.length) {
		bottomFooter.imagesLoaded(function() {
			bottomFooterHeight = bottomFooter.outerHeight();
		});
	} else {
		bottomFooterHeight = 0;
	};
	if (horizontalElement.length) {
		jQuery('body').addClass('is-horizontal');
		if (jQuery('.iv-layout.header').length) {
			jQuery('.iv-layout.header').imagesLoaded(function(){
				jQuery('.iv-layout.content-wrapper').css({
					'margin-top': jQuery('.iv-layout.header').outerHeight()
				});
			});
		};
		jQuery('.iv-layout.footer, .iv-layout.bottom-footer').imagesLoaded(function(){
			jQuery('.iv-layout.content-wrapper').css({
				'margin-bottom': footerHeight + bottomFooterHeight
			});
		});
	};
};
horizontalLayout();

/* Portfolio Horizontal */
function portfolioHorizontal() {
	var el = jQuery('.portfolio-horizontal');

	el.each(function() {
		var $this = jQuery(this),
			texts = $this.find('.text'),
			imagesCarousel = $this.find('.images-carousel');
			fadeStart = 0,
			fadeUntil = 500,
			range = 1500;
			scrollTime = 0.3,
			scrollDistance = 400;

		$this.imagesLoaded(function(){
			var imagesCarouselW = (imagesCarousel.find('figure').first().outerWidth(true)) * (imagesCarousel.find('figure').length),
				textsW = texts.outerWidth(),
				contentWrapperMT = parseInt(jQuery('.iv-layout.content-wrapper').css('margin-top')),
				contentWrapperMB = parseInt(jQuery('.iv-layout.content-wrapper').css('margin-bottom'));

			$this.css({
				'width': '',
				'height': ''
			});
			$this
				.width(imagesCarouselW + textsW + 90)
				.height(jQuery(window).height() - jQuery('.iv-layout.content-wrapper').css('margin-top'));

				if (jQuery('.iv-layout.header').length) {
					$this.height(jQuery(window).height() - jQuery('.iv-layout.header').outerHeight() - jQuery('.iv-layout.content-wrapper').css('margin-top'));
				}
				if (jQuery(window).width() >= 992) {


					jQuery(window).on("scroll mousewheel DOMMouseScroll", function(event){
						
						if (!navigator.userAgent.indexOf('Mac') != -1) {
							
							event.preventDefault();
															
							var delta = event.originalEvent.wheelDelta/60 || -event.originalEvent.detail/3;
							var scrollLeft = jQuery(window).scrollLeft();
							var finalScroll = scrollLeft - parseInt(delta*scrollDistance);
								
							TweenMax.to(jQuery(window), scrollTime, {
								scrollTo : { x: finalScroll, autoKill:false },
									ease: Expo.easeOut,	//For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
									autoKill: false,
									overwrite: 5
								});
						};

						var offset = jQuery(window).scrollLeft(),
							opacity = 0;

						if( offset <= fadeStart ){
							opacity = 1;
						} else if( offset <= fadeUntil ){
							opacity = 1 - offset / fadeUntil;
						};

						texts.css({
							'position': 'fixed',
							'top': imagesCarousel.offset().top,
							'left': 90,
							'margin-top': 15,
							'opacity': opacity
						});
						imagesCarousel.css('margin-left', textsW);
					});
				} else {

					jQuery(window).on("scroll mousewheel DOMMouseScroll", function(event){
						
						event.preventDefault();
														
						var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
						var scrollTop = jQuery(window).scrollTop();
						var finalScroll = scrollTop - parseInt(delta*scrollDistance);
							
						TweenMax.to(jQuery(window), scrollTime, {
							scrollTo : { y: finalScroll, autoKill:false },
								ease: Expo.easeOut,	//For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
								autoKill: false,
								overwrite: 5
							});
					});
				};
		});
	});
};

portfolioHorizontal();

smoothScroll(1.3, 220); // Smooth Scroll

/* Fullscreen Slideshoow */
function fullscreenSlideshow() {
	var el = jQuery('.fullscreen-slideshow');
	if (el.length) {
		el.maximage();
	};
};
fullscreenSlideshow();

/* Initital Countdown */
function countdown() {
	var el = jQuery('.countdown'),
		targetDate = el.attr('data-target-date'),
		targetHour = el.attr('data-target-hour');
	if (el.length) {
		el.countdown( '' +  targetDate + ' ' + targetHour + '', function(event) {
			jQuery(this).html(
			event.strftime(''
				+ '<div><span>%D</span><span class="text">Days</span></div>'
				+ '<div><span>%H</span><span class="text">Hours</span></div>'
				+ '<div><span>%M</span><span class="text">Mins</span></div>'
				+ '<div><span>%S</span><span class="text">Secs</span></div>'
				+ '')
			);
			el.fitText();
		});
	};
};
countdown();

function productsMatchHeight() {
	var el = jQuery('ul.products').find('.product:not(.product-list-style)');
	if (el.length && typeof jQuery.fn.matchHeight == 'function') {
		el.matchHeight();
	};
};
productsMatchHeight();

/* Hover Direction */
function hoverDir() {
	var el = jQuery('.hover-dir');
	if (el.length) {
		el.hoverdir({
			hoverElem: '.hover-dir-el',
			speed: 500
		});
	};
	
};
hoverDir();

/* Simple Reveal */
function simpleReveal() {

	var el = jQuery('.reveal');

	if (el.length) {
		el.each(function() {
			var $this = jQuery(this);
			$this.appear(function(){
				$this.addClass('visible');
			});
		});
	};

};
simpleReveal();

/* Particles */
function initParticles() {

	var el = jQuery('#particles-js');

	if (el.length) {

		particlesJS('particles-js',
		  
		  {
			"particles": {
			  "number": {
				"value": 150,
				"density": {
				  "enable": true,
				  "value_area": 900
				}
			  },
			  "opacity": {
				"value": 1,
				"random": true,
				"anim": {
				  "enable": true,
				  "speed": 0.5,
				  "opacity_min": 0.6,
				  "sync": false
				}
			  },
			  "size": {
				"value": 1.5,
				"random": true,
				"anim": {
				  "enable": true,
				  "speed": 1,
				  "size_min": 0.1,
				  "sync": false
				}
			  },
			  "line_linked": {
				"enable": false,
				"distance": 150,
				"color": "#ffffff",
				"opacity": 0.4,
				"width": 1
			  },
			  "move": {
				"enable": true,
				"speed": 1.1,
				"direction": "right",
				"random": true
			  }
			},
			"interactivity": {
			  "detect_on": "canvas",
			  "events": {
				"onhover": {
				  "enable": false
				}
			  }
			},
			"retina_detect": true
		  }

		);
	};

};
initParticles();

function infiniteScroll() {

	jQuery('.ivan-projects-grid').infinitescroll({
		navSelector  : ".infinite-nav",            
		nextSelector : ".infinite-more-link",
		itemSelector : ".ivan-projects-grid .ivan-project",
		loading: {
			img: '',
			msg: '',
			finishedMsg: '',
			msgText: '<span class="infinite-more-link sc-button blue" data-loading-text="spinner"><i class="fa fa-spinner fa-pulse"></i></span>',
			selector: '.infinite-nav-loading'
		},
	},
	function(newItems) {
		jQuery(newItems).imagesLoaded(function(){
			jQuery('.ivan-projects-grid').isotope( 'appended', jQuery(newItems) );
			jQuery('.ivan-projects-grid').isotope('layout');
		});
	});
};

function moveDown() {
	var el = jQuery('.move-down'),
		contentWrapper = jQuery('.iv-layout.content-wrapper');
	contentWrapper.imagesLoaded(function(){
		contentWrapperOffsetTop = contentWrapper.offset().top;
		el.on('click', function(event) {
			event.preventDefault();
			TweenMax.to(window, 1, {scrollTo:{y: contentWrapperOffsetTop}, ease:Power2.easeOut});
		});
	});
};
moveDown();

function animatedIcons(element) {
	var el = jQuery(element);
	el.each(function(i){
		if ( ! jQuery(this).find('.icon-container').length ) {
			return;
		} else {
			var $this = jQuery(this),
				iconContainer = $this.find('.icon-container').css('opacity', 1),
				animationDelay = iconContainer.data('animation-delay'),
				obj = $this.find('object');
			obj.attr('id','icon-container-' + i);
			var svgContext = $this.find('object')[0].contentDocument,
				strokeColor = svgContext.createElementNS('http://www.w3.org/2000/svg', 'style');
			strokeColor.textContent = 'svg, svg path, svg polyline { stroke: ' + iconContainer.data('stroke-color') + '; }';
			svgContext.getElementById("Layer_1").appendChild(strokeColor);
			var animatedIcon = new Vivus(obj.attr('id'), {type: jQuery(this).find('.icon-container').data('animation-type'), duration: 100, start: 'manual'});
			jQuery(window).on('scroll', function() {
				if ($this.inView('topOnly') == true) {
					setTimeout(function(){
						animatedIcon.play();
					}, animationDelay);
				};                        
			});
		};
	});
};

function ivanScrollTo() {

	var el = jQuery('.ivan-scroll-to');

	el.each(function() {
		var $this = jQuery(this),
			target = $this.attr('href'),
			targetOffsetTop,
			header = jQuery('.header')

		if (header.length && header.hasClass('header-fixed')) {
			targetOffsetTop = jQuery(target).offset().top - header.outerHeight();
		} else {
			targetOffsetTop = jQuery(target).offset().top;
		}
		$this.on('click', function(event) {
			event.preventDefault();
			TweenMax.to(window, 1, {scrollTo:{y: targetOffsetTop}, ease:Power2.easeOut});
		});
	});
};
ivanScrollTo();

jQuery(window).on('load', function() {
	infiniteScroll();
	animatedIcons('.content-box.style12');
	animatedIcons('.feature');
});

jQuery('.scroll-to-content a[href^="#"]').click(function(e) {
 
    jQuery('html,body').animate({ scrollTop: jQuery(this.hash).offset().top}, 600);
 
    return false;
 
    e.preventDefault();
 
});