// Этот скрипт будет загружаться динамически при активации вкладки "Безопасность"

let scanInterval;
let currentScanType = '';
const progressBar = document.getElementById('scanProgress');
const progressText = document.getElementById('scanProgressText');
const scanStatusText = document.getElementById('scanStatus');
const scanCurrentItem = document.getElementById('scanCurrentItem');
const securityEventsList = document.getElementById('securityEvents');
const detectedThreatsList = document.getElementById('detectedThreats');

const quickScanItems = [
    "Проверка системных файлов...",
    "Сканирование запущенных процессов...",
    "Проверка загрузочного сектора...",
    "Анализ оперативной памяти...",
    "Проверка автозапуска..."
];

const fullScanItems = [
    "Проверка всех локальных дисков (C:)...",
    "Сканирование системных файлов...",
    "Анализ реестра на предмет изменений...",
    "Проверка архивов и сжатых файлов...",
    "Сканирование подключаемых устройств...",
    "Проверка запущенных служб и драйверов...",
    "Глубокий анализ исполняемых файлов...",
    "Проверка всех пользовательских документов (Documents, Downloads)...",
    "Анализ сетевых подключений и открытых портов...",
    "Сканирование временных файлов и кэша браузеров...",
    "Проверка EBLAN Cloud репутации для неизвестных файлов...",
    "Проверка удаленных дисков (если подключены)...",
    "Анализ установленных программ..."
];

const knownThreats = [
    { name: "Trojan.Win32.Zbot", path: "C:\\Windows\\System32\\temp\\malware.exe" },
    { name: "PUP.Optional.Bundler", path: "C:\\Program Files (x86)\\BrowserTool\\toolbar.dll" },
    { name: "Adware.EBLANInstaller", path: "C:\\Users\\User\\Downloads\\setup.exe" },
    { name: "Worm.VBS.Agent", path: "D:\\Photos\\vacation.vbs" },
    { name: "Riskware.CoinMiner", path: "C:\\ProgramData\\Miner\\client.dat" },
    { name: "Exploit.CVE-2023-1234", path: "C:\\Windows\\System32\\drivers\\vulnerable.sys" },
    { name: "Ransom.Locky", path: "C:\\Users\\User\\Documents\\important.docx.locky" },
    { name: "Spyware.Keylogger", path: "C:\\Program Files\\Utility\\keylogger.exe" },
    { name: "Backdoor.Darkcomet", path: "C:\\Users\\Public\\client.bin" }
];


function startScan(type) {
  currentScanType = type;
  let itemsToScan = type === 'quick' ? quickScanItems : fullScanItems;
  let totalScanSteps = itemsToScan.length * 10; // Увеличиваем шаги для более длительной имитации
  let currentScanStep = 0;
  let currentItemIndex = 0;
  let threatsFound = 0;

  stopScan(); // Останавливаем любое предыдущее сканирование
  detectedThreatsList.innerHTML = '<li style="color: #ddd; font-size: 0.9em; text-align: center;">Угроз не обнаружено</li>';
  
  scanStatusText.textContent = `Запуск ${type === 'quick' ? 'быстрой' : 'полной'} проверки...`;
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  scanCurrentItem.textContent = 'Подготовка к сканированию...';

  scanInterval = setInterval(() => {
    currentScanStep++;
    let percentage = Math.min(100, Math.floor((currentScanStep / totalScanSteps) * 100));
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = percentage + '%';
    scanStatusText.textContent = `${type === 'quick' ? 'Быстрая' : 'Полная'} проверка: ${percentage}% завершено`;

    // Имитация сканирования файлов/процессов
    if (currentScanStep % 10 === 0 && currentItemIndex < itemsToScan.length) {
        scanCurrentItem.textContent = itemsToScan[currentItemIndex];
        currentItemIndex++;

        // Имитация обнаружения угрозы с некоторой вероятностью
        if (Math.random() < 0.2 && threatsFound < 3) { // 20% шанс, не более 3 угроз
            const randomThreat = knownThreats[Math.floor(Math.random() * knownThreats.length)];
            addDetectedThreat(randomThreat.name, randomThreat.path);
            threatsFound++;
        }
    }

    if (percentage >= 100) {
      clearInterval(scanInterval);
      if (threatsFound > 0) {
          scanStatusText.textContent = `${type === 'quick' ? 'Быстрая' : 'Полная'} проверка завершена. Обнаружено ${threatsFound} угроз!`;
          scanCurrentItem.textContent = 'Требуется ваше внимание!';
          addSecurityEvent(`Обнаружено ${threatsFound} угроз во время ${type === 'quick' ? 'быстрой' : 'полной'} проверки.`);
      } else {
          scanStatusText.textContent = `${type === 'quick' ? 'Быстрая' : 'Полная'} проверка завершена. Угроз не обнаружено.`;
          scanCurrentItem.textContent = 'Сканирование успешно завершено.';
          addSecurityEvent(`${type === 'quick' ? 'Быстрая' : 'Полная'} проверка завершена. Угроз не обнаружено.`);
      }
    }
  }, 70); // Уменьшено время для более быстрого "сканирования"
}

function stopScan() {
  clearInterval(scanInterval);
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  scanStatusText.textContent = 'Проверка остановлена. Готов к сканированию.';
  scanCurrentItem.textContent = 'Ожидание...';
  addSecurityEvent(`${getCurrentTime()} - Проверка остановлена пользователем.`);
  detectedThreatsList.innerHTML = '<li style="color: #ddd; font-size: 0.9em; text-align: center;">Угроз не обнаружено</li>'; // Очищаем список угроз при остановке
}

function addSecurityEvent(eventText) {
  const newEvent = document.createElement('li');
  const now = new Date();
  const time = `${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  const date = `${now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  newEvent.innerHTML = `<strong>${date} ${time}</strong> - ${eventText}`;
  securityEventsList.insertBefore(newEvent, securityEventsList.firstChild); // Добавляем в начало списка
}

function addDetectedThreat(threatName, threatPath) {
    // Удаляем сообщение "Угроз не обнаружено", если оно есть
    const noThreatsMessage = detectedThreatsList.querySelector('li[style*="text-align: center"]');
    if (noThreatsMessage) {
        noThreatsMessage.remove();
    }

    const newThreatItem = document.createElement('li');
    newThreatItem.classList.add('threat-item');
    newThreatItem.innerHTML = `
        <div>
            <strong>${threatName}</strong><br>
            <small>${threatPath}</small>
        </div>
        <div class="threat-actions">
            <button class="quarantine" onclick="handleThreatAction(this, 'quarantine', '${threatName}')">Поместить в карантин</button>
            <button class="delete" onclick="handleThreatAction(this, 'delete', '${threatName}')">Удалить</button>
        </div>
    `;
    detectedThreatsList.appendChild(newThreatItem);
}

function handleThreatAction(button, action, threatName) {
    const threatItem = button.closest('.threat-item');
    if (!threatItem) return;

    let actionText = '';
    let eventDetail = '';

    if (action === 'quarantine') {
        actionText = 'Помещено в карантин';
        eventDetail = `Угроза '${threatName}' помещена в карантин.`;
        // Изменяем кнопки на "Восстановить"
        threatItem.querySelector('.threat-actions').innerHTML = `
            <button class="restore" onclick="handleThreatAction(this, 'restore', '${threatName}')">Восстановить</button>
        `;
    } else if (action === 'delete') {
        actionText = 'Удалено';
        eventDetail = `Угроза '${threatName}' удалена.`;
        threatItem.remove(); // Удаляем элемент из списка
    } else if (action === 'restore') {
        actionText = 'Восстановлено';
        eventDetail = `Угроза '${threatName}' восстановлена из карантина.`;
        // Возвращаем исходные кнопки
        threatItem.querySelector('.threat-actions').innerHTML = `
            <button class="quarantine" onclick="handleThreatAction(this, 'quarantine', '${threatName}')">Поместить в карантин</button>
            <button class="delete" onclick="handleThreatAction(this, 'delete', '${threatName}')">Удалить</button>
        `;
    }
    
    addSecurityEvent(`${getCurrentTime()} - ${eventDetail}`);
}

function getCurrentTime() {
    const now = new Date();
    return `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU')}`;
}

// Глобальная функция для инициализации вкладки (вызывается из index.html)
window.initializeTab = function() {
    clearInterval(scanInterval); // Очищаем интервал при переключении
    if (progressBar) progressBar.style.width = '0%';
    if (progressText) progressText.textContent = '0%';
    if (scanStatusText) scanStatusText.textContent = 'Нажмите "Запустить быструю проверку" для сканирования.';
    if (scanCurrentItem) scanCurrentItem.textContent = 'Ожидание...';
    
    // Очищаем и восстанавливаем начальное состояние списка угроз
    if (detectedThreatsList) {
        detectedThreatsList.innerHTML = '<li style="color: #ddd; font-size: 0.9em; text-align: center;">Угроз не обнаружено</li>';
    }
};