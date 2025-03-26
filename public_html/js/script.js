import Hero from "./hero.js";

const hero = new Hero("three");


document.addEventListener("DOMContentLoaded", () => {
    
    
    for (let element of document.getElementsByClassName("toggleDev")) {
        element.addEventListener("click", () => {
            hero.toggleDev();
        });
    }
    
});