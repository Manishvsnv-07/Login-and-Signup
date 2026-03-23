console.log('Jay Shree Ram');

let right = document.querySelector(".right")
let left = document.querySelector(".left")

function colorchange(){
    right.classList.toggle("bg-amber-950")
    right.classList.toggle("bg-amber-200")
    left.classList.toggle("bg-amber-950")
    left.classList.toggle("bg-amber-200")
}
right.addEventListener("mouseenter",colorchange)
left.addEventListener("mouseenter",colorchange)


let google = document.querySelector(".google")
let login = document.querySelector(".loginform")

google.addEventListener("click",()=>{
    google.classList.add("hidden");
    login.classList.remove("hidden")
    login.classList.add("flex")
})
