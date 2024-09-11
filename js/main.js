import { clickEventHandler, observerCallback, onFormSubmit, handleFeedback, handleHamburgerClick, handleCloseBtnClick } from "../js/lib.js";

import { $feedbackButton, $form, $hamburgerIcon, $navItems, $sections, $slideoutCloseButton, $slideoutNavItems } from "./elements.js";

export const state = {
  activeSectionId: 0,
  scrollingOff: false,
  slideOutOpen: false,
};

// NAVBAR
// ==================================
$navItems.addEventListener("click", clickEventHandler);
$slideoutNavItems.addEventListener("click", clickEventHandler);
$hamburgerIcon.addEventListener("click", handleHamburgerClick);
$slideoutCloseButton.addEventListener("click", handleCloseBtnClick);

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
