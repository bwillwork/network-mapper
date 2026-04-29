import * as _ from 'lodash';
import * as d3 from "d3";
import constants from "./constants";

export function createGraph(containerId, {nodes,links}, {width,height}) {

    let isDirected = constants.isDirected;
    let colors = {...constants.colors};
    let showNodeLabels = constants.showNodeLabels;
    const data = {
        nodes: [...nodes],
        links: [...links]
    };

    // init svg
    let container = d3.select(containerId).style('background-color',colors.background);
    let svg = container
        .append("svg")
        .attr("style", "border: black solid 1px;");

    // Adding arrows to the definitions
    const arrowMarker = svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr('refX', 30)//so that it comes towards the center.
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("fill",colors.edges)
        .attr("d", "M0,-5L10,0L0,5");

    svg = svg.append("g");

    function draw(data) {

        container.style('background-color',colors.background);
        arrowMarker.attr("fill",colors.edges);// Needs to be set again

        svg.selectAll(`g`).remove();

        const forceLink = d3.forceLink(data.links).id((d) => d.id);
        const forceCollide = d3.forceCollide().radius(constants.radius);
        const forceManyBody = d3.forceManyBody();
        const forceCenter = d3.forceCenter(width / 2, height / 2)

        const simulation = d3.forceSimulation(data.nodes) // apply the simulation to our array of nodes
            .force( 'link', forceLink) // force between links and nodes
            .force('collide', forceCollide) // force to avoid node overlaps
            .force('charge', forceManyBody) // force to attract or repulse nodes (between nodes)
            .force('center', forceCenter) // The force to attract nodes to the center of the chart
            .on('tick',() => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                if(showNodeLabels) node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
                else node.attr("cx", d => d.x).attr("cy", d => d.y);

            });

        const link = svg.append("g")
            .attr("stroke",colors.edges)
            .selectAll("line")
            .data(data.links)
            .join("line");

        if(isDirected) link.attr("marker-end", "url(#arrow)");

        let node;
        if(showNodeLabels) {
            node = svg.append("g")
                .selectAll("g")
                .data(data.nodes)
                .enter()
                .append('g');

            node.append("circle")
                .attr("r", constants.radius)
                .attr("fill",colors.nodes);

            node.append('text')
                .text(d => d.name)
                .attr("x", 12)
                .attr("y", 3);

            node.call(drag(simulation))
        } else {
            node = svg.append("g")
                .selectAll("circle")
                .data(data.nodes)
                .join("circle")
                .attr("r", constants.radius)
                .attr("fill",colors.nodes);

            node.call(drag(simulation))
        }




        function drag(simulation) {

            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

    }

    draw(data);

    // Exposed Functions
    function updateNetworkData({nodes,links}) {
        data.nodes = [...nodes.map(n => ({...n}))];
        data.links = [...links.map(l => ({...l}))];
        draw(data);
    }

    function setIsDirected(value) {
        isDirected = _.isBoolean(value) && value;// Always default to false
        draw(data);
    }

    function updateColors(newColors) {
        colors = {...newColors};
        draw(data);
    }

    return {
        updateNetworkData,
        setIsDirected,
        updateColors
    };

}