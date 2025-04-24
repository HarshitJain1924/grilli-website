'use strict';


/**
 * PRELOAD
 * 
 * loading will end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function() {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});


/**
 * add event listener on multiple elements
 */

const addEventOnElements = function(elements, eventType, callback){
    for(let i = 0, len = elements.length; i < len; i++){
        elements[i].addEventListener(eventType, callback);
    }
};


/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const menuLinks = document.querySelectorAll(".navbar-link");

const toggleNavbar = function (){
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

const closeNavbar = function() {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-active");
}

// Add event listener to navbar toggler buttons
navTogglers.forEach(function (toggler) {
    toggler.addEventListener("click", toggleNavbar);
});

// Add event listener to menu item links to close navbar when clicked
menuLinks.forEach(function (link) {
    link.addEventListener("click", closeNavbar);
});




/**
 * HEADER & BACK TO TOP
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]")

let LastScrollPos = 0;

const hideHeader = function(){
    const isScrollBottom = LastScrollPos < window.scrollY;
    if(isScrollBottom){
        header.classList.add("hide");
    }
    else{
        header.classList.remove("hide");
    }
    LastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function(){
    if (window.scrollY >= 50){
        header.classList.add("active");
        backTopBtn.classList.add("active");
        hideHeader();
    }
    else{
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});

/*
 * HERO SLIDER 
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let LastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
    LastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    LastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const SliderNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
    } else {
        currentSlidePos++;
    }
    updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", SliderNext);

const sliderPrev = function () {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }
    updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", sliderPrev);

// auto slide

let autoSlideInterval;

const autoSlide = function () {
    autoSlideInterval = setInterval(function (){
        SliderNext();
    }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn],"mouseover", function (){
    clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn],"mouseout", autoSlide);

window.addEventListener("load", autoSlide);


/**
 * PARALLAX EFFECT
*/

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {
    x = (event.clientX / window.innerWidth * 10) -5;
    y = (event.clientY/ window.innerHeight * 10) -5;

    //reverse the number
    x = x - (x * 2);
    y = y - (y * 2);

    for(let i=0, len = parallaxItems.length; i < len; i++){
        x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
        y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
        parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }
});

