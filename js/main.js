import { clickEventHandler, observerCallback, onFormSubmit, handleFeedback } from "../js/lib.js";

import state from "./data.js";
let { slideOutOpen } = state;

import {
  $feedbackButton,
  $form,
  $hamburgerIcon,
  $navItems,
  $sections,
  $slideout,
  $slideoutCloseButton,
  $slideoutNavItems,
} from "./elements.js";

// NAVBAR
// ==================================
$navItems.addEventListener("click", clickEventHandler);
$slideoutNavItems.addEventListener("click", clickEventHandler);

$hamburgerIcon.addEventListener("click", function () {
  slideOutOpen = !slideOutOpen;
  $slideout.classList.toggle("hidden");
});

$slideoutCloseButton.addEventListener("click", function () {
  slideOutOpen = !slideOutOpen;
  $slideout.classList.toggle("hidden");
});

// OBSERVER
// ==================================
$sections.forEach((section) => {
  const sectionObserver = new IntersectionObserver(observerCallback, {
    root: null,
    threshold: 0.5,
  });
  sectionObserver.observe(document.getElementById(section.id));
});

// FORM SUBMISSON
// ==================================
$form.addEventListener("submit", onFormSubmit);
$feedbackButton.addEventListener("click", handleFeedback);
