import { determinant3x3, cofactorMatrix, transpose, inverseMatrix } from './matrix.js';
import { renderMatrix, showMessage } from './ui.js';

// State
let matrixHistory = [];

window.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calc-btn');
    const copyBtn = document.getElementById('copy-result');
    const valueDiv = document.getElementById('value');
    const advDiv = document.getElementById('matrix-advanced');
    const histList = document.getElementById('history-list');

    calcBtn.addEventListener('click', () => {
        const mat = getMatrixInput();
        if (!mat) {
            valueDiv.innerHTML = showMessage('Please fill all matrix fields.', 'error');
            advDiv.innerHTML = '';
            copyBtn.style.display = 'none';
            return;
        }
        const det = determinant3x3(mat);
        valueDiv.innerHTML = renderMatrix(mat, 'Input Matrix') + `<div class="det-result pop-in">Determinant = <b>${det.toFixed(6)}</b></div>`;
        // Advanced
        const cof = cofactorMatrix(mat);
        const adj = transpose(cof);
        const inv = inverseMatrix(mat, det);
        let advHTML = renderMatrix(cof, 'Cofactor Matrix');
        advHTML += renderMatrix(adj, 'Adjugate Matrix');
        if (inv) advHTML += renderMatrix(inv, 'Inverse Matrix', 'inverse');
        else advHTML += showMessage('Matrix is not invertible (Det = 0)', 'error');
        advDiv.innerHTML = `<div class="fade-in">${advHTML}</div>`;
        // Copy
        copyBtn.style.display = 'inline-block';
        copyBtn.onclick = function() {
            let text = `Determinant: ${det}\nCofactor: ${JSON.stringify(cof)}\nAdjugate: ${JSON.stringify(adj)}`;
            if (inv) text += `\nInverse: ${JSON.stringify(inv)}`;
            navigator.clipboard.writeText(text);
            copyBtn.textContent = 'Copied!';
            setTimeout(()=>{copyBtn.textContent='Copy Result';}, 1200);
        };
        // History
        let histEntry = `Det = ${det}, Matrix: ${JSON.stringify(mat)}`;
        matrixHistory.unshift(histEntry);
        if (matrixHistory.length > 10) matrixHistory.length = 10;
        histList.innerHTML = matrixHistory.map(h => `<li>${h}</li>`).join('');
    });
});

function getMatrixInput() {
    const ids = ['x1','x2','x3','y1','y2','y3','z1','z2','z3'];
    const vals = ids.map(id => Number(document.getElementById(id).value));
    if (vals.some(isNaN)) return null;
    return [vals.slice(0,3), vals.slice(3,6), vals.slice(6,9)];
}
