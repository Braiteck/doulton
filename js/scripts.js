$(() => {
	// Основной слайдер на главной
	$('.main_slider .slider').owlCarousel({
		items: 1,
		margin: 0,
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 750,
		autoplay: true,
		autoplayTimeout: 5000,
		onInitialized: (event) => {
			event.item.count < 10
				? $('.main_slider .count .total').text('0' + event.item.count)
				: $('.main_slider .count .total').text(event.item.count)
		},
		onTranslate: (event) => {
			let currentIndex = event.item.index - event.relatedTarget._clones.length / 2

			currentIndex < 0
				? currentIndex = event.item.count
				: currentIndex = currentIndex + 1

			if (currentIndex > event.item.count) { currentIndex = event.item.count }

			event.item.count < 10
				? $('.main_slider .count .current').text('0' + currentIndex)
				: $('.main_slider .count .current').text(currentIndex)
		}
	})


	// Инфо. блок
	$('.info_block .slider').owlCarousel({
		items: 1,
		margin: 0,
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 750,
		onInitialized: (event) => {
			event.item.count < 10
				? $('.info_block .count .total').text('0' + event.item.count)
				: $('.info_block .count .total').text(event.item.count)
		},
		onTranslate: (event) => {
			let currentIndex = event.item.index - event.relatedTarget._clones.length / 2

			currentIndex < 0
				? currentIndex = event.item.count
				: currentIndex = currentIndex + 1

			if (currentIndex > event.item.count) { currentIndex = event.item.count }

			event.item.count < 10
				? $('.info_block .count .current').text('0' + currentIndex)
				: $('.info_block .count .current').text(currentIndex)
		}
	})


	// Фиксация label при вводе в поле
	$('body').on('keydown', '.form .input, .form textarea', function () {
		let _self = $(this)

		setTimeout(() => {
			_self.val().length
				? _self.addClass('active')
				: _self.removeClass('active')
		})
	})


	// Показать/Скрыть пароль
	$('.form .view_btn').click(function (e) {
		e.preventDefault()

		if (!$(this).hasClass('active')) {
			$(this).addClass('active')
			$(this).closest('.field').find('.input').prop('type', 'text')
		} else {
			$(this).removeClass('active')
			$(this).closest('.field').find('.input').prop('type', 'password')
		}
	})


	// Спойлер в характеристиках
	$('body').on('click', '.features_block .list .spoler_link', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.list')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')

			$parent.find('.hide').slideUp(500)
		} else {
			$(this).addClass('active')

			$parent.find('.hide').slideDown(500)
		}
	})


	// Товар
	$('.product_info .images .big .slider').owlCarousel({
		items: 1,
		margin: 20,
		loop: false,
		smartSpeed: 500,
		nav: false,
		responsive: {
			0: {
				dots: true
			},
			480: {
				dots: false
			}
		},
		onTranslate: (event) => {
			const parent = $(event.target).closest('.images')

			parent.find('.thumbs button').removeClass('active')
			parent.find('.thumbs button:eq(' + event.item.index + ')').addClass('active')
		}
	})

	$('.product_info .images .thumbs button').click(function (e) {
		e.preventDefault()

		const parent = $(this).closest('.images')

		parent.find('.big .slider').trigger('to.owl', $(this).data('slide-index'))
	})


	// Календарь
	$('.date_input').datepicker({
		autoClose: true,
		maxDate: new Date()
	})


	// Отправка форм
	$('body').on('submit', '#register_modal .form', function (e) {
		e.preventDefault()

		$.fancybox.close()

		$.fancybox.open({
			src: '#register_success_modal',
			type: 'inline',
			touch: false
		})
	})

	$('body').on('submit', '#edit_info_modal .form', function (e) {
		e.preventDefault()

		$.fancybox.close()

		$.fancybox.open({
			src: '#edit_info_success_modal',
			type: 'inline',
			touch: false
		})
	})


	// Анимация появления элементов
	inView.offset($(window).innerHeight() * 0.15)

	if ($('.how_it_work').length) {
		inView('.how_it_work .items .item')
			.on('enter', function (el) {
				$(el).addClass('animate')
			})
	}


	// Залипание блока
	$('.page_links').stick_in_parent()
})



$(window).on('load', () => {
	// Выравнивание элементов в сетке
	$('.promo_products .row').each(function () {
		promoProductsHeight($(this), parseInt($(this).css('--promo_products_count')))
	})

	$('.advantages .row').each(function () {
		advantageHeight($(this), parseInt($(this).css('--advantages_count')))
	})

	$('.documents .row').each(function () {
		documentHeight($(this), parseInt($(this).css('--documents_count')))
	})
})



$(window).resize(() => {
	// Выравнивание элементов в сетке
	$('.promo_products .row').each(function () {
		promoProductsHeight($(this), parseInt($(this).css('--promo_products_count')))
	})

	$('.advantages .row').each(function () {
		advantageHeight($(this), parseInt($(this).css('--advantages_count')))
	})

	$('.documents .row').each(function () {
		documentHeight($(this), parseInt($(this).css('--documents_count')))
	})
})


// Выравнивание преимуществ
function promoProductsHeight(context, step) {
	let start = 0,
		finish = step,
		$advantages = context.find('.product')

	$advantages.find('.name, .desc').height('auto')

	$advantages.each(function () {
		setHeight($advantages.slice(start, finish).find('.name'))
		setHeight($advantages.slice(start, finish).find('.desc'))

		start = start + step
		finish = finish + step
	})
}

// Выравнивание преимуществ
function advantageHeight(context, step) {
	let start = 0,
		finish = step,
		$advantages = context.find('.item')

	$advantages.find('.name, .desc').height('auto')

	$advantages.each(function () {
		setHeight($advantages.slice(start, finish).find('.name'))
		setHeight($advantages.slice(start, finish).find('.desc'))

		start = start + step
		finish = finish + step
	})
}

// Выравнивание Документов
function documentHeight(context, step) {
	let start = 0,
		finish = step,
		$documents = context.find('.document')

	$documents.find('.name').height('auto')

	$documents.each(function () {
		setHeight($documents.slice(start, finish).find('.name'))

		start = start + step
		finish = finish + step
	})
}