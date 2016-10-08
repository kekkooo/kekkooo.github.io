$(function () {
	"use strict";
	
	$("#menuToggle, .btn-close").on("click", function (e) {
		e.preventDefault();
	});
	
	$('.dropdown-menu a').click(function(e) {
		e.stopPropagation();
	});
	
	function getGridSize() {
		return (Modernizr.mq('(max-width:490px)')) ? 1 : 
				(Modernizr.mq('(max-width:705px)')) ? 2 : 
				(Modernizr.mq('(max-width:768px)')) ? 3 : 4;
	}
	
	/* ---------------------------------------------------------
	 *	Background
	 */
	
	$.backstretch([
		"site_assets/img/background/bg-research_ld.png"
	], {duration: 3800, fade: 1500});
	
	
	/* ---------------------------------------------------------
	 *	WOW
	 */
	
	new WOW({
		mobile: false
	}).init();
	
	
	/* ---------------------------------------------------------
	 *	Knob
	 */
	
	$(".dial").knob({
		 draw : function () {

			// "tron" case
			if(this.$.data('skin') == 'tron') {

				var a = this.angle(this.cv)  		// Angle
					, sa = this.startAngle          // Previous start angle
					, sat = this.startAngle         // Start angle
					, ea                            // Previous end angle
					, eat = sat + a                 // End angle
					, r = true;

				this.g.lineWidth = this.lineWidth;

				this.o.cursor
					&& (sat = eat - 0.3)
					&& (eat = eat + 0.3);

				if (this.o.displayPrevious) {
					ea = this.startAngle + this.angle(this.value);
					this.o.cursor
						&& (sa = ea - 0.3)
						&& (ea = ea + 0.3);
					this.g.beginPath();
					this.g.strokeStyle = this.previousColor;
					this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
					this.g.stroke();
				}

				this.g.beginPath();
				this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
				this.g.stroke();

				this.g.lineWidth = 2;
				this.g.beginPath();
				this.g.strokeStyle = this.o.fgColor;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
				this.g.stroke();

				return false;
			}
		}
	});
	
	
	/* ---------------------------------------------------------
	 *	Scroll arrow
	 */
	
	// $("#scroll").click(function () {
	// 	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
	// 		var target = $(this.hash);
	// 		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	// 		if (target.length) {
	// 			$('html,body').animate({
	// 				scrollTop: target.offset().top
	// 			}, 1200);
	// 			return false;
	// 		}
	// 	}
	// });
	
	
	/* ---------------------------------------------------------
	 *	Timeline
	 */
	
	$("[data-toggle='collapse']").on("click", function(e){
		e.preventDefault();
		var id = $('.v-icon[data-target="' + $(this).attr("data-target") + '"]');
		var icon = $(id).children("i");
		if(/fa-minus/i.test($(icon).attr("class"))){
				$(icon).removeClass("fa-minus").addClass("fa-plus");
		}
		else{
			$(icon).removeClass("fa-plus").addClass("fa-minus");
		}
	});
	
	
	/* ---------------------------------------------------------
	 *	Portfolio
	 */
	
	var $grid = $('#portfolio-container');
		
	$grid.imagesLoaded( function() {
		$grid.shuffle({
			itemSelector: '.portfolio-item',
			speed: 450
		});	
		
		$('#filter a').click(function (e) {
			e.preventDefault();
		 
			// set active class
			$('#filter a').removeClass('active');
			$(this).addClass('active');
		 
			// get group name from clicked item
			var groupName = $(this).attr('data-group');
		 
			// reshuffle grid
			$grid.shuffle('shuffle', groupName );
		});
	});
	
	/* ---------------------------------------------------------
	 *	GITheWall
	 */
	
	// $('.GITheWall').GITheWall({
	// 	nextButtonClass: 'fa fa-chevron-right',
	// 	prevButtonClass: 'fa fa-chevron-left',
	// 	closeButtonClass: 'fa fa-times',
	// 	dynamicHeight: false,
	// 	onShow: function(){
	// 		$("#portfolio-container").slideDown(300).fadeOut(300);
	// 		$(".filter-tags").slideDown(300).fadeOut(300);
	// 		$("#portfolio-more").slideDown(300).fadeOut(300);
	// 	},
	// 	onHide: function(){
	// 		$("#portfolio-container").slideUp(300).fadeIn(300);
	// 		$(".filter-tags").slideUp(300).fadeIn(300);
	// 		$("#portfolio-more").slideUp(300).fadeIn(300);
	// 	}
	// });
	
	
	/*
	 * Navigation
	 * ----------------------------------------------------------------- */
	
	$('#nav').affix({
		  offset: {
			top: $('#home').height() - 80
		  }
	});	
	
	
	/*
	 * Navbar scrolls
	 * ----------------------------------------------------------------- */
	
	$(".navbar-nav").find("a").on("click", function(e){		
		if(( $(this).attr("href" ) != "#" ) && ( $(this).attr("href")[0] == "#" )){
			e.preventDefault();
			$.scrollTo($(this).attr("href"),1000, {offset: {left: 0, top: -80}});
		}
	});
	
});