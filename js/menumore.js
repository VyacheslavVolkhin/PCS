class ResponsiveMenu {
    constructor(menuContainer, menuSelector, moreItemSelector, dropdownSelector) {
        this.menuContainer = menuContainer;
        this.menu = menuContainer.querySelector(menuSelector);
        this.moreItem = this.menu.querySelector(moreItemSelector);
        this.dropdown = this.menu.querySelector(dropdownSelector);
        this.menuItems = Array.from(this.menu.children).filter(item => !item.classList.contains('menu-more'));
        
        // Добавляем флаг для отслеживания состояния
        this.isActive = false;
        this.resizeObserver = null;
        
        this.init();
    }

    init() {
		this.activateMenu();
    }

    activateMenu() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        // Показываем все элементы меню
        this.menuItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Двойной rAF гарантирует, что браузер завершил layout до первого расчёта
        requestAnimationFrame(() => requestAnimationFrame(() => this.calculateMenu()));
        
        // Используем ResizeObserver для отслеживания изменений размера контейнера
        this.resizeObserver = new ResizeObserver(() => {
            if (this.isActive) {
                this.calculateMenu();
            }
        });
        this.resizeObserver.observe(this.menuContainer);
        
        // Также оставляем обработчик resize для безопасности
        window.addEventListener('resize', this.handleResize);
    }

    deactivateMenu() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        // Отключаем наблюдатель
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        // Убираем обработчик resize
        window.removeEventListener('resize', this.handleResize);
        
        // Восстанавливаем исходное состояние меню
        this.menuItems.forEach(item => {
            item.style.display = '';
        });
        
        // Скрываем кнопку "Еще"
        this.moreItem.classList.remove('active');
        
        // Очищаем выпадающий список
        this.dropdown.innerHTML = '';
    }

    handleResize = () => {
        if (this.isActive) {
            this.calculateMenu();
        }
    }

    calculateMenu() {
        if (!this.isActive) return;
        
        // Сначала показываем все элементы
        this.menuItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Очищаем выпадающий список
        this.dropdown.innerHTML = '';
        
        const containerWidth = this.menuContainer.offsetWidth;
        let totalWidth = 0;
        let itemsToMove = [];
        
        // Временно показываем кнопку "Еще" для измерения
        this.moreItem.style.display = 'block';
        const moreItemWidth = this.moreItem.offsetWidth;
        
        // Измеряем ширину всех элементов
        for (let i = 0; i < this.menuItems.length; i++) {
            const item = this.menuItems[i];
            const itemWidth = item.offsetWidth;
            
            // Проверяем, помещается ли элемент вместе с кнопкой "Еще"
            if (totalWidth + itemWidth + moreItemWidth <= containerWidth) {
                totalWidth += itemWidth;
            } else {
                itemsToMove = this.menuItems.slice(i);
                break;
            }
        }
        
        // Если есть элементы для перемещения - показываем кнопку "Еще"
        if (itemsToMove.length > 0) {
            this.moreItem.classList.add('active');
            this.populateDropdown(itemsToMove);
            
            // Скрываем перемещенные элементы
            itemsToMove.forEach(item => {
                item.style.display = 'none';
            });
        } else {
            this.moreItem.classList.remove('active');
        }
    }

    populateDropdown(items) {
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.style.display = 'block';
            
            // Находим все кнопки с классом btn-menu внутри клона и заменяем класс
            const buttons = clone.querySelectorAll('.btn-menu');
            buttons.forEach(btn => {
                btn.classList.remove('btn-menu');
                btn.classList.add('btn-submenu');
            });
            
            this.dropdown.appendChild(clone);
        });
    }
}

// Инициализация меню после загрузки DOM
window.addEventListener('load', () => {
    const menuContainer = document.querySelector('.header .menu-container');
    if (!menuContainer) return;

    const instance = new ResponsiveMenu(menuContainer, '.menu', '.menu-more', '.menu-more-ul');

    // Повторный расчёт после применения web-шрифтов
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => instance.calculateMenu());
    }
});