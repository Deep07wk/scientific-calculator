// Matrix operations module
export function determinant3x3(mat) {
    const [a, b, c] = mat[0];
    const [d, e, f] = mat[1];
    const [g, h, i] = mat[2];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

export function cofactorMatrix(mat) {
    function minor(m, row, col) {
        const sub = m.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
        return sub[0][0] * sub[1][1] - sub[0][1] * sub[1][0];
    }
    return mat.map((row, i) => row.map((_, j) => ((i + j) % 2 === 0 ? 1 : -1) * minor(mat, i, j)));
}

export function transpose(mat) {
    return mat[0].map((_, i) => mat.map(row => row[i]));
}

export function inverseMatrix(mat, det) {
    if (Math.abs(det) < 1e-10) return null;
    const cof = cofactorMatrix(mat);
    const adj = transpose(cof);
    return adj.map(row => row.map(val => val / det));
}
