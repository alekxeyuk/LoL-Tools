var ui={};ui.caretPos = function(ctrl) {
	// Return caret position
	var pos = 0;  
	if (document.selection) {
		ctrl.focus();
		var sel = document.selection.createRange();
		sel.moveStart ('character', -ctrl.value.length);
		pos = sel.text.length;
	}
	else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		pos = ctrl.selectionStart;
	}
	return pos;
};

ui.leftButton = function(e) {
    if (!e) e = window.event;
    if (e.buttons) return e.buttons === 1;
    if (e.which) return e.which === 1;
    return e.button === 1;
};

ui.cancel = function(e) {
    if (!e) e = window.event;
    if (e.cancelBubble != null) e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    if (window.event) e.returnValue = false;
    if (e.cancel != null) e.cancel = true;
    return false;
};

// SKINS
SKIN = 'light'; // the name of the skin
COLORSCHEME = 'light'; // light or dark
SKINPATH = '/skin/'+SKIN;
ICONPATH = SKINPATH+'/icon';	
BGNDPATH = SKINPATH+'/bgnd';
BTNPATH = SKINPATH+'/btn';	
DIVPATH = SKINPATH+'/div';	

// Initializing
$(document).ready(function() {
	SKINPATH = '/skin/'+SKIN;
	ICONPATH = SKINPATH+'/icon';	
	BGNDPATH = SKINPATH+'/bgnd';
	BTNPATH = SKINPATH+'/btn';	
	DIVPATH = SKINPATH+'/div';	
});

ui.Slider = {};

ui.Slider.clicked = null;

ui.Slider.pos = function(slider,value) {
	// Return the width based on value
	var min = parseFloat($(slider).attr('min'));
	var max = parseFloat($(slider).attr('max'));
	var log = parseFloat($(slider).attr('log'));
	var xmin = parseFloat($(slider).attr('xmin'));
	var xmax = parseFloat($(slider).attr('xmax'));
	if (isNaN(min)) min = 0;
	if (isNaN(max)) max = 1;
	if (isNaN(log)) log = 1;
	if (isNaN(xmin)) xmin = min;
	if (isNaN(xmax)) xmax = max;
	if (value > max) value = max;
	if (value < min) value = min;
	var pos = (value-xmin)/(xmax-xmin);
	pos = Math.pow(pos,1/log);
	// Reverse slider
	var reverse = parseInt($(slider).attr('reverse'));
	if (isNaN(reverse)) reverse = 0;
	if (reverse) pos = 1-pos;
	return pos;
};

ui.Slider.valueFromPos = function(slider,pos) {
	// Return the value based on position (from 0.0 to 1.0)
	var min = parseFloat($(slider).attr('min'));
	var max = parseFloat($(slider).attr('max'));
	var step = parseFloat($(slider).attr('step'));
	var log = parseFloat($(slider).attr('log'));
	var xmin = parseFloat($(slider).attr('xmin'));
	var xmax = parseFloat($(slider).attr('xmax'));
	if (isNaN(min)) min = 0;
	if (isNaN(max)) max = 1;
	if (isNaN(step)) step = 1;
	if (isNaN(log)) log = 1;
	if (isNaN(xmin)) xmin = min;
	if (isNaN(xmax)) xmax = max;
	if (!step) step = 1;
	if (pos > 1.0) pos = 1.0;
	if (pos < 0.0) pos = 0.0;
	pos = Math.pow(pos,log);
	var value = step*Math.round((pos*(xmax-xmin)+xmin)/step);
	if (value > max) value = max;
	if (value < min) value = min;
	return value;
};

ui.Slider.setVal = function(slider,value) {
	var pos = ui.Slider.pos(slider,value);
	$(slider).val(value).children('div').css('width',''+(pos*100)+'%');
};

ui.Slider.update = function(pageX) {
	if (!ui.Slider.clicked) return;
	var offset = $(ui.Slider.clicked).offset();
	var width = $(ui.Slider.clicked).width();
	var pos = (pageX-offset.left)/width;
	var value = ui.Slider.valueFromPos(ui.Slider.clicked, pos);
	ui.Slider.setVal(ui.Slider.clicked, value);
};

ui.Slider.mouseDown = function(e) {
	ui.Slider.clicked = e.currentTarget;
	ui.Slider.update(e.pageX);
	$(ui.Slider.clicked).trigger('change');
	return ui.cancel(e);
};

ui.Slider.mouseMove = function(e) {
	if (!ui.Slider.clicked) return;
	ui.Slider.update(e.pageX);
	$(ui.Slider.clicked).trigger('change');
	return ui.cancel(e);
};

ui.Slider.mouseOut = function(e) {
	if (!ui.Slider.clicked) return;
	ui.Slider.update(e.pageX);
	$(ui.Slider.clicked).trigger('change',true);
	ui.Slider.clicked = null;
	return ui.cancel(e);
};

ui.Slider.mouseUp = function(e) {
	ui.Slider.update(e.pageX);
	$(ui.Slider.clicked).trigger('change',true);
	ui.Slider.clicked = null;
	return ui.cancel(e);
};

ui.Slider.touchStart = function(e) {
	if (!e.originalEvent.touches.length) return;
	ui.Slider.clicked = e.currentTarget;
	ui.Slider.update(e.originalEvent.touches[0].pageX);
	$(ui.Slider.clicked).trigger('change');
	return ui.cancel(e);
};

ui.Slider.touchMove = function(e) {
	if (!e.originalEvent.touches.length) return;
	if (!ui.Slider.clicked) return;
	ui.Slider.update(e.originalEvent.touches[0].pageX);
	$(ui.Slider.clicked).trigger('change');
	return ui.cancel(e);
};

ui.Slider.touchEnd = function(e) {
	if (!ui.Slider.clicked) return;
	$(ui.Slider.clicked).trigger('change',true);
	ui.Slider.clicked = null;
	return ui.cancel(e);
};

ui.Slider.setUp = function(div) {
	var title = $(div).attr('title');
	var value = parseFloat($(div).attr('value'));
	var pos = ui.Slider.pos(div,value);
	var html = '';
	if (title) html+= '<p class="label back">'+title+'</p>';
	html+= '<div style="width:'+(pos*100)+'%">';
	if (title) html+= '<p class="label front">'+title+'</p>';
	html+= '</div>';
	$(div).val(value).attr('title','').prepend(html)
	.mousedown(ui.Slider.mouseDown)
	.mousemove(ui.Slider.mouseMove)
	.mouseout(ui.Slider.mouseOut)
	.mouseup(ui.Slider.mouseUp)
	.on('touchstart', ui.Slider.touchStart);
};

// Initializing
$(document).ready(function() {
	$('.slider').each(function(i) {
		ui.Slider.setUp(this);
	});
	$(window)
		.on('touchmove', ui.Slider.touchMove)
		.on('touchend', ui.Slider.touchEnd);
});

ui.Sound = {};

ui.Sound.audioList = {};
ui.Sound.audioElement = function(name, overlay) {
	// Return an audio element
	var parsed1 = name.split('*');
	var parsed2 = parsed1[0].split('-');
	var audio = ui.Sound.audioList[name];
	if (!audio) {
		// Create the audio object
		var file = parsed2[0];
		var source;
		var audio = document.createElement('audio');
		audio.name = name;
		// OGG format
		source = document.createElement('source');
		source.type = 'audio/ogg';
		source.src = '/audio/'+file+'.ogg';
		audio.appendChild(source);
		// MP4 format
		source = document.createElement('source');
		source.type = 'audio/mp4';
		source.src = '/audio/'+file+'.m4a';
		audio.appendChild(source);
		ui.Sound.audioList[name] = audio;
	}
	if (parsed1.length > 1) {
		// Loop and delay
		audio.loop = true;
		audio.delay = parseInt(parsed1[1]);
		if (!audio.delay) audio.delay = 0;
	}
	else {
		audio.loop = false;
		audio.delay = 0;
	}
	if (parsed2.length > 1) {
		audio.volume = 1-parseInt(parsed2[1])/5;
	}
	if (overlay && !audio.ended && audio.currentTime>0.33) {
		// Clone the audio element
		audio = audio.cloneNode(true);
		audio.loop = false;
		audio.pause();
		audio.currentTime = 0;
		audio.onended = function() {
			audio.remove();
		};
	}
	return audio;
};

ui.Sound.timeout = {};

ui.Sound.playNow = function(name) {
	ui.Sound.timeout[name] = null;
	var audio = ui.Sound.audioElement(name);
	if (!audio) return;
	audio.play();
};

ui.Sound.play = function(mix,overlay) {
	if (!mix) return;
	var mix = mix.split(',');
	for (var i in mix) {
		if (!mix[i]) continue;
		var name = mix[i];
		var audio = ui.Sound.audioElement(name, overlay);
		if (!audio) continue; // couldn't load sound
		if (ui.Sound.timeout[name]) {
			clearTimeout(ui.Sound.timeout[name]);
			ui.Sound.timeout[name] = null;
		}
		if (audio.loop) {
			// Differ playing
			ui.Sound.timeout[name] = setTimeout(function() {
				ui.Sound.timeout[name] = null;
				audio.play();
			}, audio.delay*1000);
		}
		else {
			// Play now
			audio.play();
		}
	}
};

ui.Sound.stop = function(mix) {
	var mix = mix.split(',');
	for (var i in mix) {
		if (!mix[i]) continue;
		var name = mix[i];
		var audio = ui.Sound.audioElement(name);
		if (!audio) continue;
		if (ui.Sound.timeout[name]) {
			clearTimeout(ui.Sound.timeout[name]);
			ui.Sound.timeout[name] = null;
		}
		audio.loop = false;
		audio.delay = 0;
		audio.pause();
		audio.currentTime = 0;
	}
};

// Create a namespace for our SVG-related utilities
ui.SVG = {};

ui.SVG.ns = 'http://www.w3.org/2000/svg';
ui.SVG.xlinkns = 'http://www.w3.org/1999/xlink';

ui.SVG.makeCanvas = function(width, height, attr) {
    var svg = document.createElementNS(ui.SVG.ns, "svg:svg");
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    if (attr) for (var i in attr) svg.setAttribute(i, attr[i]);
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', ui.SVG.xlinkns);
    return svg;
};

ui.SVG.defs = function(canvas) {
    var defs = document.createElementNS(ui.SVG.ns, 'defs');
    canvas.appendChild(defs);
    return defs;
};

ui.SVG.clipPath = function(defs, id) {
    var clipPath = document.createElementNS(ui.SVG.ns, 'clipPath');
    clipPath.setAttribute('id', id);
    defs.appendChild(clipPath);
    return clipPath;
};

ui.SVG.group = function(canvas, attr) {
    var group = document.createElementNS(ui.SVG.ns, 'g');
    if (attr) for (var i in attr) group.setAttribute(i, attr[i]);
    canvas.appendChild(group);
    return group;
};

ui.SVG.title = function(canvas, s, attr) {
    var title = document.createElementNS(ui.SVG.ns, 'title');
    title.innerHTML = s;
    if (attr) for (var i in attr) title.setAttribute(i, attr[i]);
    canvas.appendChild(title);
    return title;
};

ui.SVG.text = function(canvas, s, x, y, attr) {
    var text = document.createElementNS(ui.SVG.ns, 'text');
    text.innerHTML = s;
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    if (attr) for (var i in attr) text.setAttribute(i, attr[i]);
    canvas.appendChild(text);
    return text;
};

ui.SVG.line = function(canvas, x1, y1, x2, y2, attr) {
    var line = document.createElementNS(ui.SVG.ns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    if (attr) for (var i in attr) line.setAttribute(i, attr[i]);
    canvas.appendChild(line);
    return line;
};

ui.SVG.rectangle = function(canvas, x, y, width, height, attr) {
    var rect = document.createElementNS(ui.SVG.ns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    if (attr) for (var i in attr) rect.setAttribute(i, attr[i]);
    canvas.appendChild(rect);
    return rect;
};

ui.SVG.circle = function(canvas, cx, cy, radius, attr) {
    var circle = document.createElementNS(ui.SVG.ns, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', radius);
    if (attr) for (var i in attr) circle.setAttribute(i, attr[i]);
    canvas.appendChild(circle);
    return circle;
};

ui.SVG.path = function(canvas, d, attr) {
    var path = document.createElementNS(ui.SVG.ns, 'path');
    path.setAttribute('d', d);
    if (attr) for (var i in attr) path.setAttribute(i, attr[i]);
    canvas.appendChild(path);
    return path;
};

var lol={version:7007};lol.hostname='www.landsoflords.com';
lol.UID = 0;
lol.FID = 0;

lol.Lang = null;
lol.SafeMode = false;
lol.IsNovice = false;
lol.IsAdmin = false;
lol.IsInspector = false;
lol.IsSilenced = false;
lol.IsDisabled = false;
lol.Premium = false;
lol.Locate = false;
lol.Prod = true;

lol.go = function(url) {
	// Go to the passed url
	if (!url) return;
	window.location=url;
};

lol.refresh = function(timeout) {
	// Refresh current page
	if (timeout) return setTimeout(lol.refresh,timeout);
	window.location.replace(window.location.href);
};


lol.str = function(s) {
	// The opposite function to php's data()
	// Replace somme tagged characters.
	if (!s) return '';
	s = s.replace(/&#126;/g,'~');
	s = s.replace(/&#124;/g,'|');
	s = s.replace(/&#58;/g,':');
	s = s.replace(/&#44;/g,',');
	s = s.replace(/&#36;/g,'$');
	s = s.replace(/&#35;/g,'#');
	return s;
};

lol.sprintf = function(s, args) {
	// Very simple sprintf function
	for (var i in args) s = s.replace(/%[sd]/, args[i]);
	s = s.replace(/\s+/g,' '); // remove duplicate spaces
	s = s.replace(/\s\./g,'.'); // remove space before dot
	return s.trim();
};

lol.htmlspecialchars = function(s) {
	// Disable html tags
	if (!s) return '';
	s = s.replace(/</g,'&lt;');
	s = s.replace(/>/g,'&gt;');
	s = s.replace(/"/g,'&quot;');
	return s;
};

lol.addslashes = function(s) {
	if (!s) return '';
    return s.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
};


lol.pad0 = function(n, length) {
	var str = ''+n;
	while (str.length < length) str = '0'+str;
	return str;
};

lol.money = function(n) {
	// format number with 2 decimals
	if (!n) return '-';
	var s = Number(n).toFixed(2);
 	var i = s.length-6;
	while (i > 0) {
		s = s.substr(0,i)+'&thinsp;'+s.substr(i);
		i-= 11;
	}
	return s;
};

function parseMoney(s) {
	return parseFloat(s.replace(/[^-0-9.]/g, ''));
};

lol.hmoney = function(n,strict) {
	if (strict) return lol.money(n);
	if (n < 0) {
		n = Math.ceil(n);
		if (!n) return '-';
		if (n>-10000) return n;
		n = Math.ceil(n/1000);
		if (n>-10000) return '<'+n+'<b>k</b>';
		n = Math.ceil(n/1000);
		return '<'+n+'<b>M</b>';
	}
	n = Math.floor(n);
	if (!n) return '-';
	if (n < 10000) return n;
	n = Math.floor(n/1000);
	if (n < 10000) return '>'+n+'<b>k</b>';
	n = Math.floor(n/1000);
	return '>'+n+'<b>M</b>';
};

lol.hval = function(n) {
	n = Math.floor(n);
	if (!n) return '-';
	if (n < 10000) return n;
	n = Math.floor(n/1000);
	if (n < 10000) return '>'+n+'<b>k</b>';
	n = Math.floor(n/1000);
	return '>'+n+'<b>M</b>';
};

window.ondragstart = function(e) {
	// Disable dragging of images
	return ui.cancel(e);
};

// LOADERS
lol.loaded = function(loader, end) {
	if (!end) end = false;
	$(loader).removeClass('loading');
	$(loader).toggleClass('hidden', end);
};

// TOKENS
lol.Tokens = {
	current: 0,
	displayHTML: function(tokens, className) {
		var html = '<span class="tok monospace';
		if (className) html+= ' '+className;
		html+= '">'+tokens+'</span>';
		return html;
	},
	buttonHTML: function(tokens, onclick, title, className) {
		var enabled = lol.Tokens.current >= tokens;
		var html = '<button class="round tok monospace';
		if (className) html+= ' '+className;
		if (!enabled) html+= ' disabled';
		html+= '"';
		if (title) html+= ' title="'+title+'"';
		html+= ' onclick="'+(enabled? onclick:'lol.go(\'/settings/tokens\')')+'">'+tokens+'</button>';
		return html;
	},
	spend: function(tokens) {
		if (tokens <= 0) return;
		// Update the tokens
		lol.Tokens.current-= tokens;
		if (lol.Tokens.current < 0) lol.Tokens.current = 0;
		var lostTokens = Math.floor(lol.Tokens.current/1000);
		$('.tokens').html(lol.Tokens.current);
		$('.tokensLost').html(lostTokens);
		var html = '<img class="txt" src="'+ICONPATH+'/tokenw.png">'+tokens;
		$('#magic').html(html).stop().css('display','block').fadeOut(3000);
	},
	playSound: function () {
		if (lol.Notif.sound) ui.Sound.play('magic');
	},
	reward: function(tokens) {
		lol.Tokens.current+= tokens;
		var lostTokens = Math.floor(lol.Tokens.current/1000);
		$('.tokens').html(lol.Tokens.current);
		$('.tokensLost').html(lostTokens);
		var html = '<img class="txt" src="'+ICONPATH+'/tokenw.png">'+tokens;
		$('#magic').html(html).stop().css('display','block').fadeOut(3000);
		if (lol.Notif.sound) ui.Sound.play('coins');
	},
};

// LAYOUT
lol.layoutColumns = function() { 
	// Laying out columns
	var pageHeight = $('#page').outerHeight();
	var winHeight = $(window).innerHeight();
	var maxScroll = Math.max(0,pageHeight-winHeight);
	var scrollTop = $(window).scrollTop();
	$('.floatingColumn > div').each(function() {
		var content = $(this).children('.content');
		if (!scrollTop) {
			// Attach the floating column
			content.css({position: 'static', top: 0});
			$(this).css({height: 'auto'});
			return;
		}
		var voffset = $(this).offset().top;
		var contentHeight = content.outerHeight();
		var height = winHeight - voffset;
		if (contentHeight < height) {
			// The content stays fixed
			content.css({position: 'fixed', top: ''+voffset+'px'});
			$(this).css({height: ''+contentHeight+'px'});
			return;
		}
		var scrollRate = scrollTop/maxScroll;
		var top = voffset + (winHeight-contentHeight-voffset)*scrollRate;
		content.css({position: 'fixed', top: ''+top+'px'});
		$(this).css({height: ''+contentHeight+'px'});
		return;
	});
};

lol.layoutWindow = function() {
	// Force header on top
	$('#header').css('margin-top','0');
	lol.layoutColumns();
	// Layout elements in main column
	var div = $('#main');
	var width = div.width();
	div.toggleClass('noOrnament', width<380);
};

lol.formatElements = function(base) {
	// Format elements from the specified base element
	if (!base) base = $(document.body);
	
	// Menu
	base.find('.menu > a').each(function(i) {
		var item = $(this).attr('data-item');
		if (item == $(this).parent().attr('data-item')) $(this).addClass('selected');
	});
	
	// Portraits
	base.find('.portrait').each(function(i) {
		var frame = parseInt($(this).attr('data-frame'));
		if ($(this).is('[data-offensive]')) $(this).append('<img class="noMouse" src="/img/portrait/offensive.png"/>');
		if ($(this).is('[data-guilty]')) $(this).append('<img class="noMouse" src="/img/portrait/guilty.png"/>');
		if ($(this).is('[data-banned]')) $(this).append('<img class="noMouse" src="/img/portrait/banned.png"/>');
		$(this).append('<img class="noMouse pFrame" src="/img/portrait/frame/'+lol.pad0(frame,3)+'.png"/>');
		if ($(this).is('[data-online]')) $(this).append('<img class="noMouse" src="/img/portrait/online.png"/>');
		if ($(this).is('[data-inactive]')) $(this).append('<img class="noMouse" src="/img/portrait/inactive.png"/>');
		if ($(this).is('[data-excom]')) $(this).append('<img class="noMouse" src="/img/portrait/excom.png"/>');
		if ($(this).is('[data-dead]')) $(this).append('<img class="noMouse" src="/img/portrait/ribbon.png"/>');
	});	
	
	// Bonuses
	base.find('.bonus').each(function(i) {
		var bonus = parseFloat($(this).text());
		var rounded = Math.round(Math.abs(bonus));
		$(this).text(rounded);
		if (rounded == 0) $(this).addClass('gray');
		else $(this).addClass(bonus<0?'red':'green');
		$(this).prepend(bonus<0?'-':'+');
	});
	
	// Align labels
	base.find('.labelset').each(function(i) {
		var maxWidth = 0;
		$(this).find('label').each(function() {
			var width = $(this).width();
			if (width > maxWidth) maxWidth = width;
		});
		$(this).find('label').css({'display':'inline-block'}).width(maxWidth+1);
	});
	
	// Disclosed
	base.find('.disclosed').click(function(e) {
		$(this).removeClass('disclosed');
	});
	base.find('.disclosure').click(function(e) {
		$(this).parent().toggleClass('disclosed');
		return ui.cancel(e);
	});
};

lol.switch = function(e) {
	var direction = e.shiftKey?-1:1;
	mqykkbj('session', {switch:direction}, function(data) {
		if (!data) return;
		lol.refresh();
	});
	return ui.cancel(e);
};

// Initializing
$(document).ready(function() {

	if ('ontouchstart' in document.documentElement) {
		$(document.body).addClass('touch');
	}

	// Changing current language
	$('.lang').click(function() {
		mqykkbj('session',{lang:$(this).attr('data-lang')}, function() {
			lol.refresh();
		});
	});
	// Switching characters
	$('.menu .switch').click(function(e) {
		mqykkbj('session', {fid:$(this).attr('data-fid')}, lol.refresh);
		return ui.cancel(e);
	});
	
	
	// Figure menu
	$('#user').click(function() {
		$('#user .menu').slideToggle(200);
		$('#nav .menu').hide();
		lol.Nav.subItem = null;
	});
	// COLUMN LAYOUTS
	$('#left, #right')
	.addClass('floatingColumn')
	.wrapInner('<div class="content"></div>')
	.wrapInner('<div></div>');
	
	// RESIZING AND SCROLLING
	lol.layoutWindow();
	$(window)
	.resize(lol.layoutWindow)
	.on('orientationchange', lol.layoutWindow)
	.scroll(function() {
		// Loaders
		var last = $('#main > *:last-child');
		if (!last.length) return; // no element
		var docHeight = last.position().top + last.height();
		var winHeight = $(window).height();
		var scrollTop = $(window).scrollTop();
		if (scrollTop < 0) return;
		if (scrollTop == 0 && this.onscrolltop) this.onscrolltop();
		if (scrollTop+winHeight >= docHeight && this.onscrollbottom) this.onscrollbottom();
		lol.layoutColumns();
	});
	
	// PAGE LOADER
	if ($('.loader.top').length) window.onscrolltop = function() {
		if ($(':focus').length) return;
		var topLoader = $('.loader.top');
		if (!topLoader.length) return;
		if (!topLoader.is(':visible')) return;
		if (topLoader.hasClass('loading')) return;
		topLoader.addClass('loading');
		var action = topLoader.attr('data-action');
		if (!action) return;
		setTimeout(action+'()', 1000);
	};
	if ($('.loader.bottom').length) window.onscrollbottom = function() {
		if ($(':focus').length) return;
		var bottomLoader = $('.loader.bottom');
		if (!bottomLoader.length) return;
		if (!bottomLoader.is(':visible')) return;
		if (bottomLoader.hasClass('loading')) return;
		bottomLoader.addClass('loading');
		var action = bottomLoader.attr('data-action');
		if (!action) return;
		setTimeout(action+'()', 1000);
	};
	
	// Other loaders
	$('.loader').append('<img class="anim" src="'+ICONPATH+'/bar.gif"/>');
	$('.loader button').click(function() {
		$(this).parent().addClass('loading');
		setTimeout($(this).parent().attr('data-action')+'()', 1000);
	});
	
	lol.formatElements();
	
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
	
	$(document).keydown(function(e) {
		var editing = $(':focus').length>0;
		if (editing) return;
		switch (e.keyCode) {
			case 9: ui.cancel(e); break;
		}
	});
	setTimeout(function() {
		$(document).keydown(function(e) {
			var editing = $(':focus').length>0;
			if (editing) return;
			switch (e.keyCode) {
				case 8: $('#del').click(); break;
				case 9: lol.switch(e); break;
				case 13: $('#enter').click(); break;
				case 27: $('#esc').click(); break;
				case 37: lol.go($('a#prev').attr('href')); break;
				case 39: lol.go($('a#next').attr('href')); break;
			}
		});
	}, lol.Premium?0:1000);
	
	if ($('#notice').length) {
		// Display a notice
		var div = $('#notice');
		div.find('button').click(function() {
			var accept = $(this).attr('data-accept');
			mqykkbj('session',{accept:accept}, function() {
				div.slideUp();
			});
		});
		setTimeout(function() {
			div.slideDown();
		},2000);
	}
	
	if (lol.Locate) {
		// Register the user's IP address
		// lol.Locate contain the token
		var hostname = (lol.Prod? 'master':'dev')+'.landsoflords.com';
		$.post('https://'+hostname+'/ajax/loc', {id:lol.UID, token:lol.Locate});
	}
	
	// Deferred elements
	$('.deferred').each(function() {
		var div = $(this);
		var key = div.attr('data-key');
		var arg = div.attr('data-arg');
		if (!key) return;
		mqykkbj('deferred', {key:key,arg:arg}, function(data) {
			if (!data) return;
			div.replaceWith(data);
		});
	});
});

// NAVIGATION
lol.Nav = {
	item: null,
	badges: {},
};

lol.Nav.subItem = null;
lol.Nav.holdClickTimer = null;
lol.Nav.startClick = function(e) {
	if (!ui.leftButton(e)) return;
	// Restart hold click timer
	$('#user .menu').slideUp(200);
	var item = $(this).attr('data-item');
	clearTimeout(lol.Nav.holdClickTimer);
	lol.Nav.holdClickTimer = null;
	if (lol.Nav.subItem == item) {
		// Hide current submenu
		lol.Nav.hideSubmenu();
		return ui.cancel(e);
	}
	lol.Nav.holdClickTimer = setTimeout(function() {
		lol.Nav.holdClickTimer = null;
		lol.Nav.showSubmenu(item);
	}, lol.Premium? 500:800);
	return ui.cancel(e);
};

lol.Nav.endClick = function(e) {
	if (!ui.leftButton(e)) return;
	if (lol.Nav.holdClickTimer) {
		// Short click
		clearTimeout(lol.Nav.holdClickTimer);
		lol.Nav.holdClickTimer = null;
		lol.go($(this).attr('href'));
		return;
	}
	if (!lol.FID) {
		// No figure
		lol.go($(this).attr('href'));
		return;
	}
	return ui.cancel(e);
};

lol.Nav.click = function(e) {
	if (!ui.leftButton(e)) return;
	return ui.cancel(e);
};

lol.Nav.showSubmenu = function(item) {
	lol.Nav.subItem = item;
	$('#nav .menu').hide();
	var menu = $('#nav .menu[data-item="'+item+'"]');
	if (menu.length) {
		menu.slideDown(200);
		return;
	}
	mqykkbj('nav', {item:item}, function(data) {
		if (!data) return lol.Nav.hideSubmenu();
		data = lol.XHR.decode(data).split('$');
		var html = '<div class="menu" data-item="'+item+'">';
		for (var i in data) {
			if (!data[i]) continue;
			if (data[i] == '-') {
				// Separator
				html+= '<div class="sep"></div>';
				continue;
			}
			var result = data[i].split(':');
			var url = lol.str(result[0]);
			var name = lol.Search.decodeName(lol.str(result[1]));
			var bold = parseInt(result[2])?true:false;
			var className = '';
			if (bold) className+= ' bold';
			name = '<img class="txt" src="'+ICONPATH+'/nav.'+item+'.png"/> '+name;
			html+= '<a href="'+url+'" class="'+className+'">'+name+'</a>';
		}
		html+= '</div>';
		$('#nav').append(html).find('.menu[data-item="'+item+'"]').slideDown(200);
	});
};

lol.Nav.hideSubmenu = function() {
	$('#nav .menu').slideUp(200);
	lol.Nav.subItem = null;
};

lol.Nav.updateBadges = function() {
	$('#nav .badge').remove();
	for (var item in lol.Nav.badges) {
		var value = lol.Nav.badges[item];
		if (!value) continue;
		if (value > 99) value = '>99';
		$('#nav > a[href="/'+item+'/"]').append('<span class="round badge noMouse">'+value+'</span>');
	}	
};


// Initializing
$(document).ready(function() {
	$('#nav > a')
	.click(lol.Nav.click)
	.mousedown(lol.Nav.startClick)
	.mouseup(lol.Nav.endClick)
	.on('touchstart', lol.Nav.startClick)
	.on('touchend', lol.Nav.endClick);
	$('#nav > a[data-item="'+lol.Nav.item+'"]').attr('selected',true);
	lol.Nav.updateBadges();
});

function __(s,gender) {
	// Return localized string.
	// Optional gender passed as second argument.
	if (gender != 'undefined') {
		if (isNaN(gender)) gender = 1;
		var loc = _[s+'.'+gender]; if (loc) return loc;
		var loc = _[s+'.0']; if (loc) return loc;
	}
	var loc = _[s]; if (loc) return loc;
	if (loc=="") return loc;
	return s;
};

function __bold(s,gender) {
	// String with bold format
	s = __(s,gender);
	s = s.replace(/\[/gi, '<b>');
	s = s.replace(/\]/gi, '</b>');
	return s;
};

function __decl(c,s) {
	// Declensions
	return s;
};


lol.B64 = {
	table: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
};

lol.B64.decode = function(data,url) {
	// Decode base 64
	if (!data) return data;
    if (url) {
	    // Decoding URL
	    data = data.replace(/-/g,'+');
	    data = data.replace(/~/g,'/');
	    data = data.replace(/_/g,'=');
    }
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0;
	var result = '';
	do {
		h1 = lol.B64.table.indexOf(data.charAt(i++));
		h2 = lol.B64.table.indexOf(data.charAt(i++));
		h3 = lol.B64.table.indexOf(data.charAt(i++));
		h4 = lol.B64.table.indexOf(data.charAt(i++));
		bits = h1<<18 | h2<<12 | h3<<6 | h4;
		o1 = bits>>16 & 0xff;
		o2 = bits>>8 & 0xff;
		o3 = bits & 0xff;
		if (h3==64) result+= String.fromCharCode(o1);
		else if (h4==64) result+= String.fromCharCode(o1,o2);
		else result+= String.fromCharCode(o1,o2,o3);
	} while (i<data.length);
	return result;
};

lol.B64.encode = function(data,url) {
	// Encode base 64
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i=0;
	if (!data) return data;
    var result = '';
    while (i < data.length) {
        chr1 = data.charCodeAt(i++);
        chr2 = data.charCodeAt(i++);
        chr3 = data.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) enc3 = enc4 = 64;
        else if (isNaN(chr3)) enc4 = 64;
        result = result +
        lol.B64.table.charAt(enc1) + lol.B64.table.charAt(enc2) +
        lol.B64.table.charAt(enc3) + lol.B64.table.charAt(enc4);
    }
    if (url) {
	    // Encoding URL
	    result = result.replace(/\+/g,'-');
	    result = result.replace(/\//g,'~');
	    result = result.replace(/=/g,'_');
    }
    return result;
};


lol.XHR = {
	token: null,
};

lol.XHR.decode = function(data) {
	// Decrypting data
	data = data.replace(/[\n\r]/g, '');
	data = data.trim();
	data = lol.B64.decode(data);
	
	// Calculate the decrypt key.
	// The timestamp is taken at the begining of the data.
	// No need to compare it with current timestamp.
	var ts = parseInt(data.substring(0,4),10);
	var kstring = lol.XHR.token+ts;
	var klen = kstring.length;
	var k = '';
	for (var i=0; i<20; i++) k+= kstring.substring((ts+i*3)%klen,(ts+i*3)%klen+1);
	
	// Decrypt the string
	var result = '';
	data = data.substring(4);
	for (var i=0; i<data.length; i++) {
		var c = data.charCodeAt(i);
		var kc = k.charCodeAt((i*7)%k.length);
		result+= String.fromCharCode((c-kc)%256);
	}
	// decode URI
	return decodeURIComponent(result);
};

lol.XHR.encode = function(query,args) {
	var q = '';
	if (args) $.each(args, function(i,v) {
		q+= i+':'+encodeURIComponent(v)+',';
	});
	q+= 'query:'+query;
	
	// Build the key
	var ts = Math.floor(lol.Time.now/9)%9999;
	var kstring = lol.XHR.token+ts;
	var klen = kstring.length;
	var k = '';
	for (var i=0; i<20; i++) k+= kstring.substring((ts+i*7)%klen,(ts+i*7)%klen+1);
	
	// Encrypt the data
	var enc = lol.pad0(ts,4);
	for (var i=0; i<q.length; i++) {
		var c = q.charCodeAt(i);
		var kc = k.charCodeAt((i*7)%k.length);
		enc+= String.fromCharCode((c+kc)%256);
	}
	return lol.B64.encode(enc);
};

lol.XHR.alert = function(error) {
	var icon;
	switch (error) {
		case '!TIMEOUT': icon = 'timeout'; break;
		case '!EXPIRED': icon = 'timeout'; break;
		default: icon = 'warning'; break;
	}
	var html = '<p class="center"><img height="90" src="'+DIVPATH+'/'+icon+'.png"></p>';
	html+= '<p class="center">'+__(error)+'</p>';
	html+= '<p class="center"><button class="submit" onclick="lol.refresh()">'+__('Refresh page')+'</button></p>';
	lol.modal.open('<div class="uinfo round">'+html+'</div>');
	lol.modal.canClose = false; // this modal window cannot be closed
	lol.XHR.status = false; // prevent further requests
};

lol.XHR.reload = function() {
	var html = '<p class="center"><img height="12" src="'+ICONPATH+'/bar.gif"></p>';
	lol.modal.open('<div class="reload round">'+html+'</div>');
	lol.modal.canClose = false; // this modal window cannot be closed
	lol.XHR.status = false; // prevent further requests
	setTimeout(lol.refresh, lol.Premium?1200:2400);
};

lol.XHR.id = 0;
lol.XHR.pool = {};
lol.XHR.abort = function() {
	for (var i in lol.XHR.pool) lol.XHR.pool[i].abort();
	lol.XHR.pool = {};	
};

lol.XHR.status = true;
lol.XHR.focused = true;
mqykkbj = function(query,args,callback,repeat) {
	// Ajax call to the server
	if (!lol.XHR.status) {
		// XHR is disabled
		return;
	}
	var id = ++lol.XHR.id;
	if (repeat) {
		// Append the XHR id
		if (!args) args = {};
		args['xhrid'] = id;
	}
	lol.XHR.pool[id] = $.ajax({
		type: 'POST',
		url: '/ajax/query',
		data: {token:lol.XHR.token, ts:lol.Time.now, q:lol.XHR.encode(query,args)},
		dataType: 'text',
		complete: function(xhr,t) {
			delete lol.XHR.pool[id];
		},
		success: function(data) {
			if (!lol.XHR.status) return;
			if (data) switch (data.trim()) {
				case '!TOKEN':
				case '!EXPIRED':
				case '!TIMEOUT':
					// Reload the page
					// Ignored if window is not focused
					if (!lol.XHR.focused) return;
					lol.XHR.reload();
					return;
				case '!ERROR':
					// Query error
					// Ignored if window is not focused
					if (!lol.XHR.focused) return;
					lol.XHR.alert('!ERROR');
					return;
			}
			// invoke the callback function
			if (callback) callback(data);
		},
		error: function(xhr,t,m) {
			if (xhr.status === 0) return;
			if (xhr.readyState === 0) return;
			// Communication error
			if (!lol.XHR.status) return;
			if (!lol.XHR.focused) return;
			// Display a communication error
			lol.XHR.alert('!ERROR');
		}
	});
	return lol.XHR.pool[id];
};

lol.XHR.check = function(callback) {
	// Check the session
	mqykkbj('session',{ping:lol.Time.now},callback,true);
};

$(document).ready(function() {
	$(window).on("beforeunload", function() { 
		lol.XHR.status = false;
    	lol.XHR.abort();
	});
	
	$(window).focus(function() {
		if (lol.XHR.focused) return;
		lol.XHR.focused = true;
		lol.XHR.check();
	});
	$(window).blur(function() {
		if (!lol.XHR.focused) return;
		lol.XHR.focused = false;
	});
});

lol.Timers = [];

lol.Time = {
	now: 0,
	offset: 0,
	zoneOffset: 0,
	set: false,
};

lol.Time.init = function() {
	if (lol.Time.set) return;
	var date = new Date();
	var localTime = Math.floor(date.getTime()/1000);
	lol.Time.offset = lol.Time.now-localTime;
	lol.Time.zoneOffset = 60*date.getTimezoneOffset();
	lol.Time.set = true;
	lol.Time.refresh();
	setInterval(function() {
		lol.Time.refresh();
		for (var i in lol.Timers) lol.Timers[i]();
	}, 1000);
};

lol.Time.update = function() {
	var date = new Date();
	var localTime = Math.floor(date.getTime()/1000);
	lol.Time.now = localTime+lol.Time.offset;
};

lol.Time.refresh = function() {
	lol.Time.update();
	$('#date').text(lol.Time.html(lol.Time.now,0x0070));
	$('#time').text(lol.Time.html(lol.Time.now,0x0007));
};

lol.Time.refreshDelay = function() {
	$('.delay[data-refresh]').each(function(i) {
		var t = parseInt($(this).attr('data-refresh'));
		var d = t - lol.Time.now;
		this.html = $(this).text(lol.Time.delay(d));
		if (d <= 0) lol.refresh();
	});
};


lol.Time.html = function(t,opts) {
	// Return a date string
	// opts is a combination of the following:
	// 0x0001: show seconds
	// 0x0002: show minutes
	// 0x0004: show hours
	// 0x0010: show day
	// 0x0020: show month
	// 0x0040: show year
	// 0x0100: relative
	// 0x0200: short display
	// 0x1000: table
	if (!t) return '-';
	if (!opts) opts = 0x0077;
	var showTime = (opts & 0x000f)? true: false;
	var showDate = (opts & 0x00f0)? true: false;
	var tab = (opts & 0x1000)? true: false;
	var date = new Date();
	date.setTime((t+lol.Time.zoneOffset)*1000);
	var html = '';
	if (tab) html+= '<table class="date"><tr>';
	if (showDate) {
		// Display date
		var showDay = (opts & 0x0010)? true: false;
		var showMonth = (opts & 0x0020)? true: false;
		var showYear = (opts & 0x0040)? true: false;
		var relative = (opts & 0x0100)? true: false;
		var _short = (opts & 0x0200)? true: false;
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		var rday = null;
		if (relative) {
			// Relative date
			var now = new Date();
			now.setTime(now.getTime()+(lol.Time.offset+lol.Time.zoneOffset)*1000); // Convert to server date
			if (day==now.getDate() && month==now.getMonth() && year==now.getFullYear())
				rday = __('Today'+(_short?'.short':''));
			else {
				var yesterday = new Date();
				yesterday.setDate(now.getDate()-1); // Get yesterday date
				if (day==yesterday.getDate() && month==yesterday.getMonth() && year==yesterday.getFullYear())
					rday = __('Yesterday'+(_short?'.short':''));
				else {
					var tomorrow = new Date();
					tomorrow.setDate(now.getDate()+1); // Get tomorrow date
					if (day==tomorrow.getDate() && month==tomorrow.getMonth() && year==tomorrow.getFullYear())
						rday = __('Tomorrow'+(_short?'.short':''));
				}
			}
		}
		if (tab) html+= '<td class="d">';
		if (rday) html+= rday;
		else {
			// Show normal date
			if (relative && !_short) html+= __('On')+' ';
			switch (lol.Lang) {
				case 'en':
					// English format
					switch (day) {
						case 1: case 21: case 31: day = ''+day+'st'; break;
						case 2: case 22: day = ''+day+'nd'; break;
						case 3: case 23: day = ''+day+'rd'; break;
						default: day = ''+day+'th'; break;
					}
					if (showMonth) html+= __((_short?'m':'M')+(month+1));
					if (showDay) html+= ' '+day;
					if (showYear) html+= ', '+year;
					break;
				case 'zh':
				case 'ja':
					// Chinese format
					if (showYear) html+= ''+year+'年';
					if (showMonth) html+= ''+(month+1)+'月';
					if (showDay) html+= ''+day+'日';
					break;
				case 'de':
				case 'cz':
				case 'sk':
				case 'pl':
				case 'bg':
					// With a point after the day number
					if (showDay) html+= day+'.';
					if (showMonth) html+= ' '+__((_short?'m':'M')+(month+1));
					if (showYear) html+= ' '+year;
					break;
				default:
					// Default date formats
					if (showDay) html+= day;
					if (showMonth) html+= ' '+__((_short?'m':'M')+(month+1));
					if (showYear) html+= ' '+year;
					break;
			}
		}
		if (tab) html+= '</td>';
	}
	if (showDate && showTime) {
		// Add a space between date and time
		html+= ' ';
	}
	if (showTime) {
		// Display time
		var showSeconds = (opts & 0x0001)? true: false;
		if (tab) html+= '<td class="t">';
		if (relative && !_short) html+= __('at')+' ';
		h = date.getHours();
		m = date.getMinutes();
		if (h < 10) h = '0'+h;
		if (m < 10) m = '0'+m;
		html+= h+':'+m;
		if (showSeconds) {
			s = date.getSeconds();
			if (s < 10) s = '0'+s;
			html+= ':'+s;
		}
		if (tab) html+= '</td>';
	}
	if (tab) html+= '</tr></table>';
	return html;	
};


lol.Time.delay = function(d) {
	// Convert a delay to a string
	if (d <= 0) return '-';
	var days = Math.floor(d/86400);
	var h = Math.floor((d%86400)/3600);
	var m = Math.floor((d%3600)/60);
	var s = d%60;
	var string = '';
	if (days) string+= ''+days+__('d')+' ';
	if (h) string+= ''+h+__('h')+' ';
	if (m) string+= ''+m+'’ ';
	if (s) string+= ''+s+'” ';
	return string.trim();
};

lol.Time.progress = function(started,ended,rounded) {
	if (!ended) return '100%';
	if (started>=ended) return '100%';
	var p = 100*Math.max(0,Math.min(1,(lol.Time.now-started)/(ended-started)));
	if (rounded) p = Math.round(p);
	return ''+p+'%';
};


// Initializing
$(document).ready(function() {
	lol.Time.init();
	$('#time').attr('title',__('Server time'));

	// Date and time
	$('.date').each(function(i) {
		// The attribute data-opts contains the date options
		$(this).text(lol.Time.html(parseInt($(this).text()),parseInt($(this).attr('data-opts'),16)));
	});
	
	$('.delay').each(function(i) {
		$(this).text(lol.Time.delay($(this).text()));
	});
	
	lol.Timers.push(lol.Time.refreshDelay);
});

lol.modal = {};

lol.modal.savedEventHandlers = null;

lol.modal.detect = function() {
	// Return true if a modal panel is open
	return $('.modal').length > 0;
};

lol.modal.update = function() {
	$('.modal .slider').each(function(i) {
		ui.Slider.setUp(this);
	});
	$('.modal > *').click(function(e) {
		return ui.cancel(e);
	});
	$('.modal a').click(function(e) {
		lol.go($(e.target).closest('a').attr('href'));
		return ui.cancel(e);
	});
};

lol.modal.onClose = null;
lol.modal.open = function(div, onClose) {
	// Close any existing modal panel or menu
	$('#user .menu').hide();
	$('#nav .menu').hide();
	lol.Nav.subItem = null;
	var modal = $('.modal');
	if (modal.length) {
		// Reuse the same modal view
		if (lol.modal.onClose) {
			lol.modal.onClose();
		}
		modal.html(div);
		lol.modal.update();
		lol.modal.onClose = onClose;
		return div;
	}
	// Open a new modal view
	var modal = $('<div class="modal"></div>');
	modal.html(div);
	$(document.body).append(modal);
	lol.modal.update();
	lol.modal.onClose = onClose;
	modal.fadeIn(250).click(function(e) {
		lol.modal.close();
		return ui.cancel(e);
	});
	// Save document event handlers
	var events = $._data(document,'events');
	if (events) {
		lol.modal.savedEventHandlers = {};
		for (var name in events) {
			lol.modal.savedEventHandlers[name] = [];
			for (var i in events[name]) {
				lol.modal.savedEventHandlers[name].push(events[name][i].handler);
			}
		}
	}
	$(document).off().keyup(function(e) {
		switch (e.keyCode) {
			case 13: $('.modal #enter').click(); break;
			case 27: lol.modal.close(); return ui.cancel(e);
		}
	});
	return div;
};

lol.modal.canClose = true;
lol.modal.close = function() {
	// Close the modal view
	if (!lol.modal.canClose) return;
	var modal = $('.modal');
	modal.fadeOut(250, function(){
		$(this).remove();
	});
	if (lol.modal.onClose) {
		lol.modal.onClose();
		lol.modal.onClose = null;
	}
	// Restore document event handlers
	$(document).off();
	if (lol.modal.savedEventHandlers) {
		for (var name in lol.modal.savedEventHandlers) {
			for (var i in lol.modal.savedEventHandlers[name]) {
				$(document).on(name, lol.modal.savedEventHandlers[name][i]);
			}
		}
		lol.modal.savedEventHandlers = null
	}
};

lol.inspector = {};

lol.inspector.open = function(html) {
	// Open the inspector
	html = html? '<div class="header">'+html+'</div>':'';
	html+= '<div class="result"><p class="center"><img src="'+ICONPATH+'/bar.gif"></p></div>';
	lol.modal.open('<div class="uinfo round inspector">'+html+'</div>');
};

lol.inspector.update = function(html) {
	// Update the inspector
	var div = $('.modal > div > div.result');
	div.html(html);
	lol.modal.update();
};

lol.Search = {};

lol.Search.setSelected = function(id,isSelected) {
	var button = $('.menu > a button[data-unit-id="'+id+'"]');
	button.attr('data-selected', isSelected?1:0);
	button.find('img').attr('src', ICONPATH+'/sel'+(isSelected?1:0)+'.png');
};

lol.Search.toggleSelect = function(button) {
	// Select or deselect a unit
	var id = parseInt($(button).attr('data-unit-id'));
	var isSelected = parseInt($(button).attr('data-selected'));
	isSelected = !isSelected;
	lol.Search.setSelected(id, isSelected);
	lol.Unit.setSelected(id,isSelected);
	lol.Unit.selectionDidChange();
};

lol.Search.decodeName = function(name) {
	name = lol.BB.decodeTags(name);
	name = name.replace(/\{([^\}]+)\}/gi, '<small class="gray">$1</small>');
	name = name.replace(/(.*)⇥/gi, '<span class="floatRight">$1</span>');
	name = name.replace(/⚙︎/gi, ' <img class="txt blur" src="'+ICONPATH+'/delay.gif">');
	name = name.replace(/☑︎([0-9]+)/gi, ' <button class="blur" data-unit-id="$1" data-selected="1" onclick="lol.Search.toggleSelect(this);return ui.cancel(event);"><img class="txt" src="'+ICONPATH+'/sel1.png"></button>');
	name = name.replace(/☒([0-9]+)/gi, ' <button class="blur" data-unit-id="$1" data-selected="0" onclick="lol.Search.toggleSelect(this);return ui.cancel(event);"><img class="txt" src="'+ICONPATH+'/sel0.png"></button>');
	name = name.replace(/◻︎([0-9])/gi, ' <img class="txt blur" src="'+ICONPATH+'/mod$1.png">');
	name = name.replace(/✵([0-9]{5}[EW][0-9]{5}[NS])/gi, ' <button class="blur" title="'+__('Locate on the Map')+'" onclick="lol.go(\'/map/$1\');return ui.cancel(event);"><img class="txt" src="'+ICONPATH+'/nav.map.png"></button>');
	name = name.replace(/✵(-?[0-9]+):(-?[0-9]+)/gi, ' <button class="blur" title="'+__('Locate on the Map')+'" onclick="lol.go(\'/map?x=$1&y=$2\');return ui.cancel(event);"><img class="txt" src="'+ICONPATH+'/nav.map.png"></button>');
	name = name.replace(/✉︎([0-9]+)/gi, ' <button class="blur" title="'+__('Send a Message')+'" onclick="lol.go(\'/msg/new?to=$1\');return ui.cancel(event);"><img class="txt" src="'+ICONPATH+'/message.png"></button>');
	name = name.replace(/✝/gi, '<img class="txt" src="'+ICONPATH+'/dead.png">');
	name = name.replace(/✍/gi, '<img class="txt" src="'+ICONPATH+'/write.png">');
	name = name.replace(/★/gi, '<img class="txt" src="'+ICONPATH+'/captain.png">');
	return name;
};

lol.Search.showResult = function(data) {
	var html = '';
	if (data) {
		data = data.split('$');
		html+= '<table>';
		var maxRelevance = 1.0;
		for (var i in data) {
			if (!data[i]) continue;
			var result = data[i].split(':');
			var relevance = parseFloat(result[3]);
			if (relevance > maxRelevance) maxRelevance = relevance;
		}
		for (var i in data) {
			if (!data[i]) continue;
			var result = data[i].split(':');
			var url = lol.str(result[0]);
			var nav = result[1];
			var name = lol.Search.decodeName(lol.str(result[2]));
			var relevance = parseFloat(result[3]);
			var className = '';
			switch (nav) {
				case 'modr': className='red'; break;
			}
			html+= '<tr'+(className?' class="'+className+'"':'')+' onclick="lol.go(\''+url+'\')">';
			html+= '<td class="icon"><img class="txt" src="'+ICONPATH+'/nav.'+nav+'.png"/></td>';
			html+= '<td class="name">'+name+'</td>';
			html+= '<td class="relevance"><img class="txt" src="'+ICONPATH+'/relev.png"';
			html+= ' width="'+(50*relevance/maxRelevance)+'"/></td>';
			html+= '</tr>';
		}
		html+= '</table>';
	}
	$('#search > .result').html(html);
};

lol.Search.filter = null;
lol.Search.search = function() {
	// Call an ajax request to get search result
	var string = $('#search > input').val().trim();
	//lol.XHR.abort();
	mqykkbj('search',{string:string,filter:lol.Search.filter}, function(data) {
		lol.Search.showResult(lol.XHR.decode(data));
	}, true);
};

lol.Search.timeout = '';
lol.Search.searchWithTimeout = function() {
	clearTimeout(lol.Search.timeout);
    lol.Search.timeout = setTimeout(lol.Search.search, 400);
};

lol.Search.open = function(filter) {
	lol.Search.filter = filter;
	var html = '<div id="search">';
	html+= '<input type="text" autocomplete="off" placeholder="'+__('Search')+'">';
	html+= '<div class="result"></div>';
	html+= '</div>';
	lol.modal.open(html);
	lol.Search.search();
	$('#search > input').focus().keyup(lol.Search.searchWithTimeout);
};

// Initializing
$(document).ready(function() {
	$('#searchbtn').click(function() {
		lol.Search.open('');
	});
});

lol.Ad = function() {
};

lol.Ad.opt = {
	main: true,
	notif: true,
};

lol.Ad.isInitialized = false;
lol.Ad.init = function() {
	if (lol.Ad.isInitialized) return;
	// Create the script
	var el = document.createElement('script');
	el.type = 'text/javascript';
	el.async = true;
	el.src = 'https://cdn.ad4game.com/async-ajs.min.js';
	//el.src = 'https://ad4game-a.akamaihd.net/async-ajs.min.js';
	el.setAttribute('data-a4g-charset', 'UTF-8');
	document.body.appendChild(el);
	lol.Ad.isInitialized = true;
};

lol.Ad.bannerHTML = function() {
	if (lol.Ad.opt.main == false) {
		// No ads
		return '';
	}
	var html = '<div class="ad"><div>';
	if (lol.Prod) {
		lol.Ad.init();
		html+= '<ins data-a4g-zone=64084 data-a4g-block data-a4g-blockcampaign data-a4g-disable-flash></ins>';
	}
	html+= '</div></div>';
	return html;
};

lol.Ad.notifHTML = function() {
	if (lol.Ad.opt.notif == false) {
		// No ads
		return '';
	}
	var html = '<div class="ad"><div>';
	if (lol.Prod) {
		lol.Ad.init();
		html+= '<ins data-a4g-zone=64078 data-a4g-block data-a4g-blockcampaign data-a4g-disable-flash></ins>';
	}
	html+= '</div></div>';
	return html;
};


lol.BB = {};

lol.BB.mask = {
	// 0x0001: automatic global replacements on text format
	// 0x0002: character format
	// 0x0004: text color
	// 0x0010: raw URL
	// 0x0020: emoji
	// 0x0040: tags
	// 0x0100: images and links
	// 0x0200: quotes
	// 0x8000: reserved
	chat: 0x0030, // chat message
	action: 0x0020, // chat action
	notice: 0x8116, // action notice
	area: 0x8116, // area information
	log: 0x8116, // action log
	histo: 0x8116, // history log
	entry: 0x8116, // financial entry
	post: 0x0001, // post preview
	message: 0x0303, // private message
	reply: 0x0373, // reply or comment
	report: 0x0373, // report
	// Tickets
	doc: 0x0103, // a free document
	announce: 0x0103, // an announcement
	feather: 0x0003, // chronicles
	private: 0x0103, // private ticket
	// Forum
	question: 0x0133, // question
	bug: 0x0133, // bug report
	fixed: 0x0133, // fixed bug
	suggest: 0x0133, // suggestion
	// Help
	faq: 0x0133, // faq
	video: 0x0133, // video
	// Others
	all: 0xFFFF,
	
};

lol.BB.buttonHTML = function(before, after, title, src) {
	// Return HTML to display one single button
	return ' <button data-before="'+before+'" data-after="'+after+'"'
		+ ' onclick="lol.BB.insert(this); return ui.cancel(event);" title="'+title+'">'
		+ '<img class="txt" src="'+src+'"/></button>';
};

lol.BB.buttonsHTML = function(type) {
	// Return HTML to display buttons
	if (!type) type = 'all';
	var mask = lol.BB.mask[type];
	var html = '';
	if (mask & 0x0002) {
		// Text format
		html+= ' &nbsp;';
		html+= lol.BB.buttonHTML('[B]', '[/B]', __('Bold'), ICONPATH+'/bold.png');
		html+= lol.BB.buttonHTML('[I]', '[/I]', __('Italic'), ICONPATH+'/italic.png');
		html+= lol.BB.buttonHTML('[U]', '[/U]', __('Underline'), ICONPATH+'/underline.png');
		html+= lol.BB.buttonHTML('[S]', '[/S]', __('Strikethrough'), ICONPATH+'/strikethrough.png');
	}
	if (mask & 0x0001) {
		// Various elements
		html+= ' &nbsp;';
		html+= lol.BB.buttonHTML('[*]', '', __('Bullet'), ICONPATH+'/bullet.png');
		html+= lol.BB.buttonHTML('¶', '', __('Line break without spacing'), ICONPATH+'/lbreak.png');
	}
	if (mask & 0x0300) {
		// URL and quotes
		html+= ' &nbsp;';
		if (mask& 0x0100) html+= lol.BB.buttonHTML('[IMG]http://', '[/IMG]', __('Image'), ICONPATH+'/pic.png');
		if (mask& 0x0100) html+= lol.BB.buttonHTML('[URL]http://', '[/URL]', __('URL'), ICONPATH+'/link.png');
		if (mask& 0x0200) html+= lol.BB.buttonHTML('[QUOTE]', '[/QUOTE]', __('Quote'), ICONPATH+'/quote.png');
	}
	if (mask & 0x0020) {
		// Emojis
		html+= ' &nbsp;';
		html+= lol.BB.buttonHTML('', ':D', ':grinning:', '/img/emoji/grinning.png');
		html+= lol.BB.buttonHTML('', ':)', ':smiley:', '/img/emoji/smiley.png');
		html+= lol.BB.buttonHTML('', ':p', ':tongueout:', '/img/emoji/tongueout.png');
		html+= lol.BB.buttonHTML('', ';)', ':wink:', '/img/emoji/wink.png');
		html+= lol.BB.buttonHTML('', ':o', ':openmouth:', '/img/emoji/surprised.png');
		html+= lol.BB.buttonHTML('', ':(', ':frowning:', '/img/emoji/frowning.png');
		html+= lol.BB.buttonHTML('', ':/', ':confused:', '/img/emoji/confused.png');
		html+= lol.BB.buttonHTML('', ':$', ':flushed:', '/img/emoji/flushed.png');
		html+= lol.BB.buttonHTML('', ':\'(', ':cry:', '/img/emoji/crying.png');
		html+= lol.BB.buttonHTML('', '>:(', ':angry:', '/img/emoji/angry.png');
	}
	return html;
};

lol.BB.repair = function(text, tag) {
	// Repair BB code tags
	//return text;
	if (!text) return '';
	var start = new RegExp('\\['+tag+'[=\\]]', 'i');
	var end = new RegExp('\\[\\/'+tag+'\\]', 'i');
	var tags = [];
	var i = 0;
	while (true) {
		var r = text.substr(i).search(start);
		if (r == -1) break;
		tags[i+r] = 1;
		i+= r+1;
	}
	var i = 0;
	while (true) {
		var r = text.substr(i).search(end);
		if (r == -1) break;
		tags[i+r] = -1;
		i+= r+1;
	}
	var indexes = [];
	for (var i in tags) indexes.push(i);
	indexes.sort(function(a,b){return a-b;});
	var opened = 0;
	for (var j in indexes) {
		var i = indexes[j];
		opened+= tags[i];
		while (opened < 0) {
			// Prepend opening tag
			text = '['+tag+']'+text;
			opened++;
		}
	}
	while (opened-- > 0) {
		// Append closing tag just before the […] URL
		text = text.replace(/(\[URL=[^\]]+\]\[…\]\[\/URL\])?$/, '[/'+tag+']$1');
		opened--;
	}
	return text;
};

lol.BB.insert = function(button) {
	var target = $(button).parent().nextAll().find('.bbinput').addBack('.bbinput').get(0);
	if (!target) return; // target not found
	var before = button.getAttribute('data-before');
	var after = button.getAttribute('data-after');
	var val = target.value;
	var start = target.selectionStart;
	var end = target.selectionEnd;
	target.value = val.slice(0,start)+before+val.slice(start,end)+after+val.slice(end);
	end+= before.length+after.length;
	target.selectionStart = end;
	target.selectionEnd = end;
	target.focus();
	lol.BB.preview(target);
};

lol.BB.preview = function(textarea) {
	// Display a preview of the BB text
	var value = $(textarea).val();
	var div = $(textarea).parent().next('.bbpreview');
	if (div.length) {
		// Show preview
		var type = div.attr('data-type');
		var html = lol.BB.decode(value,type);
		div.html(html? html:'<p class="ltgray">'+__('Preview of your text')+'</p>');
	}
	var div = $(textarea).parent().nextAll().find('.bbdesc');
	if (div.length) {
		// Show description
		var desc = 'desc.'+div.attr('data-lang')+' = ';
		desc+= value.replace(/\n\n*/gi,'§');
		div.val(desc);
	}
};

lol.BB.translate = function(button) {
	button.disabled = true;
	var bb = $(button).parent().parent();
	var text = bb[0].original;
	mqykkbj('translate', {text:text}, function(data) {
		if (!data) return;
		var content = lol.XHR.decode(data);	
		var type = bb.attr('data-type');
		var html = lol.BB.decode(content,type);
		html+= '<p class="small gray">'+__('Translated by…')+'</p>';
		bb.html(html);	
	});
};

$(document).ready(function() {
	// BB text
	$('.bb, .bbinc').each(function(i) {
		var type = $(this).attr('data-type');
		var lang = $(this).attr('data-lang');
		var text = $(this).text();
		var html = lol.BB.decode(text,type);
		if (lang && lang != lol.Lang) {
			html+= '<p><button onclick="lol.BB.translate(this)">'+__('Translate')+'</button></p>';
			this.original = text;
		}
		$(this).html(html).removeClass('bb');
	});

	// BB buttons
	$('.bbbtns').each(function() {
		var type = $(this).attr('data-type');
		$(this).html(lol.BB.buttonsHTML(type)).addClass('ellipsis');
	});

	// BB text areas
	$('.bbinput')
		.each(function() { lol.BB.preview(this); })
		.keyup(function() { lol.BB.preview(this); });
		
});

lol.BB.clean = function(text) {
	if (!text) return '';
	text = text.replace(/({[^}]+})/g, 'X'); // brackets
	text = text.replace(/([\s])+/g, '$1'); // remove multiple spaces
	text = text.replace(/\\\[/g, '&#91;'); // escaped brackets
	text = text.replace(/\\\[/g, '&#91;'); // escaped brackets
	text = text.replace(/\\\]/g, '&#93;'); // escaped brackets
	text = text.replace(/\r/g, '\n'); // change \r to \n
	text = text.replace(/[ \t\f\v]+/g, ' '); // remove multiple spaces
	text = text.replace(/[ \t\f\v]\n[ \t\f\v]/g, '\n'); // remove spaces before or after new line
	text = text.replace(/¶/g, '¶\n'); // remove orphan new line symbols
	text = text.replace(/\n¶/g, '\n'); // remove orphan new line symbols
	text = text.replace(/\n+/g, '\n'); // remove duplicate new lines
	text = text.replace(/^[\s]+/g, ''); // remove starting spaces
	text = text.replace(/[\s]+$/g, ''); // remove ending spaces
	text = text.replace(/"\s*([^"]*)\s*"/g, __('“')+'$1'+__('”')); // smart quotes
	return text;
};

lol.BB.decodeRawURL = function(text) {
	text = text.replace(/<p>(https?:\/\/[a-z0-9]+\.landsoflords\.[a-z]+)\/?([^"<\s\]\[\)]+)/gi, '<p><a href="/$2">$1/$2</a>');
	text = text.replace(/<p>(https?:\/\/[^"<\s\]\[\)]+)/gi, '<p><a href="$1" target="ext">$1</a>');
	return text;
};

lol.BB.decodeTags = function(text) {
	text = text.replace(/\[(noip|vpn|host|multi|loc|client)\]/gi, '<img class="txt" src="'+ICONPATH+'/$1.png">');
	text = text.replace(/\[(mod)\]/gi, '<span class="tag red">$1</span>');
	text = text.replace(/\[([^\]]*)\]/gi, '<span class="tag">$1</span>');
	return text;
};

lol.BB.decode = function(text, type) {
	text = text.replace(/\{SKIN\}/gi, SKIN);
	if (!type) type = 'all';
	var mask = lol.BB.mask[type];
	// Clean the text
	text = lol.BB.clean(text);
	text = lol.htmlspecialchars(text);
	// Repair BB code tags
	text = lol.BB.repair(text, 'B');
	text = lol.BB.repair(text, 'I');
	text = lol.BB.repair(text, 'U');
	text = lol.BB.repair(text, 'S');
	text = lol.BB.repair(text, 'COLOR');
	text = lol.BB.repair(text, 'SMALL');
	text = lol.BB.repair(text, 'SRC');
	text = lol.BB.repair(text, 'BUTTON');
	text = lol.BB.repair(text, 'FLOAT');
	text = lol.BB.repair(text, 'QUOTE');
	text = lol.BB.repair(text, 'NOTE');
	text = lol.BB.repair(text, 'TABLE');
	text = lol.BB.repair(text, 'TD');
	text = lol.BB.repair(text, 'HAPP');
	// Cut into paragraphs
	text = '<p>'+text+'</p>';
	text = text.replace(/¶\n+/g, '<br>');
	text = text.replace(/\n/g, '</p><p>');
	text = text.replace(/\[…\]/gi, '&#91;…&#93;');
	// Replacements
	var initText = text;
	if (mask & 0x0001) {
		// BB code for global replacements
		text = text.replace(/<p>\[\*\]\s*/g, '<p class="bullet">');
		text = text.replace(/<p>(§+|\*\*\*|---+)/g, '<p class="center">✽ ✽ ✽</p><p>');
		if (text.length > 700 && text.indexOf('</p>') > 350) {
			// Show initial image on the first paragraph if large enough
			text = text.replace(/^<p>([A-Z])/, '<p><img class="initial" src="'+SKINPATH+'/cap/$1.png"/>');
		}
	}
	if (mask & 0x0002) {
		// BB code for character format
		if (text.search(/\[(B|I|U|S|SMALL)\]/i) != -1) {
			text = text.replace(/\[B\]/gi, '<b>'); text = text.replace(/\[\/B\]/gi, '</b>');
			text = text.replace(/\[I\]/gi, '<i>'); text = text.replace(/\[\/I\]/gi, '</i>');
			text = text.replace(/\[U\]/gi, '<u>'); text = text.replace(/\[\/U\]/gi, '</u>');
			text = text.replace(/\[S\]/gi, '<s>'); text = text.replace(/\[\/S\]/gi, '</s>');
			text = text.replace(/\[SMALL\]/gi, '<small>'); text = text.replace(/\[\/SMALL\]/gi, '</small>');
		}
	}
	if (mask & 0x0004) {
		// BB code for colors
		text = text.replace(/\[COLOR=(gray|red|green|gold|hap[0-5])\]/gi, '<span class="$1">');
		text = text.replace(/\[\/COLOR\]/gi, '</span>');
	}
	if (mask & 0x8000) {
		// BB code for sources and signatures
		if (text.search(/\[SRC\]/i) != -1) {
			text = text.replace(/<p>\[SRC\](https?:\/\/)([^\[\)]+)\[\/SRC\]<\/p>/gi, '<p class="src"><a href="$1$2" target="ext">$2</a></p>');
			text = text.replace(/\[SRC\](https?:\/\/)([^\[\)]+)\[\/SRC\]/gi, '<span class="src"><a href="$1$2" target="ext">$2</a></span>');
			text = text.replace(/<p>\[SRC\]([^\[\)]+)\[\/SRC\]<\/p>/gi, '<p class="src">$1</p>');
			text = text.replace(/\[SRC\]([^\[\)]+)\[\/SRC\]/gi, '<span class="src">$1</span>');
		}
	}
	if (mask & 0x0100) {
		// BB code for inline coordinates
		text = text.replace(/([0-9]{5}[EW]):([0-9]{5}[NS])/g, '[URL=/map/$1$2]$1:$2[/URL]');
		// BB code for URL autodetect
		if (text.search('http') != -1) {
			text = text.replace(/http:\/\/(https?:\/\/)/g, '$1');
			text = text.replace(/(https?:\/\/[a-z0-9\.]+\/?[^"<\s\]\[\)]+)\.(jpg|png)([\s\]\[<])/g, '[IMG]$1.$2[/IMG]$3');
			text = text.replace(/(https?:\/\/[a-z0-9\.]+\/?[^"<\s\]\[\)]+)([\.,])([\s\]\[<])/g, '[URL]$1[/URL]$2$3');
			text = text.replace(/(https?:\/\/[a-z0-9\.]+\/?[^"<\s\]\[\)]+)/g, '[URL]$1[/URL]');
			text = text.replace(/\[URL\]\[URL\]/gi, '[URL]'); text = text.replace(/\[\/URL\]\[\/URL\]/gi, '[/URL]');
			text = text.replace(/\[IMG\]\[IMG\]/gi, '[IMG]'); text = text.replace(/\[\/IMG\]\[\/IMG\]/gi, '[/IMG]');
			text = text.replace(/\[IMG\]\[URL\]/gi, '[IMG]'); text = text.replace(/\[\/URL\]\[\/IMG\]/gi, '[/IMG]');
			text = text.replace(/\[URL\]\[IMG\]/gi, '[URL]'); text = text.replace(/\[\/IMG\]\[\/URL\]/gi, '[/URL]');
			text = text.replace(/\[URL=\[URL\]([^\[\)]+)\[\/URL\]\]/gi, '[URL=$1]');
			text = text.replace(/\[URL=\[IMG\]([^\[\)]+)\[\/IMG\]\]/gi, '[URL=$1]');
		}
	}
	if (mask & 0x0100) {
		// BB code for URL
		if (text.search(/\[URL/i) != -1) {
			// URL starting on a single line will be converted to LINK object
			text = text.replace(/<p>\[URL\]([^\[\)]+)\[\/URL\]<\/p>/gi, '[LINK]$1[/LINK]');
			// BB code for inline local URL 
			text = text.replace(/\[URL\]https?:\/\/[a-z0-9]+\.landsoflords\.[a-z]+\/?([^"<\[]*)\[\/URL\]/gi, '[URL]/$1[/URL]');
			text = text.replace(/\[URL\]\/([^"<\[]*)\[\/URL\]/gi, '<a href="/$1">https://'+lol.hostname+'/$1</a>');
			text = text.replace(/\[URL=(https?:\/\/[a-z0-9]+\.landsoflords\.[a-z]+)\/?([^"<\]]*)\]/gi, '[URL=/$2]');
			text = text.replace(/\[URL=\/([^\]]+)\]/gi, '<a href="/$1">');
			text = text.replace(/\[URL=!\]/gi, '<a href="!">');
			text = text.replace(/\[URL=!\]/gi, '<a href="!">');
			// BB code for inline external URL
			text = text.replace(/\[URL\](https?:\/\/[^\[\)]+)\[\/URL\]/gi, '<a href="$1" target="ext">$1</a>');
			text = text.replace(/\[URL=(https?:\/\/[^\]]+)\]/gi, '<a href="$1" target="ext">');
			// BB code for URL end tag
			text = text.replace(/\[\/URL\]/gi, '</a>');
			// BB code for help URL
			text = text.replace(/\[HELP=\/([^\]]+)\]/gi, '<a class="blur" href="/$1"><img class="txt" src="'+ICONPATH+'/help.png"></a>');
			if (text.search(/\[LINK\]/i) != -1) {
				// BB code for local links
				text = text.replace(/\[LINK\]https?:\/\/[a-z0-9]+\.landsoflords\.[a-z]+\/?([^"<\[]*)\[\/LINK\]/gi, '[LINK]/$1[/LINK]');
				text = text.replace(/\[LINK\]\/help\/([a-z]+)\/([a-z]+):([a-z]+)\[\/LINK\]/gi, '[LINK]/help/$1?type=$3[/LINK]');
				text = text.replace(/\[LINK\]\/help\/([a-z]+)\?type=([a-z]+)\[\/LINK\]/gi, '[LINK=/img/link/local/help/$1/$2.jpg]/help/$1?type=$2[/LINK]');
				text = text.replace(/\[LINK\]\/arm\/([a-z]+)\/([A-Za-z0-9]+)([^"<\[]*)\[\/LINK\]/gi, '[LINK=/img/link/local/arm/$1/$2.jpg]/arm/$1/$2$3[/LINK]');
				text = text.replace(/\[LINK\]\/([a-z]+)([^"<\[]*)\[\/LINK\]/gi, '[LINK=/img/link/local/$1.jpg]/$1$2[/LINK]');
				text = text.replace(/\[LINK\]\/([^"<\[]*)\[\/LINK\]/gi, '[LINK=/img/link/local.jpg]/$1[/LINK]');
				text = text.replace(/\[LINK=\/([^"<\[]*)\]\/([^"<\[]*)\[\/LINK\]/gi, '<a class="round link" href="/$2"><img src="/$1"><div><h3>'
				+__('Click here')+'</h3> <p class="url">https://'+lol.hostname+'/$2</p></div></a>');
				// BB code for external links
				text = text.replace(/\[LINK\](https?:\/\/[^"<\[]*)\[\/LINK\]/gi, '[LINK=/img/link/web.jpg]$1[/LINK]');
				text = text.replace(/\[LINK=\/([^"<\[]*)\](https?:\/\/[^"<\[]*)\[\/LINK\]/gi,
				'<a class="round link" href="$2" target="ext"><img src="/$1"><div><h3>'
				+__('Click here')+'</h3> <p class="url">$2</p></div></a>');
			}
		}
	}
	if (mask & 0x8000) {
		// Inline icons and images
		text = text.replace(/\[IMG([0-9]+)=([^\]]+)\]/gi, '<img height="$1" src="/img/$2"/>');
		text = text.replace(/\[IMG([0-9]+)X([0-9]+)=([^\]]+)\]/gi, '<img height="$1" width="$2" src="/img/$3"/>');
		text = text.replace(/\[IMGR([0-9]+)X([0-9]+)=([^\]]+)\]/gi, '<img class="round box" height="$1" width="$2" src="/img/$3"/>');
		text = text.replace(/\[IMGC([0-9]+)X([0-9]+)=([^\]]+)\]/gi, '<img class="round combat" height="$1" width="$2" src="/img/$3"/>');
		text = text.replace(/\[LANG=([^\]]+)\]/gi, '<img height="$1" src="/img/lang/$2"/>');
		// Images defined in the skins
		text = text.replace(/\[ICON=([^\]]+)\]/gi, '<img class="txt" src="'+ICONPATH+'/$1"/>');
		text = text.replace(/\[BTN=([^\]]+)\]/gi, '<img class="txt" src="'+BTNPATH+'/$1"/>');
		text = text.replace(/\[DIV([0-9]+)X([0-9]+)=([^\]]+)\]/gi, '<img height="$1" width="$2" src="'+DIVPATH+'/$3"/>');
	}
	if (mask & 0x0100) {
		// External images
		if (text.search(/\[IMG\]/i) != -1) {
			// Base 64 image encoding
			var m; var r = /\[IMG\](https?:\/\/)([^"<\s\]\[\)]+)\[\/IMG\]/gi;
			while ((m=r.exec(text)) != null) {
				var url = m[1]+m[2];
				var src = 'pic/'+lol.B64.encode(url,true)+'.jpg';
				if (src.length > 255) src = 'pic/default.jpg';
				// Replace with external link
				text = text.replace(m[0], '</p><a class="round imglink" href="'+url+'" title="'+url+'" target="ext"><img src="/img/'+src+'"></a><p>');
			}
		}
	}
	if (mask & 0x8000) {
		// Anchors
		text = text.replace(/\[#([a-z]+)\]/g, '<a name="$1"></a>');
		// Buttons
		text = text.replace(/\[BUTTON]/gi, '<button class="submit" style="width:110px">');
		text = text.replace(/\[BUTTON=green]/gi, '<button class="submit green" style="width:110px">');
		text = text.replace(/\[BUTTON=red]/gi, '<button class="submit red" style="width:110px">');
		text = text.replace(/\[\/BUTTON]/gi, '</button>');
		// BB code for mail (not documented)
		text = text.replace(/\[MAILTO\]([^\[\)]+)\[\/MAILTO\]/gi, '<a href="mailto:$1">$1</a>');
		// BB code for map coords
		text = text.replace(/\[MAP=([-0-9]+):([-0-9]+)\]/gi, '<a class="blur" href="/map?x=$1&y=$2"><img class="txt" src="'+ICONPATH+'/nav.map.png"></a>');
	}
	if (mask & 0x0200) {
		// BB code for quotes
		text = text.replace(/\[QUOTE\]/gi, '</p><div class="quote"><p>');
		text = text.replace(/\[QUOTE=([^\]]+)\]/gi, '</p><div class="quote"><p><span class="gray">$1 '+__('wrote:')+'</span></p><p>');
		text = text.replace(/\[\/QUOTE\]/gi, '</p></div><p>');
	}
	if (mask & 0x8000) {
		// BB code for floating
		text = text.replace(/\[FLOAT=left\]/gi, '</p><div class="floatLeft"><p>');
		text = text.replace(/\[FLOAT=right\]/gi, '</p><div class="floatRight"><p>');
		text = text.replace(/\[\/FLOAT\]/gi, '</p></div><p>');
		// BB code for note
		text = text.replace(/\[NOTE\]/gi, '</p><div class="postit small"><p>');
		text = text.replace(/\[\/NOTE\]/gi, '</p></div><p>');
		// Tables
		text = text.replace(/\[TABLE\]/gi, '</p><table class="small table bspacing"><p>');
		text = text.replace(/\[TABLE=alt\]/gi, '</p><table class="small table alt"><p>');
		text = text.replace(/\[\/TABLE\]/gi, '</p></table><p>');
		text = text.replace(/<p>\[TD\]/gi, '<tr>[TD]');
		text = text.replace(/\[\/TD\]<\/p>/gi, '[/TD]</tr>');
		text = text.replace(/\[TD\]/gi, '<td>');
		text = text.replace(/\[\/TD\]/gi, '</td>');
		// Titles
		text = text.replace(/\[H([0-9])\]/gi, '</p><h$1>');
		text = text.replace(/\[\/H([0-9])\]/gi, '</h$1><p>');
		// Paragraph alignment
		text = text.replace(/<(p|td|h[0-9]+)>\[CENTER\]/gi, '<$1 class="center">');
		text = text.replace(/<(p|td|h[0-9]+)>\[RIGHT\]/gi, '<$1 class="right">');
		// State and happiness
		text = text.replace(/\[LIFESPAN=([0-9]+)\]/gi, '</p><div class="lifespan round w162"><div style="width:$1%;"></div></div><p>');
		text = text.replace(/\[STATE=([0-9]+)\]/gi, '</p><div class="state round w162"><div style="width:$1%;"></div></div><p>');
		text = text.replace(/\[DYING=([0-9]+)\]/gi, '</p><div class="state round w162 dying"><div style="width:$1%;"></div></div><p>');
		text = text.replace(/\[HAPP\]/gi, '</p><div class="happiness round center w162">');
		text = text.replace(/\[\/HAPP\]/gi, '</div><p>');
		// Other indicators
		text = text.replace(/\[QUAL=([0-9]+)\]/gi, '</p><div class="qual round w162"><div style="width:$1%;"></div></div><p>');
		text = text.replace(/\[SERV=([0-9]+)\]/gi, '</p><div class="serv on round w162"><div style="width:$1%;"></div></div><p>');
		text = text.replace(/\[PROGRESS=([0-9]+)\]/gi, '</p><div class="progress round w162"><div style="width:$1%;"></div></div><p>');
	}
	if (mask & 0x0020) {
		// Decode emoji
		text = lol.BB.decodeEmojis(text);
	}
	if (mask & 0x0010) {
		// Decode raw URL
		text = lol.BB.decodeRawURL(text);
	}
	if (mask & 0x0040) {
		// Other inline tags
		text = lol.BB.decodeTags(text);
	}
	// Delete unresolved BB tags
	text = text.replace(/\[([^\]]*)\]/gi, '');
	// Remove empty paragraphs
	text = text.replace(/<p><\/p>/g, '');
	// Check the result
	return lol.BB.check(text, initText);
};

lol.BB.check = function(text, initText) {
	// Check disclosed HTML tags
    var tags = ["a", "span", "div", "ul", "li", "p", "table", "tr", "td", "b", "i", "u"];
    for (var i in tags) { 
	    var tag = tags[i];
        var opened = (text.match(new RegExp('<'+tag+'( |>)','g'))||[]).length;
        var closed = (text.match(new RegExp('</'+tag+'>','g'))||[]).length;
        if (opened != closed) return '<div class="small gray">'+initText+'</div>';
    };
    return text;
};


lol.BB.emojiList = [':angel:',':angry:',':beer:',':confused:',':crying:',':devil:',':disappointed:',':ear:',':expressionless:',':fearful:',
':flushed:',':frowning:',':grinning:',':heart:',':innocent:',':tearsofjoy:',':joy:',':laughing:',':satisfied:',':love:',
':openmouth:',':praying:',':surprised:',':scream:',':omg:',':sleeping:',':zzz:',':smile:',':thinking:',
':thumbsup:',':thumbsdown:',':tongueout:',':veryangry:',':wine:',':wink:',':zippermouth:'];

lol.BB.decodeEmojis = function(text) {
	// Disable some combinations before replacing emoji
	text = text.replace(/:\/\//g, '{colon}//'); // to avoid replacements in URL
	text = text.replace(/\/([a-z0-9]{2,}):([a-z0-9]{2,})/g, '/$1{colon}$2'); // to avoid replacements in URL
	text = text.replace(/&quot;\)/g, '{quot.parenth}');
	// Emojis with delimiter
	text = text.replace(/(:angry:)/g, '<img class="emoji" src="/img/emoji/angry.png"/>');
	text = text.replace(/(:beer:)/g, '<img class="emoji" src="/img/emoji/beer.png"/>');
	text = text.replace(/(:confused:)/g, '<img class="emoji" src="/img/emoji/confused.png"/>');
	text = text.replace(/(:crying:|:cry:)/g, '<img class="emoji" src="/img/emoji/crying.png"/>');
	text = text.replace(/(:devil:)/g, '<img class="emoji" src="/img/emoji/devil.png"/>');
	text = text.replace(/(:disappointed:)/g, '<img class="emoji" src="/img/emoji/disappointed.png"/>');
	text = text.replace(/(:ear:)/g, '<img class="emoji" src="/img/emoji/ear.png"/>');
	text = text.replace(/(:expressionless:)/g, '<img class="emoji" src="/img/emoji/expressionless.png"/>');
	text = text.replace(/(:fearful:|:fear:)/g, '<img class="emoji" src="/img/emoji/fearful.png"/>');
	text = text.replace(/(:flushed:)/g, '<img class="emoji" src="/img/emoji/flushed.png"/>');
	text = text.replace(/(:grinning:)/g, '<img class="emoji" src="/img/emoji/grinning.png"/>');
	text = text.replace(/(:heart:)/g, '<img class="emoji" src="/img/emoji/heart.png"/>');
	text = text.replace(/(:innocent:|:angel:)/g, '<img class="emoji" src="/img/emoji/innocent.png"/>');
	text = text.replace(/(:laughing:)/g, '<img class="emoji" src="/img/emoji/laughing.png"/>');
	text = text.replace(/(:love:)/g, '<img class="emoji" src="/img/emoji/love.png"/>');
	text = text.replace(/(:openmouth:|:surprised:)/g, '<img class="emoji" src="/img/emoji/surprised.png"/>');
	text = text.replace(/(:frowning:)/g, '<img class="emoji" src="/img/emoji/frowning.png"/>');
	text = text.replace(/(:praying:)/g, '<img class="emoji" src="/img/emoji/praying.png"/>');
	text = text.replace(/(:scream:|:omg:)/g, '<img class="emoji" src="/img/emoji/scream.png"/>');
	text = text.replace(/(:sleeping:|:zzz:)/g, '<img class="emoji" src="/img/emoji/sleeping.png"/>');
	text = text.replace(/(:smile:)/g, '<img class="emoji" src="/img/emoji/smiling.png"/>');
	text = text.replace(/(:smiley:)/g, '<img class="emoji" src="/img/emoji/smiley.png"/>');
	text = text.replace(/(:tearsofjoy:|:joy:)/g, '<img class="emoji" src="/img/emoji/tearsofjoy.png"/>');
	text = text.replace(/(:thinking:)/g, '<img class="emoji" src="/img/emoji/thinking.png"/>');
	text = text.replace(/(:thumbsdown:|:\-1:)/g, '<img class="emoji" src="/img/emoji/thumbsdown.png"/>');
	text = text.replace(/(:thumbsup:|:\+1:)/g, '<img class="emoji" src="/img/emoji/thumbsup.png"/>');
	text = text.replace(/(:tongueout:)/g, '<img class="emoji" src="/img/emoji/tongueout.png"/>');
	text = text.replace(/(:veryangry:)/g, '<img class="emoji" src="/img/emoji/veryangry.png"/>');
	text = text.replace(/(:wine:)/g, '<img class="emoji" src="/img/emoji/wine.png"/>');
	text = text.replace(/(:wink:)/g, '<img class="emoji" src="/img/emoji/wink.png"/>');
	text = text.replace(/(:zippermouth:)/g, '<img class="emoji" src="/img/emoji/zippermouth.png"/>');
	// Emojis with symbols
	text = text.replace(/(3:-?\))/gi, '<img class="emoji" src="/img/emoji/devil.png"/>');
	text = text.replace(/(o:-?\))/gi, '<img class="emoji" src="/img/emoji/innocent.png"/>');
	text = text.replace(/(&gt;:-?D)/g, '<img class="emoji" src="/img/emoji/laughing.png"/>');
	text = text.replace(/(&gt;:-?\()/g, '<img class="emoji" src="/img/emoji/angry.png"/>');
	text = text.replace(/(&gt;:-?\(\()/g, '<img class="emoji" src="/img/emoji/veryangry.png"/>');
	text = text.replace(/(&lt;3)/g, '<img class="emoji" src="/img/emoji/heart.png"/>');
	text = text.replace(/(:-?\/|:-?\\)/g, '<img class="emoji" src="/img/emoji/confused.png"/>');
	text = text.replace(/(:'-?\()/g, '<img class="emoji" src="/img/emoji/crying.png"/>');
	text = text.replace(/(-_-)/g, '<img class="emoji" src="/img/emoji/expressionless.png"/>');
	text = text.replace(/(:-?\$)/g, '<img class="emoji" src="/img/emoji/flushed.png"/>');
	text = text.replace(/(:-?D|=D)/g, '<img class="emoji" src="/img/emoji/grinning.png"/>');
	text = text.replace(/(:-?o)/gi, '<img class="emoji" src="/img/emoji/surprised.png"/>');
	text = text.replace(/(:-?\()/g, '<img class="emoji" src="/img/emoji/frowning.png"/>');
	text = text.replace(/(\^_?\^)/g, '<img class="emoji" src="/img/emoji/smiling.png"/>');
	text = text.replace(/(:-?\))/g, '<img class="emoji" src="/img/emoji/smiley.png"/>');
	text = text.replace(/(:-?p)/gi, '<img class="emoji" src="/img/emoji/tongueout.png"/>');
	text = text.replace(/(;-?\))/g, '<img class="emoji" src="/img/emoji/wink.png"/>');
	// Single emoji
	text = text.replace(/<p><img class="emoji" src="([^"]+)"\/><\/p>/g, '<p><img class="sticker" src="$1"/></p>');
	// end
	text = text.replace(/\{colon\}/g, ':');
	text = text.replace(/\{quot.parenth\}/g, '&quot;)');
	return text;
};


lol.Forum = {};
lol.Notices = {};

lol.follow = function(follow) {
	// Follow a forum
	mqykkbj('forum', {id:lol.Forum.id, follow:follow}, function() {
		lol.refresh();
	});
};

lol.anonymous = {
	id:0,
	blazon:'x',
	name:null,
	aka:null,
	isOnline:false,
	logo:null,
};

// Initializing
$(document).ready(function() {

	// Posts
	$('.post.data').each(function(i) {
		var data = lol.XHR.decode($(this).text()).split('|');
		var n = 0;
		var url = data[n++];
		var type = data[n++];
		var lang = data[n++];
		var title = lol.str(data[n++]);
		var created = parseInt(data[n++]);
		var locked = parseInt(data[n++]);
		var author = {
			id: parseInt(data[n++]),
			name: data[n++],
			aka: data[n++],
		};
		var content = lol.str(data[n++]);
		if (type=='bug' && locked) type = 'fixed';
		var html = '';
		if (type) html+= '<div class="floatRight"><img class="txt" src="'+ICONPATH+'/'+type+'.png"/></div>';
		html+= '<h3><img class="txt" src="/img/lang/'+lang+'.png"/> '+title+'</h3>';
		html+= '<p>'+lol.Time.html(created, 0x0177)+'</p>';
		if (author.id) {
			html+= '<p>'+__('By')+' <a href="/arm/lord/'+author.id+'">'+author.name+'</a>';
			if (author.aka != author.name) html+= ', <i>'+__('aka')+' '+author.aka+'</i>';
			html+= '</p>';
		}
		html+= '<div class="just hyphen pointer" onclick="lol.go(\''+url+'\')">'+lol.BB.decode(content,'post')+'</div>';
		$(this).html(html).removeClass('data');
	});
	
	// Message types
	$('#msgtype button').click(function(e) {
		var type = $(this).attr('data-type');
		$('#msgtype button').removeClass('selected');
		$(this).addClass('selected');
		$('#msgtype input[type="hidden"]').val(type);
		// Notice
		var notice = lol.Notices[type];
		if (notice) $('#msgtype .notice').html(lol.BB.decode(notice));
		else mqykkbj('notice', {type:type}, function(data) {
			var notice = lol.XHR.decode(data);
			lol.Notices[type] = notice;
			$('#msgtype .notice').html(lol.BB.decode(notice));
		});
		// Update buttons and preview
		$('.bbbtns').attr('data-type',type);
		$('.bbpreview').attr('data-type',type);
		$('.bbbtns').html(lol.BB.buttonsHTML(type));
		$('.bbinput').each(function() { lol.BB.preview(this); });
		return ui.cancel(e);
	});
	
	$('#linkmenu button').click(function(e) {
		var url = $(this).attr('data-url');
		var target = $(this).parent().parent().find('.bbinput').addBack('.bbinput').get(0);
		if (!target) return ui.cancel(e); // target not found
		var val = target.value + '\n[URL]'+url+'[/URL]';
		target.value = val;
		var end = val.length;
		target.selectionStart = end;
		target.selectionEnd = end;
		target.focus();
		lol.BB.preview(target);
		return ui.cancel(e);
	});
	
});


lol.Autosave = function(input) {
	this.input = input;
	this.name = $(input).attr('data-autosave');
	this.restore();
	lol.Autosave.list.push(this);
};

lol.Autosave.list = [];

lol.Autosave.prototype.restore = function() {
	// Restore the content of an input or text area if empty
	if (!this.input.value.trim()) {
		// Restore the value
		var value;
		try { value = localStorage.getItem(this.name+'.value'); } catch (e) { value = ''; }
		this.input.value = value;
		if ($(this.input).is('.bbinput')) lol.BB.preview(this.input);
	} 
	if ($(this.input).is('textarea')) {
		// Restore the height of a textarea
		var height;
		try { height = parseInt(localStorage.getItem(this.name+'.height')); } catch (e) { height = 0; }
		if (height < 190) height = 190;
		this.input.style.height = ''+height+'px';
	}
};

lol.Autosave.prototype.clear = function() {
	try { localStorage.removeItem(this.name+'.value'); } catch (e) {}
	try { localStorage.removeItem(this.name+'.height'); } catch (e) {}
};

lol.Autosave.prototype.save = function() {
	if (this.input.value.trim()) {
		// Save the value of the input
		var value = this.input.value;
		try { localStorage.setItem(this.name+'.value', value); } catch (e) {}
	} 
	if ($(this.input).is('textarea')) {
		// Save the height of a textarea
		var height = this.input.clientHeight;
		try { localStorage.setItem(this.name+'.height', height); } catch (e) {}
	}
};

lol.Autosave.start = function() {
	// Will start autosaving
	for (var i in lol.Autosave.list) {
		lol.Autosave.list[i].save();
	}
	setTimeout('lol.Autosave.start()',10000);
};



// Initializing
$(document).ready(function() {

	// Autosave
	var div = $('[data-autosave]');
	if (div.length) {
		div.each(function(i) {
			var autosave = new lol.Autosave(this);
			$(this).closest('form').find('input[type="submit"]').click(function(e) {
				autosave.clear();
			});
		});
		lol.Autosave.start();
	}
	
});
	
lol.Event = function(data, sep) {
	// Initialize an event
	if (!sep) sep = '§';
	var e = data.split(sep);
	this.id = parseInt(e[0]);
	this.date = parseInt(e[1]);
	this.type = e[2];
	this.info = e[3]? e[3].split(':'):[];
	this.figs = e[4]? e[4].split(':'):[];
	this.fid = lol.FID;
	if (this.figs.length) {
		for (var i in this.figs) this.figs[i] = parseInt(this.figs[i]);
		if (this.figs.indexOf(lol.FID) == -1) this.fid = this.figs[0];
	}
	if (this.id > lol.Event.lastId) lol.Event.lastId = this.id;
};

lol.Event.lastId = 0;

lol.Event.data = function(json, sep) {
	if (!sep) sep = '§';
	var data = ''+json.id;
	data+= sep+json.date;
	data+= sep+json.type;
	data+= sep+json.info;
	data+= sep+json.figs;
	return data;
};

lol.Event.mode = 0;
lol.Event.coords = null;
lol.Event.rtype = null;
lol.Event.token = null;
lol.Event.callbacks = {};

lol.Event.addListener = function(type,callback) {
	// Add an event listener
	var array = lol.Event.callbacks[type];
	if (array) array.push(callback);
	else lol.Event.callbacks[type] = [callback];
};

lol.Event.upgrade = function() {
	// Implemented for polling
};
lol.Event.downgrade = function() {
	// Implemented for polling
};

lol.Event.registration = function() {
	// Return the registration info
	var types = [];
	for (var type in lol.Event.callbacks) types.push(type);
	return {
		uid:lol.UID, fid:lol.FID,
		token:lol.Event.token,
		lastEventId:lol.Event.lastId,
		coords:lol.Event.coords,
		rtype:lol.Event.rtype,
		types:types,
	};
};

lol.Event.directConnect = function() {
	// Non persistent socket
	var socket = io.connect('https://'+lol.hostname, {
	    transports: ['websocket','polling'],
	    query:'node='+(lol.Premium?1:2),
	});
	socket.on('connect', function() {
		// Send information about the client
		socket.emit('register', lol.Event.registration());
	});
	// Register callbacks
	for (var type in lol.Event.callbacks) {
		socket.on(type, function(object) {
			if (object.id) if (object.id <= lol.Event.lastId) return;
			var event = new lol.Event(lol.Event.data(object));
			for (var i in lol.Event.callbacks[event.type]) {
				lol.Event.callbacks[event.type][i](event);
			}
		});
	}
};

lol.Event.directConnectWithTimeout = function() {
	// Non persistent socket started with timeout
	setTimeout(lol.Event.directConnect, lol.Premium? 500:2000);
};

lol.Event.connect = lol.Event.directConnectWithTimeout;

$(document).ready(function() {
	if (!lol.UID) return;
	if (lol.SafeMode) return;
	lol.Event.connect();
});

lol.Notif = function(event, isNew) {
	this.isNew = isNew? true:false;
	this.id = event.id;
	this.date = event.date;
	this.type = event.type;
	this.info = event.info;
	this.fid = event.fid;
	this.icon = this.type;
	if (event.id < lol.Notif.firstId) lol.Notif.firstId = this.id;
};

lol.Notif.firstId = 9999999999999;
lol.Notif.sound = true;
lol.Notif.sounds = {};

lol.Notif.completedHTML = function() {
	return '<img class="txt" src="'+ICONPATH+'/checked.png">';
};

lol.Notif.rewardHTML = function(reward) {
	var title = __('Reward:')+' '+reward+' '+__('tokens');
	var html = '<span class="round reward" title="'+title+'">';
	html+= reward;
	html+= '</span>';
	return html;
};

lol.Notif.prototype.beginHTML = function() {
	// Display beginning of notification
	var html = '<table class="notif'+(this.isNew?' new':'')+'" data-id="'+this.id+'"';
	if (this.url) html+= ' onclick="lol.Notif.go(\''+this.url+'\','+this.fid+')"';
	html+= '><tr><td class="icon"><img class="event" src="'+SKINPATH+'/evt/'+this.icon+'.png"/></td>';
	if (this.sender) {
		html+= '<td class="sender"><img class="round sender" src="/img/unit/'+this.sender.icon+'.png"/>';
		html+= '<div class="status">';
		if (this.tip) {
			if (this.tip.completed) html+= lol.Notif.completedHTML();
			else if (this.tip.reward) html+= lol.Notif.rewardHTML(this.tip.reward);
		}
		html+= '</div>';
		html+= '</td>';
	}
	html+= '<td class="main"><span class="date">'+lol.Time.html(this.date,0x0136)+'</span><br>';
	return html;
};

lol.Notif.prototype.endHTML = function() {
	// Display end of notification
	var html = '</td>';
	if (this.fid != lol.FID) {
		// The recipient is not the current active figure
		html+= '<td class="icon"><img src="'+SKINPATH+'/evt/fig.png"/></td>';
	}
	html+= '</tr></table>';
	return html;
};

lol.Notif.prototype.html = function() {
	// Return HTML to display a notification
	var func = this.type+'HTML';
	if (!this[func]) return '';
	return this[func]();
};

lol.Notif.go = function(url, fid) {
	// Go to the passed URL as "fid"
	if (fid && fid != lol.FID) {
		// At first, change current figure
		mqykkbj('session',{fid:fid}, function(data){lol.Notif.go(url);});
		return;
	}
	lol.go(url);
};

lol.Notif.prototype.prepend = function() {
	// Prepend the notification
	var html = this.html();
	$('#homeNotif').prepend(html);
	// Notification list
	$('#notif').prepend(html);
	$('#notif .notif.new').stop(true).fadeIn(function() {
		$(this).removeClass('new');
	});
	lol.Notif.scrollTop();
};

lol.Notif.prototype.append = function() {
	var html = this.html();
	$('#homeNotif').append(html);
};

lol.Notif.prototype.play = function() {
	if (!lol.Notif.sound) return;
	var sound = lol.Notif.sounds[this.type];
	if (!sound) sound = 'notif';
	ui.Sound.play(sound);
};

lol.Notif.newEvent = function(event) {
	var notif = new lol.Notif(event, true);
	notif.play();
	notif.prepend();
	lol.Notif.isNotified = true;
	lol.Notif.updateButton();
};


lol.Notif.scrollTop = function() {
	$('#notif').scrollTop(0);
};

lol.Notif.layout = function(e) {
	// Layout chat height
	var height = $(window).height();
	height-= 44; // button height
	$('#notif').css('height', height);
	lol.Notif.scrollTop();
};

lol.Notif.more = function() {
	// Load more notifications and append to the list
	mqykkbj('notif', {count:10, before:lol.Notif.firstId}, function(data) {
		// Append new notifications
		data = lol.XHR.decode(data).split('$');
		for (var i in data) {
			if (!data[i]) continue;
			var event = new lol.Event(data[i]);
			var notif = new lol.Notif(event);
			notif.append();
		}
		// Append notifications
		lol.loaded('.loader.bottom', data.length<10);
	}, true);
};

// Notifications
lol.Notif.isNotified = false;
lol.Notif.buttonHTML = function() {
	if ($('#notif').is(':visible')) lol.Notif.isNotified = false;
	var html = '';
	if (lol.Notif.isNotified) html+= '<button onclick="lol.Notif.open()"><img src="'+BTNPATH+'/notifs.gif"></button>';
	else if ($('#notif').is('.opened')) html+= '<button onclick="lol.Notif.close()"><img src="'+BTNPATH+'/notifs.png"></button>';
	else html+= '<button class="blur" onclick="lol.Notif.open()"><img src="'+BTNPATH+'/notifs.png"></button>';
	return html;
};

lol.Notif.updateButton = function() {
	$('.notifs').html(lol.Notif.buttonHTML());
};

lol.Notif.open = function() {
	lol.Chat.close();
	$('#notif').addClass('opened');
	lol.Notif.updateButton();
};

lol.Notif.close = function() {
	$('#notif').removeClass('opened');
	lol.Notif.updateButton();
};

// Initializing
$(document).ready(function() {

	if (lol.FID) {
		// Left notification list
		var data = lol.XHR.decode($('#notif').text()).split('$');
		$('#notif').html('').removeClass('data');
		for (var i in data) {
			if (!data[i]) continue;
			var event = new lol.Event(data[i]);
			var notif = new lol.Notif(event);
			notif.prepend();
		}
		$('#notif').prepend(lol.Ad.notifHTML());

		// Notification button
		$('#notifBtn').html(lol.Notif.buttonHTML());
			
		$(window)
		.resize(lol.Notif.layout)
		.on('orientationchange', lol.Notif.layout);
		lol.Notif.layout();
	}
});




lol.Notif.prototype.acceptHTML = function() {
	var html = '';
	// A request to accept action
	this.acttype = this.info[0];
	this.coords = {x:parseInt(this.info[1]), y:parseInt(this.info[2])};
	this.sender = {name:this.info[3], icon:this.info[4]};
	this.fig = {gender:parseInt(this.info[5])};
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Arguments 
	var arg1 = '<b>'+this.sender.name+'</b>';
	// Make HTML
	var key = this.type;
	key+= '.'+this.acttype;
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(key,this.fig.gender), [arg1])+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('accept', lol.Notif.newEvent);


lol.Notif.prototype.likeHTML = function() {
	var html = '';
	// A post was liked
	this.post = {id:parseInt(this.info[0])};
	this.thread = {id:parseInt(this.info[1]), title:lol.str(this.info[2])};
	this.forum = {type:this.info[3], url:this.info[4]};
	this.sender = {name:this.info[5], icon:this.info[6]};
	this.isFirst = (parseInt(this.info[7])==this.post.id);
	this.fig = {gender:parseInt(this.info[8])};
	this.url = this.forum.url+'/'+this.thread.id;
	// Arguments 
	var arg1 = '<b>'+this.sender.name+'</b>';
	var arg2 = '<i>'+this.thread.title+'</i>';
	// Make HTML
	var key = this.type;
	key+= '.'+this.forum.type;
	if (!this.isFirst) key+= '.reply';
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(key,this.fig.gender), [arg1,arg2])+'.';
	html+= this.endHTML();
	return html;
};

lol.Notif.prototype.replyHTML = function() {
	var html = '';
	// A reply or comment
	this.post = {id:parseInt(this.info[0])};
	this.thread = {id:parseInt(this.info[1]), title:lol.str(this.info[2])};
	this.forum = {type:this.info[3], url:this.info[4]};
	this.sender = {name:this.info[5], icon:this.info[6]};
	this.isMine = (parseInt(this.info[7])==lol.FID);
	this.fig = {gender:parseInt(this.info[8])};
	this.url = this.forum.url+'/'+this.thread.id;
	// Arguments 
	var arg1 = '<b>'+this.sender.name+'</b>';
	var arg2 = '<i>'+this.thread.title+'</i>';
	// Make HTML
	var key = this.type;
	key+= '.'+this.forum.type;
	if (this.isMine) key+= '.mine';
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(key,this.fig.gender), [arg1,arg2])+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('like', lol.Notif.newEvent);
lol.Event.addListener('reply', lol.Notif.newEvent);

lol.Notif.prototype.publishHTML = function() {
	var html = '';
	// A new chronicle
	this.thread = {id:parseInt(this.info[0]), title:lol.str(this.info[1])};
	this.forum = {type:this.info[2], url:this.info[3]};
	this.sender = {name:this.info[4], icon:this.info[5]};
	this.fig = {gender:parseInt(this.info[6])};
	this.url = this.forum.url+'/'+this.thread.id;
	// Make HTML
	var arg1 = '<b>'+this.sender.name+'</b>';
	var key = 'publish.'+this.type;
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(key,this.fig.gender), [arg1]);
	html+= ' <i>'+this.thread.title+'</i>';
	html+= '.';
	html+= this.endHTML();
	return html;
};

lol.Notif.prototype.featherHTML = function() {
	return this.publishHTML();
};

lol.Notif.prototype.docHTML = function() {
	return this.publishHTML();
};

lol.Notif.prototype.announceHTML = function() {
	return this.publishHTML();
};

lol.Notif.prototype.privateHTML = function() {
	return this.publishHTML();
};

lol.Event.addListener('feather', lol.Notif.newEvent);
lol.Event.addListener('doc', lol.Notif.newEvent);
lol.Event.addListener('announce', lol.Notif.newEvent);
lol.Event.addListener('private', lol.Notif.newEvent);




lol.Notif.prototype.alertHTML = function(anonymous) {
	var html = '';
	// Display an alert
	this.coords = {x:parseInt(this.info[0]), y:parseInt(this.info[1])};
	this.sender = {name:this.info[2], icon:this.info[3]};
	this.fig = {gender:parseInt(this.info[4])};
	this.loc = this.info[5];
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	html+= this.beginHTML();
	if (anonymous) {
		html+= __bold(this.type,this.fig.gender);
	}
	else {
		var arg1 = '<b>'+this.sender.name+'</b>';
		html+= lol.sprintf(__bold(this.type,this.fig.gender), [arg1]);
	}
	if (this.loc) {
		html+= ' <small>('+this.loc+')</small>';
	}
	html+= '.';
	html+= this.endHTML();
	return html;
};

lol.Notif.sounds['troops'] = 'call';
lol.Notif.prototype.troopsHTML = function() {
	return this.alertHTML();
};

lol.Notif.sounds['fight'] = 'charge';
lol.Notif.prototype.fightHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.visitHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.unitsHTML = function() {
	return this.alertHTML(true);
};

lol.Notif.prototype.convoyHTML = function() {
	return this.alertHTML(true);
};

lol.Notif.prototype.occupyHTML = function() {
	return this.alertHTML(true);
};

lol.Notif.prototype.lootHTML = function() {
	return this.alertHTML(true);
};

lol.Notif.prototype.strikeHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.embargoHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.excomHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.foundHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.expandHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.liquidHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.indepHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.vassalHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.subjectHTML = function() {
	return this.alertHTML();
};

lol.Notif.prototype.subvassHTML = function() {
	return this.alertHTML();
};


lol.Event.addListener('troops', lol.Notif.newEvent);
lol.Event.addListener('fight', lol.Notif.newEvent);
lol.Event.addListener('visit', lol.Notif.newEvent);
lol.Event.addListener('units', lol.Notif.newEvent);
lol.Event.addListener('convoy', lol.Notif.newEvent);
lol.Event.addListener('occupy', lol.Notif.newEvent);
lol.Event.addListener('loot', lol.Notif.newEvent);
lol.Event.addListener('strike', lol.Notif.newEvent);
lol.Event.addListener('embargo', lol.Notif.newEvent);
lol.Event.addListener('excom', lol.Notif.newEvent);
lol.Event.addListener('found', lol.Notif.newEvent);
lol.Event.addListener('expand', lol.Notif.newEvent);
lol.Event.addListener('liquid', lol.Notif.newEvent);
lol.Event.addListener('indep', lol.Notif.newEvent);
lol.Event.addListener('vassal', lol.Notif.newEvent);
lol.Event.addListener('subject', lol.Notif.newEvent);
lol.Event.addListener('subvass', lol.Notif.newEvent);

// Other formats
lol.Notif.sounds['inter'] = 'call';
lol.Notif.prototype.interHTML = function() {
	var html = '';
	// An interception has started
	this.coords = {x:parseInt(this.info[0]), y:parseInt(this.info[1])};
	this.sender = {icon:this.info[2]};
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	html+= this.beginHTML();
	html+= __bold(this.type,0)+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('inter', lol.Notif.newEvent);

lol.Notif.prototype.siegeHTML = function() {
	var html = '';
	// A siege was started
	this.coords = {x:parseInt(this.info[0]), y:parseInt(this.info[1])};
	this.sender = {name:this.info[2], icon:this.info[3]};
	this.fig = {gender:parseInt(this.info[4])};
	this.domain = this.info[5]? {name:this.info[5]}:null;
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Arguments 
	var arg1 = this.domain?'<b>'+this.domain.name+'</b>':'';
	// Make HTML
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(this.type), [arg1])+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('siege', lol.Notif.newEvent);



lol.Notif.sounds['pop'] = 'ping';
lol.Notif.prototype.popHTML = function() {
	var html = '';
	// A unit has arrived
	this.coords = {x:parseInt(this.info[0]), y:parseInt(this.info[1])};
	this.sender = {name:this.info[2],icon:this.info[3]};
	this.loc = this.info[4];
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	html+= this.beginHTML();
	var arg1 = '<b>'+this.sender.name+'</b>';
	html+= lol.sprintf(__bold(this.type), [arg1])+'.';
	if (this.loc) html+= ' <small>('+this.loc+')</small>';
	html+= '.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('pop', lol.Notif.newEvent);

lol.Notif.sounds['leave'] = 'ping';
lol.Notif.prototype.leaveHTML = function() {
	var html = '';
	// A unit is dead
	this.coords = {x:parseInt(this.info[0]), y:parseInt(this.info[1])};
	this.sender = {name:this.info[2],icon:this.info[3]};
	this.loc = this.info[4];
	this.weapon = this.info[5];
	this.fig = {gender:parseInt(this.info[6])};
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	var arg1 = '<b'+(this.fig.gender?' class="red"':'')+'>'+this.sender.name+'</b>';
	var key = this.type;
	key+= (this.org?'.unit':'.fig');
	if (this.weapon) key+= '.combat';
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(key,this.fig.gender), [arg1]);
	if (this.loc) html+= ' <small>('+this.loc+')</small>';
	html+= '.';
	html+= this.endHTML();
	return html;
};

lol.Notif.sounds['die'] = 'die';
lol.Notif.prototype.dieHTML = function() {
	return this.leaveHTML();
};

lol.Event.addListener('leave', lol.Notif.newEvent);
lol.Event.addListener('die', lol.Notif.newEvent);


lol.Notif.prototype.revokeHTML = function() {
	var html = '';
	// Revoked title
	this.org = {url:this.info[0]};
	this.sender = {name:this.info[1], icon:this.info[2]};
	this.fig = {gender:parseInt(this.info[3])};
	this.legend = this.info[4];
	this.url = this.org.url;
	// Arguments
	var arg1 = '<b>'+this.sender.name+'</b>';
	var arg2 = '<i>'+this.legend+'</i>';
	// Make HTML
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(this.type,this.fig.gender), [arg1,arg2])+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('revoke', lol.Notif.newEvent);

lol.Notif.prototype.birthdayHTML = function() {
	var html = '';
	// Revoked title
	this.u = {url:this.info[0]};
	this.fig = {
		id:parseInt(this.info[0]),
		name:this.info[1],
		gender:parseInt(this.info[3]),
	};
	this.sender = {
		name:this.info[1],
		icon:this.info[2],
	};
	this.url = '/arm/lord/'+this.fig.id;
	// Arguments
	var arg1 = '<b>'+this.fig.name+'</b>';
	// Make HTML
	html+= this.beginHTML();
	html+= lol.sprintf(__bold(this.type,this.fig.gender), [arg1])+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('birthday', lol.Notif.newEvent);


lol.Notif.didComplete = function(event) {
	// A unit did update
	var id = parseInt(event.info[0]);
	var reward = parseInt(event.info[1]);
	if (reward) lol.Tokens.reward(reward);
	// Update the notification
	var notif = $('#notif .notif[data-id="'+id+'"]');
	notif.find('.status').html(lol.Notif.completedHTML());
};

lol.Event.addListener('complete', lol.Notif.didComplete);

lol.Notif.prototype.relicHTML = function() {
	var html = '';
	// Relic detection
	this.tip = {completed:parseInt(this.info[0]), reward:parseInt(this.info[1])}
	this.sender = {icon:this.info[2]};
	this.rtype = this.info[3];
	this.coords = {x:parseInt(this.info[4]), y:parseInt(this.info[5])};
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	html+= this.beginHTML();
	html+= __bold(this.type)+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('relic', lol.Notif.newEvent);

lol.Notif.prototype.buildHTML = function() {
	var html = '';
	// Building something in the domain
	this.icon = 'tip';
	this.tip = {completed:parseInt(this.info[0]), reward:parseInt(this.info[1])}
	this.sender = {icon:this.info[2]};
	this.btype = this.info[3];
	this.coords = {x:parseInt(this.info[4]), y:parseInt(this.info[5])};
	this.loc = this.info[6];
	this.url = '/map?x='+this.coords.x+'&y='+this.coords.y;
	// Make HTML
	html+= this.beginHTML();
	html+= __bold(this.type+'.'+this.btype)+'.';
	if (this.loc) {
		html+= ' <small>('+this.loc+')</small>';
	}
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('build', lol.Notif.newEvent);

lol.Notif.prototype.tokenHTML = function() {
	var html = '';
	// Using tokens
	this.icon = 'tip';
	this.tip = {completed:parseInt(this.info[0]), reward:parseInt(this.info[1])}
	this.sender = {icon:this.info[2]};
	this.coords = {x:parseInt(this.info[3]), y:parseInt(this.info[4])};
	this.url = '/map/'+lol.Map.coordsToString(this.coords.x, this.coords.y);
	// Make HTML
	html+= this.beginHTML();
	html+= __bold(this.type)+'.';
	html+= this.endHTML();
	return html;
};

lol.Event.addListener('token', lol.Notif.newEvent);

lol.Chat = function(event, isNew) {
	this.isNew = isNew? true:false;
	this.event = event;
	this.id = event.id;
	this.date = event.date;
	this.type = event.type;
	var func = this.type+'HTML';
	if (!lol.Chat[func]) {
		this.sender = {
			id:parseInt(event.info[0]),
			icon:event.info[1],
			name:event.info[2]
		};
		// Decode message
		var func = this.type+'MessageHTML';
		if (lol.Chat[func]) this.message = lol.Chat[func](event);
		// Highlighted
		var message = lol.str(event.info[3]);
		this.isHighlighted = false;
		for (var i in lol.Chat.keywords) {
			var item = lol.Chat.keywords[i];
			if (message.indexOf(item) == -1) continue;
			this.isHighlighted = true;
			break;
		}
	}
	if (event.id < lol.Chat.firstId) lol.Chat.firstId = this.id;
	if (lol.Chat.firstDate == null) lol.Chat.firstDate = this.date;
	if (lol.Chat.lastDate == null) lol.Chat.lastDate = this.date;
};

lol.Chat.firstId = 9999999999999;
lol.Chat.firstDate = null;
lol.Chat.lastDate = null;

lol.Chat.mode = 'chat';
lol.Chat.sound = true;
lol.Chat.keywords = [];
lol.Chat.sounds = {};

lol.Chat.prototype.append = function() {
	var func = this.type+'HTML';
	if (lol.Chat[func]) {
		var html = lol.Chat[func](this);
		$('#chatMsg > div > div.chatMsg > div').append(html);
		return;
	}
	// Display the date if 5mn have passed since last message
	if (this.date >= lol.Chat.lastDate+500) {
		var html = '<p class="date">'+lol.Time.html(this.date,0x136)+'</p>';
		$('#chatMsg > div > div.chatMsg > div').append(html);
	}
	lol.Chat.lastDate = this.date;
	// Append a chat message to the chat list
	var last = $('#chatMsg > div > div.chatMsg > div > *').last();
	if (last.attr('data-fid') == this.sender.id) {
		// Append message to last chat message
		if (this.isHighlighted) last.addClass('hl');
		last.find('td.msg').append(this.message);
	}
	else {
		// New sender
		var item = '@'+this.sender.name.replace(/ /g,' ');
		var className = 'chat hyphen' + (this.isNew? ' new':'');
		if (this.sender.id==lol.FID) className+= ' me';
		if (this.isHighlighted) className+= ' hl';
		var html = '<table class="'+className+'" data-fid="'+this.sender.id+'"><tr>';
		html+= '<td class="icon"><button data-item="'+item+'" onclick="lol.Chat.insert(this)">';
		html+= '<img src="/img/unit/'+this.sender.icon+'.png"/></button></td>';
		html+= '<td class="msg"><p class="author">'+this.sender.name+'</p>';
		html+= this.message+'</td>';
		html+= '</tr></table>';
		$('#chatMsg > div > div.chatMsg > div').append(html);
	}
};

lol.Chat.prototype.prepend = function() {
	var func = this.type+'HTML';
	if (lol.Chat[func]) {
		var html = lol.Chat[func](this);
		$('#chatMsg > div > div.chatMsg > div').prepend(html);
		return;
	}
	// Display the date if 5mn have passed since last message
	if (this.date <= lol.Chat.firstDate-300) {
		var html = '<p class="date">'+lol.Time.html(this.date,0x136)+'</p>';
		$('#chatMsg > div > div.chatMsg > div').prepend(html);
	}
	lol.Chat.firstDate = this.date;
	// Prepend a chat message to the chat list
	var last = $('#chatMsg > div > div.chatMsg > div > *').first();
	if (last.attr('data-fid') == this.sender.id) {
		// Prepend message to first chat message
		if (this.isHighlighted) last.addClass('hl');
		last.find('td.msg > .author').remove();
		last.find('td.msg').prepend(this.message)
		.prepend('<p class="author">'+this.sender.name+'</p>');
	}
	else {
		// New sender
		var item = '@'+this.sender.name.replace(/ /g,' ');
		var className = 'chat hyphen' + (this.isNew? ' new':'');
		if (this.sender.id==lol.FID) className+= ' me';
		if (this.isHighlighted) className+= ' hl';
		var html = '<table class="'+className+'" data-fid="'+this.sender.id+'"><tr>';
		html+= '<td class="icon"><button data-item="'+item+'" onclick="lol.Chat.insert(this)">';
		html+= '<img src="/img/unit/'+this.sender.icon+'.png"/></button></td>';
		html+= '<td class="msg"><p class="author">'+this.sender.name+'</p>';
		html+= this.message+'</td>';
		html+= '</tr></table>';
		$('#chatMsg > div > div.chatMsg > div').prepend(html);
	}
};

lol.Chat.prototype.play = function() {
	if (!lol.Chat.sound) return;
	var sound = lol.Chat.sounds[this.type];
	if (!sound) if (this.message) {
		// Default sound for messages
		sound = this.isHighlighted? 'dingaling':'gchat';
	}
	if (!sound) return;
	ui.Sound.play(sound);
};

// WRITERS
lol.Chat.writers = [];
lol.Chat.writerTimeout = null;
lol.Chat.showWriters = function() {
	if (lol.Chat.writers.length) {
		var html = '<img class="txt" src="'+ICONPATH+'/edit.png"> ';
		html+= lol.Chat.writers.map(e=>e.name).join(', ');
		html+= '<img class="txt" src="'+ICONPATH+'/write.gif">';
		$('#chatMsg > div > div.chatWriters').html(html);
	}
	else {
		$('#chatMsg > div > div.chatWriters').html('');
	}
};

lol.Chat.addWriter = function(fid,name) {
	// Add a new writer
	var writer = null;
	for (var i in lol.Chat.writers) {
		if (lol.Chat.writers[i].id != fid) continue;
		writer = lol.Chat.writers[i];
		break;
	}
	if (!writer) {
		writer = {id:fid};
		lol.Chat.writers.push(writer);
	}
	writer.name = name;
	writer.wrote = lol.Time.now;
	lol.Chat.showWriters();
	clearTimeout(lol.Chat.writerTimeout);
	lol.Chat.writerTimeout = setTimeout(function() {
		lol.Chat.writerTimeout = null;
		for (var i in lol.Chat.writers) {
			if (lol.Chat.writers[i].wrote > lol.Time.now-7) continue;
			lol.Chat.removeWriter(lol.Chat.writers[i].id);
		}
	},10000);
};

lol.Chat.removeWriter = function(fid) {
	// Remove a writer
	for (var i in lol.Chat.writers) {
		if (lol.Chat.writers[i].id != fid) continue;
		lol.Chat.writers.splice(i,1);
		break;
	}
	lol.Chat.showWriters();
};

lol.Chat.isWriting = function(event) {
	// Someone is writing
	var fid = parseInt(event.info[0]);
	var name = event.info[1];
	if (fid == lol.FID) return;
	lol.Chat.addWriter(fid,name);
};

// NEW MESSAGES
lol.Chat.newEvent = function(event) {
	var chat = new lol.Chat(event, true);
	chat.play();
	if (chat.message) {
		lol.Chat.removeWriter(chat.sender.id);
		chat.notify();
	}
	if (event.figs.indexOf(lol.FID)!=-1) {
		// Chat event is appended only if current figure matches
		chat.append();
	}
	lol.Chat.scrollBottom();
	lol.Event.upgrade();
};

lol.Chat.startCommand = function() {
	var target = $('#chat textarea').get(0);
	$(target).val('/');
	target.selectionStart = 1;
	target.selectionEnd = 1;
	target.focus();
	lol.BB.preview(target);
	lol.Chat.showSuggestions();
	return ui.cancel(e);
};

lol.Chat.toggleMode = function(button) {
	lol.Chat.mode = (lol.Chat.mode=='chat'?'off':'chat');
	$(button).find('img').attr('src', ICONPATH+'/'+lol.Chat.mode+'.png');
	mqykkbj('chat',{mode:lol.Chat.mode});
	$('#chat textarea').focus();
};

lol.Chat.buttonsHTML = function() {
	var html = '';
	html+= '<button onclick="lol.Chat.toggleMode(this);return ui.cancel(event);">';
	html+= '<img class="txt" src="'+ICONPATH+'/'+lol.Chat.mode+'.png"/></button> ';
	html+= '<button onclick="lol.Chat.startCommand();return ui.cancel(event);">';
	html+= '<img class="txt" src="'+ICONPATH+'/command.png"/></button> ';
	return html;
};

lol.Chat.open = function() {
	lol.Notif.close();
	$('#chat').addClass('focused');
	$('#chatMsg').addClass('opened');
	lol.Chat.updateTalkingButton();
	//lol.Chat.scrollBottom();
};

lol.Chat.closeTimeout = null;
lol.Chat.close = function() {
	$('#chat').removeClass('focused');
	$('#chatMsg').removeClass('opened');
};

lol.Chat.scrolling = false;
lol.Chat.scrollBottom = function() {
	if (lol.Chat.scrolling) return;
	$('#chatMsg > div').scrollTop(99999);
};

lol.Chat.layout = function() {
	// Layout chat height
	var height = $(window).height();
	height-= $('#header').height();	
	height-= 100; // chat height and user menu
	$('#chatMsg > div').css('height', height);
	lol.Chat.scrollBottom();
};

lol.Chat.more = function() {
	// Load more notifications and append to the list
	mqykkbj('chat', {count:25, before:lol.Chat.firstId}, function(data) {
		var n = 0;
		var html = '';
		var lastDate = 0;
		var oldHeight = $('#chatMsg > div > div.chatMsg').height();
		if (data) {
			// Append older chat events
			data = lol.XHR.decode(data).split('$');
			data = data.reverse();
			for (var i in data) {
				if (!data[i]) continue;
				var event = new lol.Event(data[i]);
				var chat = new lol.Chat(event);
				chat.prepend();
				n++;
			}
		}
		var newHeight = $('#chatMsg > div > div.chatMsg').height();
		$('#chatMsg > div').scrollTop(newHeight-oldHeight);
	}, true);
};

lol.Chat.writeTimeout = null;
lol.Chat.write = function(value) {
	if (!value) return;
	if (lol.Chat.writeTimeout) return;
    mqykkbj('chat',{write:null});
	lol.Chat.writeTimeout = setTimeout(function() {
		lol.Chat.writeTimeout = null;
	}, 5000);
};

lol.Chat.send = function(value) {
	value = value.replace(/^\*(.+)\*$/,'/me $1');
	value = value.replace(/^\*(.+)$/,'/me $1');
    mqykkbj('chat',{send:value});
	lol.Chat.setBadge(lol.FID, 0);
};

// NOTIFICATION
lol.Chat.isTalking = false;
lol.Chat.talkingHTML = function() {
	// Return the content of the talking icon
	if ($('#chatMsg').is(':visible')) lol.Chat.isTalking = false;
	var html = '';
	if (lol.Chat.isTalking) html+= '<a href="/chat"><img src="'+BTNPATH+'/fullscreen.gif"></a>';
	else html+= '<a class="blur" href="/chat"><img src="'+BTNPATH+'/fullscreen.png"></a>';
	if ($('#chatMsg').is('.opened')) html+= '<br><button class="blur" onclick="lol.Chat.close()"><img src="'+BTNPATH+'/close.png"></button>';
	return html;
};

lol.Chat.updateTalkingButton = function() {
	$('#chat .talking').html(lol.Chat.talkingHTML());
};

lol.Chat.talkingTimeouts = {};
lol.Chat.setTalking = function(fid) {
	if (fid == lol.FID) {
		// Current figure
		lol.Chat.isTalking = true;
		lol.Chat.updateTalkingButton();
	}
	else {
		// Try to find the figure in the menu
		var div = $('#user > .menu > a.switch[data-fid="'+fid+'"] img.talking');
		if (!div.length) return; // figure not found in the menu
		div.css('display', 'inline');
		clearTimeout(lol.Chat.talkingTimeouts[fid]);
		lol.Chat.talkingTimeouts[fid] = setTimeout(function() {
			delete lol.Chat.talkingTimeouts[fid];
			$(div).css('display', 'none');
		}, 60000);
	}
};

lol.Chat.badges = {};
lol.Chat.setBadge = function(fid,value) {
	// Update badges
	lol.Chat.badges[fid] = value;
	if (value > 99) value = '>99';
	if (fid == lol.FID) {
		// Current figure
		$('#chat').toggleClass('called', value!=0);
		var div = $('#chat > .chatInput > div.call');
		if (!div.length) return; // badge not found
		div.find('.badge').remove(); // remove current badge
		if (!value) return; // no badge to display
		div.html('<span class="round badge">'+value+'</span>');
	}
	else {
		// Try to find the figure in the menu
		var div = $('#user > .menu > a.switch[data-fid="'+fid+'"]');
		if (!div.length) return; // figure not found in the menu
		div.find('.badge').remove(); // remove current badge
		$('#user').find('.badge').remove(); // remove current badge
		if (!value) return; // no badge to display
		div.find('.floatRight').append('<span class="round badge">'+value+'</span>');
		$('#user').append('<span class="round badge noMouse">'+value+'</span>');
	}
};

lol.Chat.prototype.notify = function() {
	for (var i in this.event.figs) {
		var fid = this.event.figs[i];
		lol.Chat.setTalking(fid);
	}
	if (!this.isHighlighted) return;
	for (var i in this.event.figs) {
		var fid = this.event.figs[i];
		var value = lol.Chat.badges[fid];
		if (!value) value = 0;
		lol.Chat.setBadge(fid, value+1);
	}
};

// CONTACT
lol.Chat.contact = null;

lol.Chat.contactHTML = function() {
	var message = '<img class="txt half" src="'+ICONPATH+'/mind.png"> ';
	message+= lol.sprintf(__('contact',lol.Chat.contact.gender), ['']).trim();
	message = '<div class="small italic">'+message+'</div>';
	var html = '<div>';
	var item = '@'+lol.Chat.contact.name.replace(/ /g,' ');
	var className = 'chat hyphen contact';
	html+= '<table class="'+className+'" data-fid="'+lol.Chat.contact.id+'"><tr>';
	html+= '<td class="icon"><button data-item="'+item+'" onclick="lol.Chat.insert(this)">';
	html+= '<img src="/img/unit/'+lol.Chat.contact.icon+'.png"/></button></td>';
	html+= '<td class="msg"><p class="author">'+lol.Chat.contact.name+'</p>';
	html+= message+'</td>';
	html+= '<td class="buttons"><button class="blur" onclick="lol.Chat.hangUp();return ui.cancel(event);">';
	html+= '<img src="'+BTNPATH+'/hangup.png"></button></td>';
	html+= '</tr></table>';
	html+= '</div>';
	return html;
};

lol.Chat.connect = function(event) {
	if (event) {
		if (lol.Chat.sound) ui.Sound.play('contact');
		if (event.figs.indexOf(lol.FID)==-1) return;
		lol.Chat.contact = {
			id:parseInt(event.info[0]),
			name:event.info[1],
			icon:event.info[2],
			gender:parseInt(event.info[3]),
		};
	}
	$('#chatMsg > div > div.chatContact').html(lol.Chat.contactHTML());
	lol.Chat.scrollBottom();
};

lol.Chat.hangUp = function(event) {
	// End telepathic contact
	if (event) {
		if (lol.Chat.sound) ui.Sound.play('disconn');
		if (event.figs.indexOf(lol.FID)==-1) return;
	}
	else {
		if (lol.Chat.sound) ui.Sound.play('hangup');
		mqykkbj('chat',{hangup:null});
	}
	lol.Chat.contact = null;
	$('#chatMsg > div > div.chatContact').html('');
};

// AUTOCOMPLETE
lol.Chat.insertItem = function(item, offset) {
	if (!offset) offset = 0;
	var target = $('#chat textarea').get(0);
	var val = target.value.trim();
	var words = val.split(' ');
	var start = target.selectionStart;
	var lwords = val.substr(0,start).split(' ');
	var index = lwords.length+offset;
	words[index] = item;
	// Make the new string
	val = '';
	for (var i in words) {
		if (!words[i].length) continue;
		val+= words[i]+' ';
		if (i == index) start = val.length;
	}
	target.value = val;
	target.selectionStart = start;
	target.selectionEnd = start;
};

lol.Chat.insert = function(tr) {
	var item = $(tr).attr('data-item');
	lol.Chat.insertItem(item);
};

lol.Chat.replace = function(tr) {
	var item = $(tr).attr('data-item');
	lol.Chat.insertItem(item, -1);
};

lol.Chat.commands = {
'me': '<i>action</i>',
'dice': '<i>1-5</i>',
};

lol.Chat.fidByItem = function() {
	var fids = {};
	// Keywords
	var everyone = __('@everyone').split(',');
	for (var i in everyone) fids[everyone[i]] = 0;
	// Contact
	if (lol.Chat.contact) {
		var item = '@'+lol.Chat.contact.name.replace(/ /g,' ');
		fids[item] = lol.Chat.contact.id;
	}
	// Get the figures in the speaker list
	$('#speakers > .unit').each(function() {
		var id = $(this).attr('data-id');
		var unit = lol.Unit.list[id];
		if (!unit.fid) return;
		var item = '@'+unit.name.replace(/ /g,' ');
		fids[item] = unit.fid;
	});
	// Get the figures already speaking
	$('#chatMsg .chat').each(function() {
		var fid = parseInt($(this).attr('data-fid'));
		var name = $(this).find('.author').text();
		var item = '@'+name.replace(/ /g,' ');
		fids[item] = fid;
	});
	// Get the figures in the grid
	$('#agrid > .units > .unit').each(function() {
		var id = $(this).attr('data-id');
		var unit = lol.Unit.list[id];
		if (!unit.fid) return;
		var item = '@'+unit.name.replace(/ /g,' ');
		fids[item] = unit.fid;
	});
	return fids;
};

lol.Chat.decodeNames = function(message) {
	// Replace @name with links
	return message.replace(/(@[^ <]+)/gi, '<button data-item="$1" onclick="lol.Chat.insert(this)">$1</button>');
};

lol.Chat.showSuggestions = function() {
	// Suggestions
	var target = $('#chat textarea').get(0);
	var val = target.value;
	var start = target.selectionStart;
	var words = val.slice(0,start).split(' ');
	var word = words[words.length-1].toLowerCase();
	var length = word.length;
	var html = '';
	if (length>=3 && word.substr(0,1)==':') {
		// Emojis
		for (var i in lol.BB.emojiList) {
			var item = lol.BB.emojiList[i];
			if (word != item.substr(0,length).toLowerCase()) continue;
			html+= '<tr data-item="'+item+'" onclick="lol.Chat.replace(this)">';
			html+= '<td><b>'+item.substr(0,length)+'</b>'+item.substr(length)+'</td>';
			html+= '<td class="icon">'+lol.BB.decodeEmojis(item)+'</td></tr>';
		}
	}
	if (length>=1 && word.substr(0,1)=='/') {
		// Commands
		for (var item in lol.Chat.commands) {
			var desc = lol.Chat.commands[item];
			var item = '/'+item;
			if (word != item.substr(0,length).toLowerCase()) continue;
			html+= '<tr data-item="'+item+'" onclick="lol.Chat.replace(this)">';
			html+= '<td><b>'+item.substr(0,length)+'</b>'+item.substr(length)+'</td>';
			html+= '<td>'+desc+'</td></tr>';
		}
	}
	if (length>=3 && word.substr(0,1)=='@') {
		// Character name
		var fids = lol.Chat.fidByItem();
		for (var item in fids) {
			if (fids[item] == lol.FID) continue;
			if (word != item.substr(0,length).toLowerCase()) continue;
			html+= '<tr data-item="'+item+'" onclick="lol.Chat.replace(this)">';
			html+= '<td><b>'+item.substr(0,length)+'</b>'+item.substr(length)+'</td>';
		}
	}
	if (!html) return lol.Chat.hideSuggestions();
	// Display the suggestions
	html = '<div><table>'+html+'</table></div>';
	$('#chat .chatSuggest').html(html).css('display','block');
};

lol.Chat.hideSuggestions = function() {
	// Hide the suggestions
	$('#chat .chatSuggest').html('').css('display','none');
};

// Initializing
$(document).ready(function() {

	if (lol.FID) {
		// Set keywords
		var everyone = __('@everyone').split(',');
		for (var i in everyone) lol.Chat.keywords.push(everyone[i]);
		// Add the figures names
		$('#user > .menu > a[data-fid]').each(function() {
			var item = '@'+$(this).text().trim().replace(/ /g,' ');
			lol.Chat.keywords.push(item);
		});
		
		var data = lol.XHR.decode($('#chat').text()).split('$');
		var html = '<div id="chatMsg"><div>';
		html+= '<div class="chatMsg"><div></div></div>';
		html+= '<div class="chatWriters small italic"></div>';
		html+= '<div class="chatContact"></div>';
		html+= '</div></div>';
		html+= '<div class="chatSuggest"></div>';
		html+= '<p class="floatLeft">'+lol.Chat.buttonsHTML()+'</p>';
		html+= '<p class="right">'+lol.BB.buttonsHTML('chat')+'</p>';
		html+= '<div class="chatInput">';
		html+= '<div class="notifs">'+lol.Notif.buttonHTML()+'</div>';
		html+= '<textarea class="monospace bbinput" placeholder="'+__('Chat with characters around you')+'"></textarea>';
		html+= '<div class="call"></div>';
		html+= '<div class="talking">'+lol.Chat.talkingHTML()+'</div>';
		html+= '</div>';
		$('#chat').html(html).removeClass('data');
		for (var i in data) {
			if (!data[i]) continue;
			var event = new lol.Event(data[i]);
			var chat = new lol.Chat(event);
			chat.append();
		}
		if (lol.Chat.contact) lol.Chat.connect();
		for (var fid in lol.Chat.badges) lol.Chat.setBadge(fid, lol.Chat.badges[fid]);	
		
		$('#chat > .chatInput > div.call').click(function() {
			$('#chat textarea').focus();
		});
		$('#chat textarea')
			.focus(function() {
				clearTimeout(lol.Chat.closeTimeout);
				lol.Chat.closeTimeout = null;
				lol.Chat.scrolling = false;
				lol.Chat.open();
				lol.Event.upgrade();
				lol.Chat.showSuggestions();
				lol.Chat.scrollBottom();
			})
			.blur(function() {
				clearTimeout(lol.Chat.closeTimeout);
				lol.Chat.closeTimeout = setTimeout(function() {
					lol.Chat.hideSuggestions();
					lol.Chat.close();
					lol.Chat.scrollBottom();
				}, 500);
			})
			.keypress(function(e) {
				if (e.keyCode == 13) {
					// Select first suggestion
					var tr = $('#chat .chatSuggest tr:first-child');
					if (tr.length) {
						lol.Chat.replace(tr.get(0));
						lol.Chat.hideSuggestions();
					}
					// Send message
					lol.Event.upgrade();
					lol.Chat.send(this.value);
					lol.Chat.scrolling = false;
					this.value = '';
					return ui.cancel(e);
				}
			})
			.keyup(function(e) {
				switch (e.keyCode) {
					case 32:
					case 39:
					// Select first suggestion
					var tr = $('#chat .chatSuggest tr:first-child');
					if (tr.length) {
						lol.Chat.replace(tr.get(0));
						lol.Chat.hideSuggestions();
						return ui.cancel(e);
					}
				}
				lol.Chat.write(this.value);
				lol.Chat.showSuggestions();
			});
			
		$('#chatMsg > div').scroll(function(e) {
			var top = $(this).scrollTop();
			var height = $(this).height();
			var height2 = $(this).find('div').height();
			if (height2>top+height) {
				lol.Chat.scrolling = true;
			}
			if (top == 0) {
				lol.Chat.more();
			}
		});
						
		$(window)
		.resize(lol.Chat.layout)
		.on('orientationchange', lol.Chat.layout);
		lol.Chat.layout();
	}

});


// Event listeners
lol.Event.addListener('write', lol.Chat.isWriting);
lol.Event.addListener('chat', lol.Chat.newEvent);
lol.Event.addListener('off', lol.Chat.newEvent);
lol.Event.addListener('me', lol.Chat.newEvent);
lol.Event.addListener('sep', lol.Chat.newEvent);
lol.Event.addListener('enter', lol.Chat.newEvent);
lol.Event.addListener('exit', lol.Chat.newEvent);
lol.Event.addListener('dice', lol.Chat.newEvent);
lol.Event.addListener('gift', lol.Chat.newEvent);

lol.Event.addListener('contact', lol.Chat.connect);
lol.Event.addListener('hangup', lol.Chat.hangUp);



lol.Chat.chatMessageHTML = function(event) {
	// Default chat message
	var message = lol.str(event.info[3]);
	message = lol.BB.decode(message,'chat');
	message = lol.Chat.decodeNames(message);
	return message;
};

lol.Chat.offMessageHTML = function(event) {
	// Off message
	var message = lol.str(event.info[3]);
	message = lol.BB.decode(message,'chat');
	message = lol.Chat.decodeNames(message);
	return '<div class="gray">'+message+'</div>';
};

lol.Chat.meMessageHTML = function(event) {
	// Personal action
	var message = lol.str(event.info[3]);
	message = lol.BB.decode(message,'action');
	message = lol.Chat.decodeNames(message);
	return '<div class="small italic">'+message+'</div>';
};

lol.Chat.sepHTML = function(chat) {
	return '<div class="sep"></div>';
};


lol.Chat.sounds['enter'] = 'ding';
lol.Chat.enterMessageHTML = function(event) {
	// A character entered the room
	var gender = parseInt(event.info[3]);
	var message = '<img class="txt half" src="'+ICONPATH+'/enter.png"> ';
	message+= lol.sprintf(__('enter',gender), ['']).trim();
	return '<div class="small italic">'+message+'</div>';
};

lol.Chat.sounds['exit'] = 'ding';
lol.Chat.exitMessageHTML = function(event) {
	// A character has left the room
	var gender = parseInt(event.info[3]);
	var message = '<img class="txt half" src="'+ICONPATH+'/exit.png"> ';
	message+= lol.sprintf(__('exit',gender), ['']).trim();
	return '<div class="small italic">'+message+'</div>';
};


lol.Chat.sounds['dice'] = 'dices';
lol.Chat.diceMessageHTML = function(event) {
	// Random dices
	var html = '<div>';
	var dices = event.info[3];
	var n = dices.length;
	for (var i=0; i<n; i++) {
		var dice = dices.substr(i,1);
		html+= '<img class="sticker" src="/img/emoji/dice'+dice+'.png" title="'+dice+'"/> ';
	}
	html+= '</div>';
	return html;
};

lol.Chat.sounds['gift'] = 'done';
lol.Chat.giftMessageHTML = function(event) {
	// Send a gift
	var info = lol.str(event.info[3]);
	info = lol.Chat.decodeNames(info);
	var html = '<div class="small italic">';
	html+= '<img class="txt" src="'+ICONPATH+'/gift.png"> '+info;
	html+= '</div>';
	return html;
};


lol.Map = {
	width: 80000,
	height: 80000,
	minZoom: 1.0,
	maxZoom: 200.0,
	noZoom: false,
	dx: {N:0,E:1,S:0,W:-1,0:-1,1:1,2:-1,3:1,n:0,e:0.5,s:0,w:-0.5,4:-0.5,5:0.5,6:-0.5,7:0.5},
	dy: {N:-1,E:0,S:1,W:0,0:-1,1:-1,2:1,3:1,n:-0.5,e:0,s:0.5,w:0,4:-0.5,5:-0.5,6:0.5,7:0.5},
	cellWidth: 40,
	tileWidth: 640,
};

lol.Map.mode = '1';
lol.Map.coords = null;
lol.Map.zoom = 1.0;
lol.Map.wheelZoom = false;

lol.Map.coordsToString = function(x,y,sep) {
	// Return a string containing the passed coordinates
	x = Math.floor(x);
	y = Math.floor(y);
	return lol.pad0(x<0? -x:x+1, 5)+(x<0? 'W':'E')+(sep?':':'')+lol.pad0(y<0? -y:y+1, 5)+(y<0? 'N':'S');
};

lol.Map.coordsFromString = function(s) {
	// Return coords from string or null if invalid
	var coords = s.split(':');
	if (coords.length != 2) return null;
	if (coords[0].length == 0) return null;
	if (coords[1].length == 0) return null;
	var x = parseInt(coords[0],10);
	var y = parseInt(coords[1],10);
	if (x <= 0) return null;
	if (y <= 0) return null;
	if (x > 99999) return null;
	if (y > 99999) return null;
	switch (coords[0].substr(coords[0].length-1,1)) {
		case 'W': x = -x; break;
		case 'E': x = x-1; break;
		default: return null;
	}
	switch (coords[1].substr(coords[0].length-1,1)) {
		case 'N': y = -y; break;
		case 'S': y = y-1; break;
		default: return null;
	}
	return {x:x,y:y};
};

lol.Map.path = function(path,rand) {
	path = path.split(':');
	var x = parseInt(path[0]);
	var y = parseInt(path[1]);
	var dirs = path[2];
	var d = 'M'+(rand?x+(Math.abs(y)%9-4.5)*0.03:x)+','+(rand?y+(Math.abs(x)%9-4.5)*0.03:y);
	for (var i=0; i<dirs.length; i++) {
		var dir = dirs.substr(i,1);
		x+= lol.Map.dx[dir];
		y+= lol.Map.dy[dir];
		d+= ' L'+(rand?x+(Math.abs(y)%9-4.5)*0.03:x)+','+(rand?y+(Math.abs(x)%9-4.5)*0.03:y);
	}
	return d;
};

lol.Map.info = null; // current map info
lol.Map.deprecatedTimeout = null;
lol.Map.updateWithData = function(data, anim) {
	data = data.split('#');
	
	// Parsing weather
	var weather = data[0].split('|');
	var wsymbol = weather[0];
	var temp = parseInt(weather[1]);
	$('#weather').css('background-image','url('+SKINPATH+'/weather/'+wsymbol+'.png)')
		.html(''+temp+'<small>°C</small>');

	// Management
	var mgmts = data[1].split('$');
	var html = '';
	for (var i in mgmts) {
		if (!mgmts[i]) continue;
		var mgmt = mgmts[i].split('|');
		html+= '<div class="round">';
		html+= '<img class="round pointer" onclick="lol.go(\'/arm/org/'+mgmt[0]+'\')"';
		html+= ' src="/img/herald/'+mgmt[1]+'.st.jpg" title="'+mgmt[2]+'">';
		var mgmtFin = parseInt(mgmt[3]);
		var mgmtUnit = parseInt(mgmt[4]);
		var mgmtBuild = parseInt(mgmt[5]);
		var mgmtTrade = parseInt(mgmt[6]);
		html+= ' <div class="mgmtbtns">';
		if (mgmtFin) html+= '<a class="blur" href="/mgmt/'+mgmt[0]+'/finances"><img class="round" src="'+BTNPATH+'/fin.png"></a> ';
		else html+= '<img class="round blur" src="'+BTNPATH+'/black.png"> ';
		if (mgmtUnit) html+= '<a class="blur" href="/mgmt/'+mgmt[0]+'/units"><img class="round" src="'+BTNPATH+'/unit.png"></a><br>';
		else html+= '<img class="round blur" src="'+BTNPATH+'/black.png"><br>';
		if (mgmtBuild) html+= '<a class="blur" href="/mgmt/'+mgmt[0]+'/buildings"><img class="round" src="'+BTNPATH+'/bld.png"></a> ';
		else html+= '<img class="round blur" src="'+BTNPATH+'/black.png"> ';
		if (mgmtTrade) html+= '<a class="blur" href="/mgmt/'+mgmt[0]+'/resources"><img class="round" src="'+BTNPATH+'/res.png"></a>';
		else html+= '<img class="round blur" src="'+BTNPATH+'/black.png">';
		html+= '</div>';
		html+= '</div>';
	}
	$('#mapMgmt').html(html);
		
	// Parsing info
	var n = 0;
	var info = data[2].split('|');
	var x = parseInt(info[n++]);
	var y = parseInt(info[n++]);
	var w = parseInt(info[n++]);
	var h = parseInt(info[n++]);
	var zoom = parseInt(info[n++]);
	var mode = info[n++];
	var tx0 = parseInt(info[n++]);
	var ty0 = parseInt(info[n++]);
	var tw = parseInt(info[n++]);
	var th = parseInt(info[n++]);
	var group = parseInt(mode);
	// Map bounds
	var mtx0 = tx0 - tw;
	var mty0 = ty0 - th;
	var mtw = tw*3;
	var mth = th*3;
	lol.Map.info = {
		x:x,y:y,w:w,h:h,zoom:zoom,
		tx0:tx0,ty0:ty0,tw:tw,th:th,
		mtx0:mtx0,mty0:mty0,mtw:mtw,mth:mth
	};

	var div = $('#map .map');
	var divWidth = div.width();
	var divHeight = div.height();

	// Tiles data
	var tcoords = {};
	var tiles = data[3].split('$');
	div.children('.tile.new').remove(); // remove unloaded tiles
	div.children('.tile.brd').remove(); // remove previous borders
	div.children('.tile').addClass('deprecated'); // all existing tiles will be removed
	var tileWidth = 100.0*zoom*16/lol.Map.width;
	var tileHeight = 100.0*zoom*16/lol.Map.height;
	for (var i in tiles) {
		if (!tiles[i]) continue;
		var tile = tiles[i].split('|');
		var ttag = tile[0];
		var tx = parseInt(tile[1]);
		var ty = parseInt(tile[2]);
		var version = parseInt(tile[3]);
		var bversion = parseInt(tile[4]);
		var released = parseInt(tile[5]);
		var left = 100.0*(tx*16+lol.Map.width/2)/lol.Map.width;
		var top = 100.0*(ty*16+lol.Map.height/2)/lol.Map.height;
		var key = 'tile:'+tx+':'+ty+':'+zoom+':'+version;
		var src = '/img/tile/'+ttag+'.'+zoom+'.'+version+(released?'':'.unreleased')+'.jpg';
		var style = 'left:'+left+'%;top:'+top+'%;width:'+tileWidth+'%;height:'+tileHeight+'%;';
		var html = '<img class="tile new" style="'+style+(anim?'display:none;':'')+'" src="'+src+'" data-key="'+key+'"/>';
		div.append(html);
		if (group && bversion) {
			var key = 'tile:'+tx+':'+ty+':'+zoom+':'+group+':'+bversion;
			var src = '/img/tile/'+ttag+'.'+zoom+'.'+group+'.'+bversion+'.png';
			var html = '<img class="tile brd noMouse" style="'+style+'" src="'+src+'" data-key="'+key+'"/>';
		}
		div.append(html);
		tcoords[''+tx+':'+ty] = true;
	}
	// Fill holes with ocean
	for (var tx=tx0; tx<tx0+tw; tx+= zoom)
		for (var ty=ty0; ty<ty0+th; ty+= zoom) {
			if (tcoords[''+tx+':'+ty]) continue;
			var left = 100.0*(tx*16+lol.Map.width/2)/lol.Map.width;
			var top = 100.0*(ty*16+lol.Map.height/2)/lol.Map.height;
			var key = 'tile:'+tx+':'+ty+':'+zoom+':0';
			var src = '/img/tile/'+Math.abs((tx/zoom)%2)+Math.abs((ty/zoom)%2)+'.'+zoom+'.0.jpg';
			var style = 'left:'+left+'%;top:'+top+'%;width:'+tileWidth+'%;height:'+tileHeight+'%;';
			var html = '<img class="tile new" style="'+style+(anim?'display:none;':'')+'" src="'+src+'" data-key="'+key+'"/>';
			div.append(html);
		}
		
	// Domains
	console.log(data[4]);
	var doms = data[4].split('$');
	div.children('.zone').remove();
	for (var i in doms) {
		if (!doms[i]) continue;
		var dom = doms[i].split('|');
		var x = parseInt(dom[0]);
		var y = parseInt(dom[1]);
		var id = parseInt(dom[2]);
		var housing = parseInt(dom[3]);
		// Calculate radiuses
		var radiuses = [];
		var radius1 = Math.min(8, 0.050*Math.sqrt(housing)); if (radius1 > 0) radiuses.push(radius1);
		var radius2 = Math.min(16, 0.075*Math.sqrt(housing)); if (radius2 != radius1) radiuses.push(radius2);
		var radius3 = Math.min(24, 0.100*Math.sqrt(housing)); if (radius3 != radius2) radiuses.push(radius3);
		for (var j in radiuses) {
			var radius = radiuses[j];
			var r = (radius+0.5)*lol.Map.cellWidth;
			var svg = ui.SVG.makeCanvas(2*r, 2*r);
			ui.SVG.circle(svg, '50%','50%','50%', {fill:'none', stroke:'rgba(128,128,128,0.66)', 'stroke-width':2, 'stroke-dasharray': '2,2'});
			var w = 100.0*zoom*(radius+0.5)*2/lol.Map.width;
			var h = 100.0*zoom*(radius+0.5)*2/lol.Map.height;
			var left = 100.0*(x-radius+lol.Map.width/2)/lol.Map.width;
			var top = 100.0*(y-radius+lol.Map.height/2)/lol.Map.height;
			var key = ''+id+':'+radius;
			var style = 'left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%;';
			var html = '<div class="zone" style="'+style+'" data-key="'+key+'"></div>';
			div.append(html);
			$(div).children('.zone[data-key="'+key+'"]').html(svg);
		}
	}
	
	// Organizations
	var orgs = data[5].split('$');
	div.children('.label').remove();
	for (var i in orgs) {
		if (!orgs[i]) continue;
		var org = orgs[i].split('|');
		var x = parseInt(org[0]);
		var y = parseInt(org[1]);
		var crest = org[2];
		var name = org[3];
		var blazon = org[4];
		var left = 100.0*(x+lol.Map.width/2)*lol.Map.cellWidth/lol.Map.zoom/divWidth;
		var top = 100.0*(y+lol.Map.height/2)*lol.Map.cellWidth/lol.Map.zoom/divHeight;
		var style = 'left:'+left+'%;top:'+top+'%;';
		var html = '<div class="label" style="'+style+'">';
		if (crest.length) html+= '<img class="crest" src="/img/crest/'+crest+'.sh.png"/>';
		html+= '<img class="blz" src="/img/herald/'+blazon+'.sh.png"/>';
		html+= '<p class="old uppercase round txt ellipsis">'+name+'</p></div>';
		div.append(html);
	}
		
	var cellWidth = 100.0*lol.Map.cellWidth/divWidth*zoom/lol.Map.zoom;
	var cellHeight = 100.0*lol.Map.cellWidth/divHeight*zoom/lol.Map.zoom;

	// Units
	var unitGroups = data[6].split('$');
	div.children('.units').remove();
	for (var i in unitGroups) {
		if (!unitGroups[i]) continue;
		var units = unitGroups[i].split('|');
		var x = parseInt(units[0]);
		var y = parseInt(units[1]);
		var n = Math.min(parseInt(units[2]),9);
		var left = 100.0*(x-0.25+lol.Map.width/2)*lol.Map.cellWidth/lol.Map.zoom/divWidth;
		var top = 100.0*(y-0.25+lol.Map.height/2)*lol.Map.cellWidth/lol.Map.zoom/divHeight;
		var style = 'left:'+left+'%;top:'+top+'%;width:'+(cellWidth*1.5)+'%;height:'+(cellHeight*1.5)+'%;';
		var html = '<img class="units noMouse" style="'+style+'" src="/img/map/units'+n+'.gif"/>';
		div.append(html);
	}

	// Routes
	var routes = data[7].split('$');
	div.children('.route').remove();
	for (var i in routes) {
		if (!routes[i]) continue;
		var route = routes[i].split('|');
		var x = parseInt(route[0]);
		var y = parseInt(route[1]);
		var type = route[2];
		var title = __('route.'+type);
		var left = 100.0*(x-0.25+lol.Map.width/2)*lol.Map.cellWidth/lol.Map.zoom/divWidth;
		var top = 100.0*(y-0.25+lol.Map.height/2)*lol.Map.cellWidth/lol.Map.zoom/divHeight;
		var style = 'left:'+left+'%;top:'+top+'%;width:'+(cellWidth*1.5)+'%;height:'+(cellHeight*1.5)+'%;';
		var html = '<img class="route" style="'+style+'" src="/img/map/route.png" title="'+title+'"/>';
		div.append(html);
	}
	
	// Actions (alerts)
	var actions = data[8].split('$');
	div.children('.act').remove();
	for (var i in actions) {
		if (!actions[i]) continue;
		var action = actions[i].split('|');
		var x = parseInt(action[0]);
		var y = parseInt(action[1]);
		var type = action[2];
		var title = __('act.'+type);
		var left = 100.0*(x-0.25+lol.Map.width/2)*lol.Map.cellWidth/lol.Map.zoom/divWidth;
		var top = 100.0*(y-0.25+lol.Map.height/2)*lol.Map.cellWidth/lol.Map.zoom/divHeight;
		var style = 'left:'+left+'%;top:'+top+'%;width:'+(cellWidth*1.5)+'%;height:'+(cellHeight*1.5)+'%;';
		var html = '<img class="act" style="'+style+'" src="/img/map/act/'+type+'.gif" title="'+title+'"/>';
		div.append(html);
	}

	if (anim) {
		// Display image when loaded
		div.children('img.new').load(function() {
			// The image has just finished loading
			$(this).fadeIn(400, function() {
				// remove any equivalent deprecated image
				if ($(this).is('.deprecated')) return;
				var key = $(this).attr('data-key');
				div.children('.deprecated[data-key="'+key+'"]').remove();
			});
		});
	}

	div.children('img.new').removeClass('new');
	// Remove all deprecated images after timeout
	clearTimeout(lol.Map.deprecatedTimeout);
    lol.Map.deprecatedTimeout = setTimeout(function() {
    	div.children('.deprecated').remove();
    }, 3000);
};


lol.Weather = function(data) {
	// Initialize a weather object
	var n = 0;
	var data = data.split(':');
	this.symbol = data[n++];
	this.temp = parseInt(data[n++]);
};

lol.Weather.current = null;

lol.Weather.prototype.update = function() {
	// Update the weather display
	$('#WeatherSymbol').attr('src', SKINPATH+'/weather/'+this.symbol+'.jpg');
	$('#WeatherTemp').text(''+this.temp+' °C');
};

lol.Weather.refresh = function() {
	// Refresh the weather
	mqykkbj('map',{weather:null,x:lol.Map.coords.x,y:lol.Map.coords.y}, function(data) {
		lol.Weather.current = new lol.Weather(lol.XHR.decode(data));
		lol.Weather.current.update();
	}, true);
};


$(document).ready(function() {
	var weather = $('#Weather');
	if (weather.length) {
		// Create current weather
		lol.Weather.current = new lol.Weather(lol.XHR.decode(weather.text()));

		// HTML code for the weather content
		var html = '<img id="WeatherSymbol"/>'
		+ '<div id="WeatherTemp"></div>';
		
		$('#Weather')
			.css('width', '256px')
			.css('height', '100px')
			.css('overflow', 'hidden')
			.css('position', 'relative')
			.html(html);
		$('#Weather > *')
			.css('position', 'absolute');
		$('#WeatherTemp')
			.css('right', '50px')
			.css('top', '30px')
			.css('font-size', '24px')
			.css('color', 'rgba(255,255,255,0.5)');
			
		// Update the weather with data
		lol.Weather.current.update();
	}
});


lol.Unit = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a unit
	var n = 0;
	var data = data.split(sep);
	this.id = parseInt(data[n++]);
	if (data.length > 1) {
		// Minimum data
		this.type = data[n++];
		this.typeName = data[n++];
		this.name = data[n++];
		this.icon = data[n++];
		this.isLoaded = true;
	}
	else {
		this.icon = 'x';
		this.isLoaded = false;
	}
	if (data.length > 3) {
		// Extended data
		this.state = parseFloat(data[n++]);
		this.stunned = parseInt(data[n++]);
		this.happiness = parseFloat(data[n++]);
		this.tendency = parseFloat(data[n++]);
		this.lifespan = parseInt(data[n++]);
		this.age = parseInt(data[n++]);
		this.isDying = this.lifespan && this.age > this.lifespan;
		this.level = parseInt(data[n++]);
		this.fid = parseInt(data[n++]);
		this.blazon = data[n++];
		this.canControl = parseInt(data[n++])?true:false;
		this.canManage = this.canControl;
		this.canDelete = parseInt(data[n++])?true:false;
		this.canDrag = true; // can drag any unit
		this.isIncompatible = parseInt(data[n++])?true:false;
		this.isOnline = parseInt(data[n++])?true:false;
		this.isSelected = parseInt(data[n++])?true:false;
		this.isCaptain = parseInt(data[n++])?true:false;
		this.isPrisoner = parseInt(data[n++])?true:false;
		this.isEthereal = parseInt(data[n++])?true:false;
		this.isRelic = parseInt(data[n++])?true:false;
		this.isConflict = parseInt(data[n++])?true:false;
		this.isOnStrike = parseInt(data[n++])?true:false;
		this.slot = parseInt(data[n++]);
		this.actId = parseInt(data[n++]);
		this.isMoving = parseInt(data[n++])?true:false;
		this.coords = {x:parseInt(data[n++]),y:parseInt(data[n++])};
		this.money = parseFloat(data[n++]);
		this.rank = parseInt(data[n++]);
		// Unit owner
		this.owner = {
			id: parseInt(data[n++]),
			blazon: data[n++],
			name: data[n++],
		};
	}
	if (!this.id) this.id = '*'+lol.Unit.defaultId++;
	lol.Unit.list[this.id] = this;
	if (this.fid) lol.Unit.listByFID[this.fid] = this;
};

lol.Unit.prototype.moreData = function(data, sep) {
	if (!sep) sep = '|';
	// Set additional data
	var n = 0;
	var data = data.split(sep);
	var id = parseInt(data[n++]);
	if (id != this.id) return; // wrong id
	this.fullName = data[n++];
	this.legend = data[n++];
	// Languages
	var langs = data[n++];
	if (langs) {
		this.langs = langs.split(',');
	}
	// Tied unit
	var tied = data[n++];
	if (tied) {
		tied = tied.split(':');
		this.tied = {
			id:parseInt(tied[0]),
			icon:tied[1],
			name:tied[2]
		};
	}
	// Captain
	var captain = data[n++];
	if (captain) {
		captain = captain.split(':');
		this.captain = {
			id:parseInt(captain[0]),
			icon:captain[1],
			name:captain[2]
		};
	}
	// Company
	this.company = [];
	var company = data[n++];
	if (company) {
		company = company.split(',');
		for (var i in company) {
			if (!company[i]) continue;
			var unit = company[i].split(':');
			this.company.push({
				id:parseInt(unit[0]),
				icon:unit[1],
				name:unit[2]
			});
		}
	}
	// XP progress
	this.xpProgress = parseFloat(data[n++]);
	// Statistics
	this.stats = {
		st:parseInt(data[n++]),
		ag:parseInt(data[n++]),
		co:parseInt(data[n++]),
		in:parseInt(data[n++]),
		wi:parseInt(data[n++]),
		ch:parseInt(data[n++]),
	};
	// Various information
	this.carriedWeight = parseInt(data[n++]);
	this.carriageCapacity = parseInt(data[n++]);
	this.pace = parseInt(data[n++]);
	this.isUntouchable = parseInt(data[n++])?true:false;
	this.def = {
		melee:parseInt(data[n++]),
		polearm:parseInt(data[n++]),
		ranged:parseInt(data[n++]),
		dist:parseInt(data[n++]),
	};
	// Attack penalty
	this.attackPenalty = parseInt(data[n++]);
	// Action control
	this.canEnableAuto = parseInt(data[n++])?true:false;
	this.isAutoEnabled = parseInt(data[n++])?true:false;
	// Leaderships
	this.leaderships = [];
	var leaderships = data[n++].split(',');
	for (var i in leaderships) {
		if (!leaderships[i]) continue;
		var leadership = leaderships[i].split(':');
		this.leaderships.push({
			name:leadership[0],
			bonus:parseInt(leadership[1]),
			x:parseInt(leadership[2]),
			y:parseInt(leadership[3])
		});
	}
	// Equipment
	this.equipment = [];
	var equipment = data[n++].split(',');
	for (var i in equipment) {
		if (!equipment[i]) continue;
		var res = equipment[i].split(':');
		this.equipment.push({
			type:res[0],
			name:res[1],
			quantity:parseInt(res[2]),
			quality:parseFloat(res[3])
		});
	}
	// Skills
	this.skills = [];
	var skills = data[n++].split(',');
	for (var i in skills) {
		if (!skills[i]) continue;
		var skill = skills[i].split(':');
		this.skills.push({
			type:skill[0],
			name:skill[1],
			bonus:parseInt(skill[2]),
			bonus2:parseInt(skill[3])
		});
	}
	// Automatic actions
	this.auto = [];
	var auto = data[n++].split(',');
	for (var i in auto) {
		if (!auto[i]) continue;
		var act = auto[i].split(':');
		this.auto.push({
			name:act[0],
			subtitle:act[1]
		});
	}
	// Consumption
	this.consumption = [];
	var consumption = data[n++].split(',');
	for (var i in consumption) {
		if (!consumption[i]) continue;
		var cons = consumption[i].split(':');
		this.consumption.push({
			type:cons[0],
			name:cons[1],
			quality:cons[2],
		});
	}
	// Resources
	this.resources = [];
	var resources = data[n++].split(',');
	for (var i in resources) {
		if (!resources[i]) continue;
		var res = resources[i].split(':');
		this.resources.push({
			type:res[0],
			name:res[1],
			quality:parseFloat(res[2]),
			quantity:parseFloat(res[3]),
			unit:res[4],
		});
	}
	// Strikes
	this.strikes = [];
	var strikes = data[n++].split(',');
	for (var i in strikes) {
		if (!strikes[i]) continue;
		var strike = new lol.ActionLink(strikes[i]);
		this.strikes.push(strike);
	}
	// Menu
	this.menu = [];
	var menuData = data[n++].split(',');
	for (var i in menuData) {
		var interaction = new lol.Interaction(null,this,menuData[i]);
		this.menu.push(interaction);
	}
};

lol.Unit.defaultId = 1;
lol.Unit.list = {};
lol.Unit.listByFID = {};

lol.Unit.load = function(data,sep) {
	// Return a unit with passed id
	var unit = lol.Unit.list[data];
	if (!unit) unit = new lol.Unit(data, sep);
	if (!unit.isLoaded) mqykkbj('unit',{id:unit.id},function(data) {
		if (!data) return; // invalid data
		var unit = new lol.Unit(lol.XHR.decode(data));
		if (lol.Area) $('#agrid .unit[data-id="'+unit.id+'"]').html(lol.Area.unit.contentHTML(unit));
		$('.acticon[data-unit-id="'+unit.id+'"]').replaceWith(unit.actionIconHTML());
	}, true);
	return unit;
};

lol.Unit.prototype.reload = function() {
	// Reload a unit
	mqykkbj('unit',{id:this.id},function(data) {
		if (!data) return; // invalid data
		var unit = new lol.Unit(lol.XHR.decode(data));
		if (lol.Area) lol.Area.unit.list[unit.id] = unit;
		// Updating 
		unit.updateInfoIfNeeded();
		unit.updateAction();
		unit.appendToSelection();
		if (unit.isSelected) {
			// Update the new actions list
			lol.Unit.updateSelection();
		}
		// Tooltips
		
	}, true);
	return null;
};

lol.Unit.prototype.update = function(data,sep) {
	// Update a unit
	if (!sep) sep = '|';
	var n = 0;
	var data = data.split(sep);
	this.icon = data[n++];
	this.state = parseFloat(data[n++]);
	this.stunned = parseInt(data[n++]);
	this.isIncompatible = parseInt(data[n++])?true:false;
	this.isOnline = parseInt(data[n++])?true:false;
	this.isSelected = parseInt(data[n++])?true:false;
	this.isCaptain = parseInt(data[n++])?true:false;
	this.isPrisoner = parseInt(data[n++])?true:false;
	this.isEthereal = parseInt(data[n++])?true:false;
	this.isRelic = parseInt(data[n++])?true:false;
	this.isConflict = parseInt(data[n++])?true:false;
	this.isOnStrike = parseInt(data[n++])?true:false;
	this.actId = parseInt(data[n++]);
	this.isMoving = parseInt(data[n++])?true:false;
	// Additional information that would require a reload
	if (this.type != data[n++]) return this.reload();
	if (this.owner.id != parseFloat(data[n++])) return this.reload();
	return this;
};

// ATTRIBUTES
lol.Unit.stateAsString = function(state) {
	return __('ustate.'+Math.round(state*4));
};

lol.Unit.stateHTML = function(state, isDying, cluster) {
	var p = Math.round(state*100);
	var title = lol.Unit.stateAsString(state)+' ('+p+'%)';
	var className = 'state'+(cluster?'':' round')+(isDying?' dying':'');
	var html = '<div class="'+className+'" title="'+title+'">';
	html+= '<div style="width:'+(state*100)+'%"></div></div>';
	return html;
};

lol.Unit.happinessAsString = function(happiness) {
	return __('happiness.'+Math.max(0,Math.min(5,Math.round(happiness*5))));
};

lol.Unit.happinessHTML = function(happiness, tendency, cluster) {
	var p = Math.round(happiness*100);
	var title = lol.Unit.happinessAsString(happiness)+' ('+p+'%)';
	var className = 'happiness'+(cluster?' roundBottom':' round');
	var html = '<div class="'+className+'" title="'+title+'">';
	if (cluster && happiness > tendency) {
		html+= '<span title="-'+Math.round((happiness-tendency)*100)+'%">';
		var t = Math.min(5,Math.ceil((happiness-tendency)*10));
		while (t--) html+= '<img class="txt" src="'+ICONPATH+'/loose.png"/>';
		html+= '</span>';
	}
	var h = Math.max(0,Math.min(5,Math.round(happiness*5)));
	html+= ' <img class="txt" src="'+ICONPATH+'/happiness.'+h+'.png"> ';
	if (cluster && happiness < tendency) {
		html+= '<span title="+'+Math.round((tendency-happiness)*100)+'%">';
		var t = Math.min(5,Math.ceil((tendency-happiness)*10));
		while (t--) html+= '<img class="txt" src="'+ICONPATH+'/recover.png"/>';
		html+= '</span>';
	}
	html+= '</div>';
	return html;
};

lol.Unit.lifespanHTML = function(lifespan, age, cluster) {
	var life = lifespan? Math.min(1.0, age/lifespan):0;
	var title = ''+age+(lifespan?' / '+lifespan:'');
	if (lifespan > age) title+= ' ('+lol.sprintf(__('%d days left'),[lifespan-age])+')';
	var className = 'lifespan'+(cluster?' roundTop':' round');
	var html = '<div class="'+className+'" title="'+title+'">';
	html+= '<div style="width:'+(life*100)+'%"></div></div>';
	return html;
};

lol.Unit.stunnedAsString = function(stunned) {
	var d = stunned - lol.Time.now;
	if (d <= 0) return '';
	return __('stunned for')+' '+lol.Time.delay(d);
};

lol.Unit.stunnedHTML = function(stunned) {
	if (stunned <= lol.Time.now) return '';
	var title = lol.Unit.stunnedAsString(stunned);
	var html = '<div class="stun" title="'+title+'">';
	html+= '<img class="txt" src="'+ICONPATH+'/stunned.gif">';
	html+= ' <span class="delay" data-refresh="'+stunned+'">'+lol.Time.delay(stunned-lol.Time.now)+'</span>';
	html+= '</div>';
	return html;
};

lol.Unit.bonus = function(bonus) {
	// Return the bonus as a string
	var className = 'gray';
	if (bonus < 0) className = 'red';
	if (bonus > 0) className = 'green';
	if (bonus >= 0) bonus = '+'+bonus;
	return '<span class="'+className+'">'+bonus+'</span>';
};

// ACTIONS
lol.Unit.prototype.action = function() {
	if (!this.actId) return null;
	return lol.Action.list[this.actId];
};

lol.Unit.prototype.updateAction = function() {
	var act = this.action();
	if (act) act.recalc = 1;
};

lol.Unit.prototype.toggleAuto = function(button, enabled) {
	// Enable or disable automatic action
	var unit = this;
	mqykkbj('unit', {id:unit.id, auto:(enabled?1:0)}, function(data) {
		unit.moreData(lol.XHR.decode(data));
		$(button).closest('.uinfo').html(unit.infoHTML());
		lol.modal.update();
	}, true);
};

lol.Unit.prototype.release = function(button) {
	// Release unit from current action
	if (!this.actId) return;
	var act = lol.Action.list[this.actId];
	if (!act) return;
	act.releaseUnit(this);	
};

lol.Unit.prototype.canMove = function() {
	// Return true if the unit can move
	if (!this.state) return false; // down
	if (!this.canControl) return false;  // not controlable
	if (this.stunned>lol.Time.now) return false; // stunned
	return true;
};

lol.Unit.prototype.canMoveOut = function() {
	// Return true if the unit can move out
	if (this.actId) return false; // busy
	return this.canMove();
};

lol.Unit.prototype.canInteract = function(target) {
	// Return true if the unit can attack the target
	// Passed list must contain the list of units around
	if (!target) return false; // no target
	if (target == this) return false; // cannot interact with self
	if (target.isMoving) return false; // target is moving
	if (this.actId) return false; // busy
	return this.canMove();
};

lol.Unit.prototype.isIntruder = function() {
	return true;
};

// SELECTION
lol.Unit.sel = '';
lol.Unit.setSelected = function(id, isSelected) {
	// Update the inline selection
	var selIds = lol.Unit.sel.split(',');
	if (isSelected) while (selIds.length >= 100) {
		lol.Unit.setSelected(selIds[0], false);
		selIds = lol.Unit.sel.split(',');
	}
	lol.Unit.sel = '';
	for (var i in selIds) {
		var unitId = selIds[i];
		if (unitId == id) continue;
		if (lol.Unit.sel) lol.Unit.sel+= ',';
		lol.Unit.sel+= unitId;
	}
	if (isSelected) {
		if (lol.Unit.sel) lol.Unit.sel+= ',';
		lol.Unit.sel+= id;
	}
	// Update the unit object
	var unit = lol.Unit.list[id];
	if (unit) {
		// Update the unit icons
		if (unit.isSelected == isSelected) return false;
		unit.isSelected = isSelected;
		if (isSelected) {
			// Set the unit icons selected
			$('.unit[data-id="'+id+'"]').addClass('selecting').removeClass('deselecting');
			unit.appendToSelection(true);
		}
		else {
			// Set the unit icons not selected
			$('.unit[data-id="'+id+'"]').addClass('deselecting').removeClass('selecting').removeClass('selected');
		}
		lol.Unit.updateSelectAllButton();
		lol.Search.setSelected(id,isSelected);
		return true;
	}
	if (isSelected) {
		// Load the unit
		mqykkbj('unit', {id:id}, function(data) {
			if (!data) return;
			data = lol.XHR.decode(data);
			new lol.Unit(data);
			lol.Unit.setSelected(id,isSelected);
			lol.Unit.selectionDidChange();
		}, true);
		return false;
	}
	return true;
};

lol.Unit.prototype.setSelected = function(isSelected) {
	// Set the unit selected and return true if selection has changed
	return lol.Unit.setSelected(this.id, isSelected);
};

lol.Unit.onSelection = function() {
	// Update the selection
	mqykkbj('session',{sel:lol.Unit.sel});
};

lol.Unit.selectionTimeout = null;
lol.Unit.updateSelection = function() {
	// Change selection in session variable
	lol.Unit.onSelection();
	$('.unit[data-id].selecting').addClass('selected').removeClass('selecting');
	$('.unit[data-id].deselecting').removeClass('deselecting');
	clearTimeout(lol.Unit.selectionTimeout);
	lol.Unit.selectionTimeout = null;
};

lol.Unit.selectionDidChange = function() {
	clearTimeout(lol.Unit.selectionTimeout);
	lol.Unit.selectionTimeout = setTimeout(lol.Unit.updateSelection, lol.Premium?500:1000);
};

// SELECTION ICONS
lol.Unit.selection = {};

lol.Unit.selection.holdClickTimer = null;
lol.Unit.selection.startClick = function(e) {
	if (!ui.leftButton(e)) return;
	var unit = lol.Unit.list[$(this).attr('data-id')];
	// Restart hold click timer
	clearTimeout(lol.Unit.selection.holdClickTimer);
	lol.Unit.selection.holdClickTimer = setTimeout(function() {
		lol.Unit.selection.holdClickTimer = null;
		unit.showInfo();
	}, lol.Premium? 500:800);
	return ui.cancel(e);
};

lol.Unit.selection.endClick = function(e) {
	if (!ui.leftButton(e)) return;
	if (lol.Unit.selection.holdClickTimer) {
		// Select or deselect the unit
		clearTimeout(lol.Unit.selection.holdClickTimer);
		lol.Unit.selection.holdClickTimer = null;
		var unit = lol.Unit.list[$(this).attr('data-id')];
		if (unit.setSelected(!unit.isSelected)) lol.Unit.selectionDidChange();
	}
	return ui.cancel(e);
};

lol.Unit.selection.mouseOver = function(e) {
	if (!lol.Map.coords) return;
	var unit = lol.Unit.list[$(this).attr('data-id')];
	var left = (unit.coords.x-lol.Map.coords.x)*lol.Map.cellWidth;
	var top = (unit.coords.y-lol.Map.coords.y)*lol.Map.cellWidth;
	$('#map #hilite img').css('left',''+left+'px').css('top',''+top+'px');
	$('#map #hilite').stop().fadeIn();
};

lol.Unit.selection.mouseOut = function(e) {
	clearTimeout(lol.Unit.selection.holdClickTimer);
	lol.Unit.selection.holdClickTimer = null;
	if (!lol.Map.coords) return;
	$('#map #hilite').stop().fadeOut();
};

lol.Unit.maxSelection = 39;
lol.Unit.prototype.appendToSelection = function(selecting) {
	var div = $('#sel .unit[data-id="'+this.id+'"]');
	if (div.length) {
		// Already exists: replace
		div.replaceWith(this.selHTML(selecting));
	}
	else if ($('#sel .unit').length < lol.Unit.maxSelection) {
		// Append to the selection box
		$('#sel').append(this.selHTML(selecting)+' ');
	} else {
		// Selection box is full
		return;
	}
	var div = $('#sel .unit[data-id="'+this.id+'"]');
	div.mouseover(lol.Unit.selection.mouseOver);
	div.mouseout(lol.Unit.selection.mouseOut);
	div.mousedown(lol.Unit.selection.startClick);
	div.mouseup(lol.Unit.selection.endClick);
	div.on('touchstart', lol.Unit.selection.startClick);
	div.on('touchend', lol.Unit.selection.endClick);
};

lol.Unit.updateSelectAllButton = function() {
	// Update the select all button
	var n = $('#sel .unit').length;
	var nsel = $('#sel .unit.selected, #sel .unit.selecting').length;
	if (n == nsel) $('#sel .select').addClass('selected').attr('title', __('Deselect all'));
	else $('#sel .select').removeClass('selected').attr('title', __('Select all'));
};

lol.Unit.toggleSelectAll = function() {
	// Select or deselect all units
	var select = !$('#sel .select').hasClass('selected');
	var selectionDidChange = false;
	$('#sel .unit').each(function() {
		var unit = lol.Unit.list[$(this).attr('data-id')];
		if (unit.setSelected(select)) selectionDidChange = true;
	});
	if (selectionDidChange) {
		// Notify selection change
		lol.Unit.selectionDidChange();
	}
};

// HTML
lol.Unit.prototype.tooltip = function(sel) {
	if (!this.isLoaded) return '';
	var tooltip = this.typeName+'\n'+this.name+(this.isCaptain?' ★':'');
	if (!sel) {
		var p = Math.round(this.state*100);
		tooltip+= '\n'+lol.Unit.stateAsString(this.state)+' ('+p+'%)';
		if (this.stunned>lol.Time.now) tooltip+= '\n'+lol.Unit.stunnedAsString(this.stunned);
		if (this.isOnStrike) tooltip+= '\n'+__('on strike');
	}
	return tooltip;
};

lol.Unit.prototype.selHTML = function(selecting) {
	// Return the HTML code of a unit
	var className = 'round unit';
	if (this.isSelected) className+= selecting?' selecting':' selected';
	if (this.actId) className+= ' busy';
	if (this.isCaptain) className+= ' captain';
	if (!this.state) className+= ' down';
	var html = '<img class="'+className+'" data-id="'+this.id+'"';
	html+= ' src="/img/unit/'+this.icon+'.png" title="'+this.tooltip(true)+'"/>';
	return html;
};

lol.Unit.prototype.actionIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Unit.list[\''+this.id+'\'].showInfo()';
	var className = 'acticon round'+(this.isSelected?' selected':'');
	var html = '<button class="'+className+'" data-unit-id="'+this.id+'" title="'+this.tooltip()+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/unit/'+this.icon+'.png"/>';
	if (this.isCaptain) html+= '<img class="comp" src="'+ICONPATH+'/captainw.png">';
	if (this.isLoaded) html+= '<div class="state roundBottom"><div style="width:'+(this.state*100)+'%"></div></div>';
	html+= '</button> ';
	return html;
};

lol.Unit.actionAddIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Area.act.addUnits(this)';
	var title = __('Add selected units');
	var html = '<button class="acticon selected actadd round" disabled title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/unit/x.png"/>';
	html+= '<div class="quant">+</div>';
	html+= '</button> ';
	return html;
};

lol.Unit.prototype.actionHTML = function() {
	// Display the current action of a unit
	var act = this.action();
	if (!act) {
		if (!this.actId) return '';
		// There is an action but it is not loaded
		var unit = this;
		var id = 'unitAction'+this.actId;
		mqykkbj('act', {id:this.actId}, function(data) {
			data = lol.XHR.decode(data);
			var act = new lol.Action(data);
			var html = unit.actionHTML();
			$('#'+id).replaceWith(html);
		}, true);
		return '<div id="'+id+'" class="hidden"></div>';
	}
	var html = '<div class="action pointer '+act.color+'" data-id="'+act.id+'"';
	html+= ' onclick="lol.go(\'/map/'+lol.Map.coordsToString(act.x,act.y)+'\')"';
	var bgnd = 'url(/img/'+act.icons[0]+'.jpg)';
	for (var i=1;i<act.icons.length;i++) bgnd = 'url(/img/'+act.icons[i]+'.png),'+bgnd;
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),'+bgnd+'">';
	html+= '<div class="title">';
	html+= '<div class="floatRight">';
	if (this.canEnableAuto) {
		// Show the button for enabling/disabling auto action
		html+= '&nbsp;&nbsp;<button class="'+(this.isAutoEnabled?'':'blur')+'"';
		html+= ' title="'+__(this.isAutoEnabled? 'Automatic action enabled':'Automatic action disabled')+'"';
		html+= ' onclick="lol.Unit.list[\''+this.id+'\'].toggleAuto(this,'+(this.isAutoEnabled?false:true)+');return ui.cancel(event);">';
		html+= '<img width="23" height="20" src="'+ICONPATH+'/auto.'+act.color+'.png"/></button>';
	}
	if (act.canReleaseUnits && this.canControl && act.units.length>1) {
		// Show the button to release the unit from this action
		html+= '&nbsp;&nbsp;<button title="'+__('Release this unit')+'"';
		html+= ' onclick="lol.Unit.list[\''+this.id+'\'].release(this);return ui.cancel(event);">';
		html+= '<img width="20" height="20" src="'+ICONPATH+'/release.'+act.color+'.png"/></button>';
	}
	html+= '</div>';
	html+= '<span class="'+act.color+'">'+act.name+'</span>';
	if (act.subtitle) html+= ' <small class="gray">'+act.subtitle+'</small>';
	html+= '</div>';
	html+= '<div class="status">';
	html+= '<p class="left back countdown">'+lol.Time.delay(act.ended-lol.Time.now)+'</p>';
	html+= '<div class="progress">';
	html+= '<div style="width:'+lol.Time.progress(act.started,act.ended)+'">';
	if (act.paused) html+= '<p class="center front">'+__('waiting for acceptance…')+'</p>';
	else html+= '<p class="left front countdown">'+lol.Time.delay(act.ended-lol.Time.now)+'</p>';
	html+= '</div></div>';
	html+= '</div></div>';
	return html;
};

lol.Unit.prototype.strikeHTML = function() {
	var html = '';
	for (var i in this.strikes) {
		html+= this.strikes[i].html();
	}
	return html;
};

lol.Unit.prototype.infoHTML = function() {
	// Return info panel HTML
	var name = this.fullName? this.fullName:this.name;
	var html = '<h2 class="center">'+name+(this.isCaptain?' ★':'')+'</h2>';
	if (this.name != name) {
		html+= '<p class="center italic">';
		html+= __('aka')+' '+this.name;
		html+= '</p>';
	}
	html+= '<p class="center">';
	if (this.legend) {
		// Display the legend
		html+= this.legend;
	}
	else {
		// Display the unit type and owner
		html+= this.typeName;
		if (this.isIncompatible) {
			// Display type name in red
			html+= ' <a href="/help/unit?type='+this.type+'"';
			html+= ' title="'+__('Incompatible with organization')+'">';
			html+= '<img class="txt" src="'+ICONPATH+'/incompatible.png"></a>';
		}
		if (this.owner.id) {
			// Display the organization
			html+= '<br><a href="/arm/org/'+this.owner.id+'">'+this.owner.name+'</a>';
		}
	}
	html+= '</p>';
	if (this.langs) {
		html+= '<p class="center">';
		for (var i in this.langs) {
			if (i > 3) break;
			if (!this.langs[i]) continue;
			html+= '<img class="txt" src="/img/lang/'+this.langs[i]+'.png"> ';
		}
		html+= '</p>';
	}
	html+= '<p class="center pict">';
	if (this.fid) html+= '<a href="/arm/lord/'+this.fid+'">';
	html+= '<img class="round" src="/img/unit/'+this.icon+'.pt.jpg"/>';
	if (this.fid) html+= '</a>';
	html+= '</p>';
	html+= lol.Unit.lifespanHTML(this.lifespan, this.age, true);
	html+= lol.Unit.stateHTML(this.state, this.isDying, true);
	html+= lol.Unit.happinessHTML(this.happiness, this.tendency, true);
	html+= lol.Unit.stunnedHTML(this.stunned);
	// Statistics
	var loaded = Math.round(100*Math.min(1.0, this.carriedWeight/this.carriageCapacity));
	html+= '<p class="small">'+__('Lvl:')+'&nbsp;'+this.level+'.';
	html+= ' <span class="round xp"><span style="width:'+(this.xpProgress*100)+'%"></span></span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('St:')+'</b>&nbsp;'+this.stats.st+'.</span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('Ag:')+'</b>&nbsp;'+this.stats.ag+'.</span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('Co:')+'</b>&nbsp;'+this.stats.co+'.</span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('In:')+'</b>&nbsp;'+this.stats.in+'.</span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('Wi:')+'</b>&nbsp;'+this.stats.wi+'.</span>';
	html+= ' <span class="nowrap"><b class="pre">'+__('Ch:')+'</b>&nbsp;'+this.stats.ch+'.</span>';
	html+= ' <span class="nowrap"><img class="txt" src="'+ICONPATH+'/cargo.png"/>&nbsp;'+loaded+'%</span>';
	html+= ' <span class="nowrap"><img class="txt" src="'+ICONPATH+'/pace.png"/>&nbsp;'+(this.pace>99?'>99':this.pace)+'.</span>';
	// Defensive bonuses
	if (!this.isUntouchable) {
		html+= ' <span class="nowrap"><img class="txt" src="'+ICONPATH+'/def.png"/>&nbsp;';
		html+= lol.Unit.bonus(this.def.melee)+'/'+lol.Unit.bonus(this.def.polearm)+'/'+lol.Unit.bonus(this.def.ranged);
		if (this.def.dist) html+= '&thinsp;<small>('+lol.Unit.bonus(this.def.dist)+')</small>';
		html+= '.</span>';
	}
	// Attack penalty
	html+= ' <span class="nowrap"><img class="txt" src="'+ICONPATH+'/mil.png"/>&nbsp;';
	html+= this.attackPenalty? lol.Unit.bonus(this.attackPenalty):'<span class="gray">-</span>';
	html+= '.</span>';
	// Money
	html+= ' <span class="gold nowrap"><img class="txt" src="'+ICONPATH+'/money.png"/>&nbsp;';
	html+= ''+lol.money(this.money)+'</span>.';
	html+= '</p>';
	// Action and strikes
	html+= this.actionHTML();
	html+= this.strikeHTML();
	// Leaderships
	if (this.leaderships.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/mil.png"/> ';
		html+= __('Leadership')+__(':')+ ' ';
		for (var i in this.leaderships) {
			var leadership = this.leaderships[i];
			if (i > 0) html+= ', ';
			html+= '<a href="/map/'+lol.Map.coordsToString(leadership.x,leadership.y)+'">';
			html+= leadership.name+'</a>';
			html+= ' <span class="small">'+lol.Unit.bonus(leadership.bonus)+'</span>';
		}
		html+= '.</p>';
	}
	// Equipment
	if (this.equipment.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/equip.png"/> ';
		for (var i in this.equipment) {
			var res = this.equipment[i];
			if (i > 0) html+= ', ';
			html+= res.name;
			// Quality and quantity
			html+= '&thinsp;<span class="small">';
			html+= lol.Res.qualityAsString(res.quality);
			html+= '&thinsp;<span class="gray">'+res.quantity+'</span>';
			html+= '</span>';
		}
		html+= '.</p>';
	}
	// Skills
	if (this.skills.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/skill.png"/> ';
		for (var i in this.skills) {
			var skill = this.skills[i];
			if (i > 0) html+= ', ';
			html+= skill.name+' <span class="small">'+lol.Unit.bonus(skill.bonus)+'</span>';
			if (skill.bonus2) html+= '&thinsp;<span class="small">('+lol.Unit.bonus(skill.bonus2)+')</span>';
		}
		html+= '.</p>';
	}
	// Automatic actions
	if (this.auto.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/auto.png"/> ';
		for (var i in this.auto) {
			var act = this.auto[i];
			if (i > 0) html+= ', ';
			html+= act.name;
			if (act.subtitle) html+= ' <span class="small">('+act.subtitle+')</span>';
		}
		html+= '.</p>';
	}
	// Consommation
	if (this.consumption.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/happiness.png"/> ';
		for (var i in this.consumption) {
			var cons = this.consumption[i];
			if (i > 0) html+= ', ';
			html+= cons.name;
		}
		html+= '…</p>';
	}
	// Carried resources
	if (this.resources.length) {
		html+= '<p class="small hyphen"><img class="txt" src="'+ICONPATH+'/cargo.png"/> ';
		for (var i in this.resources) {
			var res = this.resources[i];
			if (i > 0) html+= ', ';
			html+= res.name+'&thinsp;<span class="small">'+lol.Res.quantityAsString(res.quantity,res.unit)+'</span>';
		}
		html+= '.</p>';
	}
	if (this.tied) {
		// Display the tied unit
		html+= '<p class="center tied">';
		html+= '<img height="40" src="'+DIVPATH+'/tied.png"/><br>';
		html+= '<button onclick="lol.Unit.list['+this.tied.id+'].showInfo()" title="'+this.tied.name+'">';
		html+= '<img class="round" src="/img/unit/'+this.tied.icon+'.png"/>';
		html+= '</button>';
		html+= '</p>';
	}
	if (this.captain) {
		// Display the captain
		html+= '<p class="center tied">';
		html+= '<button onclick="lol.Unit.list['+this.captain.id+'].showInfo()" title="'+this.captain.name+' ★">';
		html+= '<img class="round" src="/img/unit/'+this.captain.icon+'.png"/>';
		html+= '</button>';
		html+= '</p>';
	}
	if (this.company.length) {
		html+= '<p class="center tied">';
		// Display the company
		for (var i in this.company) {
			var unit = this.company[i];
			html+= '<button onclick="lol.Unit.list['+unit.id+'].showInfo()" title="'+unit.name+'">';
			html+= '<img class="round" src="/img/unit/'+unit.icon+'.png"/>';
			html+= '</button> ';
		}
		html+= '</p>';
	}
	if (this.menu) {
		// Display the interaction menu
		html+= '<table class="'+lol.Interaction.tableClass+'">';
		for (var i in this.menu) html+= this.menu[i].html();
		html+= '</table>';
	}
	if (this.actId || !this.isMoving) {
		html+= '<p class="center"><a href="/map/'+lol.Map.coordsToString(this.coords.x,this.coords.y)+'">';
		html+= __('Locate on the Map')+'</a></p>';
	}
	if (this.canManage) {
		// Display a link to the management
		var oid = this.owner? this.owner.id:0;
		html+= '<p class="center"><a href="/mgmt/'+oid+'/unit:'+this.id+'">';
		html+= __('Manage this unit')+'</a></p>';
		if (this.canDelete) {
			var disabled = (this.state<1);
			html+= '<p class="center"><button'+(disabled?' disabled':'')+' class="red"';
			html+= ' onclick="lol.Unit.delete(this);return ui.cancel(event);">';
			html+= __('Delete this unit')+'</button></p>';
		}
		html+= '<div class="confirm"></div>';
	}
	return html;
};

lol.Unit.delete = function(button, confirmed) {
	var uinfo = $(button).closest('.uinfo');
	var id = parseInt(uinfo.attr('data-id'));
	var unit = lol.Unit.list[id];
	var div = uinfo.find('.confirm');
	if (confirmed === true) {
		// Delete the unit
		mqykkbj('unit', {id:id, delete:true}, function(data) {
			if (unit.fid) lol.refresh();
			else lol.modal.close();
		}, true);
		return;
	}
	// Show/hide the confirm panel
	var html = '<div>';
	var text = __('confirm.delete.unit');
	html+= '<p class="center small red">'+text+'</p>';
	html+= '<p class="center">';
	html+= '<button class="submit red"';
	html+= ' onclick="lol.Unit.delete(this,true)">';
	html+= __('Delete')+'</button>';
	html+= ' <button class="submit"';
	html+= ' onclick="lol.Unit.delete(this,false)">';
	html+= __('Cancel')+'</button></p>';
	html+= '</div>';
	div.html(html);
	if (confirmed == false) div.slideUp();
	else div.slideDown();
};

lol.Unit.prototype.newInfoHTML = function() {
	// Display unit detailed information
	var html = '<h2 class="center">'+this.name+'</h2>';
	html+= '<p class="center pict">';
	html+= '<img class="round box" src="/img/unit/'+this.icon+'.pt.jpg"/>';
	html+= '</p>';
	return html;
};

lol.Unit.prototype.showInfo = function() {
	// Display unit's detailed information
	if (!parseInt(this.id)) {
		// New unit (training action)
		lol.modal.open('<div class="uinfo round" data-id="'+this.id+'">'+this.newInfoHTML()+'</div>');
		return;
	}
	var unit = this;
	mqykkbj('unit', {id:this.id, more:null}, function(data) {
		// Load more data
		unit.moreData(lol.XHR.decode(data));
		lol.modal.open('<div class="uinfo round" data-id="'+unit.id+'">'+unit.infoHTML()+'</div>');
	}, true);
};

lol.Unit.prototype.updateInfoIfNeeded = function() {
	// Update currently displayed info
	var unit = this;
	var div = $('.uinfo[data-id="'+this.id+'"]');
	if (div.length) mqykkbj('unit', {id:this.id, more:null}, function(data) {
		unit.moreData(lol.XHR.decode(data));
		div.html(unit.infoHTML());
		lol.modal.update();
	}, true);
};

// Loading resources
lol.Unit.cargo = {
	div: null,
	unit: null,
	res: null,
	isOut: true,
	weight: 0,
	capacity: 0,
	carried: 0,
	quantity: 1,
	maxQuantity: 1,
};

lol.Unit.prototype.showCargoInfo = function(div) {
	var unit = this;
	lol.Unit.cargo.div = div;
	lol.Unit.cargo.unit = unit;
	lol.Unit.cargo.res = lol.Area.res.list[$(div).attr('data-id')];
	if (!lol.Unit.cargo.res) return lol.Area.res.moveBack(div);
	mqykkbj('unit', {id:this.id, cargo:lol.Unit.cargo.res.type}, function(data) {
		// Load more data
		if (!data) return lol.Area.res.moveBack(div);
		data = lol.XHR.decode(data).split('#');
		if (data[0] != unit.id) return lol.Area.res.moveBack(div);
		lol.Unit.cargo.isOut = parseInt(data[1])?true:false;
		lol.Unit.cargo.weight = parseFloat(data[2]);
		lol.Unit.cargo.capacity = parseInt(data[3]);
		lol.Unit.cargo.carried = parseInt(data[4]);
		// Calculate the maximum quantity
		var quantity = lol.Unit.cargo.res.quantity;
		if (lol.Unit.cargo.isOut) quantity-= lol.Unit.cargo.res.inside;
		lol.Unit.cargo.maxQuantity = Math.max(0,Math.floor((lol.Unit.cargo.capacity-lol.Unit.cargo.carried)/lol.Unit.cargo.weight));
		lol.Unit.cargo.maxQuantity = Math.min(lol.Unit.cargo.maxQuantity, quantity);
		lol.Unit.cargo.quantity = lol.Unit.cargo.maxQuantity;
		if (!lol.Unit.cargo.maxQuantity) return lol.Area.res.moveBack(div);
		var html = '';
		// Display icons
		html+= '<p class="center pict">';
		html+= '<img class="round actor" src="/img/res/'+lol.Unit.cargo.res.type+'.png"/>';
		html+= ' <img src="'+DIVPATH+'/inter.png"> ';
		html+= '<img class="round target" src="/img/unit/'+unit.icon+'.png"/>';
		html+= '</p>';
		// Resource detail
		html+= '<h2 class="center">'+lol.Unit.cargo.res.name+'</h2>';
		if (lol.Unit.cargo.res.quantity && !lol.Unit.cargo.res.isRelic) {
			// Display quality only if the quantity is > 0
			html+= lol.Res.qualityHTML(lol.Unit.cargo.res.quality);
			// Display quantity
			html+= '<p class="center">';
			html+= __('Quality')+__(':')+' <span class="gold">'+lol.Res.qualityPercent(lol.Unit.cargo.res.quality)+'%</span><br>';
			html+= __('Quantity')+__(':')+' <span id="quant">'+lol.Res.quantityAsString(lol.Unit.cargo.quantity,lol.Unit.cargo.res.unit,true)+'</span>';
			html+= '</p>';
		}
		// Display a slider to change the quantity
		if (lol.Unit.cargo.maxQuantity > 1) {
			var log = Math.max(1,Math.log(lol.Unit.cargo.maxQuantity)/4);
			html+= '<div class="find">';
			html+= '<div class="round slider quant cargoquant" id="multSlider"';
			html+= 'log="'+log+'" xmin="0" min="1" max="'+lol.Unit.cargo.maxQuantity+'" value="'+lol.Unit.cargo.quantity+'"></div>';
			// Carried resources
			var loaded = Math.round(100*Math.min(1.0, lol.Unit.cargo.carried/lol.Unit.cargo.capacity));
			var added = Math.round(100*(lol.Unit.cargo.quantity*lol.Unit.cargo.weight)/lol.Unit.cargo.capacity);
			html+= '<p id="cargo" class="small center">';
			html+= '<img class="txt" src="'+ICONPATH+'/cargo.png"/>&nbsp;'+loaded+'%&thinsp;(+&thinsp;'+added+'%)</p>';
			html+= '</div>';
		}
		// Display the load button
		html+= '<p class="center"><button id="enter" class="submit" style="width:110px"';
		html+= ' onclick="lol.Unit.cargo.load();return ui.cancel(event);">';
		html+= __('OK')+'</button></p>';
		// Open the modal panel
		lol.modal.open('<div class="uinter round">'+html+'</div>', function() {
			$(div).stop().fadeOut(function() {
				$(this).remove();
			});
		});
		// Quantity multiplier
		$('#multSlider').change(lol.Unit.cargo.set);
	}, true);
};

lol.Unit.cargo.set = function(slider,done) {
	// Update the quantity
	var slider = $('#multSlider');
	lol.Unit.cargo.quantity = parseInt(slider.val());
	$('#quant').html(lol.Res.quantityAsString(lol.Unit.cargo.quantity,lol.Unit.cargo.res.unit,true));
	// Calculated load
	var loaded = Math.round(100*Math.min(1.0, lol.Unit.cargo.carried/lol.Unit.cargo.capacity));
	var added = Math.round(100*(lol.Unit.cargo.quantity*lol.Unit.cargo.weight)/lol.Unit.cargo.capacity);
	var html = '<img class="txt" src="'+ICONPATH+'/cargo.png"/>&nbsp;'+loaded+'%&thinsp;(+&thinsp;'+added+'%)';
	$('#cargo').html(html);
};

lol.Unit.cargo.load = function() {
	// Called when the cargo info panel is closed
	var unit = lol.Unit.cargo.unit;
	var div = lol.Unit.cargo.div;
	mqykkbj('unit', {id:unit.id, load:lol.Unit.cargo.res.type, quant:lol.Unit.cargo.quantity},
	function(data) {
		lol.modal.close();
	});
};


// Categories
lol.Unit.cats = {};

lol.Unit.catItemHTML = function(cat) {
	var img = cat? '/img/cat/unit.'+cat+'.png':BTNPATH+'/all.png';
	var html = '<table class="catitem" data-filter="'+(cat?'*'+cat:'')+'"';
	html+= ' onclick="return lol.Mgmt.selectCat(this)"><tr>';
	html+= '<td class="icon"><img class="round" src="'+img+'"/></td>';
	html+= '<td class="name">'+(cat? lol.Unit.cats[cat]:__('All categories'))+'</td>';
	html+= '</tr></table>';
	return html;
};

lol.Unit.catMenuHTML = function(filter) {
	var html = '<div class="catgroup">';
	html+= '<div class="catmenu">';
	html+= lol.Unit.catItemHTML('');
	for (var cat in lol.Unit.cats) html+= lol.Unit.catItemHTML(cat);
	html+= '</div>';
	var cat = filter.substr(0,1)=='*'? filter.substr(1):'';
	var img = cat? '/img/cat/unit.'+cat+'.png':BTNPATH+'/all.png';
	html+= '<button class="caticon round"';
	html+= ' title="'+(cat?lol.Unit.cats[cat]:__('All categories'))+'"';
	html+= ' onclick="return lol.Mgmt.showCatMenu(this)">';
	html+= '<img src="'+img+'">';
	html+= '</button>';
	html+= '</div>';
	return html;
};



$(document).ready(function() {

	// Set up the selection
	var div = $('#sel');
	if (div.length) {
		var data = lol.XHR.decode(div.text()).split('$');
		var html = '<img class="round select" src="'+BTNPATH+'/select.png"';
		html+= ' onclick="lol.Unit.toggleSelectAll()"/> ';
		div.html(html);
		for (var i in data) {
			if (!data[i]) continue;
			var unit = new lol.Unit(data[i]);
			unit.appendToSelection();
		}
		div.removeClass('data');
		lol.Unit.updateSelectAllButton();
	}
});







lol.Entry = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize an entry
	var n = 0;
	var data = data.split(sep);
	this.id = parseInt(data[n++]);
	this.date = parseInt(data[n++]);
	this.type = data[n++];
	this.info = data[n++];
	this.label = data[n++];
	this.amount = parseFloat(data[n++]);
	lol.Entry.list[this.id] = this;
};

lol.Entry.list = {};






lol.Skill = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a skill
	var n = 0;
	var data = data.split(sep);
	this.type = data[n++];
	this.name = data[n++];
	
	this.id = this.type;
	lol.Skill.list[this.id] = this;
};

lol.Skill.list = {};

// HTML
lol.Skill.prototype.actionIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Skill.list[\''+this.id+'\'].showInfo()';
	var title = this.name;
	title+= '\n('+__('unavailable')+')';
	var html = '<button class="acticon round missing" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/unit/x.png"/>';
	html+= '<div class="quant"><img class="txt" src="'+ICONPATH+'/error.png"></div>';
	html+= '</button> ';
	return html;
};

lol.Skill.prototype.infoHTML = function() {
	// Display unit's detailed information
	var html = '<h2 class="center">'+this.name+'</h2>';
	html+= '<p class="center">'+__('This skill is required…')+'</p>';
	html+= '<div class="find" id="findUnitList"><p class="center"><img src="'+ICONPATH+'/bar.gif"/></p></div>';
	html+= '<p class="center"><a href="/mgmt/local/units">'+__('Unit Management')+'</a></p>';
	return html;
};

lol.Skill.find = {
	current: null,
	timeout: null,
};

lol.Skill.find.units = function() {
	clearTimeout(lol.Skill.find.timeout);
	lol.Skill.find.timeout = setTimeout(function() {
		lol.Skill.find.timeout = null;
		var skill = lol.Skill.find.current;
		mqykkbj('find', {skill:skill.type}, function(data) {
			if (!data) data = '!default';
			if (data.substr(0,1)=='!') {
				// Could not find sale offer
				var html = '<p class="center gray">'+__('find.'+data.substr(1))+'</p>';
				$('#findUnitList').html(html);
				return;
			}
			data = lol.XHR.decode(data).split('$');
			var units = [];
			for (var i in data) {
				var unit = new lol.Unit(data[i]);
				lol.Area.unit.list[unit.id] = unit;
				units.push(unit);
			}
			var html= '';
			for (var i in units) html+= units[i].selHTML()+' ';
			$('#findUnitList').html(html);
			$('#findUnitList .unit').click(function(e) {
				var unit = lol.Unit.list[$(this).attr('data-id')];
				if (unit.setSelected(!unit.isSelected)) lol.Unit.selectionDidChange();
			});
		}, true);
	}, lol.Premium?500:1000);
};



lol.Skill.prototype.showInfo = function() {
	// Display skill's detailed information
	lol.modal.open('<div class="uinfo round">'+this.infoHTML()+'</div>');
	lol.Skill.find.current = this;
	lol.Skill.find.units();
};




lol.Res = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a resource
	var n = 0;
	var data = data.split(sep);
	this.type = data[n++];
	this.name = data[n++];
	this.isRelic = parseInt(data[n++])?true:false;
	this.isConflict = parseInt(data[n++])?true:false;
	this.unit = data[n++];
	this.quality = parseFloat(data[n++]);
	this.quantity = parseFloat(data[n++]);
	this.inside = parseFloat(data[n++]);
	this.maxQuantity = parseFloat(data[n++]);
	this.missingQuantity = parseFloat(data[n++]);
	this.restored = parseInt(data[n++])?true:false;
	// Parse owner
	this.owner = {
		id:data[n++],
		blazon:data[n++],
		name:lol.str(data[n++]),
		money:parseFloat(data[n++]),
		cost:parseFloat(data[n++]),
	};
	if (this.owner.id) switch (this.owner.id.substr(0,1)) {
		case 'o': this.owner.org = {id: parseInt(this.owner.id.substr(1))}; break;
		case 'u': this.owner.unit = {id: parseInt(this.owner.id.substr(1))}; break;
	}
	// Additional data
	this.rank = parseInt(data[n++]);
	this.value = parseFloat(data[n++]);
	this.volume = parseInt(data[n++]);
	this.isInStock = parseInt(data[n++])?true:false;
	this.auto = parseInt(data[n++]);
	this.sale = parseInt(data[n++]);
	this.cons = parseInt(data[n++]);
	this.purchase = parseInt(data[n++]);
	this.maxStock = parseInt(data[n++]);
	this.reservedStock = parseInt(data[n++]);
	this.sellPrice = parseFloat(data[n++]);
	this.purchasePrice = parseFloat(data[n++]);
	this.purchasedQuality = parseFloat(data[n++]);
	// Trading information
	this.trade = {
		region:{
			id:parseInt(data[n++]),
			forSale:parseInt(data[n++])?true:false,
			price:parseFloat(data[n++]),
			value:parseFloat(data[n++]),
		},
		order: {
			id:parseInt(data[n++]),
			created:parseInt(data[n++]),
			auto:parseInt(data[n++]),
			put:parseInt(data[n++]),
			price:parseFloat(data[n++]),
			done:parseInt(data[n++]),
		},
	};
	// Demand
	this.demand = {
		count:parseInt(data[n++]),
		happinessBonus:parseInt(data[n++]),
	};
	// Buy/sell orders
	this.buyQuantity = 0; // the quantity that will be bought
	this.sellQuantity = 0; // the quantity that will be sold
	this.droppedQuantity = 0; // the quantity of dropped resource
	this.isStock = false; // set to true when managing the stock
	this.canDelete = false; // set to true to allow deletion
	
	this.id = '*'+lol.Res.defaultId++;
	lol.Res.list[this.id] = this;
};

lol.Res.list = {};
lol.Res.defaultId = 1;
lol.Res.regionId = 0;

lol.Res.quantityHTML = function(quantity) {
	// Return quantity as string
	if (isNaN(quantity)) return '';
	if (!quantity) return '';
	quantity = Math.round(quantity);
	return quantity? quantity:'< 1';
};

lol.Res.qualityAsString = function(quality) {
	// Return the quality as a string
	return __('quality.'+Math.min(Math.floor(quality*2.5), 5));
};

lol.Res.qualityPercent = function(quality) {
	// Return the quality value as a percentage
	return Math.round(quality*50);
};

lol.Res.qualityHTML = function(quality) {
	// Return quality HTML code
	var width = Math.max(0,Math.round(100-quality*50));
	var title = lol.Res.qualityAsString(quality)+' ('+lol.Res.qualityPercent(quality)+'%)';
	var html = '<div class="qual round" title="'+title+'">';
	html+= '<div style="width:'+width+'%;"></div>';
	html+= '</div>';
	return html;
};

lol.Res.progressHTML = function(p) {
	var width = p*100;
	var title = ''+Math.floor(p*100)+'%';
	var html = '<div class="progress round" title="'+title+'">';
	html+= '<div style="width:'+width+'%;"></div>';
	html+= '</div>';
	return html;
};

lol.Res.unitAsString = function(unit) {
	if (!unit) return '';
	unit = unit.replace('2','²');
	unit = unit.replace('3','³');
	return unit;
};

lol.Res.convK = function(unit) {
	// Return the conversion rate
	// This function works with lol.Res.unitK
	switch (unit) {
		case 'oz': return 31.0/1000;
		default: return 1.0/1000;
	}
};

lol.Res.unitK = function(unit) {
	switch (unit) {
		// No unit
		case '': return 'K';
		case 'K': return 'M';
		case 'M': return 'G';
		// Volume
		case 'dm3': return 'm3';
		case 'm3': return 'dam3';
		case 'dam3': return 'hm3';
		case 'ml': return 'l';
		case 'l': return 'kl';
		case 'kl': return 'Ml';
		// Weight
		case 'g': return 'kg';
		case 'oz': return 'kg'; // x31
		case 'kg': return 't';
		case 't': return 'kt';
		case 'kt': return 'Mt';
		case 'Mt': return 'Gt';
		// Default
		default: return '(?)';
	}
};

lol.Res.quantityAsString = function(quantity,unit,strict) {
	if (!quantity) return '-';
	var space = unit? '&thinsp;':'';
	if (strict) return ''+quantity+space+lol.Res.unitAsString(unit);
	if (quantity < 10000) return lol.Res.quantityAsString(quantity,unit,true);
	// First conversion
	quantity = Math.floor(quantity*lol.Res.convK(unit));
	unit = lol.Res.unitK(unit);
	if (quantity < 10000) return '>'+quantity+space+lol.Res.unitAsString(unit);
	// Second conversion
	quantity = Math.floor(quantity*lol.Res.convK(unit));
	unit = lol.Res.unitK(unit);
	return '>'+quantity+space+lol.Res.unitAsString(unit);
};

lol.Res.volumeAsString = function(volume, strict) {
	return lol.Res.quantityAsString(volume,'m3',strict);
};

lol.Res.prototype.tooltip = function() {
	var tooltip = this.name;
	return tooltip;
};

// HTML
lol.Res.prototype.actionIconHTML = function(onclick, isOptional, isStrict) {
	if (!onclick) onclick = 'lol.Res.list[\''+this.id+'\'].showInfo()';
	var title = '';
	if (this.ingredient && this.ingredient.skill.name) {
		title+= this.ingredient.skill.name+'\n';
	}
	title+= this.name? this.name:__('Optional resource');
	if (this.quantity && !this.isRelic) {
		// Display quantity
		title+= __(':')+' '+lol.Res.quantityAsString(this.quantity,this.unit);
		if (this.maxQuantity && this.maxQuantity > this.quantity) title+= ' / '+lol.Res.quantityAsString(this.maxQuantity,this.unit);
		title+= '\n'+lol.Res.qualityAsString(this.quality)+' ('+lol.Building.qualityPercent(this.quality)+'%)';
	}
	var className = 'acticon round';
	if (this.missingQuantity) className+= ' missing';
	if (this.restored) className+= ' restored';
	var html = '<button class="'+className+'" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/res/'+(this.type?this.type:'x')+'.png"/>';
	if (this.quantity && !this.isRelic) {
		// Display quality only if the quantity > 0
		html+= '<div class="qual roundBottom"><div style="width:'+Math.max(0,Math.round(100-this.quality*50))+'%;"></div></div>';
	}
	if (this.missingQuantity) {
		// Display error icon
		html+= '<div class="quant"><img class="txt" src="'+ICONPATH+'/error.png"></div>';
	}
	else {
		// Display quantity
		html+= '<div class="quant">'+lol.Res.quantityHTML(this.quantity)+'</div>';
	}
	if (isStrict) {
		html+= '<img class="strict" src="'+ICONPATH+'/strict.png">';
	}
	if (this.isConflict) {
		html+= '<img class="relic" src="'+ICONPATH+'/conflict.png" title="'+__('Conflicting relic')+'">';
	}
	html+= '</button> ';
	return html;
};

lol.Res.custom = null;
lol.Res.prototype.infoHTML = function() {
	var html = '';
	if (this.ingredient && this.ingredient.skill.name) {
		html+= '<p class="small center">'+this.ingredient.skill.name+'</p>';
	}
	html+= '<h2 class="center">';
	html+= this.name? this.name:__('Optional resource');
	html+= '</h2>';
	if (this.owner.org) {
		// Display owner (organization)
		html+= '<p class="center">';
		html+= '<a href="/arm/org/'+this.owner.org.id+'">'+this.owner.name+'</a>';
		html+= '</p>';
	}
	if (this.owner.unit) {
		// Display owner (unit)
		html+= '<p class="center">';
		html+= this.owner.name;
		html+= '</p>';
	}
	html+= '<p class="center pict">';
	if (this.ingredient && this.ingredient.resources.length>1) {
		var i = this.ingredient.resources.indexOf(this);
		i = (i<=0? this.ingredient.resources.length-1:i-1);		
		var onclick = 'lol.Res.list[\''+this.id+'\'].ingredient.selectIndex(null,'+i+',true)';
		html+= '<button class="arrow blur" onclick="'+onclick+';return ui.cancel(event);">';
		html+= '<img src="'+BTNPATH+'/left.png"></button>';
	}
	html+= '<img class="round" src="/img/res/'+(this.type?this.type:'x')+'.pt.jpg"/>';
	if (this.ingredient && this.ingredient.resources.length>1) {
		var i = this.ingredient.resources.indexOf(this);
		i = (i>=this.ingredient.resources.length-1? 0:i+1);		
		var onclick = 'lol.Res.list[\''+this.id+'\'].ingredient.selectIndex(null,'+i+',true)';
		html+= '<button class="arrow blur" onclick="'+onclick+';return ui.cancel(event);">';
		html+= '<img src="'+BTNPATH+'/right.png"></button>';
	}
	html+= '</p>';
	if (this.type && this.quantity && !this.isRelic) {
		// Display quality only if the quantity is > 0
		html+= lol.Res.qualityHTML(this.quality);
		// Display quantity
		html+= '<p class="center">';
		html+= __('Quality')+__(':')+' <span class="gold">'+lol.Res.qualityPercent(this.quality)+'%</span><br>';
		html+= __('Quantity')+__(':')+' <span id="quant">'+lol.Res.quantityAsString(this.quantity,this.unit,true)+'</span>';
		html+= '</p>';
	}
	if (this.owner.cost) {
		// Display cost
		html+= '<div class="find">';
		html+= '<div id="findOrdForm" class="mini"><p class="center small monospace">';
		html+= __('Cost')+__(':')+' '+lol.money(this.owner.cost);
		html+= '</p></div></div>';
	}
	if (lol.Res.custom) {
		// Display a custom button
		var color = lol.Res.custom.color;
		var isDisabled = lol.Res.custom.isDisabled && lol.Res.custom.isDisabled(this);
		html+= '<p class="center"><button class="submit'+(color? ' '+color:'')+'" style="width:110px"'+(isDisabled?' disabled':'');
		html+= ' onclick="lol.Res.list[\''+this.id+'\'].'+lol.Res.custom.call+'();this.disabled=true;return ui.cancel(event);">';
		html+= lol.Res.custom.title+'</button></p>';
	}
	if (this.type && this.maxQuantity) {
		// Resources having a max quantity
		// Display a slider to change the quantity
		var log = Math.max(1,Math.log(this.maxQuantity)/4);
		html+= '<div class="find">';
		html+= '<div class="round slider quant ordquant" id="multSlider"';
		html+= 'log="'+log+'" xmin="0" min="1" max="'+this.maxQuantity+'" value="'+this.quantity+'"></div>';
		html+= '</div>';
	}
	else if (this.type && this.missingQuantity) {
		html+= '<p class="center red">'+__('Missing quantity')+__(':');
		html+= ' '+lol.Res.quantityAsString(this.missingQuantity,this.unit,true)+'</p>';
		if (this.owner.org) {
			// Purchase order for missing quantity
			lol.Res.find.quality = this.quality;
			lol.Res.find.quantity = this.missingQuantity;
			lol.Res.find.quantityMult = Math.min(lol.Res.find.quantityMult, 2.0);
			var quality = lol.Res.find.quality;
			var quantity = Math.round(lol.Res.find.quantity*lol.Res.find.quantityMult);
			var quantityMax = lol.Res.find.quantity*2;
			var log = Math.max(1,Math.log(quantityMax)/4);
			html+= '<div class="find">';
			html+= '<div class="round slider quant ordquant" id="findQuantSlider"';
			html+= 'log="'+log+'" xmin="0" min="1" max="'+quantityMax+'" value="'+quantity+'"></div>';
			html+= '<div class="round slider qual ordqual" id="findQualSlider"';
			html+= 'min="0.0" max="2.0" step="0.01" reverse="1" value="'+quality+'"></div>';
			html+= '<div id="findOrdForm" class="mini"><p class="center"><img src="'+ICONPATH+'/bar.gif"/></p></div>';
			html+= '</div>';
		}
	}
	else if (this.type && this.buyQuantity) {
		if (this.owner.org) {
			// Purchase order from a stock of resources 
			lol.Res.find.quality = this.quality;
			lol.Res.find.quantity = this.buyQuantity;
			lol.Res.find.quantityMult = Math.min(lol.Res.find.quantityMult, 1.0);
			var quality = lol.Res.find.quality;
			var quantity = Math.round(lol.Res.find.quantity*lol.Res.find.quantityMult);
			var quantityMax = lol.Res.find.quantity;
			var log = Math.max(1,Math.log(quantityMax)/4);
			html+= '<div class="find">';
			html+= '<div class="round slider quant ordquant" id="findQuantSlider"';
			html+= 'log="'+log+'" xmin="0" min="1" max="'+quantityMax+'" value="'+quantity+'"></div>';
			html+= '<div class="round slider qual ordqual" id="findQualSlider"';
			html+= 'min="0.0" max="2.0" step="0.01" reverse="1" value="'+quality+'"></div>';
			html+= '<div id="findOrdForm" class="mini"><p class="center"><img src="'+ICONPATH+'/bar.gif"/></p></div>';
			html+= '</div>';
		}
	}
	else if (this.type && this.sellQuantity) {
		if (this.owner.org) {
			// Sell order from a stock of resources 
			lol.Res.find.quantity = this.sellQuantity;
			lol.Res.find.quantityMult = Math.min(lol.Res.find.quantityMult, 1.0);
			var quantity = Math.round(lol.Res.find.quantity*lol.Res.find.quantityMult);
			var quantityMax = lol.Res.find.quantity;
			var log = Math.max(1,Math.log(quantityMax)/4);
			html+= '<div class="find">';
			html+= '<div class="round slider quant ordquant" id="findQuantSlider"';
			html+= 'log="'+log+'" xmin="0" min="1" max="'+quantityMax+'" value="'+quantity+'"></div>';
			html+= '<div id="findOrdForm" class="mini"><p class="center"><img src="'+ICONPATH+'/bar.gif"/></p></div>';
			html+= '</div>';
		}
	}
	else if (this.type && this.droppedQuantity && !this.isRelic) {
		// Store dropped resources
		html+= '<table class="'+lol.Interaction.tableClass+'">';
		var resId = this.id;
		$('.store').each(function() {
			var id = parseInt($(this).attr('data-id'));
			var name = $(this).find('.name').text().trim();
			html+= '<tr class="pointer"';
			html+= ' onclick="lol.Res.list[\''+resId+'\'].store('+id+');return ui.cancel(event);">';
			html+= '<td class="icon"><img src="/img/status/store.png"></td>';
			html+= '<td>'+name+'<br><small>'+__('Store')+'</small>';
			html+= '</td>';
			html+= '</tr>';
		});
		html+= '</table>';
		if (this.canDelete) {
			html+= '<p class="center"><button class="red" onclick="lol.Res.delete(this);return ui.cancel(event);">';
			html+= __('Delete this resource')+'</button></p>';
		}
		html+= '<div class="confirm"></div>';
	}
	if (this.type) {
		// Display the management link
		var url = '/mgmt';
		if (this.owner.org && !this.owner.cost) url+= '/'+this.owner.org.id;
		url+= '/res:'+this.type;
		html+= '<p class="center"><a href="'+url+'">';
		html+= __('Manage this resource')+'</a></p>';
	}
	return html;
};

lol.Res.delete = function(button, confirmed) {
	var uinfo = $(button).closest('.uinfo');
	var id = uinfo.attr('data-id');
	var res = lol.Res.list[id];
	var div = uinfo.find('.confirm');
	if (confirmed === true) {
		// Delete the resource
		mqykkbj('res', {type:res.type, delete:true}, function(data) {
			lol.modal.close();
		});
		return;
	}
	// Show/hide the confirm panel
	var html = '<div>';
	var text = __('confirm.delete.res');
	html+= '<p class="center small red">'+text+'</p>';
	html+= '<p class="center">';
	html+= '<button class="submit red"';
	html+= ' onclick="lol.Res.delete(this,true)">';
	html+= __('Delete')+'</button>';
	html+= ' <button class="submit"';
	html+= ' onclick="lol.Res.delete(this,false)">';
	html+= __('Cancel')+'</button></p>';
	html+= '</div>';
	div.html(html);
	if (confirmed == false) div.slideUp();
	else div.slideDown();
};

// QUANTITY MULTIPLIER
lol.Res.mult = {
	current: null,
	changed: false,
};

lol.Res.mult.set = function(slider,done) {
	// Update the quantity
	var res = lol.Res.mult.current;
	var slider = $('#multSlider');
	res.quantity = parseInt(slider.val());
	$('#quant').html(lol.Res.quantityAsString(res.quantity,res.unit,true));
	lol.Res.mult.changed = true;
};

lol.Res.mult.onClose = function() {
	// Called when the resource info panel is closed
	if (!lol.Res.mult.changed) return;
	var res = lol.Res.mult.current;
	lol.Res.mult.update(res.quantity/res.maxQuantity);
	lol.Res.mult.changed = false;
};

lol.Res.mult.update = function(mult) {
	// Update the resource multiplier
};


// FINDING RESOURCES
lol.Res.find = {
	current: null,
	quality: 0.0,
	quantity: 1,
	quantityMult: 1.0,
	timeout: null,
};

lol.Res.find.setQuality = function(slider,done) {
	var slider = $('#findQualSlider');
	lol.Res.find.quality = slider.val();
	lol.Res.find.buy();
};

lol.Res.find.setBuyMultiplier = function(slider,done) {
	var slider = $('#findQuantSlider');
	lol.Res.find.quantityMult = slider.val()/lol.Res.find.quantity;
	lol.Res.find.buy();
};

lol.Res.find.setSellMultiplier = function(slider,done) {
	var slider = $('#findQuantSlider');
	lol.Res.find.quantityMult = slider.val()/lol.Res.find.quantity;
	lol.Res.find.sell();
};

lol.Res.find.buy = function() {
	clearTimeout(lol.Res.find.timeout);
	lol.Res.find.timeout = setTimeout(function() {
		lol.Res.find.timeout = null;
		var res = lol.Res.find.current;
		var quality = lol.Res.find.quality;
		var requiredQuantity = Math.round(lol.Res.find.quantityMult*lol.Res.find.quantity);
		var satisfy = res.missingQuantity && !res.demand.count;
		mqykkbj('find', {buy:res.type, org:res.owner.org.id, reg:lol.Res.regionId,
		quantity:requiredQuantity, quality:quality, satisfy:(satisfy?1:0)}, function(data) {
			if (!data) data = '!default';
			if (data.substr(0,1)=='!') {
				// Could not find sale offer
				var html = '<p class="center gray">'+__('find.'+data.substr(1))+'</p>';
			}
			else {
				data = data.split(':');
				var quantity = parseFloat(data[0]);
				var grossAmount = parseFloat(data[1]);
				var taxAmount = parseFloat(data[2]);
				var shipAmount = parseFloat(data[3]);
				var totalAmount = parseFloat(data[4]);
				var html = '<table class="small">';
				html+= '<tr><th>'+__('Quantity')+__(':')+'</th>';
				html+= '<td class="monospace">';
				html+= lol.Res.quantityAsString(quantity,res.unit)+'</td></tr>';
				html+= '<tr><th>'+__('Gross amount')+__(':')+'</th>';
				html+= '<td class="monospace">'+lol.money(grossAmount)+'</td></tr>';
				html+= '<tr><th>'+__('Trade tax')+__(':')+'</th>';
				html+= '<td class="monospace">'+lol.money(taxAmount)+'</td></tr>';
				if (shipAmount) {
					html+= '<tr><th>'+__('Shipping cost')+__(':')+'</th>';
					html+= '<td class="monospace">'+lol.money(shipAmount)+'</td></tr>';
				}
				html+= '<tr><th class="bold">'+__('Total amount')+__(':')+'</th>';
				html+= '<td class="monospace">'+lol.money(totalAmount)+'</td></tr>';
				html+= '</table>';
				html+= '<p class="center"><button class="submit green" style="width:110px"';
				html+= ' onclick="lol.Res.list[\''+res.id+'\'].buy('+quantity+','+quality+')';
				html+= ';this.disabled=true;return ui.cancel(event);">';
				html+= __('Buy')+'</button></p>';
			}
			$('#findOrdForm').html(html);
		}, true);
	}, lol.Premium?500:1000);
};

lol.Res.find.sell = function() {
	clearTimeout(lol.Res.find.timeout);
	lol.Res.find.timeout = setTimeout(function() {
		lol.Res.find.timeout = null;
		var res = lol.Res.find.current;
		var quality = res.quality;
		var requiredQuantity = Math.round(lol.Res.find.quantityMult*lol.Res.find.quantity);
		mqykkbj('find', {sell:res.type, org:res.owner.org.id, reg:lol.Res.regionId,
		ord:res.trade.order.id, quantity:requiredQuantity, quality:quality}, function(data) {			
			if (!data) data = '!default';
			if (data.substr(0,1)=='!') {
				// Could not find sale offer
				var html = '<p class="center gray">'+__('find.'+data.substr(1))+'</p>';
			}
			else {
				data = data.split(':');
				var quantity = parseFloat(data[0]);
				var grossAmount = parseFloat(data[1]);
				var taxAmount = parseFloat(data[2]);
				var shipAmount = parseFloat(data[3]);
				var totalAmount = parseFloat(data[4]);
				var html = '<table class="small">';
				html+= '<tr><th>'+__('Quantity')+__(':')+'</th>';
				html+= '<td class="monospace">';
				html+= lol.Res.quantityAsString(quantity,res.unit)+'</td></tr>';
				html+= '<tr><th>'+__('Gross amount')+__(':')+'</th>';
				html+= '<td class="monospace">'+lol.money(grossAmount)+'</td></tr>';
				html+= '<tr><th>'+__('Trade tax')+__(':')+'</th>';
				html+= '<td class="monospace">'+lol.money(taxAmount)+'</td></tr>';
				if (shipAmount) {
					html+= '<tr><th>'+__('Shipping cost')+__(':')+'</th>';
					html+= '<td class="monospace">'+lol.money(shipAmount)+'</td></tr>';
				}
				html+= '<tr><th class="bold">'+__('Net amount')+__(':')+'</th>';
				html+= '<td class="monospace'+(totalAmount<=0?' red':'')+'">'+lol.money(totalAmount)+'</td></tr>';
				html+= '</table>';
				html+= '<p class="center"><button class="submit red" style="width:110px"';
				if (!quantity) html+= ' disabled';
				html+= ' onclick="lol.Res.list[\''+res.id+'\'].sell('+quantity+','+quality+')';
				html+= ';this.disabled=true;return ui.cancel(event);">';
				html+= __('Sell')+'</button></p>';
			}
			if (res.isStock) {
				html+= '<p class="center"><button class="submit" style="width:110px"';
				html+= ' onclick="lol.Res.list[\''+res.id+'\'].drop('+requiredQuantity+','+quality+')';
				html+= ';this.disabled=true;return ui.cancel(event);">';
				html+= __('Extract')+'</button><br>';
				html+= '<small class="gray">('+__('central square')+')</small><br>';
				html+= '<small><img class="txt" src="'+ICONPATH+'/drop.png">';
				html+= lol.Res.quantityAsString(requiredQuantity,res.unit)+'</small><p>';
			}
			$('#findOrdForm').html(html);
		}, true);
	}, lol.Premium?500:1000);
};


// SHOWING INFO
lol.Res.prototype.showInfo = function() {
	// Display resource's detailed information
	lol.modal.open('<div class="uinfo round" data-id="'+this.id+'">'+this.infoHTML()+'</div>');
	if (this.maxQuantity) {
		// Quantity multiplier
		$('#multSlider').change(lol.Res.mult.set);
		lol.Res.mult.current = this;
		lol.modal.onClose = lol.Res.mult.onClose;
	}
	else if (this.missingQuantity || this.buyQuantity) {
		if (!this.owner.org) return;
		// Purchase the resource at best price
		$('#findQualSlider').change(lol.Res.find.setQuality);
		$('#findQuantSlider').change(lol.Res.find.setBuyMultiplier);
		lol.Res.find.current = this;
		lol.Res.find.buy();
	}
	else if (this.sellQuantity) {
		if (!this.owner.org) return;
		// Sell the resource at best price
		$('#findQuantSlider').change(lol.Res.find.setSellMultiplier);
		lol.Res.find.current = this;
		lol.Res.find.sell();
	}
};

lol.Res.prototype.buy = function(quantity,quality) {
	var res = this;
	mqykkbj('order', {type:res.type, org:res.owner.org.id, reg:lol.Res.regionId,
	quantity:quantity, quality:quality, exec:0}, function(data) {
		if (!data) return; // failed
		data = data.split(':');
		quantity = parseInt(data[0]);
		if (!quantity) return; // no purchase
		if (lol.Notif.sound) ui.Sound.playNow('cash');
		$('#findOrdForm button.submit').remove();
		// Update the resource
		if (res.missingQuantity) {
			// Did purchase missing quantity
			var left = Math.max(0, res.missingQuantity-quantity);
			if (res.demand.count) {
				// Demands are treated atomically
				var ndemand = res.missingQuantity/res.demand.count;
				res.demand.count = Math.floor(left/ndemand);
				left = Math.ceil(res.demand.count*ndemand);
			}
			var ratio = Math.max(0,left/res.missingQuantity);
			res.volume = Math.ceil(ratio*res.volume*100);
			res.value = Math.round(ratio*res.value*100)/100;
			res.trade.region.value = Math.round(ratio*res.trade.region.value*100)/100;
			res.missingQuantity = left;
		}
		else if (res.buyQuantity) {
			// Did purchase quantity from the stock
			var ratio = Math.max(0, (res.quantity-quantity)/res.quantity);
			res.volume = Math.ceil(ratio*res.volume);
			res.value = Math.round(ratio*res.value*100)/100;
			res.trade.region.value = Math.round(ratio*res.trade.region.value*100)/100;
			res.quantity = Math.max(0, res.quantity-quantity);
			res.buyQuantity = quantity;
		}
		res.didBuy();
		lol.Money.update(res.owner.org.id);
		// Close the modal window
		lol.modal.close();
	});
};

lol.Res.prototype.sell = function(quantity,quality) {
	var res = this;
	mqykkbj('order', {type:res.type, org:res.owner.org.id, reg:lol.Res.regionId,
	quantity:quantity, quality:quality, ord:res.trade.order.id, exec:1}, function(data) {
		if (!data) return; // failed
		data = data.split(':');
		quantity = parseInt(data[0]);
		if (!quantity) return; // no purchase
		if (lol.Notif.sound) ui.Sound.playNow('cash');
		$('#findOrdForm button.submit').remove();
		// Update the resource
		if (res.sellQuantity) {
			var ratio = Math.max(0, (res.quantity-quantity)/res.quantity);
			res.quantity = Math.max(0, res.quantity-quantity);
			res.volume = Math.round(ratio*res.volume*100)/100;
			res.value = Math.round(ratio*res.value*100)/100;
			res.trade.region.value = Math.round(ratio*res.trade.region.value*100)/100;
			res.sellQuantity = quantity;
		}
		res.didSell();
		lol.Money.update(res.owner.org.id);
		// Close the modal window
		lol.modal.close();
	});
};

lol.Res.prototype.drop = function(quantity,quality) {
	var res = this;
	mqykkbj('res', {type:res.type, org:res.owner.org.id,
	drop:quantity}, function(data) {
		if (!data) return; // failed
		data = data.split(':');
		if (lol.Notif.sound) ui.Sound.playNow('drop');
		$('#findOrdForm button.submit').remove();
		// Update the resource
		if (res.sellQuantity) {
			var ratio = Math.max(0, (res.quantity-quantity)/res.quantity);
			res.quantity = Math.max(0, res.quantity-quantity);
			res.volume = Math.round(ratio*res.volume*100)/100;
			res.value = Math.round(ratio*res.value*100)/100;
			res.trade.region.value = Math.round(ratio*res.trade.region.value*100)/100;
			res.sellQuantity = quantity;
		}
		res.didDrop();
		// Close the modal window
		lol.modal.close();
	});
};

lol.Res.prototype.didBuy = function() {
	// Implemented by scripts
};

lol.Res.prototype.didSell = function() {
	// Implemented by scripts
};

lol.Res.prototype.didDrop = function() {
	// Implemented by scripts
};

// STORING
lol.Res.prototype.store = function(storeId) {
	mqykkbj('store', {id:storeId, load:this.type}, function(data) {
		// Close the modal window
		lol.modal.close();
	});
};


// Categories
lol.Res.cats = {};

lol.Res.catItemHTML = function(cat) {
	var img = cat? '/img/cat/res.'+cat+'.png':BTNPATH+'/all.png';
	var html = '<table class="catitem" data-filter="'+(cat?'*'+cat:'')+'"';
	html+= ' onclick="return lol.Mgmt.selectCat(this)"><tr>';
	html+= '<td class="icon"><img class="round" src="'+img+'"/></td>';
	html+= '<td class="name">'+(cat? lol.Res.cats[cat]:__('All categories'))+'</td>';
	html+= '</tr></table>';
	return html;
};

lol.Res.catMenuHTML = function(filter) {
	var html = '<div class="catgroup">';
	html+= '<div class="catmenu">';
	html+= lol.Res.catItemHTML('');
	for (var cat in lol.Res.cats) html+= lol.Res.catItemHTML(cat);
	html+= '</div>';
	var cat = filter.substr(0,1)=='*'? filter.substr(1):'';
	var img = cat? '/img/cat/res.'+cat+'.png':BTNPATH+'/all.png';
	html+= '<button class="caticon round"';
	html+= ' title="'+(cat?lol.Res.cats[cat]:__('All categories'))+'"';
	html+= ' onclick="return lol.Mgmt.showCatMenu(this)">';
	html+= '<img src="'+img+'">';
	html+= '</button>';
	html+= '</div>';
	return html;
};


lol.Money = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a money requirement
	var n = 0;
	var data = data.split(sep);
	this.title = data[n++];
	this.payer = {
		id: parseInt(data[n++]),
		blazon: data[n++],
		name: data[n++],
	};
	this.totalAmount = parseFloat(data[n++]);
	this.missingAmount = parseFloat(data[n++]);
	this.canManage = parseInt(data[n++])?true:false;
	// Beneficiaries
	this.beneficiaries = [];
	while (n < data.length) {
		var bdata = data[n++].split('=');
		this.beneficiaries.push({
			id: parseInt(bdata[0]),
			name: bdata[1],
			amount: parseFloat(bdata[2]),
		});
	}
	this.id = '*'+lol.Money.defaultId++;
	lol.Money.list[this.id] = this;
};

lol.Money.list = {};
lol.Money.defaultId = 1;

// HTML
lol.Money.prototype.actionIconHTML = function(onclick, isOptional, isStrict) {
	if (!onclick) onclick = 'lol.Money.list[\''+this.id+'\'].showInfo()';
	var title = ''+this.totalAmount;
	var className = 'acticon round';
	if (this.missingAmount) className+= ' missing';
	var html = '<button class="'+className+'" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/res/money.png"/>';
	if (this.missingAmount) {
		// Display error icon
		html+= '<div class="quant"><img class="txt" src="'+ICONPATH+'/error.png"></div>';
	}
	else {
		// Display quantity
		html+= '<div class="quant">'+lol.hmoney(this.totalAmount)+'</div>';
	}
	html+= '</button> ';
	return html;
};

lol.Money.prototype.infoHTML = function() {
	var html = '';
	html+= '<h2 class="center">';
	html+= this.title? this.title:__('Money transfer');
	html+= '</h2>';
	html+= '<p class="center">';
	html+= '<a href="/arm/org/'+this.payer.id+'">'+this.payer.name+'</a>';
	html+= '</p>';
	html+= '<p class="center pict">';
	html+= '<img class="round" src="/img/res/money.pt.jpg"/>';
	html+= '</p>';
	html+= '<div class="find"><div id="findOrdForm">';
	html+= '<table class="small">';
	for (var i in this.beneficiaries) {
		html+= '<tr><th style="width:100%">'+this.beneficiaries[i].name+__(':')+'</th>';
		html+= '<td>'+lol.money(this.beneficiaries[i].amount)+'</td></tr>';
	}
	html+= '<tr><th class="bold">'+__('Total amount')+__(':')+'</th>';
	html+= '<td>'+lol.money(this.totalAmount)+'</td></tr>';
	html+= '</table>';
	html+= '</div></div>';
	if (this.missingAmount) {
		html+= '<p class="center red">'+__('Missing amount')+__(':');
		html+= ' '+lol.money(this.missingAmount)+'</p>';
	}
	if (this.canManage) {
		// Display the management link
		html+= '<p class="center"><a href="/mgmt/'+this.payer.id+'/finances">';
		html+= __('Manage finances')+'</a></p>';
	}
	return html;
};

// SHOWING INFO
lol.Money.prototype.showInfo = function() {
	// Display money detailed information
	lol.modal.open('<div class="uinfo round">'+this.infoHTML()+'</div>');
};

lol.Money.updateTimeout = null;
lol.Money.update = function(oid) {
	// Update the money
	clearTimeout(lol.Money.updateTimeout);
	lol.Money.updateTimeout = setTimeout(function() {
		lol.Money.updateTimeout = null;
		mqykkbj('org', {org:oid,money:null}, function(data) {
			if (!data) return;
			var money = parseFloat(data);
			// Update the menu
			var span = $('.menu > a[href="/mgmt/'+oid+'/finances"] > span.value.floatRight');
			span.removeClass('gold red').addClass(money>=0? 'gold':'red');
			span.html(lol.hmoney(money));
			// Update the cards
			var span = $('.card[data-id="'+oid+'"] > div > .money');
			span.removeClass('gold red').addClass(money>=0? 'gold':'red');
			span.html('<img class="txt" src="'+ICONPATH+'/money'+(money<0?'.red':'')+'.png"> '
			+lol.hmoney(Math.abs(money)));
		}, true);
	}, lol.Premium? 500:1000);
};

// MONEY
lol.Money.updateCash = function(orgId, money) {
	// Update cash display for the passed organization id
	var className = money<0? 'red':'gold';
	$('.cash[data-org="'+orgId+'"]').html(lol.money(money)).removeClass('red gold').addClass(className);
	$('.hcash[data-org="'+orgId+'"]').html(lol.hmoney(money)).removeClass('red gold').addClass(className);
};







lol.Building = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a building
	var n = 0;
	var data = data.split(sep);
	this.id = parseInt(data[n++]);
	this.type = data[n++];
	this.level = parseInt(data[n++]);
	this.status = data[n++];
	this.name = data[n++];
	this.quality = parseFloat(data[n++]);
	this.state = parseFloat(data[n++]);
	this.x = parseInt(data[n++]);
	this.y = parseInt(data[n++]);
	this.value = parseFloat(data[n++]);
	this.isIncompatible = parseInt(data[n++])?true:false;
	// Building owner
	this.owner = {
		id: parseInt(data[n++]),
		blazon: data[n++],
		name: data[n++],
	};
	
	this.icon = this.type;
	if (!isNaN(this.level)) this.icon+= '.'+this.level+this.status;
	
	if (!this.id) this.id = '*'+lol.Building.defaultId++;
	lol.Building.list[this.id] = this;
};

lol.Building.list = {};
lol.Building.defaultId = 1;

lol.Building.qualityAsString = function(quality) {
	// Return the quality as a string
	return __('quality.'+Math.min(Math.floor(quality*2.5), 5));
};

lol.Building.qualityPercent = function(quality) {
	// Return the quality value as a percentage
	return Math.round(quality*50);
};

lol.Building.qualityHTML = function(quality) {
	// Return quality HTML code
	var width = Math.max(0,Math.round(100-quality*50));
	var title = lol.Building.qualityAsString(quality)+' ('+lol.Building.qualityPercent(quality)+'%)';
	var html = '<div class="qual round" title="'+title+'">';
	html+= '<div style="width:'+width+'%;"></div>';
	html+= '</div>';
	return html;
};

lol.Building.stateAsString = function(state) {
	return __('bstate.'+Math.round(state*4));
};

lol.Building.stateHTML = function(state, cluster) {
	var p = Math.round(state*100);
	var title = lol.Building.stateAsString(state)+' ('+p+'%)';
	var className = 'state'+(cluster?' roundTop':' round');
	var html = '<div class="'+className+'" title="'+title+'">';
	html+= '<div style="width:'+(state*100)+'%"></div></div>';
	return html;
};

// HTML
lol.Building.prototype.actionIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Building.list[\''+this.id+'\'].showInfo()';
	var title = this.name+'\n'+lol.Building.qualityAsString(this.quality)+' ('+lol.Building.qualityPercent(this.quality)+'%)';
	var html = '<button class="acticon round" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/bld/'+this.icon+'.png"/>';
	html+= '<div class="qual"><div style="width:'+Math.max(0,Math.round(100-this.quality*50))+'%;"></div></div>';
	html+= '</button> ';
	return html;
};

lol.Building.prototype.infoHTML = function() {
	var html = '<h2 class="center">'+this.name+'</h2>';
	html+= '<p class="center pict">';
	html+= '<img class="round" src="/img/bld/'+this.icon+'.pt.jpg"/>';
	html+= '</p>';
	html+= lol.Building.qualityHTML(this.quality);
	// Quality
	html+= '<p class="center">'+__('Quality')+__(':')+' <span class="gold">'+lol.Building.qualityPercent(this.quality)+'%</span></p>';
	return html;
};

lol.Building.prototype.showInfo = function() {
	// Display building's detailed information
	lol.modal.open('<div class="uinfo round">'+this.infoHTML()+'</div>');
};

// Categories
lol.Building.cats = {};

lol.Building.catItemHTML = function(cat) {
	var img = cat? '/img/cat/bld.'+cat+'.png':BTNPATH+'/all.png';
	var html = '<table class="catitem" data-filter="'+(cat?'*'+cat:'')+'"';
	html+= ' onclick="return lol.Mgmt.selectCat(this)"><tr>';
	html+= '<td class="icon"><img class="round" src="'+img+'"/></td>';
	html+= '<td class="name">'+(cat? lol.Building.cats[cat]:__('All categories'))+'</td>';
	html+= '</tr></table>';
	return html;
};

lol.Building.catMenuHTML = function(filter) {
	var html = '<div class="catgroup">';
	html+= '<div class="catmenu">';
	html+= lol.Building.catItemHTML('');
	for (var cat in lol.Building.cats) html+= lol.Building.catItemHTML(cat);
	html+= '</div>';
	var cat = filter.substr(0,1)=='*'? filter.substr(1):'';
	var img = cat? '/img/cat/bld.'+cat+'.png':BTNPATH+'/all.png';
	html+= '<button class="caticon round"';
	html+= ' title="'+(cat?lol.Building.cats[cat]:__('All categories'))+'"';
	html+= ' onclick="return lol.Mgmt.showCatMenu(this)">';
	html+= '<img src="'+img+'">';
	html+= '</button>';
	html+= '</div>';
	return html;
};

// Reroll
lol.Building.reroll = {
	cost: 1000,
	show: function(id,btype,blevel,bvar,bvars) {
		var html = '<div class="bpreview">';
		html+= '<img class="blur" width="60" src="/img/bld/'+btype+'.'+bvar+'.'+blevel+'.mp.png"/> ';
		html+= '<img class="blur arrow" src="'+ICONPATH+'/menu.png"/> ';
		for (var i=0; i<=bvars; i++) {
			if (i==bvar) continue;
			html+= '<img width="60" src="/img/bld/'+btype+'.'+i+'.'+blevel+'.mp.png"/> ';
		}
		html+= '</div>';
		html+= '<p class="center">';
		html+= lol.Tokens.buttonHTML(lol.Building.reroll.cost,
		'lol.Building.reroll.reroll('+id+')', null, 'submit red');
		html+= ' <button class="submit" onclick="lol.modal.close()">';
		html+= __('Cancel')+'</button></p>';
		html+= '</div>';
		lol.modal.open('<div class="uinfo round">'+html+'</div>');
	},
	reroll: function(id) {
		mqykkbj('bld', {id:id, reroll:null}, function(data) {
			if (!data) return;
			lol.Tokens.playSound();
			lol.Tokens.spend(lol.Building.reroll.cost);
			lol.Map.mini.updateWithTimeout();
			lol.modal.close();
		});
	},
};





lol.Ground = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a ground
	var n = 0;
	var data = data.split(sep);
	this.id = parseInt(data[n++]);
	this.type = data[n++];
	this.name = data[n++];
	this.quality = parseFloat(data[n++]);
	this.x = parseInt(data[n++]);
	this.y = parseInt(data[n++]);
	
	this.icon = this.type;
	
	if (!this.id) this.id = '*'+lol.Ground.defaultId++;
	lol.Ground.list[this.id] = this;
};

lol.Ground.list = {};
lol.Ground.defaultId = 1;

lol.Ground.qualityAsString = function(quality) {
	// Return the quality as a string
	return __('quality.'+Math.min(Math.floor(quality*2.5), 5));
};

lol.Ground.qualityPercent = function(quality) {
	// Return the quality value as a percentage
	return Math.round(quality*50);
};

lol.Ground.qualityHTML = function(quality) {
	// Return quality HTML code
	var width = Math.max(0,Math.round(100-quality*50));
	var title = lol.Ground.qualityAsString(quality)+' ('+lol.Ground.qualityPercent(quality)+'%)';
	var html = '<div class="qual round" title="'+title+'">';
	html+= '<div style="width:'+width+'%;"></div>';
	html+= '</div>';
	return html;
};

// HTML
lol.Ground.prototype.actionIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Ground.list[\''+this.id+'\'].showInfo()';
	var title = this.name+'\n'+lol.Ground.qualityAsString(this.quality)+' ('+lol.Ground.qualityPercent(this.quality)+'%)';
	var html = '<button class="acticon round" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/gnd/'+this.icon+'.jpg"/>';
	html+= '<div class="qual"><div style="width:'+Math.max(0,Math.round(100-this.quality*50))+'%;"></div></div>';
	html+= '</button> ';
	return html;
};

lol.Ground.prototype.infoHTML = function() {
	var html = '<h2 class="center">'+this.name+'</h2>';
	html+= '<p class="center pict">';
	html+= '<img class="round" src="/img/gnd/'+this.icon+'.pt.jpg"/>';
	html+= '</p>';
	html+= lol.Ground.qualityHTML(this.quality);
	// Quality
	html+= '<p class="center">'+__('Quality')+__(':')+' <span class="gold">'+lol.Ground.qualityPercent(this.quality)+'%</span></p>';
	return html;
};

lol.Ground.prototype.showInfo = function() {
	// Display ground detailed information
	lol.modal.open('<div class="uinfo round">'+this.infoHTML()+'</div>');
};





// ORGANIZATIONS
lol.Org = function(data) {
	// Initialize an organization
	var n = 0;
	var data = data.split('|');
	this.id = parseInt(data[n++]);
	this.name = data[n++];
	this.blazon = data[n++];
	this.motto = data[n++];
	this.encryptedMotto = data[n++];
	this.money = parseFloat(data[n++]);
	lol.Org.list[this.id] = this;
};

lol.Org.list = {};

$(document).ready(function() {

});


lol.Cult = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize a cult
	var n = 0;
	var data = data.split(sep);
	this.type = data[n++];
	this.name = data[n++];
	
	if (!this.id) this.id = '*'+lol.Cult.defaultId++;
	lol.Cult.list[this.id] = this;
};

lol.Cult.list = {};
lol.Cult.defaultId = 1;

// HTML
lol.Cult.prototype.actionIconHTML = function(onclick) {
	if (!onclick) onclick = 'lol.Cult.list[\''+this.id+'\'].showInfo()';
	var title = this.name;
	var className = 'acticon round';
	var html = '<button class="'+className+'" data-unit-id="'+this.id+'" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="/img/cult/'+this.type+'.png"/>';
	html+= '</button> ';
	return html;
};

lol.Cult.prototype.infoHTML = function() {
	var html = '<h2 class="center">'+this.name+'</h2>';
	html+= '<p class="center pict">';
	html+= '<img class="round" src="/img/cult/'+this.type+'.pt.jpg"/>';
	html+= '</p>';
	return html;
};

lol.Cult.prototype.showInfo = function() {
	// Display cult's detailed information
	lol.modal.open('<div class="uinfo round">'+this.infoHTML()+'</div>');
};




lol.Order = function(data, sep) {
	if (!sep) sep = '|';
	// Initialize an order
	var n = 0;
	var data = data.split(sep);
	this.id = parseFloat(data[n++]);
	this.created = parseInt(data[n++]);
	this.put = parseInt(data[n++]);
	this.auto = parseInt(data[n++]);
	this.quality = parseFloat(data[n++]);
	this.quantity = parseInt(data[n++]);
	this.price = parseFloat(data[n++]);
	this.volume = parseInt(data[n++]);
	this.dist = parseInt(data[n++]);
	this.amount = parseFloat(data[n++]);
	this.taxes = parseFloat(data[n++]);
	this.shipping = parseFloat(data[n++]);
	this.totalAmount = parseFloat(data[n++]);
	this.done = parseInt(data[n++]);
	this.isLiquidable = parseInt(data[n++])?true:false;
	lol.Order.list[this.id] = this;
};

lol.Order.list = {};

lol.Order.custodyRate = 0.25;
lol.Order.custody = function(price, quantity, done) {
	// Return the custody fees
	var custody = Math.round(price*(quantity-done)*lol.Order.custodyRate)/100;
	return Math.max(0, custody);
};

lol.Order.minPrice = function(quality) {
	// Return the minimum price based on quality
	var minPrice = parseFloat($('#ordbook').attr('data-min'));
	var factor = parseFloat($('#ordbook').attr('data-factor'));
	return Math.ceil(minPrice*(1+(factor-1)*quality/2)*100)/100;
};

lol.Order.prototype.html = function() {
	// Return HTML code to display an order
	var className = 'order pending '+(this.put?'sell':'buy');
	var html = '<div class="'+className+'" data-id="'+this.id+'"';
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),url(/img/res/'+lol.Trade.type+'.pt.jpg)">';
	html+= '<div class="title '+(this.put?'red':'green')+'">'+__(this.put?'SELL':'BUY');
	html+= ' <a class="blur" href="/help/res"><img class="txt" src="'+ICONPATH+'/help.png"/></a>';
	html+= ' <small class="gray">'+lol.Trade.res.name+' <span class="resqualtxt">'+lol.Res.qualityAsString(this.quality)+'</span></small>';
	html+= '</div>';
	if (this.put) {
		var minPrice = lol.Order.minPrice(this.quality);
		html+= '<div class="form" style="display:none">';
		html+= '<p><label>'+__('Limit price')+__(':')+'</label>';
		html+= ' <input name="price" type="text" value="'+this.price+'"';
		if (minPrice) html+= ' placeholder="'+minPrice+'"';
		html+= ' autocomplete="off" onkeyup="return lol.Order.editPriceDidChange(this,event)"></p>';
		html+= '<p class="center small">';
		html+= ' <button class="submit red" id="enter" onclick="lol.Order.editPrice(this,true)" disabled>'+__('OK')+'</button>';
		html+= ' <button class="submit red" onclick="lol.Order.editPrice(this,false)">'+__('Cancel')+'</button>';
		html+= '</p>';
		html+= '</div>';
	}
	html+= '<div class="resqual pointer" onclick="lol.Order.setQuality('+this.quality+')">'+lol.Res.qualityHTML(this.quality)+'</div>';
	html+= '<div class="content">';
	html+= '<table class="small">';
	html+= '<tr class="quantity"><th>'+__('Quantity')+(lol.Trade.res.unit?' ('+lol.Res.unitAsString(lol.Trade.res.unit)+')':'')+__(':')+'</th>';
	html+= '<td class="monospace">'+this.quantity+'</td></tr>';
	html+= '<tr class="price"><th>'+__('Limit price')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(this.price)+'</td></tr>';
	html+= '<tr class="volume"><th>'+__('Volume')+' (m³)'+__(':')+'</th>';
	html+= '<td class="monospace">'+this.volume+'</td></tr>';
	html+= '</table>';
	html+= '<table class="small">';
	html+= '<tr class="grossAmount gray"><th>'+__('Gross amount')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(this.amount)+'</td></tr>';
	html+= '<tr class="taxAmount gray"><th>'+__('Trade tax')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(this.taxes)+'</td></tr>';
	html+= '<tr class="shipAmount gray"><th>'+__('Shipping cost')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(this.shipping)+'</td></tr>';
	html+= '</table>';
	html+= '<table class="small amount">';
	html+= '<tr class="totalAmount gray"><th class="bold">'+__(this.put?'Net amount':'Total amount')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(this.totalAmount)+'</td></tr>';
	html+= '<tr class="custody gray"><th>'+__('Custody fees')+__(':')+'</th>';
	html+= '<td class="monospace">'+lol.money(lol.Order.custody(this.price,this.quantity,this.done))+'</td></tr>';
	html+= '</table>';
	html+= '<div class="buttons"><div>';
	if (this.put) {
		html+= '<button class="round" name="edit" onclick="return lol.Order.editPrice(this)" title="'+__('Edit')+'">';
		html+= '<img src="'+BTNPATH+'/edit.red.png"/></button> ';
	}
	html+= '<button class="round" onclick="return lol.Order.abort(this)" title="'+__('Abort order')+'">';
	html+= '<img src="'+BTNPATH+'/stop.'+(this.put?'red':'green')+'.png"/></button> ';
	if (this.put) {
		html+= '<button class="round"'+(this.isLiquidable?'':' disabled');
		html+= ' onclick="return lol.Order.sell(this)" title="'+__('Sell at any rate')+'">';
		html+= '<img src="'+BTNPATH+'/boost.red.png"/></button> ';
	}
	html+= '</div></div>';
	html+= '</div>';
	// Status bar
	var done = 100.0*this.done/this.quantity;
	var text1 = '';
	var text2 = '';
	if (this.auto) text1 = __('Automatic '+(this.put?'sale':'purchase'));
	else text1 = lol.Time.html(this.created, 0x177);
	if (!done) text2 = __('Waiting for '+(this.put?'buyers':'sellers'));
	else text2 = __('Partially executed');
	html+= '<div class="status">';
	html+= '<p class="left back">'+text1+'</p>';
	html+= '<p class="right back">'+text2+'</p>';
	html+= '<div class="progress">';
	html+= '<div style="width:'+done+'%">';
	html+= '<p class="left front">'+text1+'</p>';
	html+= '</div></div>';
	html+= '</div>';
	html+= '</div>';
	return html;
};

lol.Order.newHTML = function(put) {
	var quality = put? lol.Trade.res.quality:parseFloat($('#ordQualSlider').val());
	var quantity = put? lol.Trade.res.quantity:0;
	var className = 'order new '+(put?'sell':'buy');
	var html = '<div class="'+className+'" data-put="'+put+'"';
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),url(/img/res/'+lol.Trade.type+'.pt.jpg)">';
	html+= '<div class="title '+(put?'red':'green')+'">'+__(put?'SELL':'BUY');
	html+= ' <a class="blur" href="/help/res"><img class="txt" src="'+ICONPATH+'/help.png"/></a>';
	html+= ' <small class="gray">'+lol.Trade.res.name+' <span class="resqualtxt">'+lol.Res.qualityAsString(quality)+'</span></small>';
	html+= '</div>';
	html+= '<div class="form">';
	html+= '<p><label>'+__('Quantity')+(lol.Trade.res.unit?' ('+lol.Res.unitAsString(lol.Trade.res.unit)+')':'')+__(':')+'</label>';
	html+= ' <input name="quantity" type="text" value="'+(quantity?quantity:'')+'"';
	html+= ' autocomplete="off" onkeyup="return lol.Order.quantityDidChange(this,event)"></p>';
	html+= '<p><label>'+__('Limit price')+__(':')+'</label>';
	html+= ' <input name="price" type="text" value=""';
	html+= ' autocomplete="off" onkeyup="return lol.Order.priceDidChange(this,event)"></p>';
	html+= '<p class="right"><input name="now" type="checkbox" checked';
	html+= ' onchange="return lol.Order.deferDidChange(this,event)">';
	html+= ' <label>'+(put?__('Sell It Now'):__('Buy It Now'))+'</label></p>';
	html+= '</div>';
	html+= '<div class="resqual pointer"'+(put?' onclick="lol.Order.setQuality('+lol.Trade.res.quality+')"':'')+'>'+lol.Res.qualityHTML(quality)+'</div>';
	html+= '<div class="content">';
	html+= '<table class="small">';
	html+= '<tr class="quantity"><th>'+__('Quantity')+(lol.Trade.res.unit?' ('+lol.Res.unitAsString(lol.Trade.res.unit)+')':'')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '<tr class="price"><th>'+__('Limit price')+__(':')+'</th>';
	html+= '<td class="monospace ellipsis">-</td></tr>';
	html+= '<tr class="volume"><th>'+__('Volume')+' (m³)'+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '</table>';
	html+= '<table class="small amount">';
	html+= '<tr class="grossAmount"><th>'+__('Gross amount')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '<tr class="taxAmount"><th>'+__('Trade tax')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '<tr class="shipAmount"><th>'+__('Shipping cost')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '</table>';
	html+= '<table class="small amount">';
	html+= '<tr class="totalAmount"><th class="bold">'+__(put?'Net amount':'Total amount')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '<tr class="custody gray"><th>'+__('Custody fees')+__(':')+'</th>';
	html+= '<td class="monospace">-</td></tr>';
	html+= '</table>';
	html+= '<div class="buttons"><div>';
	html+= '<button class="round" name="start" disabled onclick="return lol.Order.start();" title="'+__(put?'Sell':'Buy')+'">';
	html+= '<img src="'+BTNPATH+'/start.'+(put?'red':'green')+'.png"/></button> ';
	html+= '</div></div>';
	html+= '</div>';
	html+= '<div class="status">';
	html+= '</div>';
	html+= '</div>';
	return html;
};

lol.Order.quantityDidChange = function(input,e) {
	var div = $('.order.new');
	div.find('button[name="start"]').prop('disabled',false);
	lol.Trade.updateOrderForm();
};

lol.Order.priceDidChange = function(input,e) {
	var div = $('.order.new');
	var price = parseFloat($(input).val().replace(',','.'));
	div.find('button[name="start"]').prop('disabled',false);
	if (!price) div.find('input[name="now"]').prop('checked', true);
	else if (!lol.Order.now) div.find('input[name="now"]').prop('checked', false);
	lol.Trade.updateOrderForm();
};

lol.Order.now = false;
lol.Order.deferDidChange = function(input,e) {
	var div = $('.order.new');
	lol.Order.now = $(input).prop('checked'); // record immediate/deferred by default
	div.find('button[name="start"]').prop('disabled',false);
	lol.Trade.updateOrderForm();
};

lol.Order.args = function() {
	var div = $('.order.new');
	var put = parseInt(div.attr('data-put'));
	var quality = put? lol.Trade.res.quality:parseFloat($('#ordQualSlider').val());
	var quantity = parseInt(div.find('input[name="quantity"]').val());
	var price = parseFloat(div.find('input[name="price"]').val().replace(',','.'));
	var defer = div.find('input[name="now"]').prop('checked')?0:1;
	if (isNaN(quantity)) quantity = 0;
	if (isNaN(price)) price = 0;
	if (quantity < 0) quantity = 0;
	if (price < 0) price = 0;
	quantity = Math.round(quantity);
	price = Math.round(price*10000)/10000;
	return {put:put,quality:quality,quantity:quantity,price:price,defer:defer};
};

lol.Order.start = function(button) {
	var args = lol.Order.args();
	var div = $('.order.new');
	div.find('button[name="start"]').prop('disabled',true);
	mqykkbj('order', {org:lol.Trade.res.owner.org.id, type:lol.Trade.type, reg:lol.Res.regionId,
	quality:args.quality, quantity:args.quantity, price:args.price, defer:args.defer, exec:args.put}, function(data) {
		if (!data) return; // failed
		if (lol.Notif.sound) ui.Sound.playNow('cash');
		lol.Trade.closeOrderForm();
	});
};

lol.Order.editPrice = function(button,submit) {
	// Edit the price of a sell order
	var div = $(button).closest('.order.pending');
	if (submit === true) {
		// Submit the new price
		div.find('.form button#enter').prop('disabled', true);
		var id = parseInt(div.attr('data-id'));
		var order = lol.Order.list[id];
		var price = parseFloat(div.find('.form input[name="price"]').val().replace(',','.'));
		if (!price) return;
		mqykkbj('ordlist', {org:lol.Trade.res.owner.org.id, id:id, price:price}, function(data) {
			if (!data) return;
			div.find('.form').css('display','none');
			if (lol.Notif.sound) ui.Sound.playNow('cash');
		});
		return;
	}
	if (submit === false) {
		// Cancel the edition
		div.find('.form').css('display','none');
		div.find('button[name="edit"]').prop('disabled', false);
		return;
	}
	// Show the price form
	$(button).prop('disabled', true);
	div.find('.form').css('display','block');
	div.find('.form input[name="price"]').focus();
};

lol.Order.editPriceDidChange = function(input, e) {
	var div = $(input).closest('.order.pending');
	var id = parseInt(div.attr('data-id'));
	var order = lol.Order.list[id];
	var price = parseFloat($(input).val().replace(',','.'));
	div.find('.form button#enter').prop('disabled', !price);
	switch (e.keyCode) {
		case 13: lol.Order.editPrice(input,true); break;
	}
};

lol.Order.abort = function(button) {
	// Cancel an order
	$(button).prop('disabled', true);
	var div = $(button).closest('.order.pending');
	var id = parseInt(div.attr('data-id'));
	mqykkbj('ordlist', {org:lol.Trade.res.owner.org.id, cancel:id}, function(data) {
		if (!data) return; // failed
		if (lol.Notif.sound) ui.Sound.playNow('cash');
		div.fadeOut();
	});
};

lol.Order.sell = function(button) {
	// Sell off an order
	$(button).prop('disabled', true);
	var div = $(button).closest('.order.pending');
	var id = parseInt(div.attr('data-id'));
	var order = lol.Order.list[id];
	mqykkbj('order', {org:lol.Trade.res.owner.org.id, type:lol.Trade.type, reg:lol.Res.regionId,
	quantity:(order.quantity-order.done), exec:1, ord:id}, function(data) {
		if (!data) return; // failed
		data = data.split(':');
		var quantity = parseInt(data[0]);
		var volume = parseInt(data[1]);
		var price = parseFloat(data[2]);
		var grossAmount = parseFloat(data[3]);
		var taxAmount = parseFloat(data[4]);
		var shipAmount = parseFloat(data[5]);
		var totalAmount = parseFloat(data[6]);
		if (!quantity) return; // no quantity sold
		if (lol.Notif.sound) ui.Sound.playNow('cash');
		// Update or delete the order
		order.quantity-= quantity;
		order.amount-= grossAmount;
		order.taxes-= taxAmount;
		order.shipping-= shipAmount;
		order.totalAmount-= totalAmount;
		order.isLiquidable = false;
		if (order.quantity<=order.done) div.fadeOut();
		else div.replaceWith(order.html());
	});
};


// ORDER BOOK
lol.Order.updateBookWithData = function(data) {
	// Update order book
	data = lol.XHR.decode(data).split('|');
	var data0 = data[0].split('$');
	var data1 = data[1].split('$');
	// Purchases
	var html = '';
	for (var i=0; i<5; i++) {
		if (data0[i]) {
			var ord = data0[i].split(':');
			var price = parseFloat(ord[0]);
			var quantity = parseInt(ord[1]);
			html+= '<tr class="ord'+(quantity?'':' rake')+'" data-put="0">';
			html+= '<td class="quant green left">'+(quantity?quantity:'XXXXX')+'</td>';
			html+= '<td class="price left">'+lol.money(price)+(quantity?'':'&thinsp;-')+'</td>';
			html+= '</tr>';
		}
		else html+= '<tr class="ord"><td>&nbsp;</td><td>&nbsp;</td></tr>';
	}
	$('#purchases').html(html);
	// Sales
	var html = '';
	for (var i=0; i<5; i++) {
		if (data1[i]) {
			var ord = data1[i].split(':');
			var price = parseFloat(ord[0]);
			var quantity = parseInt(ord[1]);
			html+= '<tr class="ord" data-put="1">';
			html+= '<td class="price right">'+lol.money(price)+'</td>';
			html+= '<td class="quant right red">'+(quantity?quantity:'XXXXX')+'</td>';
			html+= '</tr>';
		}
		else html+= '<tr class="ord"><td>&nbsp;</td><td>&nbsp;</td></tr>';
	}
	$('#sales').html(html);
	// Shortcut to a new order form
	if ($('#ordForm').length) {
		$('#purchases .ord, #sales .ord').addClass('pointer').click(lol.Trade.showOrderForm);
	}
};

lol.Order.updateTimeout = null;
lol.Order.updateBook = function(timeout) {
	// Update the order book
	clearTimeout(lol.Order.updateTimeout);
	if (!timeout) {
		lol.Order.updateTimeout = null;
		var type = $('#ordbook').attr('data-type');
		var reg = $('#ordbook').attr('data-reg');
		var qual = $('#ordQualSlider').val();
		mqykkbj('ordbook', {type:type,reg:reg,qual:qual}, lol.Order.updateBookWithData);
		return;
	}
	lol.Order.updateTimeout = setTimeout(lol.Order.updateBook, timeout);
};

lol.Order.setBookQuality = function(slider,done) {
	// Change the order book quality and update
	lol.Order.updateBook(lol.Premium?400:800);
};

lol.Order.setQuality = function(quality) {
	var slider = $('#ordQualSlider').get(0);
	ui.Slider.setVal(slider, quality);
	lol.Order.setBookQuality(slider,true);
};


lol.Order.layout = function() {
	// Show hide columns 
	var div = $('.ordcontainer');
	if (div.length) {
		var width = div.width();
		div.toggleClass('noHelp', width<440);
	}
};


// INIT
$(document).ready(function() {
	if ($('#ordbook').length) {
		// Layout the order book
		var norake = !parseInt($('#ordbook').attr('data-rake'));
		var html = '<table class="ordbook"><tr>';
		html+= '<td><table id="purchases"'+(norake?' class="norake"':'')+'></table></td>';
		html+= '<td><table id="sales"></table></td>';
		html+= '</tr></table>';
		// Update the data
		var data = $('#ordbook.data').text();
		$('#ordbook.data').html(html).removeClass('data');
		lol.Order.updateBookWithData(data);
	}
	if ($('#ordQualSlider').length) {
		// Actions on the quality slider
		$('#ordQualSlider').change(lol.Order.setBookQuality);
	}
	
	$(window).resize(lol.Order.layout)
	.on('orientationchange', lol.Order.layout);	
	lol.Order.layout();
});


lol.Action = function(data) {
	// Initialize an action
	var n = 0;
	var data = data.split('|');
	this.id = parseInt(data[n++]);
	this.type = data[n++];
	this.color = data[n++];
	this.isOffense = parseInt(data[n++])?true:false;
	this.shortcut = data[n++];
	this.info = data[n++];
	this.icons = data[n++].split(':');
	this.name = lol.str(data[n++]);
	this.orientation = lol.str(data[n++]);
	this.subtitle = lol.str(data[n++]);
	this.help = lol.str(data[n++]);
	this.relevance = parseFloat(data[n++]);
	this.duration = parseInt(data[n++]);
	this.deferred = parseInt(data[n++]);
	this.isExtra = parseInt(data[n++])?true:false;
	
	// Is action ready to start?
	this.token = data[n++];
	this.errorCode = data[n++];
	// The list of units
	this.units = [];
	var ulist = data[n++].split(',');
	for (var i in ulist) {
		if (!ulist[i]) continue;
		var unit = lol.Unit.load(ulist[i],':');
		this.units.push(unit);
	}
	// The list of missing skills
	this.missingSkills = [];
	var slist = data[n++].split(',');
	for (var i in slist) {
		if (!slist[i]) continue;
		var skill = new lol.Skill(slist[i],':');
		this.missingSkills.push(skill);
	}
	// Money requirements
	this.transactions = [];
	var mlist = data[n++].split(',');
	for (var i in mlist) {
		if (!mlist[i]) continue;
		var money = new lol.Money(mlist[i],':');
		this.transactions.push(money);
	}
	// The list of resources
	this.resources = [];
	var rlist = data[n++].split(',');
	for (var i in rlist) {
		if (!rlist[i]) continue;
		var res = new lol.Res(rlist[i],':');
		this.resources.push(res);
	}
	// The list of ingredients
	this.ingredients = [];
	var ilist = data[n++].split(',');
	for (var i in ilist) {
		if (!ilist[i]) continue;
		var ingredient = new lol.Ingredient(ilist[i],'/',':');
		this.ingredients.push(ingredient);
	}
	// The list of products
	this.products = [];
	var plist = data[n++].split(',');
	for (var i in plist) {
		if (!plist[i]) continue;
		var product = new lol.Res(plist[i],':');
		this.products.push(product);
	}
	// Building data
	var bdata = data[n++];
	if (bdata) {
		this.building = new lol.Building(bdata,':');
	}
	// Ground data
	var gdata = data[n++];
	if (gdata) {
		this.ground = new lol.Ground(gdata,':');
	}
	// Cult data
	var cdata = data[n++];
	if (cdata) {
		this.cult = new lol.Cult(cdata,':');
	}
	this.notice = lol.str(data[n++]);
	this.canRefresh = parseInt(data[n++]);

	if (this.id) {
		// Action is running
		this.frozen = 0;
		this.x = parseInt(data[n++]);
		this.y = parseInt(data[n++]);
		this.started = parseInt(data[n++]);
		this.ended = parseInt(data[n++]);
		this.paused = parseInt(data[n++]);
		this.recalc = parseInt(data[n++]);
		this.cost = parseInt(data[n++]);
		this.canAccept = parseInt(data[n++]);
		this.canAbort = parseInt(data[n++]);
		this.canBoost = parseInt(data[n++]);
		this.canSkip = parseInt(data[n++]);
		this.canAddUnits = parseInt(data[n++]);
		this.canReleaseUnits = parseInt(data[n++]);
		this.sound = data[n++];
	}
	
	if (!this.id) this.id = '*'+this.type+':'+this.info;
	lol.Action.list[this.id] = this;
};

lol.Action.list = {};
lol.Action.defaultId = 1;
lol.Action.maxUnits = 20;

lol.Action.qualityPercent = function(quality) {
	// Return the quality value as a percentage
	return Math.round(quality*50);
};

lol.Action.qualityHTML = function(quality) {
	// Return quality HTML code
	var width = Math.max(0,Math.round(100-quality*50));
	var title = lol.Action.qualityPercent(quality)+'%';
	var html = '<div class="qual round" title="'+title+'">';
	html+= '<div style="width:'+width+'%;"></div>';
	html+= '</div>';
	return html;
};

lol.Action.prototype.query = function(script, args, callback) {
	var act = this;
	act.frozen++;
	mqykkbj(script, args, function(data) {
		act.frozen--;
		if (callback) callback(data);
	});
};

lol.Action.prototype.selection = function() {
	// Return the action's selection
	var sel = '';
	for (var i in this.units) {
		if (i) sel+= ',';
		sel+= this.units[i].id;
	}
	return sel;
};

lol.Action.prototype.disableButtons = function() {
	$('.action[data-id="'+this.id+'"] .buttons button').prop('disabled',true);
};

lol.Action.prototype.start = function() {
	// Start the action
	if (this.errorCode) return;
	this.disableButtons();
	this.query('start', {token:this.token, type:this.type, info:this.info, sel:this.selection()}, function(data) {
		if (!data) return;
		lol.go(data);
	});
};

lol.Action.prototype.accept = function() {
	this.disableButtons();
	this.query('accept', {id:this.id});
};

lol.Action.prototype.abort = function() {
	this.disableButtons();
	this.query('abort', {id:this.id});
};

lol.Action.prototype.boost = function() {
	this.disableButtons();
	this.query('boost', {id:this.id}, function(data) {
		if (!data) return;
		var cost = parseInt(data);
		if (cost) lol.Tokens.spend(cost);
	});
};

lol.Action.prototype.skip = function() {
	this.disableButtons();
	this.query('skip', {id:this.id});
};

lol.Action.prototype.addUnits = function() {
	this.query('recalc', {id:this.id,add:lol.Unit.sel});
};

lol.Action.prototype.releaseUnit = function(unit) {
	this.query('recalc', {id:this.id,release:unit.id});
};

lol.Action.prototype.flush = function() {
	mqykkbj('flush', {id:this.id});
	this.recalc = 0;
};

lol.Action.prototype.flushIfNeeded = function() {
	// Flush if the action is being recalculated or terminated
	if (this.recalc) return this.flush();
	if (this.ended && lol.Time.now >= this.ended && !this.paused) return this.flush();
};

lol.Action.sound = true;
lol.Action.soundById = {};

lol.Action.prototype.playSound = function() {
	if (!lol.Action.sound) return; // sounds are disabled
	if (!this.sound) return; // no sound for this action
	// Ignore if a sound is already being played by same action
	if (lol.Action.soundById[this.id]) return;
	lol.Action.soundById[this.id] = this.sound;
	ui.Sound.play(this.sound);	
};

lol.Action.prototype.stopSound = function() {
	if (!this.sound) return; // this action has no sound
	// Check that there is not another action using this sound
	lol.Action.soundById[this.id] = null;
	for (var id in lol.Action.soundById) {
		var sound = lol.Action.soundById[id];
		if (sound == this.sound) return;
	}
	ui.Sound.stop(this.sound);	
};

// HTML
lol.Action.recalcIconHTML = function() {
	var title = __('Recalculating…');
	var html = '<button class="acticon selected round" disabled title="'+title+'">';
	html+= '<img src="/img/unit/x.png"/></button> ';
	return html;
};

lol.Action.prototype.unitAndResourceHTML = function(act) {
	// Return HTML to display an action's units, resources and building
	var html = '';
	if (this.cult) html+= this.cult.actionIconHTML()+' ';
	if (this.recalc && !this.units.length) html+= lol.Action.recalcIconHTML()+' ';
	for (var i in this.units) html+= this.units[i].actionIconHTML()+' ';
	if (this.started) html+= lol.Unit.actionAddIconHTML()+' ';
	for (var i in this.missingSkills) html+= this.missingSkills[i].actionIconHTML()+' ';
	for (var i in this.resources) html+= this.resources[i].actionIconHTML()+' ';
	for (var i in this.ingredients) html+= this.ingredients[i].actionIconHTML()+' ';
	for (var i in this.transactions) html+= this.transactions[i].actionIconHTML()+' ';
	if (this.building || this.ground || this.products.length) {
		html+= '<img class="prod" src="'+DIVPATH+'/prod.png"/> ';
		for (var i in this.products) html+= this.products[i].actionIconHTML()+' ';
		if (this.ground) html+= this.ground.actionIconHTML()+' ';
		if (this.building) html+= this.building.actionIconHTML()+' ';
	}
	return html;
};

lol.Action.prototype.newHTML = function() {
	// Return HTML code to display an action
	var className = 'action new '+this.color;
	if (this.errorCode) className+= ' failed';
	var html = '<div class="'+className+'" data-id="'+this.id+'"';
	var bgnd = 'url(/img/'+this.icons[0]+'.jpg)';
	for (var i=1;i<this.icons.length;i++) bgnd = 'url(/img/'+this.icons[i]+'.png),'+bgnd;
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),'+bgnd+'">';
	// Action title and shortcut
	html+= '<div class="title">';
	if (this.shortcut) html+= '<div class="shortcut">'+this.shortcut+'</div>';
	html+= '<span class="'+(this.errorCode?'gray':this.color)+'">'+this.name+'</span>';
	if (this.orientation) {
		html+= ' <img class="txt" src="'+ICONPATH+'/orient.'+this.orientation+'.png">';
	}
	if (this.isOffense) {
		html+= ' <img class="txt'+(this.errorCode?' blur':'')+'"';
		html+= ' src="'+ICONPATH+'/offense.png" title="'+__('Offensive action')+'">';
	}
	html+= ' <a class="blur" href="/help'+this.help+'"><img class="txt" src="'+ICONPATH+'/help.png"></a>';
	if (this.canRefresh) {
		// Refresh the action
		html+= ' <button class="blur" onclick="return lol.Area.act.refresh(this)"';
		html+= ' title="'+__('Refresh')+'"><img class="txt" src="'+ICONPATH+'/reset.png"/></button>';
	}
	if (this.subtitle) html+= ' <small class="gray">'+this.subtitle+'</small>';
	//if (this.relevance && !lol.Prod) html+= ' <small class="gray">('+(Math.round(this.relevance*100))+'%)</small>';
	html+= '</div>';
	// Units and resources
	html+= '<div class="content">';
	html+= '<div class="units">'+this.unitAndResourceHTML()+'</div>';
	if (!this.errorCode) {
		html+= '<div class="buttons"><div>';
		html+= '<button class="round" onclick="return lol.Area.act.start(this)"';
		html+= ' title="'+__('Start action')+'"><img src="'+BTNPATH+'/start.'+this.color+'.png"/></button> ';
		html+= '</div></div>';
	}
	html+= '</div>';
	if (this.notice) {
		html+= '<div class="notice">';
		html+= lol.BB.decode(this.notice,'notice')+'</div>';
	}
	// Status bar
	html+= '<div class="status">';
	if (this.errorCode) {
		html+= '<p class="center red">';
		html+= __('error.'+this.errorCode);
		if (this.errorCode == 'defer') html+= ' <span class="countdown bold">'+lol.Time.delay(this.deferred-lol.Time.now)+'</span>';
		html+= '</p>';
	} else {
		html+= '<p class="left back">'+lol.Time.delay(this.duration)+'</p>';
		html+= '<p class="right back completed">'+lol.Time.html(lol.Time.now+this.duration, 0x177)+'</p>';
	}
	html+= '</div>';
	html+= '</div>';
	return html;
};

lol.Action.prototype.runningHTML = function() {
	// Return HTML code to display an action
	var className = 'action running '+this.color;
	var html = '<div class="'+className+'" data-id="'+this.id+'"';
	var bgnd = 'url(/img/'+this.icons[0]+'.jpg)';
	for (var i=1;i<this.icons.length;i++) bgnd = 'url(/img/'+this.icons[i]+'.png),'+bgnd;
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),'+bgnd+'">';
	// Action title and shortcut
	html+= '<div class="title">';
	html+= '<span class="'+this.color+'">'+this.name+'</span>';
	if (this.isOffense) {
		html+= ' <img class="txt'+(this.errorCode?' blur':'')+'"';
		html+= ' src="'+ICONPATH+'/offense.png" title="'+__('Offensive action')+'">';
	}
	html+= ' <a class="blur" href="/help'+this.help+'"><img class="txt" src="'+ICONPATH+'/help.png"></a>';
	if (this.subtitle) html+= ' <small class="gray">'+this.subtitle+'</small>';
	html+= '</div>';
	// Units and resources
	html+= '<div class="content">';
	html+= '<div class="units">'+this.unitAndResourceHTML()+'</div>';
	html+= '<div class="buttons"><div>';
	if (this.paused) {
		// Show the paused button
		html+= '<button><img src="'+BTNPATH+'/paused.'+this.color+'.gif"/></button> ';
	}
	if (this.canAccept) {
		// Show the accept button
		html+= '<button class="round" onclick="return lol.Area.act.accept(this)"';
		html+= ' title="'+__('Accept')+'"><img src="'+BTNPATH+'/accept.png"/></button> ';
	}
	if (this.canAbort) {
		// Show the abort button
		html+= '<button name="abort" class="round" onclick="return lol.Area.act.abort(this)"';
		html+= ' title="'+__('Abort action')+'"><img src="'+BTNPATH+'/stop.'+this.color+'.png"/></button> ';
	}
	if (this.canBoost && this.ended > lol.Time.now) {
		// Show the boost button
		if (this.cost) {
			// Display the number of tokens
			html+= lol.Tokens.buttonHTML(this.cost,
			'return lol.Area.act.boost(this)', __('Complete action'), this.color);
		}
		else {
			// Display just the boost button
			html+= '<button class="round" onclick="return lol.Area.act.boost(this)"';
			html+= ' title="'+__('Complete action')+'"><img src="'+BTNPATH+'/boost.'+this.color+'.png"/></button> ';
		}
	}
	if (this.canSkip) {
		// Skip to another random value
		html+= '<button class="round" onclick="return lol.Area.act.skip(this)"';
		html+= ' title="'+__('Next')+'"><img src="'+BTNPATH+'/skip.'+this.color+'.png"/></button> ';
	}
	html+= '</div></div>';
	html+= '</div>';
	if (this.notice) html+= '<div class="notice">'+lol.BB.decode(this.notice,'notice')+'</div>';
	// Status bar
	html+= '<div class="status">';
	html+= '<p class="left back countdown">'+lol.Time.delay(this.ended-lol.Time.now)+'</p>';
	html+= '<p class="right back completed">'+lol.Time.html(Math.max(this.ended,lol.Time.now), 0x177)+'</p>';
	html+= '<div class="progress">';
	html+= '<div style="width:'+lol.Time.progress(this.started,this.ended)+'">';
	if (this.paused) html+= '<p class="center front">'+__('waiting for acceptance…')+'</p>';
	else html+= '<p class="left front countdown">'+lol.Time.delay(this.ended-lol.Time.now)+'</p>';
	html+= '</div></div>';
	html+= '</div>';
	html+= '</div>';
	return html;
};


lol.ActionLink = function(data) {
	// Initialize an action link
	var n = 0;
	var data = data.split(':');
	this.id = parseInt(data[n++]);
	this.type = data[n++];
	this.color = data[n++];
	this.x = data[n++];
	this.y = data[n++];
	this.name = lol.str(data[n++]);
	this.subtitle = lol.str(data[n++]);
	this.started = parseInt(data[n++]);
	this.ended = parseInt(data[n++]);
};

lol.ActionLink.prototype.html = function() {
	// Return HTML code to display an action link
	var html = '';
	var bgnd = 'url(/img/act/'+this.type+'.jpg)';
	var url = '/map/'+lol.Map.coordsToString(this.x, this.y);
	var html = '<div class="action link '+this.color+' pointer"';
	html+= ' style="background-image:url('+BGNDPATH+'/action.png),'+bgnd+'"';
	html+= ' data-started="'+this.started+'" data-ended="'+this.ended+'"';
	html+= ' onclick="lol.go(\''+url+'\')">';
	html+= '<div class="title">';
	html+= '<span class="red">'+this.name+'</span>';
	html+= ' <small class="gray">'+this.subtitle+'</small>';
	html+= '</div>';
	html+= '<div class="status">';
	html+= '<p class="left back countdown">'+lol.Time.delay(this.ended-lol.Time.now)+'</p>';
	html+= '<div class="progress">';
	html+= '<div style="width:'+lol.Time.progress(this.started,this.ended)+'">';
	html+= '<p class="left front countdown">'+lol.Time.delay(this.ended-lol.Time.now)+'</p>';
	html+= '</div></div>';
	html+= '</div></div>';
	return html;
};
	
lol.Ingredient = function(data, sep, sep2) {
	if (!sep) sep = '|';
	if (!sep2) sep2 = ':';
	// Initialize an ingredient
	var n = 0;
	var data = data.split(sep);
	this.hash = data[n++];
	this.skill = {
		key:data[n++],
		name:lol.str(data[n++]),
	};
	this.isOptional = parseInt(data[n++]);
	this.isStrict = parseInt(data[n++]);
	this.type = data[n++];
	this.manager = {id:parseInt(data[n++])};
	this.resources = [];
	while (n < data.length) {
		var res = new lol.Res(data[n++], sep2);
		res.ingredient = this;
		this.resources.push(res);
	}
	if (this.isOptional) {
		var res = new lol.Res('');
		res.ingredient = this;
		this.resources.push(res);
	}
	// Set the selected resource
	this.index = 0;
	for (var i in this.resources) {
		var res = this.resources[i];
		if (res.type != this.type) continue;
		this.index = i;
		break;
	}
	// Add to the list of ingredients
	this.id = '*'+lol.Ingredient.defaultId++;
	lol.Ingredient.list[this.id] = this;
};

lol.Ingredient.list = {};
lol.Ingredient.defaultId = 1;

// HTML
lol.Ingredient.prototype.defaultIconHTML = function() {
	var onclick = 'lol.Ingredient.list[\''+this.id+'\'].selectIndex(this,-1)';
	var title = '';
	if (this.skill.name) {
		title+= this.skill.name+'\n';
	}
	title+= __('Default resource');
	var className = 'acticon round';
	var html = '<button class="'+className+'" title="'+title+'"';
	html+= ' onclick="'+onclick+'"><img src="'+BTNPATH+'/default.png"/>';
	html+= '</button> ';
	return html;
};

lol.Ingredient.prototype.actionIconHTML = function(onclick) {
	if (this.resources.length == 1) {
		var res = this.resources[0];
		return res.actionIconHTML('lol.Res.list[\''+res.id+'\'].showInfo()', this.isOptional, this.isStrict);
	}
	var html = '<div class="actgroup" data-ing="'+this.id+'">';
	// Ingredient menu
	html+= '<div class="actmenu">';
	html+= '<div class="actitem">'+this.defaultIconHTML()+'</div>';
	for (var i in this.resources) {
		var res = this.resources[i];
		html+= '<div class="actitem '+(i==this.index?'selected':'')+'">';
		html+= res.actionIconHTML('lol.Ingredient.list[\''+this.id+'\'].selectIndex(this,'+i+')',this.isOptional)+'</div>';
	}
	html+= '</div>';
	// Display resource
	var res = this.resources[this.index];
	if (res) html+= res.actionIconHTML('lol.Ingredient.list[\''+this.id+'\'].showMenu(this)', this.isOptional, this.isStrict);
	html+= '</div>';
	return html;
};

lol.Ingredient.hideMenu = function() {
	$('.actmenu').css('display', 'none');
};

lol.Ingredient.hideMenuTimeout = null;
lol.Ingredient.willHideMenu = function() {
	clearTimeout(lol.Ingredient.hideMenuTimeout);
	lol.Ingredient.hideMenuTimeout = setTimeout(lol.Ingredient.hideMenu, 400);
};

lol.Ingredient.cancelHideMenu = function() {
	clearTimeout(lol.Ingredient.hideMenuTimeout);
	lol.Ingredient.hideMenuTimeout = null;
};

lol.Ingredient.prototype.showMenu = function(button) {
	if ($('.actmenu:visible').length) {
		var res = this.resources[this.index];
		res.showInfo();
		return;
	}
	lol.Ingredient.hideMenu();
	var scrollTop = (this.index-0.5)*50;
	var menu = $(button).closest('.actgroup').find('.actmenu');
	menu.css({display:'block'}).scrollTop(scrollTop).hover(lol.Ingredient.cancelHideMenu, lol.Ingredient.willHideMenu);
	$('button.acticon').unbind('mouseenter').unbind('mouseleave');
	$(button).hover(lol.Ingredient.cancelHideMenu, lol.Ingredient.willHideMenu);
};

lol.Ingredient.prototype.showInfo = function() {
	// Display the selected resource's detailed information
	var res = this.resources[this.index];
	if (res) res.showInfo();
};

lol.Ingredient.prototype.selectedResource = function() {
	return this.resources[this.index];
};

lol.Ingredient.prototype.selectIndex = function(button, i, show) {
	if (!button) {
		// Find a button with the ingredient id
		var div = $('[data-ing="'+this.id+'"]');
		if (div.length) button = div.get(0);
	}
	if (i == -1) {
		// Default ingredient
		this.isStrict = 0;
	}
	else {
		// Select ingredient
		this.index = i;
		this.isStrict = 1;
		this.type = this.resources[i].type;
	}
	lol.Ingredient.onSelect(button, this, function(ingredient) {
		// Once the ingredient was updated, return the new ingredient
		var res = ingredient.selectedResource();
		if (res.missingQuantity) show = true;
		if (show) res.showInfo();
	});
	// Ingredient menu
	$(button).closest('.actgroup').replaceWith(this.actionIconHTML());
	lol.Ingredient.hideMenu();
};

lol.Ingredient.onSelect = function(button, ingredient, onUpdate) {
	// Default implementation
	if (onUpdate) onUpdate(ingredient);
};


lol.Interaction = function(unit,target,data, sep) {
	if (!sep) sep = '@';
	// Initialize an interaction
	this.unit = unit;
	this.target = target;
	var n = 0;
	if (data) {
		var data = data.split(sep);
		this.type = data[n++];
		this.info = data[n++];
		this.icon = data[n++];
		this.color = data[n++];
		this.isOffense = parseInt(data[n++])?true:false;
		this.title = lol.str(data[n++]);
		this.subtitle = lol.str(data[n++]);
		this.token = data[n++];
	}
	// Add to the list of interactions
	this.id = '*'+lol.Interaction.defaultId++;
	lol.Interaction.list[this.id] = this;
};

lol.Interaction.list = {};
lol.Interaction.defaultId = 1;

lol.Interaction.tableClass = 'inter round';
lol.Interaction.prototype.html = function() {
	if (!this.type) {
		// Separator
		return '</table><table class="'+lol.Interaction.tableClass+'">';
	}
	var html = '<tr class="pointer '+this.color+'" data-id="'+this.id+'"';
	html+= ' onclick="lol.Interaction.list[\''+this.id+'\'].start()">';
	html+= '<td class="icon"><img src="/img/status/'+this.icon+'.png"></td>';
	html+= '<td>'+this.title;
	if (this.isOffense) html+= ' <img class="txt" src="'+ICONPATH+'/offensew.png">';
	if (this.subtitle) html+= '<br><small>'+this.subtitle+'</small>';
	html+= '</td>';
	html+= '</tr>';
	return html;
};


// Interface
lol.Interaction.classes = 'inter melee polearm ranged capture exec gift';

lol.Interaction.moveBack = function(unit) {
	// Move the unit back to its position
	var div = $('#agrid .unit[data-id="'+unit.id+'"]').get(0);
	if (div) lol.Area.unit.moveBack(div);
};

lol.Interaction.inProgress = false;
lol.Interaction.prototype.start = function() {
	// Start an interaction
	var unit = this.unit;
	lol.Interaction.inProgress = true;
	mqykkbj('inter', {id:unit?unit.id:0,target:this.target?this.target.id:0,
	token:this.token,type:this.type,info:this.info},
	function(data) {
		$('#agrid .unit').removeClass('target');
		lol.modal.close();
		lol.Interaction.inProgress = false;
		if (unit) lol.Interaction.moveBack(unit);
	});
};

lol.Interaction.showMenu = function(unit, target) {
	// Ask the server the possible types of interactions and open the modal panel
	mqykkbj('inter', {id:unit.id,target:target?target.id:0},
	function(data) {
		// Decode the returned data
		if (!data) return lol.Interaction.moveBack(unit);
		data = lol.XHR.decode(data).split('#');
		if (data[0] != unit.id) return lol.Interaction.moveBack(unit);
		if (target) if (data[1] != target.id) return lol.Interaction.moveBack(unit);
		var menuData = data[2];
		if (!menuData) return lol.Interaction.moveBack(unit);
		var html = '';
		// Display unit icons
		html+= '<p class="center pict">';
		html+= '<img class="round actor" src="/img/unit/'+unit.icon+'.png"/>';
		if (target) html+= ' <img src="'+DIVPATH+'/inter.png"> <img class="round target" src="/img/unit/'+target.icon+'.png"/>';
		html+= '</p>';
		// Display unit names
		html+= '<h2 class="center">'+unit.name;
		if (target) html+= ' / '+target.name;
		html+= '</h2>';
		// Make the table of interactions
		html+= '<table class="'+lol.Interaction.tableClass+'">';
		// Decode the interactions
		menuData = menuData.split(',');
		for (var i in menuData) {
			var interaction = new lol.Interaction(unit,target,menuData[i]);
			html+= interaction.html();
		}
		html+= '</table>';
		// Open the modal panel
		lol.modal.open('<div class="uinter round">'+html+'</div>', function() {
			lol.Interaction.moveBack(unit);
		});
	});
};


