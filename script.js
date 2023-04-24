const apiEndpoint = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json';


d3.json(apiEndpoint).then(data => {

 
  const counts = d3.rollup(data, v => v.length, d => d.crime_type);

 
  const countsArray = Array.from(counts, ([crimeType, count]) => ({ crimeType, count }));

  
  countsArray.sort((a, b) => d3.descending(a.count, b.count));


  const xScale = d3.scaleBand()
    .domain(countsArray.map(d => d.crimeType))
    .range([0, 500])
    .padding(0.1);

  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(countsArray, d => d.count)])
    .range([300, 0]);

  const svg = d3.create('svg')
    .attr('width', 500)
    .attr('height', 300);

  
  const g = svg.append('g')
    .attr('transform', 'translate(0, 300)');

  
  g.append('g')
    .attr('transform', 'translate(0, -300)')
    .call(d3.axisBottom(xScale));

  
  g.append('g')
    .call(d3.axisLeft(yScale));

 
  g.selectAll('rect')
    .data(countsArray)
    .enter()
    .append('rect')
      .attr('x', d => xScale(d.crimeType))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 300 - yScale(d.count))
      .attr('fill', 'steelblue');

  
  d3.select('#chart')
    .node()
    .appendChild(svg.node());
});
