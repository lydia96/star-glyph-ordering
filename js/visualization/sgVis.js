/**
 * Slightly altered version of "Interaction for star plots in d3" by Kevin Schaul
 * link: http://bl.ocks.org/kevinschaul/8833989
 *
 */

d3.starPlot = function () {
    var width = 200,
        margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        labelMargin = 20,
        includeGuidelines = true,
        includeLabels = true,
        properties = [],
        scales = [],
        labels = [],
        title = nop,

        g,
        datum,
        radius = width / 2,
        origin = [radius, radius],
        radii = properties.length,
        radians = 2 * Math.PI / radii,
        scale = d3.scale.linear()
            .domain([0, 1.0])
            .range([0, 1.0]);

    function chart(selection) {
        datum = selection.datum();
        g = selection
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        if (includeGuidelines) {
            drawGuidelines();
        }
        /**if (includeLabels) {
            drawLabels();
        }**/

        drawChart();
    }

    function drawGuidelines() {
        var r = 0;
        properties.forEach(function (d, i) {
            var l, x, y;

            l = radius;
            x = l * Math.cos(r);
            y = l * Math.sin(r);
            g.append('line')
                .attr('class', 'star-axis')
                .attr('x1', origin[0])
                .attr('y1', origin[1])
                .attr('x2', origin[0] + x)
                .attr('y2', origin[1] + y);

            r += radians;
        })
    }

    /**
     function drawLabels() {
        var r = 0;
        properties.forEach(function (d, i) {
            var l, x, y;

            l = radius;
            x = (l + labelMargin) * Math.cos(r);
            y = (l + labelMargin) * Math.sin(r);
            g.append('text')
                .attr('class', 'star-label')
                .attr('x', origin[0] + x)
                .attr('y', origin[1] + y)
                .text(labels[i])
                .style('text-anchor', 'middle')
                .style('dominant-baseline', 'central')

            r += radians;
        })
    }
     **/

    function drawChart() {
        g.append('circle')
            .attr('class', 'star-origin')
            .attr('cx', origin[0])
            .attr('cy', origin[1])
            .attr('r', 2);

        var path = d3.svg.line.radial();

        var pathData = [];
        var r = Math.PI / 2;
        properties.forEach(function (d, i) {
            var userScale = scales[i] || scales[0];
            pathData.push([
                scale(userScale(datum[d])),
                r
            ]);
            r += radians;
        });

        g.append('path')
            .attr('class', 'star-path')
            .attr('transform', 'translate(' + origin[0] + ',' + origin[1] + ')')
            .attr('d', path(pathData) + 'Z');

        g.append('text')
            .attr('class', 'star-title')
            .attr('x', origin[0])
            .attr('y', -(margin.top / 2))
            .text(title(datum))
            .style('text-anchor', 'middle')
    }

    function drawInteraction() {
        var path = d3.svg.line.radial();

        // `*Interaction` variables are used to build the interaction layer.
        // `*Extent` variables are used to compute (and return) the x,y
        // positioning of the attribute extents. `*Value` variables are used
        // for the attribute values.
        var rInteraction = Math.PI / 2;
        var rExtent = 0;
        properties.forEach(function (d, i) {
            var lInteraction, xInteraction, yInteraction;
            var lExtent, xExtent, yExtent;

            lInteraction = radius;
            xInteraction = lInteraction * Math.cos(rInteraction);
            yInteraction = lInteraction * Math.sin(rInteraction);

            lExtent = radius + labelMargin;
            xExtent = lExtent * Math.cos(rExtent) + origin[0] + margin.left;
            yExtent = lExtent * Math.sin(rExtent) + origin[1] + margin.top;

            var userScale = scales[i] || scales[0];
            var lValue = scale(userScale(datum[d]));
            x = lValue * Math.cos(rExtent) + origin[0] + margin.left;
            y = lValue * Math.sin(rExtent) + origin[1] + margin.top;

            var halfRadians = radians / 2;
            var pathData = [
                [0, rInteraction - halfRadians],
                [lInteraction, rInteraction - halfRadians],
                [lInteraction, rInteraction + halfRadians]
            ];

            var datumToBind = {
                xExtent: xExtent,
                yExtent: yExtent,
                x: x,
                y: y,
                key: properties[i],
                datum: datum
            };

            g.append('path')
                .datum(datumToBind)
                .attr('class', 'star-interaction')
                .attr('transform', 'translate(' + origin[0] + ',' + origin[1] + ')')
                .attr('d', path(pathData) + 'Z');

            rInteraction += radians;
            rExtent += radians;
        })
    }

    function nop() {
        return;
    }

    chart.interaction = function () {
        drawInteraction();
    };

    chart.properties = function (_) {
        if (!arguments.length) return properties;
        properties = _;
        radii = properties.length;
        radians = 2 * Math.PI / radii;
        return chart;
    };

    chart.scales = function (_) {
        if (!arguments.length) return scales;
        if (Array.isArray(_)) {
            scales = _;
        } else {
            scales = [_];
        }
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        radius = width / 2;
        origin = [radius, radius];
        scale.range([0, radius]);
        return chart;
    };

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        origin = [radius, radius];
        return chart;
    };

    chart.labelMargin = function (_) {
        if (!arguments.length) return labelMargin;
        labelMargin = _;
        return chart;
    };

    chart.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return chart;
    };

    chart.labels = function (_) {
        if (!arguments.length) return labels;
        labels = _;
        return chart;
    };

    chart.includeGuidelines = function (_) {
        if (!arguments.length) return includeGuidelines;
        includeGuidelines = _;
        return chart;
    };

    chart.includeLabels = function (_) {
        if (!arguments.length) return includeLabels;
        includeLabels = _;
        return chart;
    };

    return chart;
};


var margin = {
    top: 20.8,
    right: 8.3,
    bottom: 20.8,
    left: 13.3
};
var height = 100 - margin.left - margin.right;
var width = 100 - margin.top - margin.bottom;
var labelMargin = 4;

var scale = d3.scale.linear()
    .domain([0, 1.0])
    .range([0, 1]);

function getLabels(dataArray) {
    var labels = [];
    for (var i = 1; i < dataArray[0].length; i++) {
        labels.push(dataArray[0][i]);
    }
    return labels;
}


function sgVis(rows, labels) {

    document.getElementById("targetSG").className = "show";
    var star = d3.starPlot()
        .width(width)
        //.properties(["Body", "Sweetness", "Smoky", "Honey", "Spicy", "Nutty", "Malty", "Fruity", "Floral"])
        .properties(labels)
        .scales(scale)
        //.labels(["Body", "Sweetness", "Smoky", "Honey", "Spicy", "Nutty", "Malty", "Fruity", "Floral"])
        .labels(labels)
        .title(function (d) {
            return d.Name;
        })
        .margin(margin)
        .labelMargin(labelMargin);

    rows.forEach(function (d, i) {
        star.includeLabels(i % 10 === 0);

        var wrapper = d3.select('#targetSG').append('div')
            .attr('class', 'wrapper');

        var svg = wrapper.append('svg')
            .attr('class', 'chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', width + margin.top + margin.bottom)
            .attr('transform', 'rotate(270 0 0)');

        var starG = svg.append('g')
            .datum(d)
            .call(star)
            .call(star.interaction);

        var interactionLabel = wrapper.append('div')
            .attr('class', 'interaction label');

        var circle = svg.append('circle')
            .attr('class', 'interaction circle')
            .attr('r', 5);

        var interaction = wrapper.selectAll('.interaction')
            .style('display', 'none');

        svg.selectAll('.star-interaction')
            .on('mouseover', function (d) {
                svg.selectAll('.star-label')
                    .style('display', 'none');

                interaction
                    .style('display', 'block');

                circle
                    .attr('cx', d.x)
                    .attr('cy', d.y);

                $interactionLabel = $(interactionLabel.node());
                interactionLabel
                    .text(d.key + ': ' + precisionRound(d.datum[d.key],2))
                    .style('left', d.xExtent - ($interactionLabel.width() / 2))
                    .style('top', d.yExtent - ($interactionLabel.height() / 2))
            })
            .on('mouseout', function (d) {
                interaction
                    .style('display', 'none');

                svg.selectAll('.star-label')
                    .style('display', 'block')
            })
    });
}

