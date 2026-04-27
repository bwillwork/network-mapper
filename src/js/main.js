// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import {Popover} from 'bootstrap';
import * as d3 from 'd3';
import {createGraph} from "./network";




// Create popovers (bootstrap)
const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
popovers.forEach(popover => (new Popover(popover)));


const displaySVG = document.querySelector('#graph');
const dimensions = {width: displaySVG.offsetWidth, height: 500};
console.log(dimensions);

const jsonInput = document.querySelector('#json-input');
const submitBtn = document.querySelector('#submit-btn');

const network = createGraph('#graph',{nodes:[],links:[]},dimensions);


const nodesContainer = document.querySelector('#nodes');
const edgesContainer = document.querySelector('#edges');

const addNodeBtn = document.querySelector('#add-node-btn');
const addEdgeBtn = document.querySelector('#add-edge-btn');

function addNode() {
    console.log('add node');
    const idInputVal = `${document.querySelector('#node-id').value}`;
    const nameInputVal = `${document.querySelector('#node-name').value}`;
    if(idInputVal && nameInputVal) {
        const row = document.createElement('div');
        row.setAttribute("id",`node-row-${idInputVal}`);
        const idContainer = document.createElement('span');
        const nameContainer = document.createElement('span');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Delete';
        removeBtn.classList.add('btn','btn-danger');
        removeBtn.setAttribute('data-node-id',idInputVal);
        removeBtn.addEventListener('click',removeNode);

        idContainer.appendChild(document.createTextNode(idInputVal));
        nameContainer.appendChild(document.createTextNode(nameInputVal));
        row.append(idContainer,nameContainer,removeBtn);
        nodesContainer.appendChild(row);


        network.addNode({id: parseInt(idInputVal),name: nameInputVal});

    }
}
function removeNode() {
    console.log('remove node - ',this);

    const nodeId = this.getAttribute("data-node-id");
    if(nodeId) {
        const rowId = `node-row-${nodeId}`;
        let row = document.querySelector(`#${rowId}`);
        row.remove();
        row = null;
        network.removeNode(parseInt(nodeId));
    }
}
function addLink() {
    console.log('add edge');
    const fromInputVal = `${document.querySelector('#from-id').value}`;
    const toInputVal = `${document.querySelector('#to-id').value}`;
    if(fromInputVal && toInputVal) {
        const row = document.createElement('div');
        row.setAttribute("id",`row-from-${fromInputVal}-to-${toInputVal}`);
        const fromContainer = document.createElement('span');
        const toContainer = document.createElement('span');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Delete';
        removeBtn.classList.add('btn','btn-danger');
        removeBtn.setAttribute('data-from-id',fromInputVal);
        removeBtn.setAttribute('data-to-id',toInputVal);
        removeBtn.addEventListener('click',removeLink);

        fromContainer.appendChild(document.createTextNode(fromInputVal));
        toContainer.appendChild(document.createTextNode(toInputVal));
        row.append(fromContainer,toContainer,removeBtn);
        edgesContainer.appendChild(row);


        network.addLink({source: parseInt(fromInputVal),target: parseInt(toInputVal)});

    }
}
function removeLink() {
    console.log('remove edge - ',this);
    const fromId = this.getAttribute("data-from-id");
    const toId = this.getAttribute("data-to-id");
    if(fromId && toId) {
        const rowId = `row-from-${fromId}-to-${toId}`;
        let row = document.querySelector(`#${rowId}`);
        row.remove();
        row = null;
        network.removeLink({source: parseInt(fromId),target: parseInt(toId)});
    }
}

addNodeBtn.addEventListener('click',addNode);
addEdgeBtn.addEventListener('click',addLink);

submitBtn.addEventListener('click',function() {
    const data = JSON.parse(jsonInput.value);
    console.log('data: ',data);

});