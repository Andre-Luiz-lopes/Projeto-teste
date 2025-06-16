class Notes {
    constructor() {
        this.notes = {};
    }

    addNote(date, note) {
        if (!this.notes[date]) {
            this.notes[date] = [];
        }
        this.notes[date].push(note);
    }

    editNote(date, noteIndex, newNote) {
        if (this.notes[date] && this.notes[date][noteIndex]) {
            this.notes[date][noteIndex] = newNote;
        }
    }

    deleteNote(date, noteIndex) {
        if (this.notes[date] && this.notes[date][noteIndex]) {
            this.notes[date].splice(noteIndex, 1);
        }
    }

    getNotes(date) {
        return this.notes[date] || [];
    }
}

export default Notes;