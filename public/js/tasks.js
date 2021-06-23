window.onload = pageLoad;

function pageLoad() {
}

function deleteTask(id) {
    fetch('tasks', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': id
        })
    }).then(function (response) {
        window.location.reload()
    })
}

function toggleTask(id, comp) {
    fetch('tasks', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': id,
            'comp': comp
        })
    })
        .then(function (response) {
            window.location.reload()
        })
}

function setTask(index) {
    window.parent.stop();
    window.parent.sessionTime = list[index].time * 60;
    var minutes = Math.floor((window.parent.sessionTime / 60) % 60);
    var seconds = Math.floor(window.parent.sessionTime % 60);
    var fSeconds = ('0' + seconds).slice(-2);
    parent.document.getElementById('remainingTime').innerHTML = minutes + ':' + fSeconds;
    parent.document.getElementById('currentDesc').setAttribute('name', list[index]._id);
    parent.document.getElementById('currentDesc').innerHTML = list[index].desc;
    parent.document.getElementById('clearTask').style.visibility = 'visible';
}
