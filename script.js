"use strict";


const navLinks = document.querySelectorAll('.link a');

navLinks.forEach(lnk => {
  
  lnk.addEventListener('click', function(e) {

    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    targetSection.scrollIntoView({ behavior: 'smooth' });

  });

});


const submitBtn = document.querySelector(".submit-rating");
const stars     = document.querySelectorAll(".star");
const rateBtn   = document.getElementById("hero-btn");
const modal     = document.getElementById("ratingModal");
const closeBtn  = document.getElementById("closeModal");
const starsContainer = document.querySelector(".stars");


function showAlert(message) {
  const alert = document.getElementById('customAlert');
  const msg = document.getElementById('alertMsg');
  msg.textContent = message;
  alert.classList.add('show');
}

document.getElementById('alertOk').addEventListener('click', () => {
  document.getElementById('customAlert').classList.remove('show');
});

let selectedRating = 0;

rateBtn.addEventListener("click", function() {
  if(modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  }
});


closeBtn.addEventListener("click", function() {
    // add 'hidden' class back
    modal.classList.add("hidden");
});


stars.forEach(star => {

  //stars effect
  star.addEventListener("mouseover", function() {
    const value = this.getAttribute("data-value");

    stars.forEach(s => {
      if(s.getAttribute("data-value") <= value) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });

  });

  //click save rating
  star.addEventListener("click", function() {
    selectedRating = this.getAttribute("data-value");

  });

});


starsContainer.addEventListener("mouseleave", function() {
  stars.forEach(s => {
    if (s.getAttribute("data-value") <= selectedRating) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
});

submitBtn.addEventListener("click", function() {
// replace your existing alert() call with:
showAlert('Thank you for your rating! ⭐');
  modal.classList.add("hidden");
});






