import { state } from "./main.js";

import {
  $feedback,
  $feedbackContent,
  $feedbackButton,
  $form,
  $inputs,
  $negativeIcon,
  $positiveIcon,
  $slideout,
  $slideoutCloseButton,
  $slideoutNavItems,
} from "./elements.js";

export function changeNavItemsColor(item) {
  document.querySelectorAll(".nav-item").forEach((navItem) => {
    if (item === navItem.textContent.toLowerCase()) {
      navItem.style.color = "hsl(var(--clr-white))";
    } else {
      navItem.style.color = state.slideOutOpen ? "hsl(var(--clr-primary-100))" : "hsl(var(--clr-white) / .3)";
    }
  });
}

export function scrollPage(targetId) {
  if (targetId === "home") {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  } else {
    document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
  }
  changeNavItemsColor(targetId);
}

export function clickEventHandler(e) {
  if (e.target === e.currentTarget || state.activeSectionId === +e.target.dataset.id) return;

  if (Math.abs(+e.target.dataset.id - state.activeSectionId) > 1) {
    state.scrollingOff = true;
  } else {
    state.scrollingOff = false;
  }
  state.activeSectionId = +e.target.dataset.id;

  scrollPage(e.target.textContent.toLowerCase());
}

export function handleHamburgerClick() {
  state.slideOutOpen = !state.slideOutOpen;
  $slideout.classList.toggle("hidden");
  $slideoutCloseButton.style.cursor = state.slideOutOpen ? "pointer" : "default";
  $slideoutNavItems.querySelectorAll(".nav-item").forEach((navItem) => (navItem.style.cursor = state.slideOutOpen ? "pointer" : "default"));
  changeNavItemsColor(document.querySelector(`.nav-item[data-id="${state.activeSectionId}"]`).textContent.toLowerCase());
}

export function handleCloseBtnClick() {
  if ($slideoutCloseButton.parentElement.parentElement.classList.contains("hidden")) return;
  state.slideOutOpen = false;
  $slideout.classList.toggle("hidden");
  $slideoutCloseButton.style.cursor = "default";
  $slideoutNavItems.querySelectorAll(".nav-item").forEach((navItem) => (navItem.style.cursor = "default"));
  changeNavItemsColor(document.querySelector(`.nav-item[data-id="${state.activeSectionId}"]`).textContent.toLowerCase());
}

export function observerCallback(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting || state.activeSectionId === +entry.target.dataset.id) return;

  if (!state.scrollingOff) {
    changeNavItemsColor(entry.target.id);
    state.activeSectionId = +entry.target.dataset.id;
  }

  state.scrollingOff = false;
}

export function generateErrorMessages(dataObj) {
  const { name, email, message } = dataObj;

  const errorMessages = {
    name: "",
    email: "",
    message: "",
  };

  if (name === "") {
    errorMessages.name = "This field is required.";
  }

  if (email === "") {
    errorMessages.email = "This field is required.";
  } else if (!isEmailValid(email)) {
    errorMessages.email = "Please provide a valid email address";
  }

  if (message === "") {
    errorMessages.message = "This field is required.";
  }

  return errorMessages;
}

export function isEmailValid(email) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export function areInputsValid(inputsObj) {
  let result = true;
  const errorMessages = generateErrorMessages(inputsObj);

  Object.keys(errorMessages).forEach((key) => {
    if (errorMessages[key] !== "") {
      document.querySelector(`.error-message--${key}`).textContent = errorMessages[key];
      document.querySelector(`.${key}-input`).style.setProperty("--shadow-input-focus", "inset -1px 0px 14px 1px rgba(154, 75, 75, 1)");
      result = false;
    } else {
      document.querySelector(`.error-message--${key}`).textContent = "";
      document
        .querySelector(`.${key}-input`)
        .style.setProperty("--shadow-input-focus", "inset -1px 0px 14px 1px hsl(var(--clr-primary-400))");
    }
  });
  return result;
}

export async function sendData2Api(dataObj) {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message);
    } else {
      return data.message;
    }
  } catch (err) {
    console.error(err.message);
    return "Something went wrong. Please try again.";
  }
}

export function createFeedback(msg) {
  $feedback.querySelector(".feedback-content p").textContent = msg;
  $feedback.style.display = "flex";
  $form.style.display = "none";

  if (msg === "Something went wrong. Please try again.") {
    $negativeIcon.style.display = "flex";
    $positiveIcon.style.display = "none";
    $feedbackButton.textContent = "Go back";
  } else {
    $negativeIcon.style.display = "none";
    $positiveIcon.style.display = "flex";
    $feedbackButton.textContent = "Send another message";
  }
}

export async function onFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const formDataObj = Object.fromEntries(formData);

  if (!areInputsValid(formDataObj)) return;

  const returnedMessage = await sendData2Api(formDataObj);

  createFeedback(returnedMessage);

  $inputs.forEach((item) => (item.value = ""));
}

export function handleFeedback() {
  $feedbackContent.textContent = "";
  $feedback.style.display = "none";
  $form.style.display = "flex";

  $positiveIcon.style.display = "none";
  $negativeIcon.style.display = "none";
  $feedbackButton.style.textContent = "";
}
