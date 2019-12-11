import { TweenLite } from "gsap";

function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
    window.onload = function() {
        var logo = document.getElementById("logo");
        TweenLite.to(logo, 2, {left:"542px", backgroundColor:"black", borderBottomColor:"#90e500", color:"white"});
    }
}
hello('TypeScript');