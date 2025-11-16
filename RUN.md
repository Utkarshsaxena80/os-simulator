# How to Run the CPU Scheduling Simulator

## Method 1: Direct File Opening (Simplest)

1. Navigate to the project folder: `C:\Users\utkar\OneDrive\Desktop\New folder`
2. Double-click on `index.html`
3. It will open in your default web browser
4. The application should load and be ready to use!

**Note:** This method works because all resources (Tailwind CSS and D3.js) are loaded from CDN.

## Method 2: Using a Local Server (Recommended)

If you encounter any issues with Method 1, or want to test with a proper server:

### Option A: Using Python (if installed)

1. Open PowerShell or Command Prompt
2. Navigate to the project folder:
   ```powershell
   cd "C:\Users\utkar\OneDrive\Desktop\New folder"
   ```
3. Start a simple HTTP server:
   ```powershell
   python -m http.server 8000
   ```
4. Open your browser and go to: `http://localhost:8000`
5. Click on `index.html` or it may open automatically

### Option B: Using Node.js (if installed)

1. Install a simple server globally:
   ```bash
   npm install -g http-server
   ```
2. Navigate to the project folder
3. Run:
   ```bash
   http-server
   ```
4. Open the URL shown in the terminal (usually `http://localhost:8080`)

### Option C: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Quick Start Guide

Once the application is open:

1. **Add Processes:**
   - Enter Process ID, Arrival Time, Burst Time, and Priority
   - Click "Add Process" or press Enter
   - OR click "Generate Random" for sample data

2. **Select Algorithm:**
   - Choose from the dropdown menu
   - For Round Robin, enter a time quantum value

3. **Run Simulation:**
   - Click "Run Simulation"
   - View the Gantt chart and metrics

## Troubleshooting

- **If the page doesn't load:** Make sure you have an internet connection (for CDN resources)
- **If styles look broken:** Check browser console for errors
- **If D3.js doesn't work:** Verify internet connection for CDN access

## Browser Compatibility

Works best with:
- Google Chrome (recommended)
- Microsoft Edge
- Mozilla Firefox
- Safari

Make sure your browser is up to date!

