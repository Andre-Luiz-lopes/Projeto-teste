class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = {};
        this.render();
    }

    render() {
        const calendarElement = document.getElementById('calendar');
        calendarElement.innerHTML = '';

        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `<h2>${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}</h2>`;
        calendarElement.appendChild(header);

        const daysElement = document.createElement('div');
        daysElement.className = 'days';

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day empty';
            daysElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerText = day;
            dayElement.addEventListener('click', () => this.handleDayClick(day));
            daysElement.appendChild(dayElement);
        }

        calendarElement.appendChild(daysElement);
    }

    handleDayClick(day) {
        const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        alert(`Selected date: ${selectedDate.toDateString()}`);
        // Here you can integrate with Alarms and Notes functionalities
    }

    navigateToNextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    navigateToPreviousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }
}

export default Calendar;