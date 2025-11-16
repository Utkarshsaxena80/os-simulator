// Gantt Chart Visualization using D3.js

class GanttChart {
    constructor(containerId) {
        this.containerId = containerId;
        this.margin = { top: 20, right: 20, bottom: 40, left: 60 };
        this.barHeight = 40;
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.tooltip = null;
    }
    
    render(timeline, metrics) {
        const container = d3.select(`#${this.containerId}`);
        container.selectAll("*").remove();
        
        if (!timeline || timeline.length === 0) {
            container.append("p")
                .text("No simulation data available. Run a simulation first.")
                .classed("text-gray-500 text-center py-8", true);
            return;
        }
        
        // Get unique process IDs and create color mapping
        const processIds = [...new Set(timeline.map(t => t.pid))];
        const colorMap = {};
        processIds.forEach((pid, i) => {
            colorMap[pid] = this.colors(i);
        });
        
        // Calculate dimensions
        const maxTime = d3.max(timeline, d => d.end);
        const width = Math.max(600, container.node().offsetWidth - this.margin.left - this.margin.right);
        const height = processIds.length * (this.barHeight + 10) + this.margin.top + this.margin.bottom;
        
        // Create SVG
        const svg = container.append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, maxTime])
            .range([0, width]);
        
        const yScale = d3.scaleBand()
            .domain(processIds)
            .range([0, processIds.length * (this.barHeight + 10)])
            .padding(0.1);
        
        // Create tooltip
        this.tooltip = d3.select("body").append("div")
            .attr("class", "gantt-tooltip")
            .style("opacity", 0);
        
        // Draw timeline bars
        const bars = svg.selectAll(".gantt-bar")
            .data(timeline)
            .enter()
            .append("g")
            .attr("class", "gantt-bar");
        
        bars.append("rect")
            .attr("x", d => xScale(d.start))
            .attr("y", d => yScale(d.pid))
            .attr("width", d => xScale(d.end) - xScale(d.start))
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorMap[d.pid])
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .on("mouseover", (event, d) => {
                this.tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                this.tooltip.html(`
                    <strong>Process:</strong> ${d.pid}<br/>
                    <strong>Start:</strong> ${d.start}<br/>
                    <strong>End:</strong> ${d.end}<br/>
                    <strong>Duration:</strong> ${d.end - d.start}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                this.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        // Add process ID labels on bars
        bars.append("text")
            .attr("class", "process-id-label")
            .attr("x", d => xScale(d.start) + (xScale(d.end) - xScale(d.start)) / 2)
            .attr("y", d => yScale(d.pid) + yScale.bandwidth() / 2)
            .text(d => d.pid)
            .attr("fill", "white")
            .style("font-size", "12px")
            .style("font-weight", "bold");
        
        // Add X-axis (time)
        const xAxis = d3.axisBottom(xScale)
            .ticks(Math.min(maxTime, 20))
            .tickFormat(d => d);
        
        svg.append("g")
            .attr("transform", `translate(0, ${processIds.length * (this.barHeight + 10)})`)
            .call(xAxis)
            .append("text")
            .attr("x", width / 2)
            .attr("y", 35)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("Time");
        
        // Add Y-axis (process IDs)
        const yAxis = d3.axisLeft(yScale);
        
        svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -height / 2)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("Process ID");
        
        // Add grid lines
        svg.selectAll(".grid-line")
            .data(xScale.ticks(Math.min(maxTime, 20)))
            .enter()
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("y1", 0)
            .attr("y2", processIds.length * (this.barHeight + 10))
            .attr("stroke", "#e0e0e0")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3");
    }
    
    clear() {
        const container = d3.select(`#${this.containerId}`);
        container.selectAll("*").remove();
        if (this.tooltip) {
            this.tooltip.remove();
        }
    }
}

