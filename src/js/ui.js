
export function addNodeRow(nodeId, name, nodeContainer, removeNodeCallback) {
    if(nodeId && name) {
        const row = document.createElement('div');
        row.setAttribute("id",`node-row-${nodeId}`);
        const idContainer = document.createElement('span');
        const nameContainer = document.createElement('span');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Delete';
        removeBtn.classList.add('btn','btn-danger');
        removeBtn.setAttribute('data-node-id',nodeId);
        removeBtn.addEventListener('click',removeNodeCallback);

        idContainer.appendChild(document.createTextNode(nodeId));
        nameContainer.appendChild(document.createTextNode(name));
        row.append(idContainer,nameContainer,removeBtn);
        nodeContainer.appendChild(row);
        return true;
    }
    return false;
}

export function deleteNodeRow(nodeId) {
    if(nodeId) {
        const rowId = `node-row-${nodeId}`;
        let row = document.querySelector(`#${rowId}`);
        const fromEdges = document.querySelectorAll(`[data-from-id="${nodeId}"]`);
        const toEdges = document.querySelectorAll(`[data-to-id="${nodeId}"]`);
        let edgeRows = [...Array.from(fromEdges),...Array.from(toEdges)];

        row.remove();
        row = null;

        while(edgeRows.length > 0) {
            let eRow = edgeRows.pop();
            eRow.remove();
            eRow = null;
        }

        return true;
    }
    return false;
}

export function addEdgeRow(from,to,edgeContainer,removeEdgeCallback) {
    if(from && to) {
        const row = document.createElement('div');
        row.setAttribute("id",`row-from-${from}-to-${to}`);
        const fromContainer = document.createElement('span');
        const toContainer = document.createElement('span');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Delete';
        removeBtn.classList.add('btn','btn-danger');
        removeBtn.setAttribute('data-from-id',from);
        removeBtn.setAttribute('data-to-id',to);
        removeBtn.addEventListener('click',removeEdgeCallback);

        fromContainer.appendChild(document.createTextNode(from));
        toContainer.appendChild(document.createTextNode(to));
        row.append(fromContainer,toContainer,removeBtn);
        edgeContainer.appendChild(row);
        return true;
    }
    return false;
}

export function deleteEdgeRow(from,to) {
    if(from && to) {
        const rowId = `row-from-${from}-to-${to}`;
        let row = document.querySelector(`#${rowId}`);
        row.remove();
        row = null;
        return true;
    }
    return false;
}

export function updateControls(
    previousNetwork,
    newNetwork,
    nodeContainer,
    removeNodeCallback,
    edgeContainer,
    removeEdgeCallback) {

    const oldNodes = previousNetwork.nodes;
    while(oldNodes.length > 0) {
        let node = oldNodes.pop();
        deleteNodeRow(node.id);
        node = null;
    }

    const newNodes = newNetwork.nodes;
    const newEdges = newNetwork.links;

    newNodes.forEach(n => addNodeRow(n.id,n.name,nodeContainer,removeNodeCallback));
    newEdges.forEach(e => addEdgeRow(e.source,e.target,edgeContainer,removeEdgeCallback));
}

export function updateJson(networkData,jsonInputElm) {
    jsonInputElm.value = JSON.stringify(networkData,null,2);
}