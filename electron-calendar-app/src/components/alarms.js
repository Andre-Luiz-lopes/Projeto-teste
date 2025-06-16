class Alarms {
    constructor() {
        this.alarms = [];
    }

    setAlarm(date, time, message) {
        const alarmTime = new Date(`${date}T${time}`);
        this.alarms.push({ alarmTime, message });
        this.scheduleAlarm(alarmTime, message);
    }

    scheduleAlarm(alarmTime, message) {
        const now = new Date();
        const timeout = alarmTime - now;

        if (timeout > 0) {
            setTimeout(() => {
                this.triggerAlarm(message);
            }, timeout);
        }
    }

    triggerAlarm(message) {
        alert(`Alarm: ${message}`);
    }

    editAlarm(index, newDate, newTime, newMessage) {
        if (this.alarms[index]) {
            this.alarms[index].alarmTime = new Date(`${newDate}T${newTime}`);
            this.alarms[index].message = newMessage;
            this.scheduleAlarm(this.alarms[index].alarmTime, newMessage);
        }
    }

    deleteAlarm(index) {
        if (this.alarms[index]) {
            this.alarms.splice(index, 1);
        }
    }

    getAlarms() {
        return this.alarms;
    }
}

export default Alarms;