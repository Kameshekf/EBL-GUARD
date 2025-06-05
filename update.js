// Этот скрипт будет загружаться динамически при активации вкладки "Обновление"

let updateInterval;
let currentDownloadingIndex = -1;
let updatesToInstall = [];

const updateStatusText = document.getElementById('updateStatusText');
const availableUpdatesList = document.getElementById('availableUpdatesList');
const installUpdatesButton = document.getElementById('installUpdatesButton');
const updateLogList = document.getElementById('updateLogList');

const initialUpdates = [
    { name: 'Антивирусные базы', version: '20250519.1' },
    { name: 'Ядро защиты', version: '3.0.0' }
];

// Функция для добавления записи в журнал
function addUpdateLog(message, type = '') {
    const li = document.createElement('li');
    li.classList.add(type);
    li.innerHTML = `<strong>${getCurrentDateTime()}</strong> - ${message}`;
    updateLogList.insertBefore(li, updateLogList.firstChild); // Добавляем в начало
}

function checkForUpdates() {
    updateStatusText.textContent = 'Идет проверка доступных обновлений...';
    installUpdatesButton.disabled = true; // Отключаем кнопку установки
    availableUpdatesList.innerHTML = ''; // Очищаем список

    setTimeout(() => {
        updatesToInstall = []; // Очищаем список для установки
        const newUpdates = [
            { name: 'Антивирусные базы', version: '20250520.1' },
            { name: 'Компонент защиты от угроз', version: '2.1.16' },
            { name: 'Модуль облачной репутации', version: '1.2.5' }
        ];

        // Имитация различных сценариев
        const scenario = Math.random();

        if (scenario < 0.6) { // 60% шанс на новые обновления
            updateStatusText.textContent = `Обнаружено ${newUpdates.length} новых обновлений. Нажмите "Установить обновления".`;
            newUpdates.forEach((update, index) => {
                const li = document.createElement('li');
                li.classList.add('update-item', 'new-update');
                li.style.setProperty('--item-index', index);
                li.setAttribute('data-name', update.name); // Сохраняем имя
                li.setAttribute('data-version', update.version); // Сохраняем версию
                li.innerHTML = `${update.name} <span>v. ${update.version}</span>`;
                availableUpdatesList.appendChild(li);
                updatesToInstall.push(update); // Добавляем в список для установки
            });
            installUpdatesButton.disabled = false; // Включаем кнопку установки
            addUpdateLog('Проверка обновлений: Обнаружены новые обновления.', 'success');

        } else if (scenario < 0.9) { // 30% шанс, что нет обновлений
            updateStatusText.textContent = 'Обновлений не обнаружено. Базы актуальны.';
            availableUpdatesList.innerHTML = '<li class="update-item">Нет новых обновлений.</li>';
            addUpdateLog('Проверка обновлений: Обновлений не найдено.', 'success');

        } else { // 10% шанс на ошибку проверки
            updateStatusText.textContent = 'Ошибка при проверке обновлений. Повторите попытку.';
            availableUpdatesList.innerHTML = '<li class="update-item error">Не удалось получить список обновлений.</li>';
            addUpdateLog('Проверка обновлений: Ошибка соединения с сервером.', 'error-log');
        }
    }, 2000);
}

function startUpdate() {
    if (updatesToInstall.length === 0) {
        updateStatusText.textContent = 'Нет доступных обновлений для установки.';
        addUpdateLog('Попытка установки обновлений: Нет доступных обновлений.', 'error-log');
        return;
    }

    updateStatusText.textContent = 'Начало загрузки и установки обновлений...';
    installUpdatesButton.disabled = true; // Отключаем кнопку во время установки
    currentDownloadingIndex = 0;

    clearInterval(updateInterval); // Очищаем предыдущий интервал, если есть
    updateInterval = setInterval(processNextUpdate, 1000); // Интервал для каждого шага установки
}

function processNextUpdate() {
    if (currentDownloadingIndex >= updatesToInstall.length) {
        clearInterval(updateInterval);
        updateStatusText.textContent = `Все обновления установлены. Базы актуальны. Последнее обновление: ${getCurrentDate()}`;
        availableUpdatesList.innerHTML = '<li class="update-item installed">Все компоненты актуальны.</li>';
        addUpdateLog('Все обновления успешно установлены.', 'success');
        return;
    }

    const currentUpdate = updatesToInstall[currentDownloadingIndex];
    const listItem = availableUpdatesList.children[currentDownloadingIndex];

    if (!listItem) { // На всякий случай
        clearInterval(updateInterval);
        return;
    }

    // Имитация загрузки
    listItem.textContent = `${currentUpdate.name} v. ${currentUpdate.version} - Загрузка...`;
    listItem.classList.remove('new-update');
    listItem.classList.add('downloading');
    addUpdateLog(`Загрузка: ${currentUpdate.name} v. ${currentUpdate.version}`, '');

    setTimeout(() => {
        // Имитация установки
        const installError = Math.random() < 0.1; // 10% шанс на ошибку установки
        if (installError) {
            listItem.textContent = `${currentUpdate.name} v. ${currentUpdate.version} - Ошибка установки!`;
            listItem.classList.remove('downloading');
            listItem.classList.add('error');
            addUpdateLog(`Ошибка установки: ${currentUpdate.name} v. ${currentUpdate.version}`, 'error-log');
            
            // Если ошибка, переходим к следующему, но не останавливаемся
            currentDownloadingIndex++;
            return; // Выходим, чтобы следующий процесс запустился через setInterval
        }

        listItem.textContent = `${currentUpdate.name} v. ${currentUpdate.version} - Установлено`;
        listItem.classList.remove('downloading');
        listItem.classList.add('installed');
        addUpdateLog(`Успешно установлено: ${currentUpdate.name} v. ${currentUpdate.version}`, 'success');

        currentDownloadingIndex++; // Переходим к следующему обновлению
    }, 1500); // Имитация времени загрузки/установки
}


function getCurrentDate() {
    const now = new Date();
    return `${now.toLocaleDateString('ru-RU')}`;
}

function getCurrentDateTime() {
    const now = new Date();
    return `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
}


// Глобальная функция для инициализации вкладки (вызывается из index.html)
window.initializeTab = function() {
    clearInterval(updateInterval); // Очищаем интервал при переключении
    currentDownloadingIndex = -1;
    updatesToInstall = [];

    // Восстанавливаем начальное состояние
    updateStatusText.textContent = 'Последнее обновление: 19.05.2025 12:00. Статус: Базы актуальны.';
    installUpdatesButton.disabled = true; // Сначала кнопка установки отключена

    availableUpdatesList.innerHTML = '';
    initialUpdates.forEach(update => {
        const li = document.createElement('li');
        li.classList.add('update-item');
        li.innerHTML = `${update.name} <span>v. ${update.version}</span>`;
        availableUpdatesList.appendChild(li);
    });

    updateLogList.innerHTML = `
        <li><strong>19.05.2025 12:00</strong> - Антивирусные базы успешно обновлены до v. 20250519.1</li>
        <li><strong>18.05.2025 22:00</strong> - Проверка обновлений: Обновлений не найдено.</li>
    `;
};