// UI rendering and helpers
export function renderMatrix(mat, label = '', className = '') {
    let html = '';
    if (label) html += `<div class="matrix-label fade-in">${label}</div>`;
    html += `<table class="matrix-table fade-in${className ? ' ' + className : ''}"><tbody>`;
    for (let i = 0; i < mat.length; i++) {
        html += '<tr>';
        for (let j = 0; j < mat[i].length; j++) {
            html += `<td>${Number.isFinite(mat[i][j]) ? (Math.abs(mat[i][j]) < 1e-10 ? 0 : +mat[i][j].toFixed(3)) : ''}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

export function showMessage(msg, type = 'info') {
    return `<div class="msg msg-${type} fade-in">${msg}</div>`;
}
