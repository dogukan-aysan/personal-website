import state from "./data.js";
let { activeSectionId, scrollingOff, slideOutOpen } = state;

import { $feedback, $feedbackContent, $feedbackButton, $form, $inputs, $negativeIcon, $positiveIcon } from "./elements.js";

export function changeNavItemsColor(item) {
  document.querySelectorAll(".nav-item").forEach((navItem) => {
    if (item === navItem.textContent.toLowerCase()) {
      navItem.style.color = slideOutOpen ? "rgb(4, 1, 74)" : "white";
    } else {
      navItem.style.color = slideOutOpen ? "black" : "#959595";
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
  if (e.target === e.currentTarget || activeSectionId === +e.target.dataset.id) return;

  if (Math.abs(+e.target.dataset.id - activeSectionId) > 1) {
    scrollingOff = true;
  } else {
    scrollingOff = false;
  }
  activeSectionId = +e.target.dataset.id;
  if (e.target.dataset.slideout) {
    console.log("this is an item from slideout");
  }

  scrollPage(e.target.textContent.toLowerCase());
}

export function observerCallback(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting || activeSectionId === +entry.target.dataset.id) return;

  if (!scrollingOff) {
    changeNavItemsColor(entry.target.id);
    activeSectionId = +entry.target.dataset.id;
  }

  scrollingOff = false;

  // console.log("observer callback executed");
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
      document
        .querySelector(`.${key}-input`)
        .style.setProperty(
          "--focus-shadow",
          "inset 2px 2px 0 0 rgb(154, 75, 75, 0.6), inset -2px -2px 0 0 rgb(154, 75, 75, 0.6), -1.5px 1px 25px 13px rgb(154, 75, 75, 0.3)"
        );
      result = false;
    } else {
      document.querySelector(`.error-message--${key}`).textContent = "";
      document
        .querySelector(`.${key}-input`)
        .style.setProperty(
          "--focus-shadow",
          "inset 2px 2px 0 0 rgb(4, 208, 208, 0.6), inset -2px -2px 0 0 rgb(4, 208, 208, 0.6) , -1.5px 1px 25px 6px rgb(4, 208, 208, 0.3)"
        );
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
