// Main Application Logic

class CPUSchedulingSimulator {
    constructor() {
        this.processes = [];
        this.ganttChart = new GanttChart('gantt-chart');
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Algorithm selection - show/hide quantum input
        document.getElementById('algorithm').addEventListener('change', (e) => {
            const quantumContainer = document.getElementById('quantum-container');
            if (e.target.value === 'roundrobin') {
                quantumContainer.classList.remove('hidden');
            } else {
                quantumContainer.classList.add('hidden');
            }
        });
        
        // Add process button
        document.getElementById('add-process-btn').addEventListener('click', () => {
            this.addProcess();
        });
        
        // Enter key support for adding process
        ['pid-input', 'arrival-input', 'burst-input', 'priority-input'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addProcess();
                }
            });
        });
        
        // Generate random processes
        document.getElementById('generate-random-btn').addEventListener('click', () => {
            this.generateRandomProcesses();
        });
        
        // Clear all processes
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearProcesses();
        });
        
        // Run simulation
        document.getElementById('run-simulation-btn').addEventListener('click', () => {
            this.runSimulation();
        });
    }
    
    addProcess() {
        const pid = document.getElementById('pid-input').value.trim();
        const arrivalTime = parseInt(document.getElementById('arrival-input').value);
        const burstTime = parseInt(document.getElementById('burst-input').value);
        const priority = parseInt(document.getElementById('priority-input').value) || 1;
        
        // Validation
        if (!pid) {
            alert('Please enter a Process ID');
            return;
        }
        
        if (isNaN(arrivalTime) || arrivalTime < 0) {
            alert('Please enter a valid Arrival Time (>= 0)');
            return;
        }
        
        if (isNaN(burstTime) || burstTime <= 0) {
            alert('Please enter a valid Burst Time (> 0)');
            return;
        }
        
        if (isNaN(priority) || priority < 1) {
            alert('Please enter a valid Priority (>= 1)');
            return;
        }
        
        // Check for duplicate PID
        if (this.processes.find(p => p.pid === pid)) {
            alert('Process ID already exists. Please use a different ID.');
            return;
        }
        
        // Add process
        this.processes.push({
            pid: pid,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            priority: priority
        });
        
        // Clear input fields
        document.getElementById('pid-input').value = '';
        document.getElementById('arrival-input').value = '';
        document.getElementById('burst-input').value = '';
        document.getElementById('priority-input').value = '';
        
        // Update table
        this.updateProcessTable();
    }
    
    deleteProcess(pid) {
        this.processes = this.processes.filter(p => p.pid !== pid);
        this.updateProcessTable();
    }
    
    updateProcessTable() {
        const tbody = document.getElementById('process-table-body');
        tbody.innerHTML = '';
        
        if (this.processes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No processes added yet</td></tr>';
            return;
        }
        
        this.processes.forEach(process => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="border border-gray-300 px-3 py-2">${process.pid}</td>
                <td class="border border-gray-300 px-3 py-2">${process.arrivalTime}</td>
                <td class="border border-gray-300 px-3 py-2">${process.burstTime}</td>
                <td class="border border-gray-300 px-3 py-2">${process.priority}</td>
                <td class="border border-gray-300 px-3 py-2">
                    <button class="text-red-600 hover:text-red-800 font-medium" onclick="simulator.deleteProcess('${process.pid}')">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    generateRandomProcesses() {
        const numProcesses = 5;
        const processNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
        
        this.processes = [];
        
        for (let i = 0; i < numProcesses; i++) {
            this.processes.push({
                pid: processNames[i],
                arrivalTime: Math.floor(Math.random() * 5),
                burstTime: Math.floor(Math.random() * 10) + 1,
                priority: Math.floor(Math.random() * 5) + 1
            });
        }
        
        // Sort by arrival time for better visualization
        this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        
        this.updateProcessTable();
    }
    
    clearProcesses() {
        if (this.processes.length > 0 && confirm('Are you sure you want to clear all processes?')) {
            this.processes = [];
            this.updateProcessTable();
            this.clearResults();
        }
    }
    
    runSimulation() {
        if (this.processes.length === 0) {
            alert('Please add at least one process before running the simulation.');
            return;
        }
        
        const algorithm = document.getElementById('algorithm').value;
        let result;
        
        try {
            switch (algorithm) {
                case 'fcfs':
                    result = SchedulingAlgorithms.fcfs(this.processes);
                    break;
                case 'sjf-nonpreemptive':
                    result = SchedulingAlgorithms.sjfNonPreemptive(this.processes);
                    break;
                case 'sjf-preemptive':
                    result = SchedulingAlgorithms.sjfPreemptive(this.processes);
                    break;
                case 'priority-nonpreemptive':
                    result = SchedulingAlgorithms.priorityNonPreemptive(this.processes);
                    break;
                case 'priority-preemptive':
                    result = SchedulingAlgorithms.priorityPreemptive(this.processes);
                    break;
                case 'roundrobin':
                    const quantum = parseInt(document.getElementById('quantum').value);
                    if (isNaN(quantum) || quantum <= 0) {
                        alert('Please enter a valid time quantum (> 0)');
                        return;
                    }
                    result = SchedulingAlgorithms.roundRobin(this.processes, quantum);
                    break;
                default:
                    alert('Unknown algorithm selected');
                    return;
            }
            
            this.displayResults(result.timeline, result.metrics);
        } catch (error) {
            console.error('Simulation error:', error);
            alert('An error occurred during simulation: ' + error.message);
        }
    }
    
    displayResults(timeline, metrics) {
        // Render Gantt chart
        this.ganttChart.render(timeline, metrics);
        
        // Calculate overall metrics
        const processIds = Object.keys(metrics);
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        let totalResponseTime = 0;
        let maxEndTime = 0;
        let totalBurstTime = 0;
        
        processIds.forEach(pid => {
            const m = metrics[pid];
            totalWaitingTime += m.waitingTime;
            totalTurnaroundTime += m.turnaroundTime;
            totalResponseTime += m.responseTime;
            maxEndTime = Math.max(maxEndTime, m.endTime);
            totalBurstTime += m.burstTime;
        });
        
        const numProcesses = processIds.length;
        const avgWaitingTime = totalWaitingTime / numProcesses;
        const avgTurnaroundTime = totalTurnaroundTime / numProcesses;
        const avgResponseTime = totalResponseTime / numProcesses;
        const cpuUtilization = (totalBurstTime / maxEndTime) * 100;
        const throughput = numProcesses / maxEndTime;
        
        // Display metrics
        const metricsDisplay = document.getElementById('metrics-display');
        metricsDisplay.innerHTML = `
            <div class="metric-card">
                <div class="metric-label">Average Waiting Time</div>
                <div class="metric-value">${avgWaitingTime.toFixed(2)}</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <div class="metric-label">Average Turnaround Time</div>
                <div class="metric-value">${avgTurnaroundTime.toFixed(2)}</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <div class="metric-label">Average Response Time</div>
                <div class="metric-value">${avgResponseTime.toFixed(2)}</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <div class="metric-label">CPU Utilization</div>
                <div class="metric-value">${cpuUtilization.toFixed(2)}%</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <div class="metric-label">Throughput</div>
                <div class="metric-value">${throughput.toFixed(3)} processes/time unit</div>
            </div>
        `;
        
        // Display process details table
        const resultsTableBody = document.getElementById('results-table-body');
        resultsTableBody.innerHTML = '';
        
        // Sort processes by PID for display
        const sortedPids = processIds.sort();
        
        sortedPids.forEach(pid => {
            const m = metrics[pid];
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="border border-gray-300 px-3 py-2">${pid}</td>
                <td class="border border-gray-300 px-3 py-2">${m.arrivalTime}</td>
                <td class="border border-gray-300 px-3 py-2">${m.burstTime}</td>
                <td class="border border-gray-300 px-3 py-2">${m.startTime !== null ? m.startTime : '-'}</td>
                <td class="border border-gray-300 px-3 py-2">${m.endTime !== null ? m.endTime : '-'}</td>
                <td class="border border-gray-300 px-3 py-2">${m.waitingTime.toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2">${m.turnaroundTime.toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2">${m.responseTime >= 0 ? m.responseTime.toFixed(2) : '-'}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    }
    
    clearResults() {
        this.ganttChart.clear();
        document.getElementById('metrics-display').innerHTML = '';
        document.getElementById('results-table-body').innerHTML = '';
    }
}

// Initialize simulator when page loads
let simulator;
document.addEventListener('DOMContentLoaded', () => {
    simulator = new CPUSchedulingSimulator();
});

