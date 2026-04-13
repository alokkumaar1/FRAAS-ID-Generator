# Smart Student ID Generator

A React.js application that allows users to generate student ID cards with customizable templates.

## 🎬 Website Demo

<img src="./outputs/1.png" width="100%" />

<p align="center"> 
  <img src="./outputs/2.png" width="30%" style="margin: 150px;" />
  <img src="./outputs/3.png" width="30%" style="margin: 150px;" />
  <img src="./outputs/4.png" width="30%" style="margin: 150px;" />
</p>

---

## Features

- **Student Data Form**: Capture student information including name, roll number, class & division, allergies, photo, rack number, and bus route.
- **Smart ID Card Preview**: Generate an ID card with all student information and a QR code containing the full student data.
- **Template Switching**: Toggle between two different ID card design templates.
- **Persistent Data**: Save entries to localStorage and allow viewing/downloading of previously created cards.
- **Download as PNG**: Convert the ID card to a PNG image for printing or sharing.

## Technologies Used

- React.js with Vite
- Pure CSS for styling (no frameworks)
- qrcode.react for QR code generation
- html-to-image for downloading cards as PNG

## Implementation Details:

### Form Validation

The application includes comprehensive form validation to ensure all required fields are filled before generating an ID card. Error messages are displayed for any missing information, providing a smooth user experience.

### Photo Upload

The application allows users to upload a photo which is then displayed on the ID card. The photo is stored as a base64 string in localStorage, ensuring it persists between sessions.

### QR Code Generation

Each ID card includes a QR code that contains the complete student data in JSON format. This allows for quick scanning and retrieval of student information.

### Template Switching

Users can switch between two distinct ID card templates:
- Template 1: A professional blue design with a traditional layout
- Template 2: A modern green design with a circular photo and alternative layout

### Local Storage Integration

All generated ID cards are automatically saved to localStorage, allowing users to:
- View previously created cards
- Load existing cards for viewing or re-downloading
- Delete cards they no longer need

### Responsive Design

The application is fully responsive and works well on both desktop and mobile devices, ensuring accessibility across different screen sizes.

## Thought Process

When designing this application, I focused on creating a clean, intuitive interface that would make it easy for users to generate professional-looking ID cards. Key considerations included:

1. **User Experience**: Ensuring the form is easy to navigate with clear validation
2. **Visual Appeal**: Creating two distinct templates that look professional
3. **Functionality**: Implementing all required features including QR code generation and PNG download
4. **Data Persistence**: Using localStorage to save user data between sessions
5. **Performance**: Optimizing image handling and rendering for smooth operation

The component structure was designed to be modular and maintainable, with separate components for the form, card preview, templates, and stored cards list.

## Installation and Usage

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser to the URL displayed in the terminal
