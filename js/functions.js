$(() => {
	// Проверка браузера
	if (!supportsCssVars()) {
		$('body').addClass('lock')
		$('.supports_error').addClass('show')
	}


	// Есть ли поддержка тач событий или это apple устройство
	if (!is_touch_device() || !/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) $('html').addClass('custom_scroll')


	// Ленивая загрузка
	setTimeout(() => {
		observer = lozad('.lozad', {
			rootMargin : '200px 0px',
			threshold  : 0,
			loaded     : (el) => el.classList.add('loaded')
		})

		observer.observe()
	}, 200)


	// Установка ширины стандартного скроллбара
	$(':root').css('--scroll_width', widthScroll() + 'px')


	// Маска ввода
	$('input[type=tel]').inputmask('+7 (999) 999 - 99 - 99', {
		showMaskOnHover: false
	})

	$('input.code_input').inputmask('999 - 9999 - 99 - 99 - 99 - 99', {
		showMaskOnHover: false
	})

	// Кастомный select
	$('select').niceSelect()


	// Fancybox
	$.fancybox.defaults.hash             = false
	$.fancybox.defaults.backFocus        = false
	$.fancybox.defaults.autoFocus        = false
	$.fancybox.defaults.animationEffect  = 'zoom'
	$.fancybox.defaults.transitionEffect = 'slide'
	$.fancybox.defaults.speed            = 500
	$.fancybox.defaults.gutter           = 40
	$.fancybox.defaults.i18n             = {
		'en': {
			CLOSE       : "Закрыть",
			NEXT        : "Следующий",
			PREV        : "Предыдущий",
			ERROR       : "Запрошенный контент не может быть загружен.<br /> Пожалуйста, повторите попытку позже.",
			PLAY_START  : "Запустить слайдшоу",
			PLAY_STOP   : "Остановить слайдшоу",
			FULL_SCREEN : "На весь экран",
			THUMBS      : "Миниатюры",
			DOWNLOAD    : "Скачать",
			SHARE       : "Поделиться",
			ZOOM        : "Увеличить"
		}
	}

	// Всплывающие окна
	$('body').on('click', '.modal_link', function(e) {
		e.preventDefault()

		$.fancybox.close(true)

		$.fancybox.open({
			src   : $(this).data('content'),
			type  : 'inline',
			touch : false
		})
	})

	// Закрытие всплывающего окна по произвольной кнопке
	$('body').on('click', '.modal .close', function(e) {
		e.preventDefault()

		$.fancybox.close(true)
	})

	// Увеличение картинки
	$('.fancy_img').fancybox({
		mobile : {
			clickSlide : "close"
		}
	})


	// Мини всплывающие окна
	$('.mini_modal_link').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')
			$('.overlay').fadeOut(300)

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_link').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')
			$('.overlay').fadeIn(300)

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Закрываем всплывашку при клике за её пределами
	$(document).click((e) => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_link').removeClass('active')

			if(!$('body').hasClass('menu_open')) $('.overlay').fadeOut(300)

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Плавная прокрутка к якорю
	// Работает и при прокрутке к табу
	$('.scroll_link').click(function(e) {
		e.preventDefault()

		let href      = $(this).data('anchor'),
			addOffset = 0

		if ($(this).data('offset')) addOffset = $(this).data('offset')

		if ($('.tabs button[data-content="' + href + ']"').length) {
			const $activeTab = $('.tabs button[data-content="'+ href +'"]'),
				  $parent    = $activeTab.closest('.tabs_container')

			$parent.find('> .tabs button, > .tab_content').removeClass('active')

			$activeTab.addClass('active')
			$(href).addClass('active')
		}

		$('html, body').stop().animate({ scrollTop: $(href).offset().top - addOffset }, 1000)
	})


	// Аккордион
	$('.accordion .item .title').click(function(e) {
		e.preventDefault()

		const $item      = $(this).closest('.item'),
			  $accordion = $(this).closest('.accordion')

		if ($item.hasClass('active')) {
			$item.removeClass('active').find('.data').slideUp(300)
		} else {
			$accordion.find('.item').removeClass('active')
			$accordion.find('.data').slideUp(300)

			$item.addClass('active').find('.data').slideDown(300)
		}
	})


	// Изменение количества товара
	$('body').on('click', '.amount .minus', function(e) {
		e.preventDefault()

		const $parent  = $(this).closest('.amount'),
			  $input   = $parent.find('.input'),
			  inputVal = parseFloat($input.val()),
			  minimum  = parseFloat($input.data('minimum')),
			  step     = parseFloat($input.data('step')),
			  unit     = $input.data('unit')

		if (inputVal > minimum) $input.val(inputVal - step + unit)
	})

	$('body').on('click', '.amount .plus', function(e) {
		e.preventDefault()

		const $parent  = $(this).closest('.amount'),
			  $input   = $parent.find('.input'),
			  inputVal = parseFloat($input.val()),
			  maximum  = parseFloat($input.data('maximum')),
			  step     = parseFloat($input.data('step')),
			  unit     = $input.data('unit')

		if (inputVal < maximum) $input.val(inputVal + step + unit)
	})

	$('.amount .input').keydown(function() {
		const _self   = $(this),
			  maximum = parseInt(_self.data('maximum'))

		setTimeout(() => {
			if(_self.val() == '' || _self.val() == 0) _self.val(parseInt(_self.data('minimum')))
			if(_self.val() > maximum) _self.val(maximum)
		})
	})


	// Табы
	var locationHash = window.location.hash

	$('body').on('click', '.tabs button', function(e) {
		e.preventDefault()

		if (!$(this).hasClass('active')) {
			const $parent           = $(this).closest('.tabs_container'),
				  activeTab         = $(this).data('content'),
				  $activeTabContent = $(activeTab),
				  level             = $(this).data('level')

			$parent.find('.tabs:first button').removeClass('active')
			$parent.find('.tab_content.' + level).removeClass('active')

			$(this).addClass('active')
			$activeTabContent.addClass('active')
		}
	})

	if (locationHash && $('.tabs_container').length) {
		const $activeTab        = $('.tabs button[data-content=' + locationHash + ']'),
			  $activeTabContent = $(locationHash),
			  $parent           = activeTab.closest('.tabs_container'),
			  level             = activeTab.data('level')

		$parent.find('.tabs:first button').removeClass('active')
		$parent.find('.tab_content.' + level).removeClass('active')

		$activeTab.addClass('active')
		$activeTabContent.addClass('active')

		$('html, body').stop().animate({ scrollTop: $activeTabContent.offset().top }, 1000)
	}


	// Моб. версия
	if ($(window).width() < 360) $('meta[name=viewport]').attr('content', 'width=360, user-scalable=no')


	// Моб. меню
	$('.mob_header .mob_menu_link').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_link').addClass('active')
		$('body').addClass('menu_open')
		$('header').addClass('show')
		$('.overlay').fadeIn(300)
	})

	$('header > .close, .overlay').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_link').removeClass('active')
		$('body').removeClass('menu_open')
		$('header').removeClass('show')
		$('.overlay').fadeOut(300)
	})


	if (is_touch_device()) {
		$('header .menu .item > a.sub_link').addClass('touch_link')

		$('header .menu .item > a.sub_link').click(function(e) {
			const $dropdown = $(this).next()

			if ($dropdown.css('visibility') === 'hidden') {
				e.preventDefault()

				$('header .menu .sub_menu').removeClass('show')
				$dropdown.addClass('show')
			}
		})


		// Закрытие моб. меню свайпом справо на лево
		let ts

		$('body').on('touchstart', (e) => { ts = e.originalEvent.touches[0].clientX })

		$('body').on('touchend', (e) => {
			let te = e.originalEvent.changedTouches[0].clientX

			if ($('body').hasClass('menu_open') && ts > te + 50) {
				// Свайп справо на лево
				$('.mob_header .mob_menu_link').removeClass('active')
				$('body').removeClass('menu_open')
				$('header').removeClass('show')
				$('.overlay').fadeOut(300)
			} else if (ts < te - 50) {
				// Свайп слева на право
			}
		})
	}
})



$(window).resize(() => {
	// Моб. версия
	$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1')

	if ($(window).width() < 360) $('meta[name=viewport]').attr('content', 'width=360, user-scalable=no')
})



// Вспомогательные функции
const setHeight = (className) => {
	let maxheight = 0

	className.each(function() {
		const elHeight = $(this).outerHeight()

		if (elHeight > maxheight) maxheight = elHeight
	})

	className.outerHeight(maxheight)
}


const is_touch_device = () => !!('ontouchstart' in window)


const widthScroll = () => {
	let div = document.createElement('div')

	div.style.overflowY  = 'scroll'
	div.style.width      = '50px'
	div.style.height     = '50px'
	div.style.visibility = 'hidden'

	document.body.appendChild(div)

	let scrollWidth = div.offsetWidth - div.clientWidth
	document.body.removeChild(div)

	return scrollWidth
}


const supportsCssVars = () => {
	let s = document.createElement('style'),
		support

	s.innerHTML = ":root { --tmp-var: bold; }"

	document.head.appendChild(s)

	support = !!(window.CSS && window.CSS.supports && window.CSS.supports('font-weight', 'var(--tmp-var)'))
	s.parentNode.removeChild(s)

	return support
}