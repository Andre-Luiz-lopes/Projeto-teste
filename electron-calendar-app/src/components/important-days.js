class ImportantDays {
    constructor() {
        this.importantDays = [];
    }

    addImportantDay(date, description) {
        this.importantDays.push({ date, description });
    }

    removeImportantDay(date) {
        this.importantDays = this.importantDays.filter(day => day.date !== date);
    }

    getImportantDays() {
        return this.importantDays;
    }

    isImportantDay(date) {
        return this.importantDays.some(day => day.date === date);
    }

    displayImportantDays() {
        this.importantDays.forEach(day => {
            console.log(`Important Day: ${day.date} - ${day.description}`);
        });
    }
}

export default ImportantDays;