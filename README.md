# Custom Captcha - Camera-Based Verification

A unique and interactive CAPTCHA system that uses your camera and a moving square puzzle to verify you're human. Instead of clicking blurry text, you'll need to follow the movement of a square on your camera feed and then identify watermarked sectors to prove you're not a bot.

## 📸 Demo

Here's what the captcha looks like in action:

![Custom Captcha Demo](./ScreenRecording2026-01-15at4.03.51PM-ezgif.com-video-to-gif-converter.gif)

## 🚀 Features

- **Camera-Based Verification**: Uses your device's camera for verification
- **Moving Square Challenge**: A square moves across your camera feed in a 3x3 grid
- **Watermark Identification**: After capturing the square's position, you identify watermarked sectors
- **Multiple Watermark Shapes**: Test with triangles, circles, and squares
- **Instant Feedback**: Immediate feedback on your selections
- **Works Everywhere**: Compatible with all major browsers
- **TypeScript**: Built with TypeScript for stability

## 📋 How It Works

The verification process has three main stages:

1. **Camera Capture Stage** - The square moves around a 3x3 grid on your camera feed for 60 seconds
2. **Puzzle Selection Stage** - You select the sectors that contain watermarks (you need to get at least 3 out of 9 correct)
3. **Validation Result** - You get instant feedback on whether you passed the verification

## 💻 Getting Started

### Prerequisites

Before you start, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **yarn** (comes with Node.js)
- A working camera on your computer
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

Follow these simple steps to get the project running on your local machine:

#### 1. Clone or Download the Project

```bash
# If you have git installed:
git clone <repository-url>
cd Custom_Captcha

# Or just download and extract the ZIP file, then navigate to the folder
```

#### 2. Install Dependencies

```bash
yarn install
```

This command will download all the required packages needed to run the project. It might take a minute or two depending on your internet speed.

#### 3. Start the Development Server

```bash
yarn dev
```

You'll see output like this:

```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 4. Open in Your Browser

Open your browser and go to: **http://localhost:5173/**

That's it! You should now see the captcha interface. Grant camera permission when prompted, and you're ready to test it out.

## 📚 Available Commands

Here are the yarn commands you can use:

| Command         | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| `yarn  dev`     | Starts the development server (use this for local testing) |
| `yarn  build`   | Creates a production build                                 |
| `yarn  preview` | Preview the production build locally                       |
| `yarn  lint`    | Checks code for style issues                               |
| `yarn test`     | Runs all the tests                                         |

## 🛠️ Project Structure

```
src/
├── components/        # React components (UI pieces)
│   ├── CameraCaptureStage.tsx      # Camera and moving square
│   ├── PuzzleSelectionStage.tsx    # Watermark selection
│   ├── ValidationResult.tsx        # Pass/fail screen
│   └── LoadingSpinner.tsx          # Loading indicator
├── services/          # Business logic
│   ├── camera.service.ts          # Camera handling
│   ├── captcha-generator.service.ts  # Generate puzzle
│   ├── captcha-validator.service.ts  # Check answers
│   └── square-mover.service.ts    # Square movement logic
├── hooks/             # Custom React hooks
│   ├── useCamera.ts              # Camera management
│   ├── useCaptcha.ts             # Captcha flow
│   └── useSquareMovement.ts      # Square animation
├── config/
│   └── constants.ts   # Configuration settings
├── types/
│   └── captcha.ts     # Type definitions
└── App.tsx            # Main app component
```

## ⚙️ Configuration

All the captcha settings are in `src/config/constants.ts`. Here's what you can customize:

| Setting                        | Default | What it controls                                |
| ------------------------------ | ------- | ----------------------------------------------- |
| `gridRows` / `gridCols`        | 3       | The grid size (3x3 = 9 sectors)                 |
| `squareSizePercent`            | 40      | How big the moving square is (40% of camera)    |
| `movementIntervalMs`           | 1500    | How fast the square moves (milliseconds)        |
| `selectionTimeoutMs`           | 60000   | Time limit for entire verification (60 seconds) |
| `watermarkRatio`               | 0.5     | How many sectors have watermarks (50%)          |
| `MINIMUM_CORRECT_SELECTIONS`   | 3       | How many correct selections needed to pass      |
| `MAXIMUM_INCORRECT_SELECTIONS` | 1       | How many wrong clicks are allowed               |

## 🧪 Testing

To run the tests:

```bash
yarn test
```

Tests are already set up for camera services and captcha logic. If you modify the code, make sure the tests still pass!

## 🐛 Troubleshooting

### Camera not working?

- Make sure you allowed camera permission when the browser asked
- Check if another app is using your camera
- Try reloading the page
- Try a different browser

### The page is blank?

- Make sure you ran `yarn install` first
- Check the browser console (F12) for error messages
- Try clearing your browser cache (Ctrl+Shift+Delete on Windows, Cmd+Shift+Delete on Mac)

## 📝 Tech Stack

- **React 19** - UI framework
- **TypeScript** - JavaScript with type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
