//svg size
var svgWidth = 960;
var svgHeight = 700;
var margin = {
    top: 20,
    bottom: 60,
    right: 40,
    left: 100
};

//chart size
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//svg wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//create a group
var chartGroup = svg.append("g")
    .attr("transfrom", `translate(${margin.left}, ${margin.top})`);

//pull data, parse poverty and healthcare
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //scale functions
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty) + 2])
        .range([0, chartWidth]);
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare) + 2])
        .range([chartHeight, 0]); 
    
    //axes functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);

    //circles
    var circles = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("class", "stateCircle");
    var labels = chartGroup.selectAll(null).data(healthData).enter().append("text");
    labels
        .attr("x", function(d) {
            return xScale(d.poverty);})
        .attr("y", function(d) {
            return yScale(d.healthcare);})
        .text(function(d) {
            return d.abbr;})
        .attr("class", "stateText");
    
    //tooltip
    var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>In Poverty: ${d.poverty}%<br>Lack of Healthcare: ${d.healthcare}%`);
            });
    chartGroup.call(toolTip);

    //events
    circles.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });
    
    //labels 
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeight/1.5))
        .attr("y", 0 - margin.left +20)
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacking Healthcare(%)");
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "aText")
        .text("Poverty(%)"); 
});