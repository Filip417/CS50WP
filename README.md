# Final Project

# Car Guess Game

This is a web-based guessing game where players identify the make and model of a car within five attempts. The game is built using Django for the backend, and HTML, CSS, and JavaScript for the frontend.

## Distinctiveness and Complexity

### **Uniqueness**
The Car Guess Game offers a unique and engaging gameplay experience that combines elements from games like Loldle and Geoguessr. Unlike traditional quiz games, our game provides hints through directional arrows after incorrect guesses, adding a layer of strategy and learning.

### **Integration of Technologies**
The project integrates Django on the backend with HTML, CSS, and JavaScript on the frontend. This combination ensures a smooth interaction between the server-side logic and client-side interactivity. The use of Django models to manage game data and player statistics adds complexity and depth to the project.

### **User Experience**
Mobile responsiveness is a key feature of our application. We used responsive design techniques and tested the application across various devices to ensure an optimal user experience on both desktop and mobile platforms.

### **Data Storage**
Player statistics are stored in cookies, allowing users to play and track their progress without needing to create an account. This choice simplifies the user experience while still providing meaningful feedback and engagement.

## File Descriptions

- **`js.js`**: Handles client-side game logic, including form submissions and updating the DOM based on user input.
- **`storage.js`**: Manages local storage for saving and retrieving player statistics and game settings.
- **`index.html`**: The main game page where players view car images and input their guesses.
- **`layout.html`**: Base HTML template that includes common structure and elements used across different pages.
- **`views.py`**: Django views that process requests and return responses, implementing game logic and rendering templates.
- **`models.py`**: Defines Django models for storing game data, such as car information and player statistics.
- **`admin.py`**: Registers models with the Django admin site for easy data management.
- **`urls.py`**: Maps URL patterns to views, defining the routes for the application.
- **`styles.css`**: Main stylesheet providing layout, colors, and fonts for the game.
- **`light.css`**: Additional styles for light mode.
- **`dark.css`**: Additional styles for dark mode.

## How to Run Your Application

To run this application locally:

1. **Clone the repository**: `git clone <repository-url>`
2. **Navigate to the project directory**: `cd car-guess-game`
3. **Install dependencies**: `pip install -r requirements.txt`
4. **Run database migrations**: `python manage.py migrate`
5. **Start the development server**: `python manage.py runserver`
6. **Access the application**: Open a web browser and go to `http://127.0.0.1:8000/`

## How to Play

1. **Start the Game**: Visit the game website to start playing.
2. **Guess the Car**: You will be presented with an image of a car. Your goal is to guess the exact make and model.
3. **Make Your Guess**: Input your guess into the provided text input field.
4. **Submit Your Guess**: Click the "Submit" button to submit your guess.
5. **Receive Feedback**: After each guess, you will receive feedback indicating whether your guess was correct or not. Incorrect guesses will receive directional hints.
6. **Keep Guessing**: You have up to five attempts to guess correctly. Use the feedback to refine your guesses.
7. **Change Mode**: Click on the mode name to change game modes, affecting the selection of available cars.
8. **Win the Game**: If you guess correctly within five attempts, you win!

## Modes

Choose from a variety of game modes:

- All Cars
- German Cars
- British Cars
- Cars with 500+ Horsepower
- Cars with less than 500 Horsepower
- Cars costing less than $100,000
- Cars costing more than $100,000
- Cars with 0-62mph in less than 3 seconds
- Cars with engine sizes of 5 liters or more

## Data Source

The car data consists of 88 sports cars from the Kaggle dataset by Kiattisak Rattanaporn, available at [Sports Car Prices Dataset](https://www.kaggle.com/kiattisak/sports-car-prices).

## Photo Credits

Car photos are sourced from Wallpaper Cave and other publicly available sources.

## Disclaimer

This project is for learning purposes and has no commercial intent.

## Ranking and Statistics

View the rankings of the top 10 players along with their statistics:

- **Games Played**
- **Win Ratio Percentage**
- **Favorite Mode**
- **Wins with 1 Guess**
- **Average Guesses per Game**

Compare your statistics to the top players.

## Feedback and Support

If you encounter any bugs, have suggestions, or want to request new features, please email sawinskif@gmail.com.

Thank you for playing! Enjoy guessing the cars!
