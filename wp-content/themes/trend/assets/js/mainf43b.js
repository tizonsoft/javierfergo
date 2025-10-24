/*global jQuery:false, TweenMax, Back, TweenLite, Quad, google, mapObject, marker, _bw_theme, InfoBox, Quint, Sine*/
window.jQuery = window.$ = jQuery;

/*! blank new page*
$('body').on('click', 'a[target^=_blank], a[rel^=external], area[target^=_blank]', function(e) {  
    window.open($(this).attr('href'));
    return false;
});*/

var App = {
	
	start: function() {
		
		App.slider();
		
		App.images();
		
		App.popularWidget();
		
		App.magnificPopup();
		
		if(jQuery('body').hasClass('djax-active')) {
			App.djax();
		}
		
		if(jQuery('body').hasClass('image-copyright')) {
			App.image_copyright();
		}
		
		App.bind();
		
		App.onLoad();
		
		App.headerNavigation();
		
		App.sidebarScrollBar();
		
		App.alsoLikeCenterText();
		
	},
	
	magnificPopup: function() {
		$('.mp-item').magnificPopup({
			type: 'image',
			gallery: {enabled: true, preload: true}
		});
	},
	
	images: function() {
		
		$('.box').each(function() {
			var $this = $(this);
			if($('img', $this).length > 0) {
				var totalPercent = ( $this.outerHeight() / $this.outerWidth() ) * 100;
				var marginPix = ( $this.outerHeight() - $('.thumb', $this).outerHeight() ) * 0.5;
				var absolutePercent = marginPix / $this.outerHeight();
				$('.thumb', $this).css('margin-top', (absolutePercent * totalPercent) + '%');
			}
		});
		
	},
	
	slider: function() {
		
		var $slider = $('.post-gallery');
		
		if($slider.length > 0) {
			$slider.each(function() {
				$(this).owlCarousel({
					autoPlay: ($slider.hasClass('auto-play')) ? 3000 : false,
					stopOnHover:true,
					paginationSpeed:1000,
					goToFirstSpeed:2000,
					singleItem:true,
					autoHeight: ($slider.hasClass('auto-height')) ? true : false,
					transitionStyle: ($slider.attr('data-effect') ? $slider.attr('data-effect') : false),
					lazyLoad:true,
					navigation: ($slider.hasClass('hide-nav')) ? false : true,
					navigationText:['',''],
				});
			});
		}
		
		var $widgetSlider = $('.bw-widget-slider');
		
		if($widgetSlider.length > 0) {
			$widgetSlider.each(function() {
				$(this).owlCarousel({
					autoPlay: true,
					stopOnHover:true,
					navigation:true,
					pagination:false,
					paginationSpeed:1000,
					goToFirstSpeed:2000,
					singleItem:true,
					autoHeight: true,
					transitionStyle: false,
					navigationText:['',''],
				});
			});
		}
		
	},
	
	popularWidget: function() {
		
		var $tab = jQuery('.bw-polular-widget-holder .bw-sidebar-posts');
		var $holder = jQuery('.bw-polular-widget-holder');
		var $popularNav = jQuery('.bw-popular-widget-nav a');
		
		$tab.hide();
		jQuery('.bw-sidebar-posts:first', $holder).show(0);
		
		$popularNav.bind('click', function() {
			
			var $this = jQuery(this);
			
			var $popularHolder = jQuery(this).closest('.bw-polular-widget-holder');
			jQuery('.bw-popular-widget-nav a', $popularHolder).removeClass('active');
			$this.addClass('active');
			
			jQuery('.bw-sidebar-posts', $popularHolder).hide();
			jQuery('.bw-sidebar-posts.' + $this.attr('data-parent'), $popularHolder).fadeIn(300);
			
		});
		
	},
	
	image_copyright: function() {
		
		var copyTimer;
		
		jQuery(document).on('contextmenu', '#categorizr .nav-holder, #pattern-full, #gallery, .isotope-holder a, #rail a, #journal-list .item img', function(e) {
			clearTimeout(copyTimer);
			jQuery('#image-copyright').show().css('top', e.screenY - 90).css('left', e.screenX + 10);
			copyTimer = setTimeout(function() {
				jQuery('#image-copyright').fadeOut(150);
			}, 2000);
			return false;
		});
		
	},
	
	onLoad: function() {
		if(jQuery('#preloader .animation-holder').length) {
			
			App.preloaderAction();
			var preloaderAnimation = setInterval(function() {
				App.preloaderAction();
			}, 3500);
			
			jQuery(window).load(function() {
				
					jQuery('#preloader .animation-holder').fadeOut(300, function() {
						clearInterval(preloaderAnimation);
						App.preloader();
					});
				
				
			});
		
		}else{
			
			App.preloader();
			
		}
	},
	
	preloaderAction: function() {
		
		jQuery('#preloader span').removeAttr('style');
		
		TweenMax.to(jQuery('#preloader .right'), 0.1, {bottom:0, ease:Linear.easeNone, onComplete:function() {
			TweenMax.to(jQuery('#preloader .bottom'), 0.1, {delay:0.3, left:0, ease:Linear.easeNone, onComplete: function() {
				TweenMax.to(jQuery('#preloader .left'), 0.15, {delay:0.3, top:0, ease:Linear.easeNone, onComplete: function() {
					TweenMax.to(jQuery('#preloader .top'), 0.15, {delay:0.3, right:0, ease:Linear.easeNone});
				}});
			}});
		}});
		
		TweenMax.to(jQuery('#preloader .right'), 0.1, {delay:1.8,top:'100%', ease:Linear.easeNone, onComplete:function() {
			TweenMax.to(jQuery('#preloader .bottom'), 0.1, {delay:0.3, right:'100%', ease:Linear.easeNone, onComplete: function() {
				TweenMax.to(jQuery('#preloader .left'), 0.15, {delay:0.3, bottom:'100%', ease:Linear.easeNone, onComplete: function() {
					TweenMax.to(jQuery('#preloader .top'), 0.15, {delay:0.3, left:'100%', ease:Linear.easeNone});
				}});
			}});
		}});
		
	},
	
	preloader: function() {
		
		jQuery('#preloader').css({
			'top' : 65,
			'bottom' : 65,
			'left' : 65,
			'right' : 65,
		});
		
		setTimeout(function() {
			
			App.playAnimations('in');
			
			jQuery('#preloader').addClass('ghost').fadeOut(1000, function() {
				jQuery(this).remove();
			});
			
			setTimeout(function() {
				jQuery('body').removeClass('init');
			}, 450);
			
		}, 300);
		
	},
	
	bind: function() {
		
		/ disable empty url\'s
		jQuery(document).on('click', 'a[href="#"]', function(e) {
			e.preventDefault();
		});
		
		jQuery('#navigation-mobile ul a').bind('click', function() {
			jQuery('#navigation-mobile').toggleClass('open');
		});
		
		/ toggle mobile navigation
		jQuery(document).on('click', '#toggle-nav, #navigation-mobile .mobile-close', function() {
			
			jQuery('#navigation-mobile').toggleClass('open');
			
		});
		
		/ toggle sidebar
		jQuery(document).on('click', '#toggle-sidebar', function() {
			
			jQuery('#sidebar').toggleClass('open');
			jQuery('#toggle-sidebar').toggleClass('open');
			
		});
		
		/ journal hover effects
		jQuery(document).on('mouseover', '.bw-also-like .image', function() {
			var $element = jQuery(this),$img = $element.find('img');
			TweenLite.to($img, 0.4, {scale: 1.13, ease:Back.easeOut});
			TweenLite.to(jQuery('.pluss', $element), 0.3, {alpha: 1});
			TweenLite.to(jQuery('.horr', $element), 0.3, {width: 32, marginLeft:-15, ease:Back.easeOut});
			TweenLite.to(jQuery('.verr', $element), 0.3, {height: 32, marginTop:-15, ease:Back.easeOut});
		}).on('mouseout', '.bw-also-like .like-item', function() {
			var $element = jQuery(this),$img = $element.find('img');
			TweenLite.to($img, 0.4, {scale: 1, ease:Quad.easeOut});
			TweenLite.to(jQuery('.pluss', $element), 0.3, {alpha: 0});
			TweenLite.to(jQuery('.horr', $element), 0.3, {width: 0, marginLeft:0});
			TweenLite.to(jQuery('.verr', $element), 0.3, {height: 0, marginTop:0});
		});
		
		/ quick view hover
		jQuery(document).on('mouseenter', '#categorizr .quick-view-gallery a', function() {
			
			var $element = jQuery(this);
			
			TweenLite.to(jQuery('.img', $element), 0.4, {scale: 1.13, ease:Back.easeOut});
			TweenLite.to(jQuery('.overr', $element), 0.3, {alpha: 0.6});
			TweenLite.to(jQuery('.pluss', $element), 0.3, {alpha: 1});
			TweenLite.to(jQuery('.horr', $element), 0.3, {width: 22, marginLeft:-10, ease:Back.easeOut});
			TweenLite.to(jQuery('.verr', $element), 0.3, {height: 22, marginTop:-10, ease:Back.easeOut});
			
		}).on('mouseout', '#categorizr .quick-view-gallery a', function() {
			
			var $element = jQuery(this);
			
			TweenLite.to(jQuery('.img', $element), 0.4, {scale: 1, ease:Quad.easeOut});
			TweenLite.to(jQuery('.overr', $element), 0.3, {alpha: 0});
			TweenLite.to(jQuery('.pluss', $element), 0.3, {alpha: 0});
			TweenLite.to(jQuery('.horr', $element), 0.3, {width: 0, marginLeft:0});
			TweenLite.to(jQuery('.verr', $element), 0.3, {height: 0, marginTop:0});
			
		});
		
		/ isotope element hover
		jQuery(document).on('mouseenter', '.isotope .isotope-item .element, .rail-content .item > a', function() {
			
			var $element = jQuery(this),
				$elementParent = $element.closest('.isotope-item, .item');
			
			$elementParent.addClass('overflow');
			TweenLite.to($element, 0.4, {scale: 1.13, ease:Back.easeOut});
				
				TweenLite.to(jQuery('.over', $element), 0.3, {alpha: 0.6});
				TweenLite.to(jQuery('.plus', $elementParent), 0.3, {alpha: 1});
				TweenLite.to(jQuery('.hor', $elementParent), 0.3, {width: 52, marginLeft:-25, ease:Back.easeOut});
				TweenLite.to(jQuery('.ver', $elementParent), 0.3, {height: 52, marginTop:-25, ease:Back.easeOut});
				
		}).on('mouseout', '.isotope .isotope-item .element, .rail-content .item > a', function() {
			
			var $elementParent = jQuery(this).closest('.isotope-item, .item');
			
			TweenLite.to(jQuery(this), 0.4, {scale: 1, ease:Quad.easeOut});
				
				TweenLite.to(jQuery('.over', this), 0.3, {alpha: 0});
				TweenLite.to(jQuery('.plus', $elementParent), 0.3, {alpha: 0});
				TweenLite.to(jQuery('.hor', $elementParent), 0.3, {width: 0, marginLeft:0});
				TweenLite.to(jQuery('.ver', $elementParent), 0.3, {height: 0, marginTop:0});
		});
		
		/ disable empty url\'s
		jQuery(document).on('click', 'a[href="#"]', function(e) {
			e.preventDefault();
		});
		
		/ full background toggle
		jQuery(document).on('click', '.full-toggle.expand', function() {
			
			if(!jQuery(this).hasClass('animate')) {
				
				jQuery(this).addClass('animate');
				
				jQuery('i', this).toggleClass('fa-arrows-alt fa-compress');
				
				jQuery('#gallery .full-overlay').toggleClass('black');
				
				setTimeout(function() {
					jQuery('body').toggleClass('cover');
					/jQuery('#header, #footer').toggleClass('hidden');
				}, 300);
				
				setTimeout(function() {
					jQuery('#gallery .full').resizeToParent({parent: '#gallery'});
					jQuery('#gallery .full-overlay').toggleClass('black');
					jQuery('#gallery .full-toggle').removeClass('animate');
				}, 700);
			}
		});
		
		/ share addthis buttons
		jQuery(document).on('mouseenter', '.share-bottom', function() {
			jQuery('#bw-share').addClass('show');
		}).on('mouseleave', '.share-bottom', function() {
			jQuery('#bw-share').removeClass('show');
		});
		
		/ info section
		jQuery(document).on('click', '.full-toggle.info-toggle', function() {
			jQuery('#gallery').toggleClass('info');
			if(jQuery('#gallery').hasClass('info')) {
				jQuery('#image-buttons').css('bottom', jQuery('.info-content').outerHeight());
			}else{
				jQuery('#image-buttons').css('bottom', 0);
			}
		});
		
		/ categorizr menu item mouse enter
		var mouseHold;
		jQuery(document).on('mouseenter', '#categorizr .nav a', function() {
			var $this = jQuery(this);
			mouseHold = setTimeout(function() {
				if(!jQuery('#categorizr').hasClass('expanded')) {
					jQuery('#categorizr .nav a').removeClass('active');
					$this.addClass('active');
					App.categorizr.change($this);
				}
			}, 600);
		})
		.on('mouseleave', '#categorizr .nav a', function() {
			clearTimeout(mouseHold);
		})
		.on('click', function() {
			clearTimeout(mouseHold);
		});
		
		/ categorizr quick view
		jQuery(document).on('click', '#categorizr #quick-view', function(e) {
			e.preventDefault();
			jQuery('#categorizr').toggleClass('expanded');
			App.categorizr.show();
		});
		
		jQuery('#searchform').submit(function(e) {
			e.preventDefault();
			var searchUrl = jQuery('#searchform').attr('action') + '?s=' + encodeURIComponent(jQuery('#search').val());
			jQuery('#search-submit').attr('href', searchUrl).trigger('click');
		});
		
		/ On djax request
		jQuery(window).bind('djaxClick', function(e) {
			
			e.preventDefault();

			App.playAnimations('out');
			
			jQuery('html, body').animate({scrollTop: 0}, 300);
			
		});
		
		/ djax click
		jQuery(window).bind('djaxClick', function() {
			TweenMax.to(jQuery('#header .header-part-right h1'), 0.3, {top:-100, alpha:0, ease:Quad.easeIn});
		});
		
		/ djax loading
		jQuery(window).bind('djaxLoading', function() {
			
		});
		
		/ djax finished
		jQuery(window).bind('djaxLoad', function() {
			TweenMax.from(jQuery('#header .header-part-right h1'), 0.3, {top:'auto', bottom:-100, alpha:0, ease:Quad.easeOut});
		});
		
	},
	
	alsoLikeCenterText: function() {
		jQuery('.like-item').each(function() {
			$e = jQuery('.title', this);
			$e.css('margin-top', '-' + ($e.height()*0.5) + 'px');
		});
	},
	
	cleanUpAfterDjax: function() {
		
		if(!jQuery('.djax-dynamic > div').hasClass('bw--gallery')) {
			jQuery('body').removeClass('cover');
		}
		
	},
	
	sidebarScrollBar: function() {
		jQuery("#sidebar").mCustomScrollbar({
			theme: "dark",
			scrollInertia:300,
			autoHideScrollbar: true
		});
	},
	
	headerNavigation: function() {
		
		/ desktop
		jQuery('#navigation li').hover(function() {
			jQuery('ul:first', jQuery(this)).stop(true,true).fadeIn();
		}, function() {
			jQuery('ul', jQuery(this)).stop(true,true).fadeOut(0);
		});
		
	},
	
	map: function() {
		
		var mapContainer = document.getElementById('map');
		if (mapContainer !== null) {
		
			var btn_zoom_in = document.getElementById('zoomin');
			if (btn_zoom_in !== null) {
				google.maps.event.addDomListener(btn_zoom_in, 'click', function() {
					mapObject.setZoom(mapObject.getZoom() + 1 );
				});
			}

			var btn_zoom_out = document.getElementById('zoomout');
			if (btn_zoom_out !== null) {
				google.maps.event.addDomListener(btn_zoom_out, 'click', function() {
					mapObject.setZoom(mapObject.getZoom() - 1 );
				});
			}
			
			App.createMap(mapContainer);
			App.createMarker();
			App.createLabel();
		}
		
	},
	
	createMap: function(mapContainer) {
		var centerPin;
		if(jQuery('#map').attr('data-center') !== '') {
			var pinCenter = jQuery('#map').attr('data-center').split(",");
			centerPin = new google.maps.LatLng(parseFloat(pinCenter[0]),parseFloat(pinCenter[1]));
		}else{
			centerPin = new google.maps.LatLng(44.53793,13.62262);
		}
		
		var mapOptions = {
			center: centerPin,
			zoom: parseFloat(jQuery('#map').attr('data-zoom')),
			navigationControl: false,
			mapTypeControl: false,
			scrollwheel: false,
			disableDefaultUI: true,
			disableDoubleClickZoom: true
		};
		
		mapObject = new google.maps.Map(mapContainer, mapOptions);

		var mapStyle = [
			/ map style 1
			[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}],
			
			
			/ map style 2
			[{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#e9ebed"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#2c2e33"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]}]
		];
		
		mapObject.setOptions({styles: mapStyle[0]});
		
		google.maps.event.addListener(mapObject, 'tilesloaded', function() {
			App.mapLoaded();
		});
	},
	
	createMarker: function() {
		
		var pinImg = jQuery('#map').attr('data-pin-image'), myPin;
		
		if(jQuery('#map').attr('data-coordinates') !== '') {
			var pinCoordinates = jQuery('#map').attr('data-coordinates').split(",");
			myPin = new google.maps.LatLng(parseFloat(pinCoordinates[0]),parseFloat(pinCoordinates[1]));
		}else{
			myPin = new google.maps.LatLng(44.42752,12.22787);
		}
		
		marker = new google.maps.Marker({
			position: myPin,
			map: mapObject,
			title: 'Hello World!',
			icon: new google.maps.MarkerImage((pinImg !== '') ? pinImg : _bw_theme + 'img/pins/pin-1.png')
		});
		
	},
	
	createLabel: function() {
		
		var boxText = document.createElement("div");
		boxText.style.cssText = "color:#fff;";
		/*jshint multistr: true*/
		boxText.innerHTML = "<div class='marker-label'>" + jQuery('#map-summary').html() + "</div>";

		var infoOptions = {
			content: boxText,
			disableAutoPan: true,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-25, -235),
			zIndex: null,
			boxStyle: { 
				/background: "url('img/marker-label.png') no-repeat",
				width: "400px",
				height: "215px"
			},
			infoBoxClearance: new google.maps.Size(1, 1),
			isHidden: false,
			pane: "mapPane",
			enableEventPropagation: true
		};
		
		var ib = new InfoBox(infoOptions);
		ib.open(mapObject, marker);
		
	},
	
	mapLoaded: function() {
		
	},
	
	owlSlider: function(direction) {
		
		switch(direction) {
			case 'in': {
				if(jQuery('.post-gallery').length > 0) {
					jQuery('.post-gallery').owlCarousel({
						items:1,
						lazyLoad:true,
						navigation:true,
						autoPlay:true,
						pagination: true,
						navigationText: false
					});
				}
				break;
			}
			case 'out': {
				/jQuery('.post-gallery').data('owlCarousel').destroy();
				break;
			}
			default: return;
		}
		
	},
	
	scrollBar: function(direction) {
		
		switch(direction) {
			case 'in': {
				jQuery(".scroll-content").mCustomScrollbar({
					theme: "dark",
					scrollInertia:300,
					autoHideScrollbar: true
				});
				break;
			}
			case 'out': {
				setTimeout(function() {
					jQuery(".scroll-content").mCustomScrollbar("destroy");
				}, 300);
				break;
			}
			default: return;
		}
		
	},
	
	playAnimations: function(direction) {
		
		var element = jQuery('.djax-dynamic > div');
		
		switch(direction) {
		
            case 'in': {
				
				App.animations.pageAnimation('in');
				
                if(element.hasClass('bw--owl')) { App.owlSlider('in'); }
                if(element.hasClass('bw--page')) { App.animations.graph(); }
                if(element.hasClass('bw--also-like')) { App.alsoLikeCenterText(); }
                if(element.hasClass('bw--scroll')) { App.animations.scroll('in'); }
                if(element.hasClass('bw--catz')) { App.animations.categorizr('in'); break; }
                if(element.hasClass('bw--contact')) { App.animations.contact('in'); break; }
                if(element.hasClass('bw--rail')) { App.animations.rail.init('in'); break; }
                if(element.hasClass('bw--gallery')) { App.animations.gallery('in'); break; }
                if(element.hasClass('bw--journal')) { App.animations.journal('in'); break; }
                if(element.hasClass('bw--isotope')) { App.animations.isotope('in'); break; }
                if(element.hasClass('bw--left-part-page')) { App.animations.leftPartPage('in'); break; }
                if(element.hasClass('bw--404')) { App.animations.notFound('in'); break; }
				
				break;
            }
            case 'out': {
				
				App.animations.pageAnimation('out');
				
                if(element.hasClass('bw--owl')) { App.owlSlider('out'); }
                if(element.hasClass('bw--catz')) { App.animations.categorizr('out'); break; }
                if(element.hasClass('bw--contact')) { App.animations.contact('out'); break; }
                if(element.hasClass('bw--rail')) { App.animations.rail.init('out'); break; }
                if(element.hasClass('bw--gallery')) { App.animations.gallery('out'); break; }
                if(element.hasClass('bw--journal')) { App.animations.journal('out'); break; }
                if(element.hasClass('bw--scroll')) { App.animations.scroll('out'); break; }
                if(element.hasClass('bw--isotope')) { App.animations.isotope('out'); break; }
                if(element.hasClass('bw--left-part-page')) { App.animations.leftPartPage('out'); break; }
                if(element.hasClass('bw--404')) { App.animations.notFound('out'); break; }
				
				break;
            }
            default: break;
        }
		
	},
	
	djax: function() {
		
		var djax_transition = function($newEl) {
			
			var $oldEl = this;
			
			$oldEl.fadeOut(300, function () {
				$oldEl.after($newEl);
				$oldEl.remove();
				App.cleanUpAfterDjax();
				$newEl.hide().fadeIn(300);
				App.playAnimations('in');
				App.sidebarScrollBar();
			});
		};
		
		/ if not an iframe
		/if(window.location == window.parent.location) {
			jQuery('body').djax('.djax-dynamic', ['.pdf','.doc','.eps','.png','.zip','admin','wp-','wp-admin','feed','#', '?lang=', '&lang=', '&add-to-cart=', '?add-to-cart=', '?remove_item'], djax_transition);
		/}
		
	},
	
	animations: {
		
		graph: function() {
			
			jQuery('.bargraph li').each(function() {
				TweenMax.allTo(jQuery('.bar-wrap span', this), 0.5, {delay:0.5,width:jQuery('.bar-wrap span', this).attr('data-width') + '%', ease:Back.easeOut}, 0.5);
			});
			
		},
		
		notFound: function() {
			
		},
		
		leftPartPage: function(direction) {
			switch(direction) {
				case 'in': {
					jQuery('#left-part-page .image img').resizeToParent({parent: '.image'});
					break;
				}
				case 'out': {
					jQuery('#left-part-page .image img').resizeToParent('destroy');
					break;
				}
				default: break;
			}
		},
		
		isotope: function(direction) {
			
			switch(direction) {
				
				case 'in': {
					
					App.owlSlider('in');
					App.isotope();
					
					break;
				}
				case 'out': {
					/ destroy isotope
					App.owlSlider('out');
					jQuery(window).off("debouncedresize");
					jQuery("#content").isotope('destroy');
					break;
				}
				default: break;
			}
			
		},
		
		scroll: function(direction) {
			
			switch(direction) {
				case 'in': {
					App.owlSlider('in');
					App.scrollBar('in');
					break;
				}
				case 'out': {
					App.owlSlider('out');
					App.scrollBar('out');
					break;
				}
				default: break;
			}
		},
		
		journal: function(direction) {
			
			switch(direction) {
				case 'in': {
					
					TweenMax.staggerTo(jQuery('#journal-list .item'), 0.3, 
						{delay:0.05,opacity:1, ease:Quint.easeOut}, 
					0.10);
					
					TweenMax.staggerTo(jQuery('#journal-list .item'), 0.3, 
						{top:-20},
					0.10);
					
					TweenMax.staggerTo(jQuery('#journal-list .item'), 0.3, 
						{delay:0.3,top:0},
					0.10);
					
					break;
				}
				case 'out': {
					/ on leave animation
					break;
				}
				default: break;
			}
		},
		
		gallery: function(direction) {
			
			switch(direction) {
				case 'in': {
					
					/ keyboard shortcodes
					App.animations.galleryShortcuts('in');
					
					/ on enter animation
					jQuery('#gallery .full').resizeToParent({parent: '#gallery'});
					
					/ cover animation
					setTimeout(function() {
						
						if(jQuery('#cover').length > 0) {
							jQuery('#cover .cover-center').addClass('visible');
							
							TweenMax.allFrom(jQuery('#cover .cover-center span'), 0.5, 
							{top:"-=30px", rotation:"-40deg", alpha:0, scale:1.8, ease:Back.easeOut}, 0.2);
							
							TweenMax.to(jQuery('#cover .border-top'), 0.3, {delay:0.6, width:'27%', opacity:1, ease:Back.easeOut});
							TweenMax.to(jQuery('#cover .border-bottom'), 0.3, {delay:0.9, width:'27%', opacity:1, ease:Back.easeOut});
							
							TweenMax.to(jQuery('#cover .cover-top'), 0.3, {delay:0.7, bottom:0, opacity:1, ease:Back.easeOut});
							TweenMax.to(jQuery('#cover .cover-bottom'), 0.3, {delay:1.1, top:0, opacity:1, ease:Back.easeOut});
						}
						
					}, 500);
					
					/ fix for toggle navigation
					if(jQuery('body').hasClass('cover') && jQuery('.full-toggle i').hasClass('fa-arrows-alt')) {
						jQuery('.full-toggle i').removeClass('fa-arrows-alt').addClass('fa-compress');
					}
					
					/ addthis media
					if (window.addthis) {
						window.addthis = null;
						window._adr = null;
						window._atc = null;
						window._atd = null;
						window._ate = null;
						window._atr = null;
						window._atw = null;
					}
					jQuery.getScript( '/s7.addthis.com/js/300/addthis_widget.js#pubid=ra-534b93e766f14c42' );
					
					jQuery('.info-content').css('bottom', (jQuery('.info-content').outerHeight() * -1) );
					
					break;
				}
				case 'out': {
					
					/ keyboard shortcodes
					App.animations.galleryShortcuts('out');
					
					/ on leave animation
					jQuery('#gallery .full').resizeToParent('destroy');
					break;
				}
				default: break;
			}
			
			
		},
		
		galleryShortcuts: function(direction) {
			
			switch(direction) {
				case 'in': {
					
					jQuery(document).bind('keydown', function(eventObject) {
						
						switch (eventObject.keyCode) {
							case 37:
								/ left
								if( jQuery('.post-nav.nav-right').length ) { jQuery('.post-nav.nav-right').trigger('click'); }
								break;
							case 39:
								/ right
								if( jQuery('.post-nav.nav-left').length ) { jQuery('.post-nav.nav-left').trigger('click'); }
								break;
							case 27:
								/ escape
								if( jQuery('.full-toggle .fa-compress').length ) { jQuery('.full-toggle').trigger('click'); }
								break;
							default: break;
						}
					});
					
					break;
				}
				case 'out': {
					
					jQuery(document).unbind('keydown');
					
					break;
				}
				default: break;
			}
				
				
			
			
			
			
			
		},
		
		pageAnimation: function(direction) {
			
			switch(direction) {
				case 'in': {
					/ resize image to parent
					jQuery('.image-full .full').resizeToParent({parent: '.image-full'});
					
					TweenMax.staggerFrom(jQuery('.scale--both'), 0.3, 
						{opacity:0}, 
					0.3);
					
					break;
				}
				case 'out': {
					/ kill resize image to parent
					jQuery('.image-full .full').resizeToParent('destroy');
					
					TweenLite.to(jQuery('.scale--both'), 0.3, 
						{opacity:0}, 
					0.3);
					
					/TweenLite.to('.scale--both > .scale--cont', 0.3, {scale:0.95, opacity:0});
					/TweenMax.to('.scale--out > .scale--cont', 0.2, {scale:0.95, opacity:0});
					
					break;
				}
				default: break;
			}
		},
		
		rail: {
			
			rwidth: 0,
			
			freeze: true,
			
			init: function(direction) {
				
				switch(direction) {
					case 'in': {
						$('img').imagesLoaded(function() {
							App.animations.rail.resize();
							App.animations.rail.size();
							App.animations.rail.scrollable();
							jQuery(window).resize(function() {
								App.animations.rail.resize();
								App.animations.rail.size();
							});
							App.animations.rail.start();
							App.animations.rail.animate('in');
							
							jQuery('#container').on('click', '.mobile-rail .slide.slide-left', function() {
								App.animations.rail.wheeel(1);
							});
							
							jQuery('#container').on('click', '.mobile-rail .slide.slide-right', function() {
								App.animations.rail.wheeel(0);
							});
						});
						break;
					}
					case 'out': {
						jQuery(window).off("resize");
						App.animations.rail.end();
						App.animations.rail.animate('out');
						
						jQuery('#container').unbind('click');
						
						break;
					}
					default: break;
				}
				
			},
			
			animate: function(direction) {
				
				switch(direction) {
					case 'in': {
						
						TweenMax.to(jQuery('#rail .rail-content li'), 0, {scale:0.8, opacity:0});
						
						TweenMax.staggerTo(jQuery('#rail .rail-content li'), 0.5, 
							{scale:1, opacity:1, ease:Quint.easeOut}, 
						0.12);
						
						break;
					}
					case 'out': {
						
						TweenMax.to(jQuery('#rail .rail-content li'), 0.5, {scale:0.9, opacity:0, ease:Quint.easeIn});
						
						break;
					}
					default: break;
				}
			},
			
			scrollable: function() {
				
				App.animations.rail.flag();
				jQuery(window).resize(function() {
					App.animations.rail.flag();
				});
				
			},
			
			flag: function() {
				
				if(jQuery('#rail').outerWidth() < jQuery('#rail .rail-content').outerWidth()) {
					App.animations.rail.freeze = false;
				}else{
					App.animations.rail.freeze = true;
				}
				
			},
			
			size: function() {
				
				var totalRailWidth = 0;

				jQuery('#rail .rail-content li').each(function() {
					totalRailWidth += parseInt(jQuery(this).outerWidth(), 10);
				});
				
				jQuery('#rail .rail-content').width(totalRailWidth);
				App.animations.rail.rwidth = totalRailWidth;
				
			},
			
			resize: function() {
				
				jQuery('#rail .rail-content .item').each(function() {
					var $this = jQuery(this);
					$this.width($this.find('img').width());
				});
				
			},
			
			start: function() {
				
				jQuery('#rail .rail-content li:first').addClass('focus');
				
				jQuery(window)
				.unbind('mousewheel')
				.mousewheel(function(e, d) {
					
					App.animations.rail.wheeel(d);
					
				});
				
				/**/
			},
			
			wheeel: function(d) {
				
				var $item = jQuery('#rail .rail-content li.focus');
					
				if(d > 0) {
					if(!$item.prev().length) return;
					$item.prev().addClass('focus');
					$item.removeClass('focus');
				}else{
					if(!$item.next().length || App.animations.rail.freeze) return;
					$item.next().addClass('focus');
					$item.removeClass('focus');
				}
				
				var focusIndex = jQuery('#rail .rail-content li').index(jQuery('#rail .rail-content li.focus'));
				
				var railPosition = 0;
				
				if(d > 0) {
					
					jQuery('#rail li:lt(' + focusIndex + ')').each(function() {
						railPosition -= parseInt(jQuery(this).outerWidth(), 10);
					});
					
					App.animations.rail.freeze = false;
					
				}else{
					
					jQuery('#rail li:lt(' + focusIndex + ')').each(function() {
						
						railPosition += parseInt(jQuery(this).outerWidth(), 10);
						
					});
					
					
					if( railPosition > ( App.animations.rail.rwidth - jQuery('#rail').outerWidth() ) ) {
						
						railPosition = App.animations.rail.rwidth - jQuery('#rail').outerWidth();
						
						App.animations.rail.freeze = true;
					}
					
				}
				
				if(d > 0) {
					TweenMax.to(jQuery('#rail .rail-content'), 0.6, {left:railPosition, ease:Quint.easeOut});
				}else{
					TweenMax.to(jQuery('#rail .rail-content'), 0.6, {left:-railPosition, ease:Quint.easeOut});
				}
				
			},
			
			end: function() {
				jQuery('#rail .rail-content').unbind('mousewheel');
			},
			
		},
		
		categorizr: function(direction) {

			switch(direction) {
				case 'in':{
					
					/ rebuild resizable images
					jQuery('#categorizr .full').resizeToParent({parent: '.item'});
					
					/ show first slider
					jQuery('#categorizr .slider .item:first, #categorizr .author li:first').addClass('visible');
					
					setTimeout(function() {
						
						/ show menu categories one by one
						jQuery('#categorizr .nav .title').each(function(e) {
							(function(self, index) {
								setTimeout(function() {
									jQuery(self).addClass('show');
									if(index+1 === jQuery('#categorizr .nav .title').length) {
										/ activate first category from the menu when all categories are visible
										setTimeout(function() {
											jQuery('#categorizr .nav li:first .title').addClass('active');
										},200);
									}
								},index*50);
							})(this, e);
						});
						
						
						
					}, 300);

					break;
				}
				case 'out': {
					
					jQuery('#categorizr .full').resizeToParent('destroy');
					
					jQuery('#categorizr .nav > li').each(function(e) {
						(function(self, index) {
							setTimeout(function() {
								jQuery(self).find('.title').css('bottom',index+1*100);
								jQuery(self).find('.quick-view-gallery').css('bottom',(index+1)*50).fadeOut(200);
							},index*70);
						})(this, e);
					});
					
					break;
				}
				default: break;
			}
			
		},
		
		contact: function(direction) {
			
			switch(direction) {
				case 'in':{
					
					App.map();
					
					break;
				}
				case 'out': {
					
					
					
					break;
				}
				default: break;
			}
		}
		
	},
	
	isotope: function() {
		
		jQuery(window).on("debouncedresize", function() {
			App.isotopeRun();
		});
		
		App.isotopeRun();
		App.isotopeShow();
		
	},
	
	isotopeShow: function() {
		
		var $animateElement = jQuery('.isotope .isotope-item .element');
		
		setTimeout(function() {
			jQuery('.isotope').addClass('transition');
		}, 100);
		
		TweenMax.staggerFromTo($animateElement, 0.4, 
			{scale: 0.9}, 
			{scale: 1, ease:Back.easeOut, delay: 0.5}, 
		0.1);

		TweenMax.staggerFromTo($animateElement, 0.2, 
			{opacity: 0}, 
			{opacity: 1, ease:Sine.easeOut, delay: 0.5}, 
		0.1);

		TweenMax.staggerFromTo(jQuery('img', $animateElement), 0.6, 
			{scale: 1.35}, 
			{scale: 1, ease:Sine.easeOut, delay: 0.5}, 
		0.1);
		
	},
	
	isotopeRun: function() {
		
		var $container = jQuery('.isotope');
		var colWidth = function () {
			var w = $container.width(), 
				columnNum = 1,
				columnWidth = 0,
				elementSpace = jQuery('.isotope').hasClass('element-space') ? 8 : 0;
				elementSpace = jQuery('.isotope').hasClass('element-big-space') ? 22 : 0;
			if (w > 1200) {
				columnNum  = 5;
			} else if (w > 900) {
				columnNum  = 4;
			} else if (w > 600) {
				columnNum  = 3;
			} else if (w > 300) {
				columnNum  = 2;
			}
			
			columnWidth = Math.floor(w/columnNum);
			
			$container.find('.isotope-item').each(function() {
				var $item = jQuery(this),
					multiplier_w = $item.attr('class').match(/item-w(\d)/),
					multiplier_h = $item.attr('class').match(/item-h(\d)/),
					width = multiplier_w ? columnWidth*multiplier_w[1]-elementSpace : columnWidth-elementSpace,
					height = multiplier_h ? columnWidth*multiplier_h[1]*0.5-elementSpace : columnWidth*0.5-elementSpace;
				$item.css({
					width: width,
					height: height
				});
			});
			return columnWidth;
		};
		
		jQuery(".isotope").isotope({
			resizable: false,
			transformsEnabled: false,
			itemSelector: '.isotope-item',
			masonry: {
				columnWidth: colWidth(),
				gutterWidth: 4,
				rowHeight: 600,
			}
		});
        
        setTimeout(function() {
            $('.isotope').isotope( 'reloadItems' ).isotope();
        }, 1000);
		
	},
	
	categorizr: {
		
		change: function(e) {
			
			var index = jQuery('li.category').index(e.parent());
			
			jQuery('#categorizr .slider li .item.zindex').css('opacity', 1);
			jQuery('#categorizr .slider li .item').removeClass('zindex');
			jQuery('#categorizr .slider li:eq(' + index + ') > .item').addClass('zindex');
			TweenMax.to(jQuery('#categorizr .slider li:eq(' + index + ') > .item'), 0.9, {opacity:1, ease:Back.easeOut});
			console.log(jQuery('#categorizr .slider li:not(:eq(' + index + ')) > .item'));
			TweenMax.to(jQuery('#categorizr .slider li:not(:eq(' + index + ')) > .item'), 0, {delay:0.6, opacity:0, ease:Back.easeOut});
			
			/ authors
			jQuery('#categorizr .author li').removeClass('visible');
			jQuery('#categorizr .author li:eq(' + index + ')').addClass('visible');
			
		},
		
		show: function() {
			
			setTimeout(function() {
				if(jQuery('#categorizr').hasClass('expanded')) {
					
					jQuery("#categorizr .nav ul img").sort(function() {
						return Math.random()*10 > 5 ? 1 : -1;
					}).each(function(e) {
						(function(self, index) {
							setTimeout(function() {
								jQuery(self).addClass('visible');
							},index*15);
						})(this, e);
					});
					
					jQuery("#categorizr").addClass('transform');
					
				}else{
					jQuery("#categorizr .nav ul img").removeClass('visible');
					jQuery("#categorizr").removeClass('transform');
				}
			}, 300);
		}
	}
	
};

App.start();