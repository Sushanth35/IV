// Sample data for demonstration purposes
const data = [
    { age: 25, chain: 'Store A', purchaseAmount: 100 },
    { age: 30, chain: 'Store B', purchaseAmount: 150 },
    { age: 35, chain: 'Store A', purchaseAmount: 200 },
    { age: 40, chain: 'Store B', purchaseAmount: 120 },
];

// Render chart based on filtered data
function renderChart(filteredData) {
    const svg = d3.select("#chart");

    const xScale = d3.scaleBand()
        .domain(filteredData.map(d => d.chain))
        .range([0, svg.node().getBoundingClientRect().width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.purchaseAmount)])
        .nice()
        .range([svg.node().getBoundingClientRect().height, 0]);

    const bars = svg.selectAll(".bar")
        .data(filteredData)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.chain))
        .attr("y", d => yScale(d.purchaseAmount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svg.node().getBoundingClientRect().height - yScale(d.purchaseAmount))
        .attr("fill", "steelblue");

    svg.selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${svg.node().getBoundingClientRect().height})`)
        .call(d3.axisBottom(xScale));

    svg.selectAll(".y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
}

// Filter data based on user input and update the chart
function filterData() {
    const ageFilter = document.getElementById("age").value;
    const chainFilter = document.getElementById("chain").value;

    let filteredData = data;

    if (ageFilter !== 'all') {
        filteredData = filteredData.filter(d => d.age == ageFilter);
    }

    if (chainFilter !== 'all') {
        filteredData = filteredData.filter(d => d.chain == chainFilter);
    }

    renderChart(filteredData);
}

// Event listener for filters
document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('change', filterData);
});

// Initial rendering of the chart
filterData();
