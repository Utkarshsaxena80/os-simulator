// CPU Scheduling Algorithms Implementation

class SchedulingAlgorithms {
    // First Come First Served (FCFS)
    static fcfs(processes) {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const timeline = [];
        const metrics = {};
        
        let currentTime = 0;
        
        sorted.forEach(process => {
            const startTime = Math.max(currentTime, process.arrivalTime);
            const endTime = startTime + process.burstTime;
            
            timeline.push({
                pid: process.pid,
                start: startTime,
                end: endTime
            });
            
            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = endTime - process.arrivalTime;
            const responseTime = waitingTime; // For FCFS, response time = waiting time
            
            metrics[process.pid] = {
                arrivalTime: process.arrivalTime,
                burstTime: process.burstTime,
                startTime: startTime,
                endTime: endTime,
                waitingTime: waitingTime,
                turnaroundTime: turnaroundTime,
                responseTime: responseTime
            };
            
            currentTime = endTime;
        });
        
        return { timeline, metrics };
    }
    
    // Shortest Job First (Non-preemptive)
    static sjfNonPreemptive(processes) {
        const sorted = [...processes].sort((a, b) => {
            if (a.arrivalTime !== b.arrivalTime) {
                return a.arrivalTime - b.arrivalTime;
            }
            return a.burstTime - b.burstTime;
        });
        
        const timeline = [];
        const metrics = {};
        let currentTime = 0;
        const readyQueue = [];
        let processIndex = 0;
        
        while (processIndex < sorted.length || readyQueue.length > 0) {
            // Add processes that have arrived
            while (processIndex < sorted.length && sorted[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(sorted[processIndex]);
                processIndex++;
            }
            
            if (readyQueue.length === 0) {
                // No processes ready, jump to next arrival
                if (processIndex < sorted.length) {
                    currentTime = sorted[processIndex].arrivalTime;
                    continue;
                }
                break;
            }
            
            // Sort ready queue by burst time
            readyQueue.sort((a, b) => a.burstTime - b.burstTime);
            const process = readyQueue.shift();
            
            const startTime = currentTime;
            const endTime = startTime + process.burstTime;
            
            timeline.push({
                pid: process.pid,
                start: startTime,
                end: endTime
            });
            
            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = endTime - process.arrivalTime;
            const responseTime = waitingTime;
            
            metrics[process.pid] = {
                arrivalTime: process.arrivalTime,
                burstTime: process.burstTime,
                startTime: startTime,
                endTime: endTime,
                waitingTime: waitingTime,
                turnaroundTime: turnaroundTime,
                responseTime: responseTime
            };
            
            currentTime = endTime;
        }
        
        return { timeline, metrics };
    }
    
    // Shortest Job First (Preemptive / SRTF)
    static sjfPreemptive(processes) {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const timeline = [];
        const metrics = {};
        const remainingTime = {};
        
        sorted.forEach(p => {
            remainingTime[p.pid] = p.burstTime;
            metrics[p.pid] = {
                arrivalTime: p.arrivalTime,
                burstTime: p.burstTime,
                startTime: null,
                endTime: null,
                waitingTime: 0,
                turnaroundTime: 0,
                responseTime: -1
            };
        });
        
        let currentTime = 0;
        let currentProcess = null;
        let processIndex = 0;
        const readyQueue = [];
        
        while (processIndex < sorted.length || readyQueue.length > 0 || currentProcess) {
            // Add newly arrived processes
            while (processIndex < sorted.length && sorted[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(sorted[processIndex]);
                processIndex++;
            }
            
            // Sort ready queue by remaining time
            readyQueue.sort((a, b) => remainingTime[a.pid] - remainingTime[b.pid]);
            
            // Select process with shortest remaining time
            let nextProcess = readyQueue.length > 0 ? readyQueue[0] : null;
            
            if (currentProcess && nextProcess && 
                remainingTime[nextProcess.pid] < remainingTime[currentProcess.pid]) {
                // Preempt current process
                if (timeline.length > 0 && timeline[timeline.length - 1].pid === currentProcess.pid) {
                    timeline[timeline.length - 1].end = currentTime;
                }
                readyQueue.push(currentProcess);
                readyQueue.sort((a, b) => remainingTime[a.pid] - remainingTime[b.pid]);
                currentProcess = null;
            }
            
            if (!currentProcess && readyQueue.length > 0) {
                currentProcess = readyQueue.shift();
                if (metrics[currentProcess.pid].responseTime === -1) {
                    metrics[currentProcess.pid].responseTime = currentTime - currentProcess.arrivalTime;
                }
                if (metrics[currentProcess.pid].startTime === null) {
                    metrics[currentProcess.pid].startTime = currentTime;
                }
                
                // Start new segment
                if (timeline.length === 0 || timeline[timeline.length - 1].pid !== currentProcess.pid ||
                    timeline[timeline.length - 1].end !== currentTime) {
                    timeline.push({
                        pid: currentProcess.pid,
                        start: currentTime,
                        end: currentTime + 1
                    });
                }
            }
            
            if (currentProcess) {
                remainingTime[currentProcess.pid]--;
                timeline[timeline.length - 1].end = currentTime + 1;
                
                if (remainingTime[currentProcess.pid] === 0) {
                    metrics[currentProcess.pid].endTime = currentTime + 1;
                    metrics[currentProcess.pid].turnaroundTime = 
                        metrics[currentProcess.pid].endTime - currentProcess.arrivalTime;
                    metrics[currentProcess.pid].waitingTime = 
                        metrics[currentProcess.pid].turnaroundTime - currentProcess.burstTime;
                    currentProcess = null;
                }
            }
            
            currentTime++;
            
            // Update waiting time for processes in ready queue
            readyQueue.forEach(p => {
                if (metrics[p.pid].startTime !== null) {
                    metrics[p.pid].waitingTime++;
                }
            });
        }
        
        return { timeline, metrics };
    }
    
    // Priority Scheduling (Non-preemptive)
    static priorityNonPreemptive(processes) {
        const sorted = [...processes].sort((a, b) => {
            if (a.arrivalTime !== b.arrivalTime) {
                return a.arrivalTime - b.arrivalTime;
            }
            return a.priority - b.priority;
        });
        
        const timeline = [];
        const metrics = {};
        let currentTime = 0;
        const readyQueue = [];
        let processIndex = 0;
        
        while (processIndex < sorted.length || readyQueue.length > 0) {
            // Add processes that have arrived
            while (processIndex < sorted.length && sorted[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(sorted[processIndex]);
                processIndex++;
            }
            
            if (readyQueue.length === 0) {
                if (processIndex < sorted.length) {
                    currentTime = sorted[processIndex].arrivalTime;
                    continue;
                }
                break;
            }
            
            // Sort by priority (lower number = higher priority)
            readyQueue.sort((a, b) => a.priority - b.priority);
            const process = readyQueue.shift();
            
            const startTime = currentTime;
            const endTime = startTime + process.burstTime;
            
            timeline.push({
                pid: process.pid,
                start: startTime,
                end: endTime
            });
            
            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = endTime - process.arrivalTime;
            const responseTime = waitingTime;
            
            metrics[process.pid] = {
                arrivalTime: process.arrivalTime,
                burstTime: process.burstTime,
                priority: process.priority,
                startTime: startTime,
                endTime: endTime,
                waitingTime: waitingTime,
                turnaroundTime: turnaroundTime,
                responseTime: responseTime
            };
            
            currentTime = endTime;
        }
        
        return { timeline, metrics };
    }
    
    // Priority Scheduling (Preemptive)
    static priorityPreemptive(processes) {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const timeline = [];
        const metrics = {};
        const remainingTime = {};
        
        sorted.forEach(p => {
            remainingTime[p.pid] = p.burstTime;
            metrics[p.pid] = {
                arrivalTime: p.arrivalTime,
                burstTime: p.burstTime,
                priority: p.priority,
                startTime: null,
                endTime: null,
                waitingTime: 0,
                turnaroundTime: 0,
                responseTime: -1
            };
        });
        
        let currentTime = 0;
        let currentProcess = null;
        let processIndex = 0;
        const readyQueue = [];
        
        while (processIndex < sorted.length || readyQueue.length > 0 || currentProcess) {
            // Add newly arrived processes
            while (processIndex < sorted.length && sorted[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(sorted[processIndex]);
                processIndex++;
            }
            
            // Sort by priority (lower = higher priority)
            readyQueue.sort((a, b) => a.priority - b.priority);
            
            let nextProcess = readyQueue.length > 0 ? readyQueue[0] : null;
            
            if (currentProcess && nextProcess && 
                nextProcess.priority < currentProcess.priority) {
                // Preempt
                if (timeline.length > 0 && timeline[timeline.length - 1].pid === currentProcess.pid) {
                    timeline[timeline.length - 1].end = currentTime;
                }
                readyQueue.push(currentProcess);
                readyQueue.sort((a, b) => a.priority - b.priority);
                currentProcess = null;
            }
            
            if (!currentProcess && readyQueue.length > 0) {
                currentProcess = readyQueue.shift();
                if (metrics[currentProcess.pid].responseTime === -1) {
                    metrics[currentProcess.pid].responseTime = currentTime - currentProcess.arrivalTime;
                }
                if (metrics[currentProcess.pid].startTime === null) {
                    metrics[currentProcess.pid].startTime = currentTime;
                }
                
                if (timeline.length === 0 || timeline[timeline.length - 1].pid !== currentProcess.pid ||
                    timeline[timeline.length - 1].end !== currentTime) {
                    timeline.push({
                        pid: currentProcess.pid,
                        start: currentTime,
                        end: currentTime + 1
                    });
                }
            }
            
            if (currentProcess) {
                remainingTime[currentProcess.pid]--;
                timeline[timeline.length - 1].end = currentTime + 1;
                
                if (remainingTime[currentProcess.pid] === 0) {
                    metrics[currentProcess.pid].endTime = currentTime + 1;
                    metrics[currentProcess.pid].turnaroundTime = 
                        metrics[currentProcess.pid].endTime - currentProcess.arrivalTime;
                    metrics[currentProcess.pid].waitingTime = 
                        metrics[currentProcess.pid].turnaroundTime - currentProcess.burstTime;
                    currentProcess = null;
                }
            }
            
            currentTime++;
            
            readyQueue.forEach(p => {
                if (metrics[p.pid].startTime !== null) {
                    metrics[p.pid].waitingTime++;
                }
            });
        }
        
        return { timeline, metrics };
    }
    
    // Round Robin
    static roundRobin(processes, quantum) {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const timeline = [];
        const metrics = {};
        const remainingTime = {};
        const queue = [];
        
        sorted.forEach(p => {
            remainingTime[p.pid] = p.burstTime;
            metrics[p.pid] = {
                arrivalTime: p.arrivalTime,
                burstTime: p.burstTime,
                startTime: null,
                endTime: null,
                waitingTime: 0,
                turnaroundTime: 0,
                responseTime: -1
            };
        });
        
        let currentTime = 0;
        let currentProcess = null;
        let timeSlice = 0;
        let processIndex = 0;
        
        while (processIndex < sorted.length || queue.length > 0 || currentProcess) {
            // Add newly arrived processes
            while (processIndex < sorted.length && sorted[processIndex].arrivalTime <= currentTime) {
                queue.push(sorted[processIndex]);
                processIndex++;
            }
            
            // If current process finished its time slice or completed
            if (currentProcess && (timeSlice >= quantum || remainingTime[currentProcess.pid] === 0)) {
                if (remainingTime[currentProcess.pid] > 0) {
                    queue.push(currentProcess);
                } else {
                    metrics[currentProcess.pid].endTime = currentTime;
                    metrics[currentProcess.pid].turnaroundTime = 
                        currentTime - currentProcess.arrivalTime;
                    metrics[currentProcess.pid].waitingTime = 
                        metrics[currentProcess.pid].turnaroundTime - currentProcess.burstTime;
                }
                currentProcess = null;
                timeSlice = 0;
            }
            
            // Get next process from queue
            if (!currentProcess && queue.length > 0) {
                currentProcess = queue.shift();
                if (metrics[currentProcess.pid].responseTime === -1) {
                    metrics[currentProcess.pid].responseTime = currentTime - currentProcess.arrivalTime;
                }
                if (metrics[currentProcess.pid].startTime === null) {
                    metrics[currentProcess.pid].startTime = currentTime;
                }
                
                // Start new segment if needed
                if (timeline.length === 0 || timeline[timeline.length - 1].pid !== currentProcess.pid ||
                    timeline[timeline.length - 1].end !== currentTime) {
                    timeline.push({
                        pid: currentProcess.pid,
                        start: currentTime,
                        end: currentTime + 1
                    });
                }
            }
            
            if (currentProcess) {
                remainingTime[currentProcess.pid]--;
                timeSlice++;
                timeline[timeline.length - 1].end = currentTime + 1;
            }
            
            // Update waiting time for processes in queue
            queue.forEach(p => {
                if (metrics[p.pid].startTime !== null) {
                    metrics[p.pid].waitingTime++;
                }
            });
            
            currentTime++;
        }
        
        return { timeline, metrics };
    }
}

