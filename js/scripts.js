document.addEventListener("DOMContentLoaded", function() {

	//fancybox
	Fancybox.bind("[data-fancybox]", {
		//settings
	});


	//video
	const btnVideo = document.querySelectorAll(".js-btn-video");
	for (let i = 0; i < btnVideo.length; i++) {
	  btnVideo[i
		].addEventListener("click", function (e) {
		const videoURL = this.parentNode.dataset.video;
		this.parentNode.classList.add("active");
		this.parentNode.innerHTML += `<iframe width="100%" height="100%" src="${videoURL}" frameborder="0" allowfullscreen></iframe>`;
		e.preventDefault();
		});
	}


	//select toggle content visibility
	const inputs = document.querySelectorAll(
	  "input[data-content], input[data-content-check], input[data-content-uncheck]"
	);
  
	inputs.forEach(function (input) {
	  toggleContent(input);
	  });
  
	inputs.forEach((input) => {
	  input.addEventListener("click", function () {
		document.querySelectorAll(".frm-content").forEach((content) => {
		  content.classList.remove("active");
			  });
  
		inputs.forEach(toggleContent);
		  });
	  });
  
	document.querySelectorAll(".btn[data-content]").forEach((button) => {
	  button.addEventListener("click", function () {
		let dataContent = this.getAttribute("data-content");
		this.disabled = true;
		document
		  .querySelectorAll('.frm-content[data-content="' + dataContent + '"]')
		  .forEach((content) => {
			content.classList.add("active");
			  });
		return false;
		  });
	  });
  
	function toggleContent(input) {
	  let selectContent;
	  if (input.checked) {
		selectContent =
		  input.getAttribute("data-content-check") ||
		  input.getAttribute("data-content");
		  } else {
		selectContent = input.getAttribute("data-content-uncheck");
		  }
	  document
		.querySelectorAll('.frm-content[data-content="' + selectContent + '"]')
		.forEach((content) => {
		  content.classList.add("active");
		  });
	  }


	//field-password
	const passwordToggle = document.querySelectorAll(".js-password-toggle");
	for (let i = 0; i < passwordToggle.length; i++) {
	  passwordToggle[i
		].addEventListener("click", function (e) {
		if (this.classList.contains("active")) {
		  this.classList.remove("active");
		  const input = this.closest(".frm-field-input.field-password").querySelector(
			".form-input"
		  );
		  input.type = "password";
			} else {
		  this.classList.add("active");
		  const input = this.closest(".frm-field-input.field-password").querySelector(
			".form-input"
		  );
		  input.type = "text";
			}
		e.preventDefault();
		})
	}


	//field input clear and apply
	document.querySelectorAll('.frm-field-input').forEach(function (field) {
		const input = field.querySelector('.form-input');
		const btnClear = field.querySelector('.button-form-clear');
		const btnApply = field.querySelector('.button-form-apply');

		if (!input || (!btnClear && !btnApply)) return;

		function setButtonsState() {
			const hasValue = input.value.trim().length > 0;
			if (btnClear) btnClear.classList.toggle('button-disabled', !hasValue);
			if (btnApply) btnApply.classList.toggle('button-disabled', !hasValue);
		}

		// initial state on page load
		setButtonsState();

		// keep state in sync while typing/changing
		input.addEventListener('input', setButtonsState);
		input.addEventListener('change', setButtonsState);

		if (btnClear) {
			btnClear.addEventListener('click', function (e) {
				e.preventDefault();
				if (btnClear.classList.contains('button-disabled')) return;

				input.value = '';
				// notify other handlers/masks if needed
				input.dispatchEvent(new Event('input', { bubbles: true }));
				input.dispatchEvent(new Event('change', { bubbles: true }));
				input.focus();
			});
		}

		if (btnApply) {
			btnApply.addEventListener('click', function (e) {
				e.preventDefault();
				if (btnApply.classList.contains('button-disabled')) return;
				// тут ваша логика "применить/сохранить"
			});
		}
	});

	//side menu toggle
	document.querySelectorAll('.js-side-menu-toggle').forEach(function (el) {
		el.addEventListener('click', function (e) {
			var btn = document.querySelector('.side-menu-box .js-btn-popup-toggle')
			if (btn) btn.click()
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	})


	// field textarea counter with maxlength
	document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(function(textarea) {
		const max = textarea.getAttribute('maxlength');
		const counter = document.createElement('div');
		counter.className = 'field-input-counter';
		textarea.insertAdjacentElement('afterend', counter);
		function update() {
		const current = textarea.value.length;
		counter.textContent = current + '/' + max;
		counter.closest('.frm-field-input').classList.toggle('is-full', current >= max);
		}
		update();
		textarea.addEventListener('input', update);
	});


	//btn tgl and add
	let tglButtons = document.querySelectorAll('.js-btn-tgl')
	let addButtons = document.querySelectorAll('.js-btn-add')
	let buttonsTglOne = document.querySelectorAll('.js-btn-tgl-one');
	for (i = 0;i < tglButtons.length;i++) {
		tglButtons[i].addEventListener('click', function(e) {
			this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active')
			e.preventDefault()
			return false
		})
	}
	for (i = 0;i < addButtons.length;i++) {
		addButtons[i].addEventListener('click', function(e) {
			if (!this.classList.contains('active')) {
				this.classList.add('active');
				e.preventDefault()
				return false
			}
		})
	}
	buttonsTglOne.forEach(function(button) {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			let toggleButtonsWrap = this.closest('.js-toggle-buttons');
	
			if (this.classList.contains('active')) {
				this.classList.remove('active');
			} else {
				toggleButtonsWrap.querySelectorAll('.js-btn-tgl-one').forEach(function(btn) {
					btn.classList.remove('active');
				});
				this.classList.add('active');
			}
			return false;
		});
	});

	//mask phone
	let telInputs = document.querySelectorAll('input[type="tel"]');
	if (telInputs.length > 0) {
		let im = new Inputmask("+7 (999) 999-99-99");
		im.mask(telInputs);
	}
    const phoneInput = document.querySelector('input[type="tel"]');
	const emailInput = document.querySelector('input[type="email"]');
    if (phoneInput) {
        const phoneContainer = phoneInput.closest('.frm-field-input');

        phoneInput.addEventListener('input', function() {
            const digits = this.value.replace(/\D/g, '');
            const isValid = digits.length === 11;
            updateValidationClass(phoneContainer, isValid);
        });
    }
    if (emailInput) {
        const emailContainer = emailInput.closest('.frm-field-input');
        
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            const isValid = validateEmail(email);
            
            updateValidationClass(emailContainer, isValid);
        });
        
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const isValid = validateEmail(email);
            
            updateValidationClass(emailContainer, isValid);
        });
    }
	function updateValidationClass(container, isValid) {
		const input = container.querySelector('input');
		const hasValue = input.value.trim().length > 0;
		const isAutofilled = input.matches(':-webkit-autofill');
		const shouldBeVerified = isValid || isAutofilled;
		if (shouldBeVerified) {
			container.classList.add('inp-verify');
			container.classList.remove('inp-error');
			if (isAutofilled) {
				container.classList.add('inp-autofilled');
			} else {
				container.classList.remove('inp-autofilled');
			}
		} else {
			container.classList.remove('inp-verify', 'inp-autofilled');
			
			if (hasValue) {
				container.classList.add('inp-error');
			} else {
				container.classList.remove('inp-error');
			}
		}
	}
    function validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

	

	//js popup wrap
	const togglePopupButtons = document.querySelectorAll('.js-btn-popup-toggle')
	const closePopupButtons = document.querySelectorAll('.js-btn-popup-close')
	const popupElements = document.querySelectorAll('.js-popup-wrap')

	function popupElementsClear() {
		document.body.classList.remove('menu-show')
		document.body.classList.remove('filter-show')
		document.body.classList.remove('search-show')
		popupElements.forEach(element => element.classList.remove('popup-right'))
	}
	function popupElementsClose() {
		togglePopupButtons.forEach(element => {
			if (window.innerWidth < 1024) {
				if (!element.closest('.no-close-mobile') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}

			} else if  (window.innerWidth > 1023) {
				if (!element.closest('.no-close-desktop') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}
			} else {
				if (!element.closest('.no-close')) {
					element.classList.remove('active')
				}
			}
			
		})
	}
	function popupElementsContentPositionClass() {
		const wrapEl = document.querySelector('.wrap')
		const wrapWidth = wrapEl ? wrapEl.offsetWidth : 0
		popupElements.forEach(element => {
			let pLeft = element.offsetLeft
			let pWidth = element.querySelector('.js-popup-block').offsetWidth
			let pMax = pLeft + pWidth;
			if (pMax > wrapWidth) {
				element.classList.add('popup-right')
			} else {
				element.classList.remove('popup-right')
			}
		})
	}
	for (let i = 0; i < togglePopupButtons.length; i++) {
		togglePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			if (this.classList.contains('active')) {
				this.classList.remove('active')
			} else {
				popupElementsClose()
				this.classList.add('active')
				if (this.closest('.popup-menu-wrap')) {
					document.body.classList.add('menu-show')
				}
				if (this.closest('.popup-search-wrap')) {
					document.body.classList.add('search-show')
				}
				if (this.closest('.popup-filter-wrap')) {
					document.body.classList.add('filter-show')
				}
				popupElementsContentPositionClass()
			}
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (let i = 0; i < closePopupButtons.length; i++) {
		closePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			popupElementsClose()
			e.preventDefault()
			e.stopPropagation()
			return false;
		})
	}
	document.onclick = function (event) {
		if (!event.target.closest('.js-popup-block')) {
			popupElementsClear()
			popupElementsClose()
		}
	}
	popupElements.forEach(element => {
		if (element.classList.contains('js-popup-select')) {
			let popupElementSelectItem = element.querySelectorAll('.js-popup-block li a')
			if (element.querySelector('.js-popup-block .active')) {
				element.classList.add('select-active')
				let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
				let popupElementButton = element.querySelector('.js-btn-popup-toggle')
				popupElementButton.innerHTML = ''
				popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
			} else {
				element.classList.remove('select-active')
			}
			for (let i = 0; i < popupElementSelectItem.length; i++) {
				popupElementSelectItem[i].addEventListener('click', function (e) {
					this.closest('.js-popup-wrap').classList.add('select-active')
					if (this.closest('.js-popup-wrap').querySelector('.js-popup-block .active')) {
						this.closest('.js-popup-wrap').querySelector('.js-popup-block .active').classList.remove('active')
					}
					this.classList.add('active')
					let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
					let popupElementButton = element.querySelector('.js-btn-popup-toggle')
					popupElementButton.innerHTML = ''
					popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
					popupElementsClear()
					popupElementsClose()
					if (!this.closest('.js-tabs-nav')) {
						e.preventDefault()
						e.stopPropagation()
						return false
					}
				})
			}
		}
	})


	//js tabs
	const tabsNav = document.querySelectorAll('.js-tabs-nav')
	const tabsBlocks = document.querySelectorAll('.js-tab-block')
	const tabsButtonTitle = document.querySelectorAll('.js-tab-title')
	const tabsButtonContent = document.querySelectorAll('.js-tab-content')
	function tabsActiveStart() {
		for (iTab = 0; iTab < tabsBlocks.length; iTab++) {
			if (tabsBlocks[iTab].classList.contains('active')) {
				tabsBlocks[iTab].classList.remove('active')
			}
		}
		for (i = 0; i < tabsNav.length; i++) {
			let tabsNavElements = tabsNav[i].querySelectorAll('[data-tab]')
			for (iElements = 0; iElements < tabsNavElements.length; iElements++) {
				if (tabsNavElements[iElements].classList.contains('active')) {
					let tabsNavElementActive = tabsNavElements[iElements].dataset.tab
					for (j = 0; j < tabsBlocks.length; j++) {
						if (tabsBlocks[j].dataset.tab.toString().split(' ').indexOf(tabsNavElementActive) > -1) {
							tabsBlocks[j].classList.add('active')
						}
					}
				}
			}
		}
		
	}
	for (i = 0; i < tabsButtonTitle.length; i++) {
		tabsButtonTitle[i].addEventListener('click', function (e) {
			this.classList.toggle('active')
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (i = 0; i < tabsNav.length; i++) {
		tabsNav[i].addEventListener('click', function (e) {
			if (e.target.closest('[data-tab]')) {
				let tabsNavElements = this.querySelector('[data-tab].active')
				tabsNavElements ? tabsNavElements.classList.remove('active') : false
				e.target.closest('[data-tab]').classList.add('active')
				tabsActiveStart()
				e.preventDefault()
				e.stopPropagation()
				return false
			}
		})
	}
	tabsActiveStart()



	// Popups
	let popupCurrent;
	let popupsList = document.querySelectorAll('.popup-outer-box');
	let popupTimer = null;

	document.querySelectorAll(".js-popup-open").forEach(function (element) {
		element.addEventListener("click", function (e) {
			document.querySelector(".popup-outer-box")?.classList.remove("active");
			document.body.classList.add("popup-open");
			if (popupTimer) {
			clearTimeout(popupTimer);
			popupTimer = null;
			}
			
			for (let i = 0; i < popupsList.length; i++) {
			popupsList[i].classList.remove("active");
			}

			popupCurrent = this.getAttribute("data-popup");
			const popupElement = document.querySelector(`.popup-outer-box[id="${popupCurrent}"]`);
			popupElement.classList.add("active");

			const timerValue = this.getAttribute("data-popup-timer");
			if (timerValue) {
			const timerMs = parseInt(timerValue);
			if (!isNaN(timerMs) && timerMs > 0) {
				popupTimer = setTimeout(function() {
				document.body.classList.remove("popup-open");
				document.body.classList.remove("popup-open-scroll");
				popupElement.classList.remove("active");
				popupTimer = null;
				}, timerMs);
			}
			}

			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	});

	document.querySelectorAll(".js-popup-close").forEach(function (element) {
		element.addEventListener("click", function (event) {
			if (popupTimer) {
			clearTimeout(popupTimer);
			popupTimer = null;
			}
			
			document.body.classList.remove("popup-open");
			for (let i = 0; i < popupsList.length; i++) {
			popupsList[i].classList.remove("active");
			}
			event.preventDefault();
			event.stopPropagation();
		});
	});

	// document.querySelectorAll(".popup-outer-box").forEach(function (element) {
	// 	element.addEventListener("click", function (event) {
	// 		if (!event.target.closest(".popup-box")) {
	// 		if (popupTimer) {
	// 			clearTimeout(popupTimer);
	// 			popupTimer = null;
	// 		}
			
	// 		document.body.classList.remove("popup-open");
	// 		document.body.classList.remove("popup-open-scroll");
	// 		document.querySelectorAll(".popup-outer-box").forEach(function (e) {
	// 			e.classList.remove("active");
	// 		});
	// 		return false;
	// 		}
	// 	});
	// });


	//slider tabs
	const sliderstabs = document.querySelectorAll(".slider-tabs");
	sliderstabs.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const nextEl = container.querySelector(".button-slider-tabs-next");
		const prevEl = container.querySelector(".button-slider-tabs-prev");
		if (!swiperEl) return;
		const swiper = new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: false,
			freeMode: true,
			speed: 400,
			pagination: false,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
		const clickButtonTabInActiveSlide = () => {
			const slides = swiper.slides;
			const activeIndex = swiper.activeIndex;
			const activeSlide = slides[activeIndex];
			if (activeSlide) {
				const buttonTab = activeSlide.querySelector('.button-tab');
				if (buttonTab) {
					buttonTab.click();
				}
			}
		};
		clickButtonTabInActiveSlide();
		swiper.on('slideChange', clickButtonTabInActiveSlide);
	});

	

	//slider tiles
	const sliderstiles = document.querySelectorAll(".slider-tiles");
	
	sliderstiles.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const paginationEl = container.querySelector(".slider-tiles-pagination");
		const nextEl = container.querySelector(".button-slider-tiles-next");
		const prevEl = container.querySelector(".button-slider-tiles-prev");
	
		if (!swiperEl) return;
	const hasAutoHeight = container.dataset.height === "auto";
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: hasAutoHeight,
			speed: 400,
			pagination: {
				el: paginationEl,
				clickable: true,
			},
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});


	//slider catalog menu
	const sliderscatalogmenu = document.querySelectorAll(".slider-catalogmenu");
	sliderscatalogmenu.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		if (!swiperEl) return;
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: false,
			speed: 400,
			pagination: false,
			autoplay: false,
			navigation: false,
			freeMode: true,
			centeredSlides: true,
			initialSlide: 10,
		});
	});


	//slider apps buttons
	const slidersapps = document.querySelectorAll(".slider-apps");
	
	slidersapps.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const paginationEl = container.querySelector(".slider-apps-pagination");
		const nextEl = container.querySelector(".button-slider-apps-next");
		const prevEl = container.querySelector(".button-slider-apps-prev");
	
		if (!swiperEl) return;
		const hasAutoHeight = container.dataset.height === "auto";
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: hasAutoHeight,
			speed: 400,
			pagination: {
				el: paginationEl,
				clickable: true,
			},
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});


	//slider objects
	const slidersobjects = document.querySelectorAll(".slider-objects");
	
	slidersobjects.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const nextEl = container.querySelector(".button-slider-objects-next");
		const prevEl = container.querySelector(".button-slider-objects-prev");
	
		if (!swiperEl) return;
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: false,
			speed: 400,
			pagination: false,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});


	//slider menu app
	const slidersmenu = document.querySelectorAll(".slider-menu");
	
	slidersmenu.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const nextEl = container.querySelector(".button-slider-menu-next");
		const prevEl = container.querySelector(".button-slider-menu-prev");
	
		if (!swiperEl) return;
	const hasAutoHeight = container.dataset.height === "auto";
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: hasAutoHeight,
			speed: 400,
			pagination: false,
			freeMode: true,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});
	
	
})



//steps actions in LK
document.addEventListener("DOMContentLoaded", function() {
    const stepButtons = document.querySelectorAll('.btn-step');
    const stepContents = document.querySelectorAll('[data-step]');
    const nextActions = document.querySelectorAll('.action-next .btn');
    const prevActions = document.querySelectorAll('.action-prev .btn');

    if (!stepButtons.length || !stepContents.length) return;

    const getCurrentStep = function() {
        const active = document.querySelector('.btn-step.active');
        return active ? active.dataset.step : null;
    };

    const updateContent = function(stepId) {
        stepContents.forEach(function(el) {
            el.classList.toggle('active', el.dataset.step === stepId);
        });
    };

    const updateButtons = function() {
        const activeBtn = document.querySelector('.btn-step.active');
        if (!activeBtn) return;
        
        const allBtns = Array.from(stepButtons);
        const currentIndex = allBtns.indexOf(activeBtn);
        
        prevActions.forEach(function(btn) {
            btn.classList.toggle('button-disabled', currentIndex === 0);
        });
        
        nextActions.forEach(function(btn) {
            btn.classList.toggle('button-disabled', currentIndex === allBtns.length - 1);
        });
    };

    const setActiveStep = function(stepElement) {
        if (!stepElement) return;
        stepButtons.forEach(function(btn) {
            btn.classList.remove('active');
        });
        stepElement.classList.add('active');
        updateContent(stepElement.dataset.step);
        updateButtons();
    };

    const init = function() {
        let activeBtn = document.querySelector('.btn-step.active');
        if (!activeBtn) {
            activeBtn = stepButtons[0];
        }
        setActiveStep(activeBtn);
    };

    init();

    nextActions.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentActive = document.querySelector('.btn-step.active');
            if (!currentActive) return;
            
            const allBtns = Array.from(stepButtons);
            const currentIndex = allBtns.indexOf(currentActive);
            
            if (currentIndex < allBtns.length - 1) {
                setActiveStep(allBtns[currentIndex + 1]);
            }
        });
    });

    prevActions.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentActive = document.querySelector('.btn-step.active');
            if (!currentActive) return;
            
            const allBtns = Array.from(stepButtons);
            const currentIndex = allBtns.indexOf(currentActive);
            
            if (currentIndex > 0) {
                setActiveStep(allBtns[currentIndex - 1]);
            }
        });
    });

    stepButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveStep(btn);
        });
    });
});