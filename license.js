// Этот скрипт будет загружаться динамически при активации вкладки "Лицензия"

const licenseStatusSpan = document.getElementById('licenseStatus');
const licenseTypeSpan = document.getElementById('licenseType');
const licenseKeySpan = document.getElementById('licenseKey');
const activationDateSpan = document.getElementById('activationDate');
const expirationDateSpan = document.getElementById('expirationDate');
const daysRemainingSpan = document.getElementById('daysRemaining');
const licenseKeyInput = document.getElementById('licenseKeyInput');
const activationMessage = document.getElementById('activationMessage');

const KEY_LICENSE_DATA = 'eblanCloudLicenseData';

// Функция для получения текущей даты в формате DD.MM.YYYY
function getFormattedDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция для обновления отображения лицензии на основе данных
function updateLicenseDisplay(licenseData) {
    licenseStatusSpan.textContent = licenseData.status;
    licenseStatusSpan.className = 'license-status ' + licenseData.statusClass; // Добавляем класс для цвета/анимации
    licenseTypeSpan.textContent = licenseData.type;
    licenseKeySpan.textContent = licenseData.key;
    activationDateSpan.textContent = licenseData.activationDate;
    expirationDateSpan.textContent = licenseData.expirationDate;

    const today = new Date();
    const expiry = new Date(licenseData.expirationDate.split('.').reverse().join('-')); // Преобразуем DD.MM.YYYY в YYYY-MM-DD
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysRemainingSpan.textContent = Math.max(0, diffDays); // Не показываем отрицательные дни

    activationMessage.textContent = ''; // Очищаем сообщения
    activationMessage.className = 'activation-message';
}

// Загрузка данных лицензии из localStorage
function loadLicenseData() {
    const storedData = localStorage.getItem(KEY_LICENSE_DATA);
    if (storedData) {
        const licenseData = JSON.parse(storedData);
        updateLicenseDisplay(licenseData);
    } else {
        // Если данных нет, устанавливаем начальное состояние (истекшая или пробная)
        setInitialLicenseState();
    }
}

// Устанавливаем начальное состояние, если нет сохраненных данных
function setInitialLicenseState() {
    const today = new Date();
    const initialExpiry = new Date(today);
    initialExpiry.setDate(today.getDate() + 7); // Пробный период 7 дней

    const defaultLicense = {
        status: 'Пробная',
        statusClass: 'trial',
        type: 'Пробная версия',
        key: 'TRIAL-XXXXX-XXXXX-XXXXX-XXXXX',
        activationDate: getFormattedDate(today),
        expirationDate: getFormattedDate(initialExpiry)
    };
    localStorage.setItem(KEY_LICENSE_DATA, JSON.stringify(defaultLicense));
    updateLicenseDisplay(defaultLicense);
}

// Активация лицензии по ключу
function activateLicense() {
    const enteredKey = licenseKeyInput.value.trim().toUpperCase();
    activationMessage.textContent = 'Проверка ключа...';
    activationMessage.className = 'activation-message';

    setTimeout(() => {
        // Имитация проверки ключа
        if (enteredKey === 'PREMIUM-KEY-2025-EBLAN' || enteredKey === 'ACTIVATED-EBLAN-CLOUD') {
            const today = new Date();
            const expiry = new Date(today);
            expiry.setFullYear(today.getFullYear() + 1); // Лицензия на 1 год

            const newLicenseData = {
                status: 'Активна',
                statusClass: 'active',
                type: 'EBLAN CLOUD Premium',
                key: enteredKey,
                activationDate: getFormattedDate(today),
                expirationDate: getFormattedDate(expiry)
            };
            localStorage.setItem(KEY_LICENSE_DATA, JSON.stringify(newLicenseData));
            updateLicenseDisplay(newLicenseData);

            activationMessage.textContent = 'Лицензия успешно активирована!';
            activationMessage.classList.add('success');
            licenseKeyInput.value = '';

        } else if (enteredKey.length < 20 || enteredKey.includes(' ')) {
            activationMessage.textContent = 'Неверный формат ключа. Ключ должен быть длиннее и без пробелов.';
            activationMessage.classList.add('error');
        }
        else {
            activationMessage.textContent = 'Неверный ключ активации. Пожалуйста, проверьте и повторите.';
            activationMessage.classList.add('error');
        }
    }, 1500); // Имитация времени проверки
}

// Продление лицензии
function extendLicense() {
    const currentData = JSON.parse(localStorage.getItem(KEY_LICENSE_DATA));
    if (!currentData || currentData.status === 'Активна') {
        activationMessage.textContent = 'Лицензия уже активна. Используйте ключ для продления.';
        activationMessage.classList.add('error');
        return;
    }

    activationMessage.textContent = 'Продление лицензии...';
    activationMessage.className = 'activation-message';

    setTimeout(() => {
        const today = new Date();
        // Срок продления от текущей даты или от даты истечения, если она в будущем
        let baseDate = new Date(currentData.expirationDate.split('.').reverse().join('-'));
        if (baseDate < today) {
            baseDate = today; // Если истекла, продлеваем с сегодняшнего дня
        }
        const newExpiry = new Date(baseDate);
        newExpiry.setFullYear(newExpiry.getFullYear() + 1); // Продление на 1 год

        const updatedLicense = {
            ...currentData, // Копируем текущие данные
            status: 'Активна',
            statusClass: 'active',
            expirationDate: getFormattedDate(newExpiry)
        };
        localStorage.setItem(KEY_LICENSE_DATA, JSON.stringify(updatedLicense));
        updateLicenseDisplay(updatedLicense);

        activationMessage.textContent = 'Лицензия успешно продлена!';
        activationMessage.classList.add('success');

    }, 1500);
}

// Начать пробный период
function startTrial() {
    activationMessage.textContent = 'Активация пробного периода...';
    activationMessage.className = 'activation-message';

    setTimeout(() => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30); // Пробный период на 30 дней

        const trialLicense = {
            status: 'Пробная',
            statusClass: 'trial',
            type: 'Пробная версия (30 дней)',
            key: 'TRIAL-XXXXX-XXXXX-XXXXX-XXXXX',
            activationDate: getFormattedDate(today),
            expirationDate: getFormattedDate(expiry)
        };
        localStorage.setItem(KEY_LICENSE_DATA, JSON.stringify(trialLicense));
        updateLicenseDisplay(trialLicense);

        activationMessage.textContent = 'Пробный период активирован на 30 дней!';
        activationMessage.classList.add('success');
    }, 1500);
}


// Глобальная функция для инициализации вкладки (вызывается из index.html)
window.initializeTab = function() {
    loadLicenseData(); // Загружаем данные при каждом открытии вкладки
    licenseKeyInput.value = ''; // Очищаем поле ввода
    activationMessage.textContent = ''; // Очищаем сообщение
    activationMessage.className = 'activation-message'; // Сбрасываем классы
};