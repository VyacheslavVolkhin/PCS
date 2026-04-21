document.addEventListener('DOMContentLoaded', function() {
    // Находим все блоки загрузки файлов на странице
    const uploadFields = document.querySelectorAll('.js-field-file-multiple');
    
    uploadFields.forEach(uploadField => {
        const fileInput = uploadField.querySelector('.js-field-input');
        const attachButton = uploadField.querySelector('.js-file-button-attach');
        
        // Инициализируем счетчик при загрузке
        const maxFiles = parseInt(fileInput.getAttribute('max')) || Infinity;
        updateUploadButtonState(uploadField, maxFiles);
        
        // Обработчик клика на кнопку "Выбрать файлы"
        attachButton.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
        
        // Обработчик изменения input file
        fileInput.addEventListener('change', function() {
            handleFiles(this.files, uploadField, fileInput);
        });
        
        // Обработчик drag and drop
        setupDragAndDrop(uploadField, fileInput);
    });
    
    // Обработчик удаления файлов (делегирование событий)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('button-file-del')) {
            e.preventDefault();
            const fileItem = e.target.closest('.frm-field-file');
            if (fileItem) {
                removeFileItem(fileItem);
            }
        }
    });
});

// Функция для обработки выбранных файлов
function handleFiles(files, uploadField, fileInput) {
    if (!files.length) return;
    
    // Получаем текущее количество файлов
    const currentFilesCount = getCurrentFilesCount(uploadField);
    const maxFiles = parseInt(fileInput.getAttribute('max')) || Infinity;
    
    // Фильтруем файлы, если достигнут лимит
    const filesArray = Array.from(files);
    let filesToAdd = filesArray;
    
    if (currentFilesCount + filesArray.length > maxFiles) {
        const availableSlots = maxFiles - currentFilesCount;
        if (availableSlots <= 0) {
            showErrorMessage(uploadField, `Максимальное количество файлов: ${maxFiles}`);
            fileInput.value = ''; // Очищаем input
            return;
        }
        filesToAdd = filesArray.slice(0, availableSlots);
        
        if (filesArray.length > availableSlots) {
            showErrorMessage(uploadField, `Можно добавить только ${availableSlots} файлов. Максимум: ${maxFiles}`);
        }
    }
    
    // Создаем контейнер для файлов, если его еще нет
    let filesContainer = uploadField.nextElementSibling;
    if (!filesContainer || !filesContainer.classList.contains('uploaded-files-container')) {
        filesContainer = document.createElement('div');
        filesContainer.className = 'uploaded-files-container';
        uploadField.parentNode.insertBefore(filesContainer, uploadField.nextSibling);
    }
    
    // Добавляем каждый файл
    filesToAdd.forEach(file => {
        addFileItem(file, filesContainer, fileInput, uploadField);
    });
    
    // Обновляем состояние кнопки загрузки
    updateUploadButtonState(uploadField, maxFiles);
    
    // Очищаем input
    fileInput.value = '';
}

// Функция для добавления элемента файла
function addFileItem(file, container, fileInput, uploadField) {
    const fileSize = formatFileSize(file.size);
    const fileId = generateFileId();
    
    // Проверяем, есть ли у uploadField класс upload-photos
    const isPhotoUpload = uploadField.classList.contains('upload-photos');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'frm-field-file-outer';
    fileItem.setAttribute('data-file-id', fileId);
    
    let fileContent = '';
    
    if (isPhotoUpload && file.type.startsWith('image/')) {
        // Для фотографий создаем превью
        fileContent = `
            <div class="frm-field-file type-photo">
                <div class="file-inner-wrap">
                    <div class="elm-photo photo-cover">
                        <img src="" alt="${file.name}" class="photo-img">
                    </div>
                    <div class="file-name">${file.name} <span class="file-title-info">${fileSize}</span></div>
                    <a href="#" class="btn-action-ico ico-clear button-file-del"></a>
                </div>
            </div>
        `;
    } else {
        // Обычный файл
        fileContent = `
            <div class="frm-field-file">
                <div class="file-inner-wrap">
                    <div class="file-name">${file.name} <span class="file-title-info">${fileSize}</span></div>
                    <a href="#" class="btn-action-ico ico-clear button-file-del"></a>
                </div>
            </div>
        `;
    }
    
    fileItem.innerHTML = fileContent;
    container.appendChild(fileItem);
    
    // Если это изображение, загружаем превью
    if (isPhotoUpload && file.type.startsWith('image/')) {
        createImagePreview(file, fileItem);
    }
    
    // Сохраняем файл в input
    addFileToInput(file, fileInput, fileId);
}

// Функция для создания превью изображения
function createImagePreview(file, fileItem) {
    const reader = new FileReader();
    const imgElement = fileItem.querySelector('.photo-img');
    
    reader.onload = function(e) {
        imgElement.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Функция для удаления элемента файла
function removeFileItem(fileItem) {
    const fileField = fileItem.closest('.frm-field-file-outer');
    if (!fileField) return; // Защита от null
    
    const fileId = fileField.getAttribute('data-file-id');
    const uploadField = fileField.parentElement.previousElementSibling;
    const fileInput = uploadField.querySelector('.js-field-input');
    
    // Сохраняем ссылку на контейнер файлов ДО удаления
    const filesContainer = fileField.parentElement;
    
    // Удаляем файл из input
    removeFileFromInput(fileId, fileInput);
    
    // Удаляем визуальный элемент
    fileField.remove();
    
    // Проверяем, пуст ли контейнер и удаляем его если нужно
    if (filesContainer && filesContainer.children.length === 0) {
        filesContainer.remove();
    }
    
    // Обновляем состояние кнопки загрузки
    const maxFiles = parseInt(fileInput.getAttribute('max')) || Infinity;
    updateUploadButtonState(uploadField, maxFiles);
}

// Функция для получения текущего количества файлов
function getCurrentFilesCount(uploadField) {
    if (!uploadField) return 0;
    
    const filesContainer = uploadField.nextElementSibling;
    if (!filesContainer || !filesContainer.classList.contains('uploaded-files-container')) {
        return 0;
    }
    return filesContainer.children.length;
}

// Функция для обновления состояния кнопки загрузки
function updateUploadButtonState(uploadField, maxFiles) {
    if (!uploadField) return;
    
    const currentCount = getCurrentFilesCount(uploadField);
    const attachButton = uploadField.querySelector('.js-file-button-attach');
    
    if (!attachButton) return;
    
    // Находим или создаем элемент счетчика
    let counterElement = uploadField.querySelector('.js-file-counter');
    if (!counterElement && maxFiles !== Infinity) {
        counterElement = createCounterElement(uploadField);
    }
    
    // Обновляем счетчик
    if (counterElement && maxFiles !== Infinity) {
        counterElement.textContent = `${currentCount}/${maxFiles}`;
    }
    
    // Блокируем кнопку, если достигнут лимит
    if (currentCount >= maxFiles) {
        //attachButton.style.opacity = '0.5';
        //attachButton.style.pointerEvents = 'none';
        attachButton.setAttribute('disabled', 'disabled');
    } else {
        //attachButton.style.opacity = '1';
        //attachButton.style.pointerEvents = 'auto';
        attachButton.removeAttribute('disabled');
    }
}

// Функция для создания элемента счетчика
function createCounterElement(uploadField) {
    if (!uploadField) return null;
    
    const attachButton = uploadField.querySelector('.js-file-button-attach');
    if (!attachButton) return null;
    
    const counterElement = document.createElement('span');
    counterElement.className = 'js-file-counter file-counter';
    //counterElement.style.marginLeft = '10px';
    //counterElement.style.fontSize = '12px';
    //counterElement.style.color = '#666';
    
    attachButton.parentNode.insertBefore(counterElement, attachButton.nextSibling);
    
    return counterElement;
}

// Функция для показа сообщения об ошибке
function showErrorMessage(uploadField, message) {
    // Удаляем предыдущее сообщение об ошибке
    const existingError = uploadField.querySelector('.file-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'file-error-message';
    //errorElement.style.color = '#ff0000';
    //errorElement.style.fontSize = '12px';
    //errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    uploadField.appendChild(errorElement);
    
    // Автоматически удаляем сообщение через 3 секунды
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

// Функция для добавления файла в input
function addFileToInput(file, fileInput, fileId) {
    // Получаем текущий DataTransfer
    const dataTransfer = new DataTransfer();
    
    // Добавляем существующие файлы
    const currentFiles = Array.from(fileInput.files || []);
    currentFiles.forEach(existingFile => {
        dataTransfer.items.add(existingFile);
    });
    
    // Добавляем новый файл
    dataTransfer.items.add(file);
    
    // Сохраняем файл в кастомном хранилище
    if (!fileInput._fileStorage) {
        fileInput._fileStorage = new Map();
    }
    fileInput._fileStorage.set(fileId, file);
    
    // Обновляем files в input
    fileInput.files = dataTransfer.files;
}

// Функция для удаления файла из input
function removeFileFromInput(fileId, fileInput) {
    const dataTransfer = new DataTransfer();
    
    // Удаляем из кастомного хранилища
    if (fileInput._fileStorage) {
        fileInput._fileStorage.delete(fileId);
    }
    
    // Пересоздаем FileList из оставшихся файлов
    if (fileInput._fileStorage) {
        fileInput._fileStorage.forEach(file => {
            dataTransfer.items.add(file);
        });
    }
    
    // Обновляем files в input
    fileInput.files = dataTransfer.files;
}

// Функция для генерации уникального ID файла
function generateFileId() {
    return 'file_' + Math.random().toString(36).substr(2, 9);
}

// Функция для форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Функция для настройки drag and drop
function setupDragAndDrop(uploadField, fileInput) {
    // Предотвращаем стандартное поведение браузера
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadField.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Подсветка области при перетаскивании
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadField.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadField.addEventListener(eventName, unhighlight, false);
    });
    
    // Обработка drop
    uploadField.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files, uploadField, fileInput);
    }, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadField.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadField.classList.remove('highlight');
    }
}