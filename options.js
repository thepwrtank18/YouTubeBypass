function saveOptions(e) {
  e.preventDefault();
  if (document.getElementById("UseAdvanced").checked) { 
    document.querySelector("#user_agent").value = document.querySelector("#user_agent").value;
    browser.storage.sync.set({
      user_agent: document.querySelector("#user_agent").value,
    });
  }
  else {
    var ele = document.getElementsByName("UserAgentProfile");
    for (i = 0; i < ele.length; i++) { 
      if (ele[i].checked) {
        document.querySelector("#user_agent").value = ele[i].value,
        browser.storage.sync.set({
          user_agent: ele[i].value,
        });
      }
    }
  }

  document.getElementById("success").style = "visibility: block;";
  setTimeout(function(){ document.getElementById("success").style = "visibility: hidden; color: green;" }, 3000);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#user_agent").value = result.user_agent || "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Mobile Edge/42.0.0.2028";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("user_agent");
  getting.then(setCurrentChoice, onError);
}

function setRadio() {
  document.getElementById("UseAdvanced").value = document.getElementById("user_agent");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);