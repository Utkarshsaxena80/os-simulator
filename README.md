# CPU Scheduling Simulator - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [File Structure](#file-structure)
4. [Detailed Code Flow](#detailed-code-flow)
5. [Algorithm Implementations](#algorithm-implementations)
6. [Component Breakdown](#component-breakdown)
7. [Technical Details](#technical-details)
8. [How to Run](#how-to-run)
9. [Usage Guide](#usage-guide)

---

## 🎯 Project Overview

The **CPU Scheduling Simulator** is a web-based educational tool that visualizes and simulates various CPU scheduling algorithms used in operating systems. It provides an interactive interface for understanding how different scheduling policies affect process execution, performance metrics, and system efficiency.

### Key Features
- **6 Scheduling Algorithms**: FCFS, SJF (Non-preemptive & Preemptive), Priority (Non-preemptive & Preemptive), Round Robin
- **Interactive Gantt Chart**: Visual timeline with hover tooltips
- **Comprehensive Metrics**: Waiting time, Turnaround time, Response time, CPU utilization, Throughput
- **Process Management**: Add, delete, generate random processes
- **Real-time Visualization**: Dynamic chart updates based on algorithm selection

---

## 🏗️ Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface (HTML)                 │
│  ┌──────────────┐              ┌──────────────┐         │
│  │ Input Panel  │              │ Results Panel│         │
│  │ - Processes  │              │ - Gantt Chart│         │
│  │ - Algorithm  │              │ - Metrics    │         │
│  │ - Controls   │              │ - Details    │         │
│  └──────────────┘              └──────────────┘         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Application Controller (app.js)             │
│  - Event Handling                                        │
│  - Process Management                                    │
│  - UI Updates                                            │
│  - Result Display                                        │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Algorithms      │          │  Gantt Chart      │
│  (algorithms.js) │          │  (gantt.js)       │
│                  │          │                   │
│  - FCFS          │          │  - D3.js Render   │
│  - SJF           │          │  - Visualization  │
│  - Priority      │          │  - Tooltips       │
│  - Round Robin   │          │  - Scaling        │
└──────────────────┘          └──────────────────┘
```

### Design Patterns Used
- **MVC-like Structure**: Separation of concerns (Model: algorithms, View: HTML/CSS, Controller: app.js)
- **Class-based Architecture**: Object-oriented design for maintainability
- **Event-driven Programming**: User interactions trigger computations
- **Data-driven Visualization**: D3.js binds data to DOM elements

---

## 📁 File Structure

```
CPU-Scheduling-Simulator/
│
├── index.html          # Main HTML structure and UI layout
├── styles.css          # Custom CSS styles for Gantt chart and metrics
├── app.js              # Main application logic and event handling
├── algorithms.js       # All 6 scheduling algorithm implementations
├── gantt.js            # Gantt chart visualization using D3.js
├── README.md           # This documentation file
├── RUN.md              # Quick start guide
└── start-server.bat    # Batch file to start local server
```

### File Responsibilities

| File | Purpose | Key Components |
|------|---------|----------------|
| `index.html` | UI structure, layout, form elements | Process input form, algorithm selector, results display area |
| `app.js` | Application controller, event handling, data flow | `CPUSchedulingSimulator` class, process management, result display |
| `algorithms.js` | Core algorithm logic | `SchedulingAlgorithms` class with 6 static methods |
| `gantt.js` | Visualization engine | `GanttChart` class, D3.js rendering, tooltips |
| `styles.css` | Visual styling | Custom styles for charts, metrics cards, tooltips |

---

## 🔄 Detailed Code Flow

### 1. Application Initialization

```javascript
// When DOM loads (index.html line 296-298)
document.addEventListener('DOMContentLoaded', () => {
    simulator = new CPUSchedulingSimulator();
});
```

**Flow:**
1. Browser loads `index.html`
2. External scripts load: Tailwind CSS (CDN), D3.js (CDN), local JS files
3. `DOMContentLoaded` event fires
4. `CPUSchedulingSimulator` instance created
5. Event listeners attached to UI elements

### 2. Process Management Flow

#### Adding a Process
```
User Input → Validation → Add to Array → Update Table
```

**Detailed Steps:**
1. User fills form (PID, Arrival Time, Burst Time, Priority)
2. Clicks "Add Process" or presses Enter
3. `addProcess()` method called (app.js:51-100)
   - Validates inputs (non-empty, valid numbers, no duplicates)
   - Creates process object: `{pid, arrivalTime, burstTime, priority}`
   - Pushes to `this.processes` array
   - Clears input fields
   - Calls `updateProcessTable()` to refresh UI

#### Deleting a Process
```
Click Delete → Filter Array → Update Table
```

**Code:** `deleteProcess(pid)` (app.js:102-105)
- Filters out process with matching PID
- Updates table display

#### Generating Random Processes
```
Click Button → Generate 5 Processes → Sort by Arrival → Update Table
```

**Code:** `generateRandomProcesses()` (app.js:134-153)
- Creates 5 processes with random values
- Arrival: 0-4, Burst: 1-10, Priority: 1-5
- Sorts by arrival time for better visualization

### 3. Simulation Execution Flow

```
User Clicks "Run Simulation"
    ↓
Validate processes exist
    ↓
Get selected algorithm
    ↓
Call corresponding algorithm function
    ↓
Algorithm returns {timeline, metrics}
    ↓
Display results (Gantt chart + metrics + table)
```

**Detailed Execution (app.js:163-207):**

1. **Validation**: Checks if processes array is not empty
2. **Algorithm Selection**: Reads dropdown value
3. **Algorithm Execution**: 
   - For Round Robin: Gets time quantum value
   - Calls static method from `SchedulingAlgorithms` class
   - Returns: `{timeline: [...], metrics: {...}}`
4. **Result Processing**: `displayResults()` called with returned data

### 4. Result Display Flow

```
Algorithm Results → Calculate Metrics → Render Gantt → Display Tables
```

**Steps (app.js:209-285):**

1. **Gantt Chart Rendering** (line 211)
   - Calls `ganttChart.render(timeline, metrics)`
   - D3.js creates SVG visualization

2. **Metrics Calculation** (lines 214-235)
   - Iterates through all process metrics
   - Calculates totals and averages:
     - Average Waiting Time
     - Average Turnaround Time
     - Average Response Time
     - CPU Utilization = (Total Burst Time / Total Execution Time) × 100
     - Throughput = Number of Processes / Total Execution Time

3. **UI Updates**
   - Metrics cards displayed with gradient backgrounds
   - Process details table populated
   - Gantt chart rendered with interactive tooltips

---

## 🧮 Algorithm Implementations

### Algorithm Structure

All algorithms follow a similar pattern:
```javascript
static algorithmName(processes, optionalParams) {
    // 1. Initialize data structures
    // 2. Sort/process input
    // 3. Main scheduling loop
    // 4. Calculate metrics
    // 5. Return {timeline, metrics}
}
```

### 1. FCFS (First Come First Served) - Non-preemptive

**Location:** `algorithms.js:5-40`

**Logic:**
1. Sort processes by arrival time
2. Execute each process in order
3. If CPU is busy, wait until current process finishes
4. Calculate metrics for each process

**Key Code:**
```javascript
const startTime = Math.max(currentTime, process.arrivalTime);
const endTime = startTime + process.burstTime;
```

**Time Complexity:** O(n log n) - due to sorting
**Space Complexity:** O(n)

### 2. SJF Non-preemptive

**Location:** `algorithms.js:42-104`

**Logic:**
1. Maintain a ready queue of arrived processes
2. When CPU is free, select process with shortest burst time
3. Execute completely before switching
4. Handle idle time when no processes are ready

**Key Features:**
- Ready queue sorted by burst time
- Handles gaps in arrival times

**Time Complexity:** O(n²) - sorting ready queue for each process
**Space Complexity:** O(n)

### 3. SJF Preemptive (SRTF - Shortest Remaining Time First)

**Location:** `algorithms.js:106-200`

**Logic:**
1. Time-sliced execution (1 unit at a time)
2. Track remaining time for each process
3. At each time unit:
   - Add newly arrived processes to ready queue
   - Select process with shortest remaining time
   - Preempt if a shorter job arrives
4. Update timeline segments for visualization

**Key Features:**
- Preemption logic (lines 144-153)
- Timeline segment merging (lines 165-172)
- Response time calculation (first execution)

**Time Complexity:** O(n × maxTime) - iterate through each time unit
**Space Complexity:** O(n)

### 4. Priority Non-preemptive

**Location:** `algorithms.js:202-264`

**Logic:**
- Similar to SJF Non-preemptive
- Selection based on priority (lower number = higher priority)
- No preemption during execution

**Key Code:**
```javascript
readyQueue.sort((a, b) => a.priority - b.priority);
```

### 5. Priority Preemptive

**Location:** `algorithms.js:266-358`

**Logic:**
- Similar to SJF Preemptive
- Selection based on priority
- Preempts when higher priority process arrives

**Key Code:**
```javascript
if (currentProcess && nextProcess && 
    nextProcess.priority < currentProcess.priority) {
    // Preempt current process
}
```

### 6. Round Robin

**Location:** `algorithms.js:360-447`

**Logic:**
1. Maintain a circular queue
2. Each process gets time quantum
3. If process doesn't finish, add back to queue
4. Fair scheduling - all processes get equal opportunity

**Key Features:**
- Time slice tracking (line 383: `timeSlice`)
- Quantum enforcement (line 394)
- Queue management for incomplete processes

**Time Complexity:** O(n × maxTime)
**Space Complexity:** O(n)

---

## 🧩 Component Breakdown

### 1. CPUSchedulingSimulator Class (app.js)

**Purpose:** Main application controller

**Properties:**
- `processes`: Array of process objects
- `ganttChart`: Instance of GanttChart class

**Methods:**

| Method | Purpose | Key Logic |
|--------|---------|-----------|
| `constructor()` | Initialize app | Create GanttChart, attach event listeners |
| `initializeEventListeners()` | Set up UI interactions | DOM event binding |
| `addProcess()` | Add new process | Validation → Add to array → Update UI |
| `deleteProcess(pid)` | Remove process | Filter array → Update UI |
| `updateProcessTable()` | Refresh process list | Generate table rows dynamically |
| `generateRandomProcesses()` | Create sample data | Random generation → Sort → Display |
| `clearProcesses()` | Remove all processes | Confirm → Clear array → Clear results |
| `runSimulation()` | Execute algorithm | Validate → Call algorithm → Display results |
| `displayResults()` | Show results | Calculate metrics → Render chart → Update tables |
| `clearResults()` | Clear output | Remove chart, metrics, tables |

### 2. SchedulingAlgorithms Class (algorithms.js)

**Purpose:** Core algorithm implementations

**Structure:** Static methods (no instance needed)

**Return Format:**
```javascript
{
    timeline: [
        {pid: "P1", start: 0, end: 5},
        {pid: "P2", start: 5, end: 8},
        ...
    ],
    metrics: {
        "P1": {
            arrivalTime: 0,
            burstTime: 5,
            startTime: 0,
            endTime: 5,
            waitingTime: 0,
            turnaroundTime: 5,
            responseTime: 0
        },
        ...
    }
}
```

**Common Patterns:**
- **Non-preemptive**: Execute until completion
- **Preemptive**: Time-sliced, check for preemption each unit
- **Metrics Calculation**: 
  - Waiting Time = Start Time - Arrival Time
  - Turnaround Time = End Time - Arrival Time
  - Response Time = First Start Time - Arrival Time

### 3. GanttChart Class (gantt.js)

**Purpose:** Visualize execution timeline

**Properties:**
- `containerId`: DOM element ID for chart
- `margin`: Chart margins (top, right, bottom, left)
- `barHeight`: Height of each process bar
- `colors`: D3 color scale
- `tooltip`: D3 tooltip element

**Methods:**

#### `render(timeline, metrics)`
**Steps:**
1. Clear previous chart
2. Validate data
3. Extract unique process IDs
4. Create color mapping
5. Calculate dimensions
6. Create SVG element
7. Set up scales (x: time, y: process IDs)
8. Draw bars for each timeline segment
9. Add labels, axes, grid lines
10. Attach hover tooltips

**D3.js Concepts Used:**
- **Data Binding**: `selectAll().data().enter()`
- **Scales**: `scaleLinear()` for time, `scaleBand()` for processes
- **Axes**: `axisBottom()`, `axisLeft()`
- **Event Handlers**: `on("mouseover")`, `on("mouseout")`

#### `clear()`
- Removes all SVG elements
- Cleans up tooltip

### 4. HTML Structure (index.html)

**Layout:**
- **Header**: Title and description
- **Left Panel**: 
  - Algorithm selector
  - Time quantum input (hidden by default)
  - Process input form
  - Process table
  - Control buttons
- **Right Panel**:
  - Gantt chart container
  - Metrics display area
  - Process details table

**External Dependencies:**
- Tailwind CSS (CDN): Utility-first CSS framework
- D3.js v7 (CDN): Data visualization library

**Script Loading Order:**
1. `algorithms.js` - Core logic
2. `gantt.js` - Visualization
3. `app.js` - Application (depends on above)

---

## 🔧 Technical Details

### Data Structures

**Process Object:**
```javascript
{
    pid: string,           // Process identifier
    arrivalTime: number,   // When process arrives (>= 0)
    burstTime: number,     // CPU time needed (> 0)
    priority: number       // Priority level (>= 1, lower = higher priority)
}
```

**Timeline Segment:**
```javascript
{
    pid: string,    // Process ID
    start: number,  // Start time
    end: number     // End time
}
```

**Metrics Object:**
```javascript
{
    [pid]: {
        arrivalTime: number,
        burstTime: number,
        startTime: number | null,
        endTime: number | null,
        waitingTime: number,
        turnaroundTime: number,
        responseTime: number  // -1 if not started
    }
}
```

### Metrics Calculations

**Per Process:**
- **Waiting Time** = Start Time - Arrival Time
- **Turnaround Time** = End Time - Arrival Time
- **Response Time** = First Start Time - Arrival Time

**System-wide:**
- **Average Waiting Time** = Σ(Waiting Time) / Number of Processes
- **Average Turnaround Time** = Σ(Turnaround Time) / Number of Processes
- **Average Response Time** = Σ(Response Time) / Number of Processes
- **CPU Utilization** = (Total Burst Time / Total Execution Time) × 100%
- **Throughput** = Number of Processes / Total Execution Time

### Event Handling

**Event Listeners (app.js:10-49):**
- Algorithm dropdown change → Show/hide quantum input
- Add process button → Validate and add
- Enter key in inputs → Trigger add process
- Generate random → Create sample processes
- Clear button → Remove all processes
- Run simulation → Execute algorithm and display results

### Validation Rules

**Process Input:**
- PID: Non-empty, unique
- Arrival Time: Number >= 0
- Burst Time: Number > 0
- Priority: Number >= 1

**Simulation:**
- At least one process required
- Time quantum > 0 (for Round Robin)

---

## 🚀 How to Run

### Method 1: Direct File Opening
1. Navigate to project folder
2. Double-click `index.html`
3. Opens in default browser

### Method 2: Local Server (Recommended)
1. Double-click `start-server.bat`
2. Or run: `python -m http.server 8000`
3. Open `http://localhost:8000`

### Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for CDN resources)
- Python 3.x (optional, for local server)

---

## 📖 Usage Guide

### Step-by-Step Usage

1. **Add Processes**
   - Enter Process ID, Arrival Time, Burst Time, Priority
   - Click "Add Process" or press Enter
   - Repeat for multiple processes
   - OR click "Generate Random" for quick start

2. **Select Algorithm**
   - Choose from dropdown menu
   - For Round Robin, enter time quantum

3. **Run Simulation**
   - Click "Run Simulation" button
   - Wait for calculation (instant for small datasets)

4. **View Results**
   - **Gantt Chart**: Hover over bars for details
   - **Metrics Cards**: System-wide performance indicators
   - **Process Details Table**: Individual process metrics

5. **Experiment**
   - Try different algorithms with same processes
   - Compare metrics across algorithms
   - Modify processes and re-run

### Example Scenarios

**Scenario 1: FCFS**
- Processes: P1(0,5), P2(1,3), P3(2,8)
- Result: Executes in arrival order, P2 waits even though shorter

**Scenario 2: SJF Non-preemptive**
- Same processes
- Result: P1 runs first (arrives first), then P2 (shorter), then P3

**Scenario 3: Round Robin (quantum=2)**
- Same processes
- Result: Time-sliced execution, fair distribution

---

## 🎓 Educational Value

### Learning Objectives
1. **Understand Scheduling Concepts**: Visual representation of algorithm behavior
2. **Compare Algorithms**: Side-by-side metric comparison
3. **Analyze Performance**: See how different algorithms affect waiting/turnaround times
4. **Preemption Effects**: Observe differences between preemptive and non-preemptive

### Key Insights
- **FCFS**: Simple but can cause long waiting times
- **SJF**: Minimizes average waiting time but requires burst time knowledge
- **Priority**: Useful for real-time systems
- **Round Robin**: Fair but may have higher turnaround times

---

## 🔍 Code Quality Features

- **Modular Design**: Separate files for different concerns
- **Error Handling**: Input validation and try-catch blocks
- **User Feedback**: Alerts for invalid inputs
- **Responsive UI**: Works on different screen sizes
- **Interactive Visualization**: Hover tooltips, color coding
- **Clean Code**: Well-commented, readable structure

---

## 📝 Presentation Tips

### Key Points to Highlight
1. **Architecture**: Clean separation of concerns
2. **Algorithms**: Accurate implementations of OS concepts
3. **Visualization**: Interactive Gantt chart with D3.js
4. **Metrics**: Comprehensive performance analysis
5. **User Experience**: Intuitive interface, real-time feedback

### Demo Flow
1. Show empty interface
2. Generate random processes
3. Run FCFS - explain simple execution
4. Run SJF - show optimization
5. Run Round Robin - demonstrate time slicing
6. Compare metrics across algorithms
7. Show Gantt chart interactivity (hover tooltips)

---

## 🛠️ Future Enhancements (Optional)

- Save/load process configurations
- Export results as CSV/JSON
- Additional algorithms (Multilevel Queue, Multilevel Feedback Queue)
- Animation of process execution
- Comparison mode (side-by-side algorithm results)
- Process arrival animation

---

## 📚 References

- Operating System Concepts (Scheduling Algorithms)
- D3.js Documentation: https://d3js.org/
- Tailwind CSS Documentation: https://tailwindcss.com/

---

**Project Status:** ✅ Complete and Functional  
**Last Updated:** 2024  
**Version:** 1.0
