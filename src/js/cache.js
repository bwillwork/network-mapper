import * as _ from 'lodash';

function buildNetworkCache(directed) {

    let isDirected = _.isBoolean(directed) && directed;// Defaults to a non-directed graph network
    const data = {
        nodes: [],
        links: []
    };


    // Private Functions

    // Exposed Functions
    function addNode(node) {
        const canAdd = data.nodes.findIndex(n => n.id === node.id) === -1;
        if(canAdd) data.nodes.push({...node});
    }
    function removeNode(id) {
        const index = data.nodes.findIndex(n => n.id === id);
        if(index !== -1) {
            data.nodes.splice(index, 1);
            const edgeIndices = data.links.reduce((agg, e, index) => {
                if (e.source === id || e.target === id) return [...agg, index];
                return [...agg];
            }, []);
            edgeIndices.forEach(i => data.links.splice(i, 1));
        }
    }
    function addLink({source,target}) {
        const canAdd = data.links.findIndex(e => e.source === source && e.target === target) === -1;
        if(canAdd) data.links.push({source, target});
    }
    function removeLink({source,target}) {
        console.log(data.links);
        const index = data.links.findIndex(e => e.source === source && e.target === target);
        if(index !== -1) data.links.splice(index,1);
    }
    function toggleIsDirected() {
        isDirected = !isDirected;
    }
    function clear() {
        data.nodes = [];
        data.links = [];
    }
    function updateNetworkData(json) {
        data.nodes = [...json.nodes];
        data.links = [...json.links];
    }
    function getState() {
        return {isDirected,network: {...data}};
    }



    return {
        addNode,
        removeNode,
        addLink,
        removeLink,
        toggleIsDirected,
        clear,
        updateNetworkData,
        getState
    };

}

function buildDOMCache() {

    const selectors = {
        popovers: '[data-bs-toggle="popover"]',
        svg: '#graph',
        jsonInput: '#json-input',
        submitBtn: '#submit-btn',
        nodeContainer: '#nodes',
        edgeContainer: '#edges',
        addNodeBtn: '#add-node-btn',
        addEdgeBtn: '#add-edge-btn',
        nodeIdInput: '#node-id',
        nodeNameInput: '#node-name',
        edgeFromInput: '#from-id',
        edgeToInput: '#to-id'
    };

    return {
        selectors,
        elms: {
            popovers: document.querySelectorAll(selectors.popovers),
            svg: document.querySelector(selectors.svg),
            jsonInput: document.querySelector(selectors.jsonInput),
            submitBtn: document.querySelector(selectors.submitBtn),
            nodeContainer: document.querySelector(selectors.nodeContainer),
            edgeContainer: document.querySelector(selectors.edgeContainer),
            addNodeBtn: document.querySelector(selectors.addNodeBtn),
            addEdgeBtn: document.querySelector(selectors.addEdgeBtn),
            nodeIdInput: document.querySelector(selectors.nodeIdInput),
            nodeNameInput: document.querySelector(selectors.nodeNameInput),
            edgeFromInput: document.querySelector(selectors.edgeFromInput),
            edgeToInput: document.querySelector(selectors.edgeToInput)
        }
    };
}

export const networkCache = buildNetworkCache(false);
export const domCache = buildDOMCache();