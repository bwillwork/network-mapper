import * as _ from 'lodash';
import * as d3 from "d3";

export function createGraph(containerId, {nodes,edges}, {width,height}) {

    const data = {
        nodes: [...nodes],
        edges: [...edges]
    };

    // init svg
    const svg = d3.select(containerId)
        .append("svg")
        .attr("style", "border: black solid 1px;")
        .append("g");



    function draw(data) {

        console.log('data: ',data);
        console.debug('draw');

        function ticked() {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            edge
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });


        }

        function drag(simulation) {
            function dragstarted(event) {
                //if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                //if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        /*
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(data.edges).id(function(d) { return d.id; });

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center",  d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);


         */

        const node = svg.append("g")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 10)
            .style("fill", "#69b3a2")
            //.call(drag(simulation));
            .call(drag())

        const edge = svg.append("g")
            .selectAll("line")
            .data(data.edges)
            .join("line")
            .style("stroke", "#222");

    }



    draw(data);

    // Exposed Functions


    function addNode(node) {
        const canAdd = data.nodes.findIndex(n => n.id === node.id) === -1;
        if(canAdd) {
            data.nodes.push({...node});
            draw(data);
        }
    }

    function removeNode(id) {
        const index = data.nodes.findIndex(n => n.id === id);
        if(index !== -1) {
            data.nodes.splice(index,1);
            const edgeIndices = data.edges.reduce((agg,e,index) => {
                if(e.source === id || e.target === id) return [...agg,index];
                return [...agg];
            },[]);
            edgeIndices.forEach(i => data.edges.splice(i,1));
            draw(data);
        }
    }

    function addEdge({source,target}) {
        console.log(source,target);
        const canAdd = data.edges.findIndex(e => e.source === source && e.target === target) === -1;
        if(canAdd) {
            data.edges.push({source, target});
            draw(data);
        }
    }

    function removeEdge({source,to}) {
        const index = data.nodes.findIndex(e => e.source === source && e.target === to);
        if(index !== -1) {
            data.edges.splice(index,1);
            draw(data);
        }
    }

    return {
        addNode,
        removeNode,
        addEdge,
        removeEdge
    };

}