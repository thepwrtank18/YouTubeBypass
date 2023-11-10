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

    var removeArtifacts = document.getElementsByName("RemoveArtifacts");
    if (removeArtifacts[0].checked) {
      browser.storage.sync.set({
        remove_artifacts: true,
      });
    } else {
      browser.storage.sync.set({
        remove_artifacts: false,
      });
    }
  }

  document.getElementById("success").style = "visibility: block;";
  setTimeout(function(){ document.getElementById("success").style = "visibility: hidden; color: green;" }, 3000);
}

function restoreOptions() {
  function setCurrentChoice_Profiles(result) {
    document.querySelector("#user_agent").value = result.user_agent || "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Mobile Edge/42.0.0.2028";
    switch (result.user_agent) {
      case "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Mobile Edge/42.0.0.2028":
        document.getElementById("NT10").checked = true;
        break;
      case "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/36.0  Mobile/15E148 Safari/605.1.15":
        document.getElementById("iOS14").checked = true;
        break;
      case "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) FxiOS/7.5b3349 Mobile/14F89 Safari/603.2.4":
        document.getElementById("iOS10").checked = true;
        break;
      case "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36":
        document.getElementById("Fedora").checked = true;
        break;
      default:
        document.getElementById("UseAdvanced").checked = true;
        document.getElementById("UseAdvanced").value = result.user_agent;
        break;
    }
  }

  function setCurrentChoice_Artifacts(result) {
    document.querySelector("#RemoveArtifacts").checked = result.remove_artifacts || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("user_agent");
  getting.then(setCurrentChoice_Profiles, onError);
  browser.storage.sync.get("remove_artifacts").then(setCurrentChoice_Artifacts, onError);
}

function setRadio() {
  document.getElementById("UseAdvanced").value = document.getElementById("user_agent");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);