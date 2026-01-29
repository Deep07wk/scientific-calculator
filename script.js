// Theme toggle logic
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        html.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('light-theme');
        const isLight = html.classList.contains('light-theme');
        themeIcon.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});

// Helper: pretty matrix HTML
function matrixToHTML(mat, label = '', highlight = null, highlightClass = '') {
    let html = '';
    if (label) html += `<div class="matrix-label">${label}</div>`;
    html += '<table class="matrix-table' + (highlightClass ? ' ' + highlightClass : '') + '"><tbody>';
    for (let i = 0; i < mat.length; i++) {
        html += '<tr>';
        for (let j = 0; j < mat[i].length; j++) {
            let cellClass = '';
            if (highlight && highlight[0] === i && highlight[1] === j) cellClass = ' style="background:#ffe082;color:#e53935;"';
            html += `<td${cellClass}>${Number.isFinite(mat[i][j]) ? (Math.abs(mat[i][j]) < 1e-10 ? 0 : +mat[i][j].toFixed(3)) : ''}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

// Helper: get minor for 3x3
function minor3x3(mat, row, col) {
    let m = [];
    for (let i = 0; i < 3; i++) {
        if (i === row) continue;
        let r = [];
        for (let j = 0; j < 3; j++) {
            if (j === col) continue;
            r.push(mat[i][j]);
        }
        m.push(r);
    }
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

// Helper: cofactor matrix
function cofactorMatrix(mat) {
    let cof = [];
    for (let i = 0; i < 3; i++) {
        cof[i] = [];
        for (let j = 0; j < 3; j++) {
            cof[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * minor3x3(mat, i, j);
        }
    }
    return cof;
}

// Helper: transpose
function transpose(mat) {
    return mat[0].map((_, i) => mat.map(row => row[i]));
}

// Helper: inverse
function inverseMatrix(mat, det) {
    if (Math.abs(det) < 1e-10) return null;
    let cof = cofactorMatrix(mat);
    let adj = transpose(cof);
    let inv = adj.map(row => row.map(val => val / det));
    return inv;
}

// History
let matrixHistory = [];

function det() {
    // Get values and parse as numbers
    let x1 = Number(document.getElementById("x1").value);
    let x2 = Number(document.getElementById("x2").value);
    let x3 = Number(document.getElementById("x3").value);
    let y1 = Number(document.getElementById("y1").value);
    let y2 = Number(document.getElementById("y2").value);
    let y3 = Number(document.getElementById("y3").value);
    let z1 = Number(document.getElementById("z1").value);
    let z2 = Number(document.getElementById("z2").value);
    let z3 = Number(document.getElementById("z3").value);
    let value = document.getElementById("value");
    let adv = document.getElementById("matrix-advanced");
    let copyBtn = document.getElementById("copy-result");
    let histPanel = document.getElementById("history-list");

    // Check if all fields are filled
    if ([x1,x2,x3,y1,y2,y3,z1,z2,z3].some(isNaN)) {
        value.innerHTML = '<span style="color:#e53935;font-weight:bold;">Please fill all matrix fields.</span>';
        adv.innerHTML = '';
        copyBtn.style.display = 'none';
        return;
    }

    // Matrix
    let mat = [ [x1,x2,x3], [y1,y2,y3], [z1,z2,z3] ];

    // Calculate determinant with steps
    let step1 = `+(${x1})×((${y2}×${z3})-(${y3}×${z2}))`;
    let step2 = `-(${x2})×((${y1}×${z3})-(${z1}×${y3}))`;
    let step3 = `+(${x3})×((${y1}×${z2})-(${y2}×${z1}))`;
    let detVal = x1*(y2*z3 - y3*z2) - x2*(y1*z3 - z1*y3) + x3*(y1*z2 - y2*z1);
    let detDisplay = Number.isInteger(detVal) ? detVal : detVal.toFixed(6);

    // Matrix display
    let matrixHTML = `
      <div class="matrix-latex">
        <div class="matrix-row">
          <span class="matrix-bracket">|</span>
          <span class="matrix-cell">${x1}</span>
          <span class="matrix-cell">${x2}</span>
          <span class="matrix-cell">${x3}</span>
          <span class="matrix-bracket">|</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-bracket">|</span>
          <span class="matrix-cell">${y1}</span>
          <span class="matrix-cell">${y2}</span>
          <span class="matrix-cell">${y3}</span>
          <span class="matrix-bracket">|</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-bracket">|</span>
          <span class="matrix-cell">${z1}</span>
          <span class="matrix-cell">${z2}</span>
          <span class="matrix-cell">${z3}</span>
          <span class="matrix-bracket">|</span>
        </div>
      </div>
    `;

    // Steps display
    let stepsHTML = `<div class="det-steps">Det = ${step1} ${step2} ${step3}</div>`;
    let resultHTML = `<div class="det-result">Determinant = ${detDisplay}</div>`;
    value.innerHTML = matrixHTML + stepsHTML + resultHTML;

    // Cofactor, adjugate, inverse
    let cof = cofactorMatrix(mat);
    let adj = transpose(cof);
    let inv = inverseMatrix(mat, detVal);

    let advHTML = '';
    advHTML += matrixToHTML(cof, 'Cofactor Matrix');
    advHTML += matrixToHTML(adj, 'Adjugate Matrix');
    if (inv) {
        advHTML += matrixToHTML(inv, 'Inverse Matrix', null, 'inverse');
    } else {
        advHTML += '<div style="color:#e53935;font-weight:bold;margin-top:8px;">Matrix is not invertible (Det = 0)</div>';
    }
    adv.innerHTML = advHTML;

    // Copy result
    copyBtn.style.display = 'inline-block';
    copyBtn.onclick = function() {
        let text = `Determinant: ${detDisplay}\nCofactor Matrix: ${JSON.stringify(cof)}\nAdjugate Matrix: ${JSON.stringify(adj)}`;
        if (inv) text += `\nInverse Matrix: ${JSON.stringify(inv)}`;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(()=>{copyBtn.textContent='Copy Result';}, 1200);
    };

    // History
    let histEntry = `Det = ${detDisplay}, Matrix: [[${x1},${x2},${x3}],[${y1},${y2},${y3}],[${z1},${z2},${z3}]]`;
    matrixHistory.unshift(histEntry);
    if (matrixHistory.length > 10) matrixHistory.length = 10;
    histPanel.innerHTML = matrixHistory.map(h => `<li>${h}</li>`).join('');
}