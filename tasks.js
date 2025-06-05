// Этот скрипт будет загружаться динамически при активации вкладки "Задачи"

const activeTasksList = document.getElementById('activeTasks');
let noActiveTasksMessage = document.getElementById('noActiveTasksMessage'); // Обновленный ID
const newTaskInput = document.getElementById('newTaskText');
const taskHistoryList = document.getElementById('taskHistory');

// Функция для добавления новой задачи
function addNewTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    // Удаляем сообщение "Нет активных задач", если оно есть
    if (noActiveTasksMessage && noActiveTasksMessage.parentNode) {
      noActiveTasksMessage.remove();
      noActiveTasksMessage = null; // Обнуляем ссылку, чтобы не обращаться к удаленному элементу
    }

    const taskId = `task_${Date.now()}`; // Уникальный ID для каждой задачи
    const newTaskItem = document.createElement('li');
    newTaskItem.id = taskId;
    newTaskItem.classList.add('task-item');
    newTaskItem.innerHTML = `
      <div>${taskText}</div>
      <div class="task-actions">
        <span class="task-status" id="status_${taskId}">Ожидание...</span>
        <button class="card small-button" onclick="completeTask('${taskId}', '${taskText}')">Завершить</button>
      </div>
    `;
    activeTasksList.appendChild(newTaskItem);

    addTaskToHistory(taskText, 'Создана');
    newTaskInput.value = ''; // Очищаем поле ввода

    // Имитация начала выполнения задачи через 2 секунды
    setTimeout(() => {
        const statusSpan = document.getElementById(`status_${taskId}`);
        if (statusSpan) {
            statusSpan.textContent = 'Выполняется...';
            statusSpan.style.color = '#e0b0ff'; // Цвет для "Выполняется"
            addTaskToHistory(taskText, 'Выполняется');
        }
    }, 2000);

    // Имитация автоматического завершения задачи через 7 секунд (после начала выполнения)
    // Пользователь также может завершить вручную до этого
    setTimeout(() => {
        const currentTask = document.getElementById(taskId);
        if (currentTask && currentTask.parentNode === activeTasksList) { // Проверяем, что задача еще в активных
            completeTask(taskId, taskText, true); // Вызываем завершение задачи автоматически
        }
    }, 9000); // 2 секунды ожидания + 7 секунд выполнения
  }
}

// Функция для завершения задачи (вручную или автоматически)
function completeTask(taskId, taskText, auto = false) {
    const taskItem = document.getElementById(taskId);
    if (taskItem) {
        taskItem.remove(); // Удаляем задачу из списка активных

        addTaskToHistory(taskText, 'Завершена'); // Добавляем в историю

        // Если активных задач больше нет, добавляем сообщение "Нет активных задач"
        if (activeTasksList.children.length === 0) {
            noActiveTasksMessage = document.createElement('li'); // Создаем новый элемент
            noActiveTasksMessage.id = 'noActiveTasksMessage';
            noActiveTasksMessage.style.cssText = 'color: #ddd; font-size: 0.9em; text-align: center;';
            noActiveTasksMessage.textContent = 'Нет активных задач';
            activeTasksList.appendChild(noActiveTasksMessage);
        }
    }
}

// Функция для добавления записи в историю задач
function addTaskToHistory(taskText, status) {
  const newHistoryItem = document.createElement('li');
  const now = new Date();
  const time = `${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  const date = `${now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  newHistoryItem.innerHTML = `<strong>${date} ${time}</strong> - ${taskText}: ${status}`;
  taskHistoryList.insertBefore(newHistoryItem, taskHistoryList.firstChild); // Добавляем в начало списка
}

// Глобальная функция для инициализации вкладки (вызывается из index.html)
window.initializeTab = function() {
    // Убедимся, что список активных задач очищен и отображает начальное сообщение
    activeTasksList.innerHTML = '';
    noActiveTasksMessage = document.createElement('li');
    noActiveTasksMessage.id = 'noActiveTasksMessage';
    noActiveTasksMessage.style.cssText = 'color: #ddd; font-size: 0.9em; text-align: center;';
    noActiveTasksMessage.textContent = 'Нет активных задач';
    activeTasksList.appendChild(noActiveTasksMessage);

    // Восстанавливаем начальные записи в историю при загрузке вкладки
    taskHistoryList.innerHTML = `
        <li><strong>19.05.2025 12:05</strong> - Быстрая проверка: Завершена</li>
        <li><strong>18.05.2025 22:00</strong> - Обновление баз: Успешно</li>
    `;
    newTaskInput.value = ''; // Очистить поле ввода при инициализации
};