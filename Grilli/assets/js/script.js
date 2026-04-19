'use strict';


/**
 * PRELOAD
 * 
 * loading will end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("DOMContentLoaded", function() {
    // End preloader faster for better performance
    setTimeout(() => {
        preloader.classList.add("loaded");
        document.body.classList.add("loaded");
    }, 500); 
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

if (heroSliderNextBtn) heroSliderNextBtn.addEventListener("click", SliderNext);

const sliderPrev = function () {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }
    updateSliderPos();
}

if (heroSliderPrevBtn) heroSliderPrevBtn.addEventListener("click", sliderPrev);

// auto slide

let autoSlideInterval;

const autoSlide = function () {
    autoSlideInterval = setInterval(function (){
        SliderNext();
    }, 7000);
}

if (heroSliderNextBtn && heroSliderPrevBtn) {
    addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn],"mouseover", function (){
        clearInterval(autoSlideInterval);
    });

    addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn],"mouseout", autoSlide);
}

if (heroSlider) window.addEventListener("load", autoSlide);


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

/**
 * API INTEGRATION
 */

const API_BASE_URL = '/api';

const fetchMenu = async () => {
    try {
        const response = await fetch(API_BASE_URL + '/menu');
        const items = await response.json();
        const homeList = document.getElementById('menu-list');
        const fullList = document.getElementById('full-menu-list');
        
        if (!items.length) {
            console.log("No menu items found in API");
            return;
        }

        let html = '';
        items.forEach(item => {
            const badge = item.badge ? '<span class="badge label-1">' + item.badge + '</span>' : '';
            html += '<li>' +
                '<div class="menu-card hover:card">' +
                '<figure class="card-banner img-holder" style="--width: 100; --height: 100;">' +
                '<img src="' + item.image + '" width="100" height="100" loading="lazy" alt="' + item.name + '" class="img-cover">' +
                '</figure>' +
                '<div>' +
                '<div class="title-wrapper">' +
                '<h3 class="title-3"><a href="#" class="card-title">' + item.name + '</a></h3>' +
                badge +
                '<span class="span title-2">' + item.price + '</span>' +
                '</div>' +
                '<p class="card-text label-1">' + item.description + '</p>' +
                '</div>' +
                '</div>' +
                '</li>';
        });

        if (homeList) homeList.innerHTML = html;
        if (fullList) fullList.innerHTML = html;
        
    } catch (err) {
        console.error('Menu fetch error:', err);
    }
};

const fetchTestimonials = async () => {
    try {
        const response = await fetch(API_BASE_URL + '/testimonials');
        const items = await response.json();
        const container = document.getElementById('testimonials-container');
        if (!container || !items.length) return;

        const testi = items[0];
        container.innerHTML = '<div class="quote">”</div>' +
            '<p class="headline-2 testi-text">' + testi.text + '</p>' +
            '<div class="wrapper">' +
            '<div class="separator"></div><div class="separator"></div><div class="separator"></div>' +
            '</div>' +
            '<div class="profile">' +
            '<img src="' + testi.image + '" width="100" height="100" loading="lazy" alt="' + testi.name + '" class="img">' +
            '<p class="label-2 profile-name">' + testi.name + '</p>' +
            '</div>';
    } catch (err) {
        console.error('Testimonials fetch error:', err);
    }
};

const handleReservation = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_BASE_URL + '/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = 'success.html';
        } else {
            alert('Failed to make reservation.');
        }
    } catch (err) {
        console.error('Reservation error:', err);
        alert('An error occurred.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    fetchTestimonials();
    const resForm = document.getElementById('reservation-form');
    if (resForm) {
        resForm.addEventListener('submit', handleReservation);
    }
});
