// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import {Popover} from 'bootstrap';
import {createGraph} from "./network";
import {domCache,networkCache} from './cache'
import {addEdgeRow, addNodeRow, deleteEdgeRow, deleteNodeRow} from "./ui";
import constants from "./constants";

const elms = domCache.elms;
const selectors = domCache.selectors;

// Create popovers (bootstrap)
const popovers = elms.popovers;
popovers.forEach(popover => (new Popover(popover)));

const dimensions = {width: elms.svg.offsetWidth, height: 500};
//console.log(dimensions);

const network = createGraph(selectors.svg,{nodes:[],links:[]},dimensions);

function addNode() {
    console.log('add node');
    const idInputVal = `${document.querySelector('#node-id').value}`;
    const nameInputVal = `${document.querySelector('#node-name').value}`;

    const success = addNodeRow(idInputVal,nameInputVal,elms.nodeContainer,removeNode);
    if(success) {
        networkCache.addNode({id: parseInt(idInputVal),name: nameInputVal});
        const networkData = networkCache.getState().network;
        network.updateNetworkData(networkData);
    }

}

function removeNode() {
    console.log('remove node - ',this);
    const nodeId = this.getAttribute("data-node-id");

    const success = deleteNodeRow(nodeId)
    if(success) {
        networkCache.removeNode(parseInt(nodeId));
        const networkData = networkCache.getState().network;
        network.updateNetworkData(networkData);
    }
}

function addLink() {
    console.log('add edge');
    const fromInputVal = `${document.querySelector('#from-id').value}`;
    const toInputVal = `${document.querySelector('#to-id').value}`;

    const success = addEdgeRow(fromInputVal,toInputVal,elms.edgeContainer,removeLink);
    if(success) {
        const link = {source: parseInt(fromInputVal),target: parseInt(toInputVal)};
        networkCache.addLink(link);
        const networkData = networkCache.getState().network;
        network.updateNetworkData(networkData);
    }
}
function removeLink() {
    console.log('remove edge - ',this);
    const fromId = this.getAttribute("data-from-id");
    const toId = this.getAttribute("data-to-id");

    const success = deleteEdgeRow(fromId,toId);
    if(success) {
        const link = {source: parseInt(fromId),target: parseInt(toId)};
        networkCache.removeLink(link);
        const networkData = networkCache.getState().network;
        network.updateNetworkData(networkData);
    }
}

elms.addNodeBtn.addEventListener('click',addNode);
elms.addEdgeBtn.addEventListener('click',addLink);

elms.isDirectedInput.checked = constants.isDirected;
elms.isDirectedInput.addEventListener('change',function () {
    console.log('This has changed');
    networkCache.toggleIsDirected();
    const isDirected = networkCache.getState().isDirected;
    network.setIsDirected(isDirected);
});

elms.nodeColorInput.value = constants.colors.nodes;
elms.nodeColorInput.addEventListener('change',function() {
    console.log('color: ',elms.nodeColorInput.value);
    const newColor = elms.nodeColorInput.value;
    networkCache.updateNodeColor(newColor);
    const colors = networkCache.getState().colors;
    network.updateColors(colors);
});

elms.edgeColorInput.value = constants.colors.edges;
elms.edgeColorInput.addEventListener('change',function() {
    console.log('color: ',elms.edgeColorInput.value);
    const newColor = elms.edgeColorInput.value;
    networkCache.updateEdgeColor(newColor);
    const colors = networkCache.getState().colors;
    network.updateColors(colors);
});

elms.submitBtn.addEventListener('click',function() {
    const data = JSON.parse(elms.jsonInput.value);
    networkCache.updateNetworkData(data);
    const networkData = networkCache.getState().network;
    network.updateNetworkData(networkData);
});