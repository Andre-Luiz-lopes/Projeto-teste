# Electron Calendar App

## Overview
The Electron Calendar App is a desktop application built using Electron, HTML, CSS, and JavaScript. It provides users with a calendar interface that allows them to manage their schedules effectively by incorporating features such as alarms, notes, and the ability to mark important days.

## Features
- **Calendar View**: Navigate through months and view days.
- **Alarms**: Set, edit, and delete alarms for specific dates and times.
- **Notes**: Create, edit, and delete notes associated with specific dates.
- **Important Days**: Mark and display important days for easy reference.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd electron-calendar-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run the following command:
```
npm start
```

## Project Structure
```
electron-calendar-app
├── src
│   ├── main.js          # Main process of the Electron application
│   ├── renderer.js      # Renderer process for UI interactions
│   ├── index.html       # Main HTML file
│   ├── styles           # Directory for CSS files
│   │   └── main.css     # Styles for the application
│   ├── components       # Directory for application components
│   │   ├── calendar.js   # Calendar management
│   │   ├── alarms.js     # Alarm functionalities
│   │   ├── notes.js      # Notes management
│   │   └── important-days.js # Important days management
│   └── assets           # Directory for assets (images, etc.)
├── package.json         # NPM configuration file
├── .gitignore           # Git ignore file
└── README.md            # Project documentation
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.