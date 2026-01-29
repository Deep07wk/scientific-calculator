
function det(){
    let x1 = document.getElementById("x1").value
    let x2 = document.getElementById("x2").value
    let x3 = document.getElementById("x3").value
    let y1 = document.getElementById("y1").value
    let y2 = document.getElementById("y2").value
    let y3 = document.getElementById("y3").value
    let z1 = document.getElementById("z1").value
    let z2 = document.getElementById("z2").value
    let z3 = document.getElementById("z3").value
    let ans = x1*(y2*z3-y3*z2)-x2*(y1*z3-z1*y3)+x3*(y1*z2-y2*z1)
    let value = document.getElementById("value")
    value.innerText = Number.isInteger(ans) ? ans : Number(ans.toFixed(2));
}