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

function getRandomizedTable(width, height) {
    return getEnclosedHtml(height, (x, i) => getRandomizedRow(width), '<table class="grid">', '</table>');
}

function getRandomizedRow(width) {
    return getEnclosedHtml(width, (x, i) => getRandomizedCell(), '<tr>', '</tr>');
}

function getRandomizedCell() {
    let isBlack = Math.random() >= 0.5;
    return isBlack ? '<td class="black" />' : '<td />';
}

function getEnclosedHtml(len, func, openTag, closeTag) {
    let array = Array.from({length: len + 2}).map((x, i) => i == 0 
                                                              ? openTag 
                                                              : i == len + 1 
                                                                  ? closeTag 
                                                                  : func(x, i - 1))
    return array.join('');
}

function renderSomething(target, func, name){
    let start = new Date()
    let something = func();
    let endCalc = new Date()
    console.log("calculating " + name + ": " + (endCalc - start));
    target.innerHTML = something;
    let endSet = new Date();
    console.log("set " + name + ": " + (endSet - endCalc));
    setTimeout(() => {
    let endRender = new Date();
    console.log("render " + name + ": " + (endRender - endSet));
    }, 0);
}

let renderPoint = document.getElementById('renderpoint');
let renderPoint2 = document.getElementById('renderpoint2');
renderSomething(renderPoint2, () => 'Loading......', 'reflow cost for empty page')
setTimeout(() => {
    renderSomething(renderPoint2, () => getRandomizedDivGrid(400, 250), 'divGrid')
    setTimeout(() => {
        renderSomething(renderPoint2, () => getRandomizedDivGrid(400, 250), 'divGrid2')
        setTimeout(() => {
            renderSomething(renderPoint2, () => getRandomizedDivGrid(400, 250), 'divGrid3')
            setTimeout(() => {
                //renderSomething(renderPoint, () => getRandomizedTable(400, 250), 'table')
                // this should show the reflow cost
                renderSomething(renderPoint, () => '', 'reflow cost')
            }, 0);
        }, 0);
    }, 0);
}, 0);
