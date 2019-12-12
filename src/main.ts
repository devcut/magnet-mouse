import { TweenLite } from "gsap";

function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
    console.log(TweenLite.to('.ddo', 20, {score:100}));
    console.log('okddsssdd');
}
hello('TypeScript');