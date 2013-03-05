var width = 960;
var height = 500;
var caption_height = 60;

var projection = d3.geo.naturalEarth()
    .scale(167);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var caption = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", caption_height);

var legend_data = [
		['Countries That Cry For Me', '#FFFFFF'],
		['Countries That Do Not Cry For Me', '#666666']
	];

var legend = caption.selectAll(".legend")
	.data(legend_data)
	.enter().append("g")
	.attr("class", "legend");

legend.append('rect')
	.attr('x', 18)
	.attr('y', function(d, i) {
		if (i === 0) {
			return caption_height - 20;
		}
		else {
			return caption_height - (i + 50);
		}
	})
	.attr('width', 18)
	.attr('height', 18)
	.style('stroke', '#000000')
	.style('fill', function(d, i) {
		return d[1]
	});
	
legend.append('text')
	.attr('x', 40)
	.attr('y', function(d, i) {
		if (i === 0) {
			return caption_height - 20;
		}
		else {
			return caption_height - (i + 50);
		}
	})
	.attr('dy', '14')
	.style('text-anchor', 'start')
	.text(function(d, i) {
		return d[0];
	});

svg.append("path")
    .datum(graticule.outline)
    .attr("class", "background")
    .attr("d", path);

svg.selectAll(".graticule")
    .data(graticule.lines)
  .enter().append("path")
    .attr("class", "graticule")
    .attr("d", path);

svg.append("path")
    .datum(graticule.outline)
    .attr("class", "foreground")
    .attr("d", path);

d3.json("data/global-topo.json", function(error, world) {
	svg.selectAll(".country")
		.data(topojson.object(world, world.objects.global).geometries)
		.enter().append("path")
		.attr("class", function(d) { return "country " + d.id; })
		.attr("d", path);

	svg.insert("path", ".graticule")
		.datum(topojson.object(world, world.objects.global))
		.attr("class", "land")
		.attr("d", path);

	svg.insert("path", ".graticule")
		.datum(topojson.mesh(world, world.objects.global, function(a, b) {
			return a.id !== b.id;
			}))
		.attr("class", "boundary")
		.attr("d", path);
});
