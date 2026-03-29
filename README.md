# Random Generator

A client-side web tool for generating random strings, UUIDs, passwords, and more with ease.

**100% Client-side - No data sent to server!**

## Features

- ✅ Generate Alphabetic strings (A-Z, a-z)
- ✅ Generate Numeric strings (0-9)
- ✅ Generate Alphanumeric strings
- ✅ Generate strings with Special Characters
- ✅ Generate secure Passwords (guaranteed mix of upper, lower, numbers, symbols)
- ✅ Generate UUID v4
- ✅ Generate Hexadecimal strings
- ✅ Generate Custom strings (use your own character set)
- ✅ Configurable string length (1-1000)
- ✅ Generate multiple strings at once (1-100)
- ✅ Multiple separator options (newline, comma, semicolon, space, tab)
- ✅ Copy to clipboard
- ✅ Download results as .txt
- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ Cryptographically secure random generation

## Generator Types

| Type | Description | Example |
|------|-------------|---------|
| Alphabetic | Letters only (A-Z, a-z) | `AbCdEfGhIjKl` |
| Numeric | Numbers only (0-9) | `4827163950` |
| Alphanumeric | Letters and numbers | `A1b2C3d4E5f6` |
| Special Chars | Letters, numbers, and symbols | `Ab1@Cd2#Ef3$` |
| Password | Guaranteed strong password | `K7$mNp2&Qr9!` |
| UUID | UUID v4 format | `550e8400-e29b-41d4-a716-446655440000` |
| Hexadecimal | Hex characters (0-9, A-F) | `4A7F2B9C3E1D` |
| Custom | Your own character set | Based on your input |

## Usage

### Option 1: Open directly in browser

Simply open `public/index.html` in your web browser.

### Option 2: Use a local server

```bash
# Using Python
cd public
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

Then open `http://localhost:8000` in your browser.

### Option 3: Deploy to Firebase Hosting

```bash
firebase deploy
```

## Project Structure

```
random-generator/
├── public/
│   ├── index.html      # Main HTML file
│   ├── 404.html        # 404 page
│   ├── favicon.svg     # Favicon
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── app.js      # Main JavaScript logic
├── firebase.json       # Firebase config (if applicable)
└── README.md           # Documentation
```

## Technology

- Pure HTML, CSS, JavaScript (no frameworks)
- Web Crypto API for secure random generation
- No external dependencies
- Works offline

## Security

This generator uses the Web Crypto API (`crypto.getRandomValues()` and `crypto.randomUUID()`) for cryptographically secure random number generation, making it suitable for generating passwords and other security-sensitive strings.

## License

MIT License

## Author

Created by [Heru Rusdianto](https://herusdianto.github.io/) with AI Assistance
