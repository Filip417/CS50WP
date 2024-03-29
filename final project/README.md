# Car Guess Game

This is a simple web-based guessing game where players have to identify the make and model of a car within five attempts. The game is built using Django for the backend, and HTML, CSS, and JavaScript for the frontend.

## Distinctiveness and Complexity

The project satisfies distinctiveness and complexity requirements by offering a unique and engaging gameplay experience through a variety of game modes. It was inspired by games like loldle and geoguesser, with stats stored in cookies without the need to create an account to play and observe statistics. The integration of backend technologies like Django with frontend technologies like HTML, CSS, and JavaScript adds complexity to the project, making it a comprehensive web application.


## File description
js.js: JavaScript file containing client-side logic for the game.
storage.js: JavaScript file handling data storage and retrieval.
index.html: HTML file for the game's main page.
layout.html: HTML file defining the layout structure for the game.
views.py: Django views file containing server-side logic.
models.py: Django models file defining database structure.
admin.py: Django admin file for registering models.
urls.py: Django URLs file defining URL routing.
styles.css: CSS file containing styles for the game.
light.css: CSS file containing styles for light mode.
dark.css: CSS file containing styles for dark mode.

## How to run your application

To run this app in Django using Python's `manage.py`:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run the following command: python manage.py runserver

## How to Play

1. **Start the Game**: Visit the game website to start playing.
   
2. **Guess the Car**: You will be presented with an image of a car. Your goal is to guess the exact make and model of the car.

3. **Make Your Guess**: Input your guess into the provided text input field.

4. **Submit Your Guess**: Click the "Submit" button to submit your guess.

5. **Receive Feedback**: After each guess, you will receive feedback indicating whether your guess was correct or not. If your guess was incorrect, you will receive hints as arrows to help you guess the correct answer.

6. **Keep Guessing**: You have up to five attempts to guess the correct make and model of the car. Use the feedback provided after each guess to refine your next guess.

7. **Change Mode**: You can change the mode of the game by clicking on the mode name. This alters selection of available cars in the car game based on the name.

8. **Win the Game**: If you guess the correct make and model of the car within five attempts, you win the game!

## Modes

Choose from a variety of game modes to tailor your gameplay experience:
- All Cars
- German Cars
- British Cars
- Cars with 500+ Horsepower
- Cars with 500- Horsepower
- Cars for Less than $100,000 USD
- Cars for More than $100,000 USD
- Cars that Have 0-62mph in Less than 3 Seconds
- Cars that Have Engine Size of 5 Litres and More

## Data Source

The data used in this game consists of 88 sports cars based on the Kaggle dataset by Kiattisak Rattanaporn, available at [Sports Car Prices Dataset](https://www.kaggle.com/datasets/rkiattisak/sports-car-prices-dataset).

## Photo Credits

The car photos used in this game are sourced from [Wallpaper Cave](https://wallpapercave.com/) and other publicly available sources online.

## Disclaimer

This project has no commercial gain and is purely for learning purposes.

## Ranking and Statistics

- **Top 10 Players**: View the rankings of the top 10 players along with their statistics.
  - Games Played
  - Win Ratio Percentage
  - Favorite Mode
  - Wins with 1 Guess
  - Average Guesses per Game

- **Your Statistics**: See how your statistics compare to the top players.
  - Games Played
  - Win Ratio Percentage
  - Favorite Mode
  - Wins with 1 Guess
  - Average Guesses per Game

## Feedback and Support

If you encounter any bugs, have suggestions for improvement, or would like to request new features or modes, please send an email to [sawinskif@gmail.com](mailto:sawinskif@gmail.com).

Thank you for playing! Enjoy guessing the cars!