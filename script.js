const url = 'https://jsonplaceholder.typicode.com/photos';


//Promesas

async function getPromise() {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
        request.onerror = () => {
            reject(Error('Error: Error de red inesperado'))
        }
        request.send();
    });
}

function postPromise(data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', url);
        request.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
        request.onload = () => {
            if (request.status == 201) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
        request.onerror = () => {
            reject(Error('Error: Error de red inesperado'))
        }
        request.send(JSON.stringify(data));
    });
}

function putPromise(data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        console.log(data);

        request.open('PUT', url + '/' + data.id);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = () => {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText))
            }
        }
        request.onerror = () => {
            reject(Error('Error: Error de red inesperado'));
        }
        request.send(JSON.stringify(data));

    })
}

function deletePromise(id) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('DELETE', url + '/' + id);
        request.onload = () => {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
        request.onerror(() => {
            reject(Error('Error: Error de red inesperado'));
        });
        request.send();
    })
}


//Funciones

async function loadObjects() {
    await getPromise().then((response) => {
        response.forEach(element => {
            buildTable(element);

        });
    });
}



function buildTable(object) {
    const table = document.querySelector('tbody');
    let row = table.insertRow();
    let idCell = row.insertCell(0);
    let albumIdCell = row.insertCell(1);
    let titleCell = row.insertCell(2);
    let URLCell = row.insertCell(3);
    let albumThumbnailCell = row.insertCell(4);
    let actionCell = row.insertCell(5);

    idCell.innerHTML = object.id;
    albumIdCell.innerHTML = object.albumId;
    titleCell.innerHTML = object.title;
    URLCell.innerHTML = object.url;
    albumThumbnailCell.innerHTML = object.thumbnailUrl;
    actionCell.innerHTML = `<div style="display: flex;flex-direction: row; gap:5px"><button onclick="showUpdateModal(${object.id})">Actualizar</button> <button onclick="deleteObject(${object.id})">Borrar</button></div>`
}

function addObject() {
    const albumId = document.getElementById('addAlbumId').value;
    const title = document.getElementById('addAlbumTitle').value;
    const url = document.getElementById('addAlbumURL').value;
    const thumbnailUrl = document.getElementById('addAlbumThumbnailURL').value;
    if (!albumId || !title || !url || !thumbnailUrl || Number.isInteger(parseInt(albumId)) == false) {
        alert('Rellene todos los datos correctamente');
        return;
    }
    let newSong = { albumId: albumId, title: title, url: url, thumbnailUrl: thumbnailUrl };
    postPromise(newSong).then((response) => {
        const table = document.querySelector('tbody');
        let responseParsed = JSON.parse(response);
        responseParsed.id = table.rows.length + 1;
        buildTable(responseParsed);

    })


}

function deleteObject(id) {
    const table = document.querySelector('tbody');
    let rows = table.rows;
    for (let row = 0; row < rows.length; row++) {
        if (rows[row].cells[0].innerHTML == id) {
            table.deleteRow(row);
            break;
        }
    }
}

function showAddModal() {
    let modal = document.querySelector('.addAlbumModal');
    modal.style.display = 'flex';
}

function showUpdateModal(id) {
    const table = document.querySelector('tbody');
    const updateId = document.getElementById('updateAlbumTempId');
    const updateAlbumId = document.getElementById('updateAlbumId');
    const updateTitle = document.getElementById('updateTitle');
    const updateURL = document.getElementById('updateURL');
    const updateThumbnailURL = document.getElementById('updateThumbnailURL');
    for (let row = 0; row < table.rows.length; row++) {
        if (table.rows[row].cells[0].innerText == id) {
            let selectedCells = table.rows[row].cells;

            updateId.innerHTML = selectedCells[0].innerHTML;
            updateAlbumId.value = selectedCells[1].innerHTML;
            updateTitle.value = selectedCells[2].innerHTML;
            updateURL.value = selectedCells[3].innerHTML;
            updateThumbnailURL.value = selectedCells[4].innerHTML;
            break;
        }
    }
    document.querySelector('.updateAlbumModal').style.display = 'flex';
}

function updateObject() {
    const table = document.querySelector('tbody');
    const updateId = document.getElementById('updateAlbumTempId');
    const updateAlbumId = document.getElementById('updateAlbumId');
    const updateTitle = document.getElementById('updateTitle');
    const updateURL = document.getElementById('updateURL');
    const updateThumbnailURL = document.getElementById('updateThumbnailURL');
    let data = {
        id: updateId.innerHTML,
        albumId: updateAlbumId.value,
        title: updateTitle.value,
        url: updateURL.value,
        thumbnailUrl: updateThumbnailURL.value
    };
    if (Number.isInteger(parseInt(data.albumId)) == false || data.title === '' || data.url === '' || data.thumbnailUrl === '') {
        alert('Rellene todos los datos correctamente');
        return;
    }

    putPromise(data).then((response) => {
        response = JSON.parse(response);
        for (let row = 0; row < table.rows.length; row++) {
            if (table.rows[row].cells[0].innerText == updateId.innerHTML) {
                let selectedCells = table.rows[row].cells;
                selectedCells[1].innerHTML = response.albumId;
                selectedCells[2].innerHTML = response.title;
                selectedCells[3].innerHTML = response.url;
                selectedCells[4].innerHTML = response.thumbnailUrl;
                document.querySelector('.updateAlbumModal').style.display = 'none';
                break;
            }
        }
    });
}

window.onload = () => {
    loadObjects();
}
