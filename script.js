function getRandomizedDivGrid(width, height) {
    return getEnclosedHtml(height, (x, i) => getRandomizedDivRow(width), '<div class="grid">', '</div>');
}

function getRandomizedDivRow(width) {
    return getEnclosedHtml(width, (x, i) => getRandomizedSpanCell(), '<div>', '</div>');
}

function getRandomizedSpanCell() {
    let isBlack = Math.random() >= 0.5;
    return isBlack ? '<span class="black"></span>' : '<span></span>';
}

function getEnclosedHtml(len, func, openTag, closeTag) {
    let array = Array.from({length: len + 2}).map((x, i) => i == 0 
                                                              ? openTag 
                                                              : i == len + 1 
                                                                  ? closeTag 
                                                                  : func(x, i - 1))
    return array.join('');
}

function getMeasure() {
    return {
        now: new Date(),
        lap: function () {
            let currentTime = new Date();
            let difference = currentTime - this.now;
            this.now = currentTime;
            return difference;
        }
    }
}

function renderSomething(target, func, name, nextFunc, cleanFunc, assignFunc){
    let measure = getMeasure();
    let something = func();
    console.log("===== calculating " + name + ": " + measure.lap() + (something.length ? ", length: " + something.length : ''));
    cleanFunc(target);
    console.log("clean " + name + ": " + measure.lap());
    setTimeout(() => {
        console.log("render (cleaned) " + name + ": " + measure.lap());
        assignFunc(target, something);
        console.log("set " + name + ": " + measure.lap());
        setTimeout(() => {
            console.log("render (set) " + name + ": " + measure.lap());
            if (nextFunc) {
                setTimeout(nextFunc, 0);
            }
        }, 0);
    }, 0);
}

function renderSomethingAsString(target, func, name, nextFunc) {
    renderSomething(target, func, name + " (string)", nextFunc, (t) => t.innerHTML = '', (t, s) => t.innerHTML = s)
}

function renderSomethingAsElement(target, func, name, nextFunc) {
    renderSomething(target, func, name + " (element)", nextFunc, (t, e) => {
        let firstChild = t.firstChild;
        if (firstChild){ 
            t.removeChild(t.firstChild);
        }
    }, (t, e) => {
        t.appendChild(e);
    });
}

let renderPoint = document.getElementById('renderpoint');
let renderPoint2 = document.getElementById('renderpoint2');
renderSomethingAsString(renderPoint2, () => 'Loading......', 'reflow time for empty page', () => {
    renderSomethingAsString(renderPoint2, () => getRandomizedDivGrid(400, 250), 'divGrid', () => {
        renderSomethingAsElement(renderPoint2, () => getRandomizedDivGridElement(400, 250), 'divGrid2 - replace', () => {
            renderSomethingAsString(renderPoint2, () => getRandomizedDivGrid(400, 250), 'divGrid3 - replace', () => {
                renderSomethingAsElement(renderPoint2, () => getRandomizedDivGridElement(400, 250), 'divGrid4 - replace', () => {
                    // this should show the reflow time
                    renderSomethingAsString(renderPoint, () => '', 'reflow time')
                });
            });
        });
    });
});

function getRandomizedDivGridElement(width, height) {
    let divGrid = document.createElement('div');
    divGrid.className = 'grid';
    divGrid.app
    appendChildren(height, () => divGrid.appendChild(getRandomizedDivRowElement(width)));
    return divGrid;
}

function getRandomizedDivRowElement(width) {
    let divRow = document.createElement('div');
    appendChildren(width, () => divRow.appendChild(getRandomizedSpanCellElement()));
    return divRow;
}

function getRandomizedSpanCellElement() {
    let spanCell = document.createElement('span');
    let isBlack = Math.random() >= 0.5;
    if (isBlack) {
        spanCell.className = 'black';
    }
    return spanCell;
}

function appendChildren(len, func) {
    Array.from({length: len}).map(func);
}
