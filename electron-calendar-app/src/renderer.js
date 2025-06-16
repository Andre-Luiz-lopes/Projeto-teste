document.addEventListener('DOMContentLoaded', function() {
  let events = [];
  let notes = [];
  let alarms = [];
  let repeatAlarms = [];

  const themeBtn = document.getElementById('toggle-theme-btn');
  themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  };

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function renderCalendar(month = currentMonth, year = currentYear) {
    const calendarEl = document.getElementById('calendar');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let days = '';
    let dayOfWeek = (firstDay === 0 ? 6 : firstDay - 1);

    for (let i = 0; i < dayOfWeek; i++) {
      days += `<div class="day empty"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasEvent = events.some(ev => ev.date === dateStr);
      days += `<div class="day${hasEvent ? ' has-event' : ''}" data-date="${dateStr}">${i}</div>`;
    }

    calendarEl.innerHTML = `
      <div class="calendar-header">
        <button id="prev-month" title="Mês anterior">&lt;</button>
        <span>${monthNames[month]} ${year}</span>
        <button id="next-month" title="Próximo mês">&gt;</button>
      </div>
      <div class="calendar-days">${days}</div>
    `;

    document.getElementById('prev-month').onclick = () => {
      if (month === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
      renderCalendar(currentMonth, currentYear);
      addDayClickListeners();
    };
    document.getElementById('next-month').onclick = () => {
      if (month === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
      renderCalendar(currentMonth, currentYear);
      addDayClickListeners();
    };

    addDayClickListeners();
  }

  function addDayClickListeners() {
    document.querySelectorAll('.day[data-date]').forEach(dayEl => {
      dayEl.onclick = () => {
        const date = dayEl.getAttribute('data-date');

        openDayActionModal(date);
      };
    });
  }

  function openDayActionModal(date) {
    closeModal();
    const modalBg = document.getElementById('modal-bg');
    const modalTitle = document.getElementById('modal-title');
    const modalFields = document.getElementById('modal-fields');
    const modalForm = document.getElementById('modal-form');
    modalBg.style.display = 'flex';
    modalTitle.textContent = 'Adicionar para ' + date;
    modalFields.innerHTML = `
      <button type="button" id="add-event-day">+ Evento</button>
      <button type="button" id="add-alarm-day">+ Alarme</button>
    `;
    modalForm.onsubmit = function(e){e.preventDefault();};
    document.getElementById('add-event-day').onclick = function() {
      closeModal();
      openModal('event', date);
    };
    document.getElementById('add-alarm-day').onclick = function() {
      closeModal();
      openModal('alarm', date);
    };
    document.getElementById('modal-cancel').onclick = closeModal;
  }

  function renderEvents() {
    const el = document.getElementById('events-list');
    if (!events.length) {
      el.innerHTML = '<h2>Eventos</h2><p>Nenhum evento cadastrado.</p>';
      return;
    }
    el.innerHTML = '<h2>Eventos</h2>' + events.map((ev, idx) =>
      `<div class="event${ev.important ? ' important' : ''}">
        <strong>${ev.title}</strong> <span>(${ev.date})</span>
        <button class="delete-btn" data-type="event" data-idx="${idx}" title="Apagar evento">🗑️</button>
      </div>`
    ).join('');
    addDeleteListeners();
  }

  function renderAlarms() {
    const el = document.getElementById('alarms-list');
    if (!alarms.length && !repeatAlarms.length) {
      el.innerHTML = '<h2>Alarmes</h2><p>Nenhum alarme cadastrado.</p>';
      return;
    }
    let html = '<h2>Alarmes</h2>';
    html += alarms.map((alarm, idx) =>
      `<div class="alarm">
        <strong>${alarm.label}</strong> <span>${alarm.time}</span>
        <span style="margin-left:auto;">${alarm.active ? '⏰' : '🔕'}</span>
        <button class="delete-btn" data-type="alarm" data-idx="${idx}" title="Apagar alarme">🗑️</button>
      </div>`
    ).join('');
    html += repeatAlarms.map((alarm, idx) =>
      `<div class="alarm">
        <strong>${alarm.label}</strong> <span>${alarm.time}</span>
        <span>(${alarm.days.map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(', ')})</span>
        <span style="margin-left:auto;">${alarm.active ? '⏰' : '🔕'}</span>
        <button class="delete-btn" data-type="repeat-alarm" data-idx="${idx}" title="Apagar alarme">🗑️</button>
      </div>`
    ).join('');
    el.innerHTML = html;
    addDeleteListeners();
  }

  function renderNotes() {
    const el = document.getElementById('notes-list');
    if (!notes.length) {
      el.innerHTML = '<h2>Notas</h2><p>Nenhuma nota cadastrada.</p>';
      return;
    }
    el.innerHTML = '<h2>Notas</h2>' + notes.map((note, idx) =>
      `<div class="note">
        <span>${note.text}</span> <em>(${note.date})</em>
        <button class="delete-btn" data-type="note" data-idx="${idx}" title="Apagar nota">🗑️</button>
      </div>`
    ).join('');
    addDeleteListeners();
  }

  function renderImportantDays() {
    const el = document.getElementById('important-days-list');
    el.innerHTML = events.filter(ev => ev.important).map(ev =>
      `<li>${ev.date}: ${ev.title}</li>`
    ).join('');
  }

  function addDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = function() {
        const type = btn.getAttribute('data-type');
        const idx = parseInt(btn.getAttribute('data-idx'));
        let msg = 'Tem certeza que deseja excluir?';
        if (!confirm(msg)) return;
        if (type === 'event') {
          events.splice(idx, 1);
          renderEvents();
          renderImportantDays();
          renderCalendar(currentMonth, currentYear);
        } else if (type === 'alarm') {
          alarms.splice(idx, 1);
          stopAlarmSound(); // <-- Adicione aqui
          renderAlarms();
        } else if (type === 'note') {
          notes.splice(idx, 1);
          renderNotes();
        } else if (type === 'repeat-alarm') {
          repeatAlarms.splice(idx, 1);
          stopAlarmSound();
          renderAlarms();
        }
      };
    });
  }

  // MODAL
  function openModal(type, dateStr = '') {
    closeModal();
    const modalBg = document.getElementById('modal-bg');
    const modal = modalBg.querySelector('.modal');
    modalBg.style.display = 'flex';

    let fields = '';
    let title = '';
    if (type === 'event') {
      title = 'Novo Evento';
      fields = `
        <label>Data</label>
        <input type="date" name="date" value="${dateStr || new Date().toISOString().slice(0,10)}" required>
        <label>Título</label>
        <input type="text" name="title" required>
        <label>Importante?</label>
        <select name="important">
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>
      `;
    } else if (type === 'alarm') {
      title = 'Novo Alarme';
      fields = `
        <label>Data</label>
        <input type="date" name="date" value="${dateStr || new Date().toISOString().slice(0,10)}" required>
        <label>Nome</label>
        <input type="text" name="label" required>
        <label>Horário</label>
        <input type="time" name="time" required>
      `;
    } else if (type === 'repeat-alarm') {
      title = 'Novo Alarme Recorrente';
      fields = `
        <label>Nome</label>
        <input type="text" name="label" required>
        <label>Horário</label>
        <input type="time" name="time" required>
        <label>Dias da Semana</label>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <label><input type="checkbox" name="days" value="0">Dom</label>
          <label><input type="checkbox" name="days" value="1">Seg</label>
          <label><input type="checkbox" name="days" value="2">Ter</label>
          <label><input type="checkbox" name="days" value="3">Qua</label>
          <label><input type="checkbox" name="days" value="4">Qui</label>
          <label><input type="checkbox" name="days" value="5">Sex</label>
          <label><input type="checkbox" name="days" value="6">Sáb</label>
        </div>
      `;
    } else if (type === 'note') {
      title = 'Nova Nota';
      fields = `
        <label>Nota</label>
        <textarea name="text" rows="6" style="width:100%;resize:vertical;" required></textarea>
      `;
    }

    // Cria o form do zero
    modal.innerHTML = `
      <h2>${title}</h2>
      <form id="modal-form">
        <div id="modal-fields">${fields}</div>
        <div class="modal-actions">
          <button type="submit" id="modal-save">Salvar</button>
          <button type="button" id="modal-cancel">Cancelar</button>
        </div>
      </form>
    `;

    const modalForm = document.getElementById('modal-form');
    document.getElementById('modal-cancel').onclick = closeModal;

    modalForm.onsubmit = function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(modalForm));
      if (type === 'event') {
        events.push({
          date: data.date,
          title: data.title,
          important: data.important === 'true'
        });
        renderEvents();
        renderImportantDays();
        renderCalendar(currentMonth, currentYear);
      } else if (type === 'alarm') {
        if (alarms.some(a => a.date === data.date && a.time === data.time)) {
          alert('Já existe um alarme para esse dia e horário!');
          return;
        }
        alarms.push({
          date: data.date,
          label: data.label,
          time: data.time,
          active: true
        });
        renderAlarms();
      } else if (type === 'repeat-alarm') {
        const days = Array.from(modalForm.querySelectorAll('input[name="days"]:checked')).map(cb => parseInt(cb.value));
        if (days.length === 0) {
          alert('Selecione pelo menos um dia da semana!');
          return;
        }
        repeatAlarms.push({
          label: data.label,
          time: data.time,
          days: days,
          active: true,
          lastTriggered: null
        });
        renderAlarms();
      } else if (type === 'note') {
        notes.push({
          text: data.text,
          date: new Date().toISOString().slice(0,10)
        });
        renderNotes();
      }
      closeModal();
    };
  }

  function closeModal() {
    document.getElementById('modal-bg').style.display = 'none';
    stopAlarmSound();
  }

  document.getElementById('add-event-btn').onclick = () => openModal('event');
  document.getElementById('add-alarm-btn').onclick = () => openModal('alarm');
  document.getElementById('add-note-btn').onclick = () => openModal('note');
  document.getElementById('add-repeat-alarm-btn').onclick = () => openModal('repeat-alarm');

  // Alarme funcional
  function checkAlarms() {
    const now = new Date();
    const currentDate = now.toISOString().slice(0,10);
    const currentTime = now.toTimeString().slice(0,5);
    const currentDay = now.getDay();

    alarms.forEach((alarm, idx) => {
      if (
        alarm.active &&
        alarm.date === currentDate &&
        alarm.time === currentTime
      ) {
        alarm.active = false;
        showAlarmModal(alarm.label);
        renderAlarms();
      }
    });

    repeatAlarms.forEach((alarm, idx) => {
      if (
        alarm.active &&
        alarm.time === currentTime &&
        alarm.days.includes(currentDay)
      ) {
        // Só toca se ainda não tocou neste minuto
        if (alarm.lastTriggered !== currentDate + ' ' + currentTime) {
          alarm.lastTriggered = currentDate + ' ' + currentTime;
          showAlarmModal(alarm.label);
        }
      }
    });
  }
  setInterval(checkAlarms, 1000);

  function showAlarmModal(label) {
    const modalBg = document.getElementById('modal-bg');
    const modal = modalBg.querySelector('.modal');
    modalBg.style.display = 'flex';
    modal.innerHTML = `
      <h2>⏰ Alarme!</h2>
      <div style="font-size:1.2rem;margin-bottom:16px;">${label}</div>
      <div style="text-align:center;">
        <button id="stop-alarm-btn" style="padding:10px 24px;font-size:1.1em;background:#a259f7;color:#fff;border:none;border-radius:8px;cursor:pointer;">Desligar alarme</button>
      </div>
    `;
    stopAlarmSound();
    playAlarmSound();

    document.getElementById('stop-alarm-btn').onclick = function() {
      stopAlarmSound();
      closeModal();
    };
  }

  function playAlarmSound() {
    const audio = document.getElementById('alarm-audio');
    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(()=>{});
  }

  function stopAlarmSound() {
    const audio = document.getElementById('alarm-audio');
    audio.pause();
    audio.currentTime = 0;
  }

  renderCalendar();
  renderEvents();
  renderAlarms();
  renderNotes();
  renderImportantDays();
});