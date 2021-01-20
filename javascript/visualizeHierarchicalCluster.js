// visualize the custers
define(["d3"], function(d3) {
    return {clustering: function (text, canvasid) {
        var width = 800,
        height = 550;

        var svg = d3
        .select(canvasid)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(40,0)');

    var cluster = d3.cluster().size([ height, width - 160 ]);

    var diagonal = function link(d) {
        return "M" + d.source.y + "," + d.source.x
            + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
            + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
            + " " + d.target.y + "," + d.target.x;
      };

    

        console.log("deleting with json:", JSON.stringify(text))
        var root = d3.hierarchy(text);
        var nodes = cluster(root),
            links = nodes.links();

        var link = svg
            .selectAll('.link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', diagonal);

        var node = svg
            .selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', function(d) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });

        node.append('circle').attr('r', 4.5);

        node
            .append('text')
            .attr('dx', function(d) {
                return d.children ? -8 : 8;
            })
            .attr('dy', 3)
            .style('text-anchor', function(d) {
                return d.children ? 'end' : 'start';
            })
            .text(function(d) {
                return d.name;
            });

            // path
    // see also:
    // d3/d3-shape: Graphical primitives for visualization, such as lines and areas. 
    // https://github.com/d3/d3-shape
    // var line = d3.line()
    // .curve(d3.curveBundle.beta(0.85))
    // .x(function(d) { return d.x; })
    // .y(function(d) { return d.y; });
// svg.selectAll("path")
//     .data(links)
//     .enter()
//     .append("path")
//     .attr("d", function(d) {
//             return line([
//                 d.source,
//                 {"x" : d.source.x, "y" : (d.source.y + d.target.y)/2 },
//                 {"x" : d.target.x, "y" : (d.source.y + d.target.y)/2 },
//                 d.target
//             ]);
//         });

// // circle (overwrite path)
// svg.selectAll("circle")
//     .data(nodes.descendants())
//     .enter()
//     .append("circle")
//     .attrs({
//         "cx" : function(d) { return d.x; },
//         "cy" : function(d) { return d.y; },
//         "r" : node_size/2
//     })
//     .append("title")
//     .text(function(d) { return d.data.name; });
//     var node_size = 20;
// // text
// svg.selectAll("text")
//     .data(nodes.descendants())
//     .enter()
//     .append("text")
//     .attrs({
//         "dy" : node_size * 1.1,
//         "text-anchor" : "middle",
//         "x" : function(d) { return d.x; },
//         "y" : function(d) { return d.y; }
//     })
//     .text(function(d) { return d.data.name; } );

    d3.select(self.frameElement).style('height', height + 'px');
    }}
  });