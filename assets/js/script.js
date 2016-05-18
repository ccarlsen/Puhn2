var win = require('electron').remote.getCurrentWindow();

$('.Side-gifs').on('scroll', function() {
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
		$('.Side').addClass('bottomOfGifs');
	} else {
		$('.Side').removeClass('bottomOfGifs');
	}
});

$('.Side-sounds').on('scroll', function() {
	if($(this).scrollTop() > 1) {
		$('.Side').addClass('notTopOfSounds');
	} else {
		$('.Side').removeClass('notTopOfSounds');
	}
});

$('.Side-sounds li').on('click', function() {

	var element = $(this);
	var timeline = new TimelineMax({paused:true});
	var progress = element.find('span i');
	var sound = element.find('audio');
	var seconds = element.attr('data-seconds');

	stopSounds(element);

	timeline
		.add(function(){sound[0].play();})
		.to(progress, seconds, {css:{width: '100%'}, ease:Power0.easeNone})
		.add(function(){element.removeClass('playing');})
		.to(progress, 0, {css:{width: '0%'}});

	if(element.hasClass('playing')) {
		element.removeClass('playing');
	} else {
		element.addClass('playing');
		timeline.play();
	}

});


$('.Side-sounds li').on('dblclick', function() {
	console.log('send');
	stopSounds();
});

$('.Chat-minimize').on('click', function() {
	win.minimize();
});

function stopSounds(el) {
	$('.Side-sounds li').not(el).removeClass('playing');
	$('.Side-sounds li span i').not(el).width('0%');
	TweenMax.killAll();
	$('audio').each(function(){
		this.pause();
		this.currentTime = 0;
	});
}
