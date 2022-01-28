"use strict";

let timeOut = 2500;
let usageObj = {};

// adds one to the visits value if
const usageTracker = async function (details) {
  usageObj = JSON.parse(localStorage.getItem("usageObjRef"));
  console.log(details.url);
  console.log(usageObj);
  if (details.url in usageObj) {
    if (usageObj[details.url].blocked) {
      usageObj[details.url].visits++;
      // "Failed to launch 'chrome://newtab/' because the scheme does not have a registered handler."
      // doesn't work because http is missing
      // in chrome://newtab
      return {
        redirectUrl: "chrome://newtab",
      };
    }
    usageObj[details.url].visits++;
    localStorage.setItem("usageObjRef", JSON.stringify(usageObj));
  }
  await new Promise((r) => setTimeout(r, timeOut));
};

chrome.webRequest.onBeforeRequest.addListener(
  usageTracker,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("usageObjRef");
  if (ref) {
    usageObj = JSON.parse(ref);
  }
});
