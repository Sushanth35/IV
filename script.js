let allData = []; // We'll keep all data here globally

// Initialize tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

d3.csv("a1-mutualfunds.csv").then(function(data) {
    allData = data
        .filter(d => !isNaN(parseFloat(d.YTD)))
        .map(d => ({
            Name: d.Name,
            YTD: +d.YTD,
            Category: d.Category
        }));

    populateCategoryDropdown();
    drawChart(allData); // Draw initial chart
});

// Populate the filter dropdown
function populateCategoryDropdown() {
    const categories = Array.from(new Set(allData.map(d => d.Category))).filter(d => d);
    categories.sort();
    categories.forEach(cat => {
        d3.select("#categorySelect")
          .append("option")
          .attr("value", cat)
          .text(cat);
    });

    d3.select("#categorySelect").on("change", function() {
        const selected = this.value;
        if (selected === "All") {
            drawChart(allData);
        } else {
            const filtered = allData.filter(d => d.Category === selected);
            drawChart(filtered);
        }
    });
}

// Draw Chart
function drawChart(dataset) {
    d3.select("#chart").html(""); // Clear old chart

    const width = Math.max(800, dataset.length * 30);
    const height = 500;
    const margin = { top: 40, right: 20, bottom: 150, left: 80 };

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(dataset.map(d => d.Name))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.YTD)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Bars
    svg.append("g")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Name))
        .attr("y", d => y(d.YTD))
        .attr("height", d => y(0) - y(d.YTD))
        .attr("width", x.bandwidth())
        .on("mouseover", (event, d) => {
            tooltip
                .style("display", "block")
                .html(`<strong>${d.Name}</strong><br>YTD: ${d.YTD}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 100)
        .attr("text-anchor", "middle")
        .text("Mutual Fund Name");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("YTD Return (%)");
}
