import * as _ from 'lodash';
import * as d3 from "d3";

export function createGraph(containerId, {nodes,links}, {width,height}) {

    const data = {
        nodes: [...nodes],
        links: [...links]
    };
    const RADIUS = 10;

    // init svg
    const svg = d3.select(containerId)
        .append("svg")
        .attr("style", "border: black solid 1px;")
        .append("g");



    function draw(data) {

        svg.selectAll(`g`).remove();


        const simulation = d3.forceSimulation(data.nodes) // apply the simulation to our array of nodes
            .force( 'link', d3.forceLink(data.links).id((d) => d.id))// Force #1: links between nodes
            .force('collide', d3.forceCollide().radius(RADIUS))// Force #2: avoid node overlaps
            .force('charge', d3.forceManyBody())// Force #3: attraction or repulsion between nodes
            .force('center', d3.forceCenter(width / 2, height / 2))// Force #4: nodes are attracted by the center of the chart area
            .on('tick',() => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });

        const link = svg.append("g")
            .attr("stroke","#222")
            .selectAll("line")
            .data(data.links)
            .join("line");

        const node = svg.append("g")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", RADIUS)
            .call(drag(simulation));

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
    function updateAllData({nodes,links}) {
        data.nodes = [...nodes.map(n => ({...n}))];
        data.links = [...links.map(l => ({...l}))];
        draw(data);
    }

    return {
        updateAllData
    };

}