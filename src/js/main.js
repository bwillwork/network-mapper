// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import {Popover} from 'bootstrap';
import * as d3 from 'd3';


// Create popovers (bootstrap)
const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
popovers.forEach(popover => (new Popover(popover)));


const displaySVG = document.querySelector('#graph');
const dimensions = {width: displaySVG.offsetWidth, height: 500};
console.log(dimensions);

const jsonInput = document.querySelector('#json-input');
const submitBtn = document.querySelector('#submit-btn');

const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph")
    .append("svg")
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .attr("style", "border: black solid 1px;")
    .append("g")
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

submitBtn.addEventListener('click',function() {
    const data = JSON.parse(jsonInput.value);
    console.log('data: ',data);


    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink().id(function(d) { return d.id; }).links(data.links);
    //if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    //if (linkStrength !== undefined) forceLink.strength(linkStrength);

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center",  d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .on("tick", ticked);

    const link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa");

    // Initialize the nodes
    const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", "#69b3a2")
        .call(drag(simulation));

    // Let's list the force we wanna apply on the network
    // const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    //     .force("link", d3.forceLink()                               // This force provides links between nodes
    //         .id(function(d) { return d.id; })                     // This provide  the id of a node
    //         .links(data.links)                                    // and this the list of links
    //     )
    //     .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    //     .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    //     .on("end", ticked);





    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; });
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

});