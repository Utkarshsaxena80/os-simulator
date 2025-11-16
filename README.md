# CPU Scheduling Simulator

A complete web-based CPU Scheduling Simulator with interactive Gantt chart visualization. This application allows you to simulate various CPU scheduling algorithms and visualize their execution timeline.

## Features

### Supported Scheduling Algorithms

1. **FCFS (First Come First Served)** - Non-preemptive
2. **SJF Non-preemptive** - Shortest Job First
3. **SJF Preemptive (SRTF)** - Shortest Remaining Time First
4. **Priority Non-preemptive** - Priority-based scheduling
5. **Priority Preemptive** - Preemptive priority scheduling
6. **Round Robin** - Time-sliced scheduling with configurable quantum

### Key Features

- **Interactive Process Management**
  - Add processes with Process ID, Arrival Time, Burst Time, and Priority
  - Delete individual processes
  - Generate random processes for quick testing
  - Clear all processes

- **Interactive Gantt Chart**
  - Visual timeline showing when each process executes
  - Hover tooltips showing Process ID, Start Time, End Time, and Duration
  - Color-coded process blocks
  - Automatic scaling and grid lines

- **Comprehensive Metrics**
  - Waiting Time (per process and average)
  - Turnaround Time (per process and average)
  - Response Time (per process and average)
  - CPU Utilization percentage
  - Throughput (processes per time unit)

- **Detailed Process Information**
  - Complete execution timeline for each process
  - Start and end times
  - All calculated metrics per process

## How to Use

1. **Open the Application**
   - Simply open `index.html` in a modern web browser
   - No server or installation required (runs entirely client-side)

2. **Add Processes**
   - Enter Process ID, Arrival Time, Burst Time, and Priority
   - Click "Add Process" or press Enter
   - Alternatively, click "Generate Random" to create sample processes

3. **Select Algorithm**
   - Choose your desired scheduling algorithm from the dropdown
   - For Round Robin, enter the time quantum value

4. **Run Simulation**
   - Click "Run Simulation" to execute the selected algorithm
   - View the Gantt chart and metrics

5. **Analyze Results**
   - Hover over Gantt chart bars to see detailed information
   - Review performance metrics
   - Check individual process details in the results table

## File Structure

```
.
├── index.html      # Main HTML structure
├── styles.css      # Custom CSS styles
├── app.js          # Main application logic and UI interactions
├── algorithms.js   # All scheduling algorithm implementations
├── gantt.js        # Gantt chart visualization using D3.js
└── README.md       # This file
```

## Technical Details

### Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (with Tailwind CSS via CDN)
- **JavaScript (ES6+)** - Application logic
- **D3.js v7** - Gantt chart visualization

### Algorithm Implementations

All algorithms are implemented in `algorithms.js` as static methods of the `SchedulingAlgorithms` class:

- Each algorithm takes an array of processes and returns:
  - `timeline`: Array of execution segments `{pid, start, end}`
  - `metrics`: Object with per-process metrics

- For Round Robin, an additional `quantum` parameter is required

### Metrics Calculation

- **Waiting Time**: Time spent waiting in ready queue
- **Turnaround Time**: Total time from arrival to completion
- **Response Time**: Time from arrival to first execution
- **CPU Utilization**: (Total burst time / Total execution time) × 100
- **Throughput**: Number of processes completed per time unit

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- Process IDs must be unique
- Arrival times must be non-negative
- Burst times must be positive
- Priorities must be positive integers (lower number = higher priority)
- Time quantum for Round Robin must be positive

## Example Usage

1. Click "Generate Random" to create sample processes
2. Select "Round Robin" algorithm
3. Set time quantum to 2
4. Click "Run Simulation"
5. Observe the Gantt chart and metrics

## License

This project is open source and available for educational purposes.

