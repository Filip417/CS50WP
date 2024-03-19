document.addEventListener('DOMContentLoaded', function () {
    // Getting elements by id
    const inputField = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const submission = document.getElementById('submission');
    const resetButton = document.getElementById('reset-btn');
    const error = document.getElementById('error');
    const chances = document.getElementById('chances');
    const imgWrapper = document.getElementById('img-wrapper');
    const selector = document.getElementById("language-selector");
    const mainImg = document.getElementById("main-img");
    const torqueHeader = document.getElementById("torque-header");
    const zeroSixtyHeader = document.getElementById("zerosixty-header");
    const guessTable = document.getElementById("guesses-table");
    const htmlTop = document.getElementById("top");
    const typeButton = document.getElementById("type-btn");
    const myDropdown = document.getElementById("my-dropdown");
    const languageForm = document.getElementById('language-form');

    // Declaring constant values for game
        // maxResults is how many maximally suggested options to show
    const maxResults = 20;
        // maxGuesses is how many chances player has ; game has been designed to use 5 as default
    const maxGuesses = 5;

    // Port storage items from cookies
    const queryParamKeys = [
        "isGameOver",
        "userId",
        "answer",
        "guesses"
    ]
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.size !== 0 && !localStorage.storagePorted) { 
        queryParamKeys.forEach(key => {
            if (queryParams.has(key)) {
                let value = decodeURIComponent(queryParams.get(key))
                localStorage.setItem(key, value)
            }
        })
        localStorage.storagePorted = true
    }

    // Game launch
    var arrayCarsIds = JSON.parse(carsIds)
    const storage = new Storage(arrayCarsIds);
    storage.saveToLocalStorage()
    const answer = storage.answer;
    mainImg.src = `static/game/main/${answer}.jpg`;
        // If type of game changed, but type value did not change properly,
        // start game again with correct type this time
    if (!arrayCarsIds.includes(answer)) {
        resetStorage();
    }

    // Function creates a guess row in the #tablediv showing guesses history and results
    function createGuessRow(item, answer) {
    return new Promise((resolve, reject) => {
        fetch(`/guess-span/${item}/${answer}`, {
                method: "POST",
                headers: { "Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken") }
            })
            .then(response => response.json())
            .then(data => {
                const inputData = JSON.parse(data.input_data);
                const answerData = JSON.parse(data.answer_data);
    
                const fields = inputData[0].fields;
                const answerFields = answerData[0].fields;
    
                // Adjustment for metric units in values and display text
                const torqueInMetric = 1.356;
                let torque = fields.torque;
                if (units === "metric") {
                    torque = Math.round(torque * torqueInMetric);
                    torqueHeader.innerHTML = `${translations['torque_nm']}`;
                    zeroSixtyHeader.innerHTML = "0-100 km/h (s)";
                }
    
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td id="td-car-make"><img class="guess-icon" id="td-car-makeicon" src="static/game/make/${fields.car_make}.ico"></img>${fields.car_make}</td>
                    <td id="td-car-model">${fields.car_model}</td>
                    <td id="td-country"><img class="guess-icon" id="td-countryicon" src="static/game/country/${fields.country}.png"></img>${fields.country}</td>
                    <td id="td-engine-size">${fields.engine_size}</td>
                    <td id="td-horse-power">${fields.horse_power}</td>
                    <td id="td-torque">${torque}</td>
                    <td id="td-zero-sixty">${fields.zero_sixty}</td>
                    <td id="td-price">${fields.price}</td>
                `;
    
                colorChanger(fields, answerFields, newRow);
    
                guessTable.appendChild(newRow);
                try { guessTable.style.visibility = "visible"; }
                catch (TypeError) {}
                resolve(); // Resolve the promise once the row is created
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error); // Reject the promise if an error occurs
            });
        });
    }

    // Functions setStyleAndArrow and colorChange handle color change and adds arrow indicator 
    // in #tablediv based on row fields, answer fields and its row element.
    function setStyleAndArrow(element, color, backgroundColor, fontWeight, arrow) {
        element.setAttribute("style", `color: ${color}; background-color: ${backgroundColor}; font-weight: ${fontWeight}`);
        if (arrow) {
            element.innerHTML += arrow;
        }
    }
    
    function colorChanger(fields, answerFields, newRow) {
        const correctColor = "var(--correct-color)";
        const incorrectColor = "var(--incorrect-color)";
        const backgroundColor = "var(--bg2-color)";
        const fontWeight = "700";
    
        setStyleAndArrow(newRow.querySelector("#td-car-makeicon"), "", backgroundColor);
        setStyleAndArrow(newRow.querySelector("#td-countryicon"), "", backgroundColor);
    
        const fieldsToCheck = [
            { id: "#td-car-make", value: fields.car_make, answerValue: answerFields.car_make },
            { id: "#td-car-model", value: fields.car_model, answerValue: answerFields.car_model },
            { id: "#td-country", value: fields.country, answerValue: answerFields.country },
            { id: "#td-engine-size", value: parseFloat(fields.engine_size), answerValue: parseFloat(answerFields.engine_size), type: "number" },
            { id: "#td-horse-power", value: parseInt(fields.horse_power), answerValue: parseInt(answerFields.horse_power), type: "number" },
            { id: "#td-torque", value: parseInt(fields.torque), answerValue: parseInt(answerFields.torque), type: "number" },
            { id: "#td-zero-sixty", value: parseFloat(fields.zero_sixty), answerValue: parseFloat(answerFields.zero_sixty), type: "number" },
            { id: "#td-price", value: parseInt(fields.price), answerValue: parseInt(answerFields.price), type: "number" }
        ];
    
        fieldsToCheck.forEach(field => {
            const element = newRow.querySelector(field.id);
            if (field.value === field.answerValue) {
                setStyleAndArrow(element, correctColor, backgroundColor, fontWeight);
            } else {
                setStyleAndArrow(element, incorrectColor, "", "", field.value < field.answerValue ? "↑" : "↓");
            }
        });
    }

    // Function recreates #tablediv showing guesses history and results based on cookies in storage
    rebuildGuesses()
    async function rebuildGuesses() {
        for (const item of storage.guesses) {
            if (item !== "" && item !== null) {
                await createGuessRow(item, answer);
            }
        }
    
        const remainingChances = maxGuesses - storage.guesses.length;
        chances.innerHTML = `${translations['chances_left']} ${remainingChances}`;
    
        const hasCorrectGuess = storage.guesses.includes(answer);
        const tooManyGuesses = storage.guesses.length >= maxGuesses;
    
        if (hasCorrectGuess) {
            handleGameOver(true,false);
        }
    
        if (tooManyGuesses) {
            handleGameOver(false,false);
        }
    }

    // Informs how many chances are left below the main input field
    if (storage.guesses.length === 0 || !storage.guesses){
        chances.innerHTML = `${translations['chances_left']} ${maxGuesses - storage.guesses.length}`;
    }
    
    // Execute search function with every typing change in the inputfield
    inputField.addEventListener('keyup', search);
    // If there are no guesses in cookies storage execute search function
    if(!storage.guesses.length>0){
        search();
    }
    // Function that searches for suggestions based on type of game and input value,
    // and adds them to resultsContainer to show suggestion options in scrollable div
    function search() {
        var inputText = inputField.value;
        // Clears previous results
        resultsContainer.innerHTML = ' ';
        fetch(`/search/${inputText}/${type}`,{
            method: "POST",
            headers: {"Content-type":"application/json", "X-CSRFToken": getCookie("csrftoken")}
        })
            .then(response => response.json())
            .then(data => {
                // Populate search results, limited by previously declared maxResults
                let count = 0;
                data.forEach(item => {
                    if (count < maxResults && !storage.guesses.includes(item['id'])){
                    const option = document.createElement('div');
                    option.className = "option";
                    option.innerHTML+= `<img class="search-icon" src="static/game/make/${item['car_make']}.ico"></img>`;
                    option.innerHTML += `${item['name']}`;
                    option.addEventListener('click', function () {
                            inputField.value = item['name'];
                            resultsContainer.innerHTML = '';
                    });
                    resultsContainer.appendChild(option);
                    count++;
                }
            });
        });
    }

    // Function that searches for all car names for type of game
    async function getAllCarNames(type) {
        try {
            const response = await fetch(`/get-all-car-names/${type}`, {
                method: "POST",
                headers: { "Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken") }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    // Function that submits answer
    submission.onclick = submitAnswer;
    async function submitAnswer(event) {
        event.preventDefault();
        
        const inputText = inputField.value.trim();
        
        if (!inputText) {
            return inputNotOnList();
        }
    
        const carNames = await getAllCarNames(type);
        
        if (carNames.includes(inputText)) {
            try {
                const response = await fetch(`/answer/${inputText}`, {
                    method: "POST",
                    headers: { "Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken") }
                });
                const item = await response.json();
                
                if (!storage.guesses.includes(item)) {
                    storage.addGuess(item);
                    imgBlur();
                    createGuessRow(item, answer);
                    const remainingChances = maxGuesses - storage.guesses.length;
                    chances.innerHTML = `${translations['chances_left']} ${remainingChances}`;
                    
                    if (item === answer || storage.guesses.length >= maxGuesses) {
                        handleGameOver(item === answer, true);
                    } else {
                        resetInputField();
                    }
                }
            } catch (error) {
                console.error("Error occurred:", error);
            }
        } else {
            inputNotOnList();
        }
    }

    // Function handles gameover state for submitting new guesses and rebuilding view when refreshed
    function handleGameOver(isWinner,isSubmitting) {
        const gameOverMessage = isWinner ? translations['you_won'] : translations['you_lost'];
        submission.setAttribute("disabled", true);
        inputField.value = gameOverMessage;
        inputField.setAttribute("disabled", "disabled");
        storage.isGameOver = true;
        mainImg.style.filter = "blur(0px)";
        imgWrapper.style.borderWidth = "3px";
        imgWrapper.style.borderImage = `linear-gradient(#313131, ${isWinner ? '#28a745' : '#a72828'}) 30`;
        mainImg.style.transform = "scale(1.03)";
        submission.style.display = "none";
        resetButton.style.display = "block";
        chances.innerHTML = isWinner ? '' : `${translations['no_chances_left']}`;

        if (isSubmitting) {
            saveGameResults(isWinner);
        }

        if (!isWinner) {
            createGuessRow(answer, answer);
        }
    }
    // Function clears input field
    function resetInputField() {
        inputField.focus();
        inputField.value = "";
        resultsContainer.innerHTML = '';
    }
    // Function make visible for fixed time error message when input is not on cars list
    function inputNotOnList() {
        resetInputField();
        error.textContent = translations['not_in_list_error'];
        error.style.visibility = "visible";
        setTimeout(() => {
            error.style.visibility = "hidden";
        }, 3000);
    }
    
    // Function handles starting new game
    resetButton.onclick = resetStorage;
    function resetStorage(){
        submission.removeAttribute("disabled")
        inputField.removeAttribute("disabled")
        inputField.value = ""
        storage.reset(arrayCarsIds)
        location.reload()
        search();
        inputField.focus();
        }
    

    // Function handles img blur levels based on state of game and guesses numbers 
    imgBlur()
    function imgBlur(){
    if (storage.isGameOver === true){
        mainImg.style.filter = "blur(0px)";
    }
    else if(maxGuesses === storage.guesses.length){
        mainImg.style.filter = "blur(0px)";
    }
    else {
        var blur = (maxGuesses - storage.guesses.length)*(maxGuesses - storage.guesses.length);
        mainImg.style.filter = `blur(${blur}px)`;
    }
    }

    // Handles cookie issue for fetching into views.py (through urls.py declared views)
    function getCookie(name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`)
        if (parts.length == 2) return parts.pop().split(';').shift();
    }

    // Function saves game results to the db stored in sqlite3 Django database
    function saveGameResults(result) {
        var data = {
            userId: storage.userId,
            win: result,
            guesses: storage.guesses.length,
            answer: storage.answer,
            type: type,
        };

        fetch('/save-game/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showStats();
        })
        .catch(error => {
            console.error('Error occurred while saving data:', error);
        });
    }

    // Function shows saved game results from sqlite3 Django database in Ranking modal
    showStats();
    function showStats(){
        fetch(`/get-stats/${storage.userId}`,{
            method: "POST",
            headers: {"Content-type":"application/json", "X-CSRFToken": getCookie("csrftoken")}
        })
            .then(response => response.json())
            .then(data => {
                const top = JSON.parse(data.topUsers);
                
                let tableHtml = `<tr>
                <th>${translations['user_id']}</th>
                <th>${translations['games_played']}</th>
                <th>${translations['win']}</th>
                <th>${translations['guesses_per_game']}</th>
                <th>${translations['wins_1_guess']}</th>
                <th>${translations['favourite_type']}</th>
                </tr>`;
                var count = 0;
                top.forEach(user => {
                    const winPercentage = Math.round(user.games_won / user.games_played * 100 * 10) / 10;
                    const guessesPerGame = Math.round(user.total_guesses / user.games_played * 10) / 10;
    
                    if (count === 11) {
                        tableHtml += `<tr>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>`;
                    }
    
                    tableHtml += `<tr class="${user.user_id === storage.userId ? 'bold' : ''}">
                                <td>${user.user_id}</td>
                                <td>${user.games_played}</td>
                                <td>${winPercentage}%</td>
                                <td>${guessesPerGame}</td>
                                <td>${user.one_guess_wins}</td>
                                <td>${translations[user.favourite_type]}</td>
                            </tr>`;
                });
    
                htmlTop.innerHTML = tableHtml;
            });
    }

    //Handles color changing for typeButton for changing types of game
    typeButton.onclick = function dropdownMenu() {
        myDropdown.classList.toggle("show");
        if (typeButton.style.backgroundColor == "var(--text-color)"){
            typeButton.style.backgroundColor = "var(--text2-color)";
        }
        else{
            typeButton.style.backgroundColor = "var(--text-color)";
        }
    }
  
  window.onclick = function(event) {
      // Close/Show the dropdown menu if the user clicks outside/inside of it
    if (!event.target.matches('#type-btn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      typeButton.style.backgroundColor = "var(--text-color)";
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
      // Close the searched suggestions if the user clicks outside of it
    if (!event.target.matches('#search-input')){
        resultsContainer.innerHTML = '';
    }
        // Show suggestions if the user clicks in the main input field
    else if(event.target.matches('#search-input')){
        search();
    }
  }

    // Function to handle language change
    function handleLanguageChange() {
        var selectedOption = selector.options[selector.selectedIndex];
        var selectedImage = selectedOption.getAttribute("data-image");
        selector.style.backgroundImage = "url('static/game/country/" + selectedImage + ".png')";
        localStorage.setItem("selectedLanguage", selector.value); // Save selected language
        selector.blur();
    }
    selector.addEventListener("change", handleLanguageChange);
    // Initial language setup
    var initialSelectedLanguage = localStorage.getItem("selectedLanguage");
    if (initialSelectedLanguage) {
        selector.value = initialSelectedLanguage;
        handleLanguageChange();
    }
    // Form submission for language change
    languageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var form = event.target;
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', form.action); 
        xhr.setRequestHeader('X-CSRFToken', formData.get('csrfmiddlewaretoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                localStorage.setItem("selectedLanguage", selector.value);
                window.location.reload();
            } else {
            }
        };
        xhr.send(formData);
    });

    // Find all elements with the class "typechanger"
    const typeChangers = document.querySelectorAll(".type-changer");
    // All typechanger elements start new game when clicked on
    typeChangers.forEach(function(typeChanger) {
        typeChanger.addEventListener("click", function(event) {
            resetStorage();
        });
    });
});
