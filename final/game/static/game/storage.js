class Storage {
    constructor(carsIds) {
        this.carsIds = carsIds;
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        this.isGameOver = JSON.parse(localStorage.getItem("isGameOver")) || false;
        this.userId = JSON.parse(localStorage.getItem("userId")) || this.generateUserId();
        this.answer = parseInt(localStorage.getItem("answer")) || this.getRandomCarId(this.carsIds);
        const storedGuesses = localStorage.getItem("guesses");
        if (storedGuesses && storedGuesses !== "undefined") {
            this.guesses = JSON.parse(storedGuesses);
        } else {
            this.guesses = [];
        }
    }

    saveToLocalStorage() {
        // Save gamesPlayed, gamesWon, isGameOver, and guesses to localStorage
        localStorage.setItem("isGameOver", JSON.stringify(this.isGameOver));
        localStorage.setItem("guesses", JSON.stringify(this.guesses));
        localStorage.setItem("answer",this.answer);
        localStorage.setItem("userId",JSON.stringify(this.userId));
    }

    addGuess(guess) {
        this.guesses.push(guess);
        this.saveToLocalStorage();
    }

    reset(carsIds){
        this.guesses = []
        this.isGameOver = false
        this.answer = this.getRandomCarId(carsIds);
        this.saveToLocalStorage();
    }

    generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }

    getRandomCarId(carsIds) {
        const randomIndex = Math.floor(Math.random() * carsIds.length);
        return this.carsIds[randomIndex];
    }

}