var browser = browser || chrome;

let user_agent = "";
let browserStorage = browser.storage.sync.get("user_agent");
browserStorage.then((item) => {if (item.user_agent) { user_agent = item.user_agent; } else { user_agent = "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Mobile Edge/42.0.0.2028"; }});
let remove_artifacts = false;
let browserStorage2 = browser.storage.sync.get("remove_artifacts");
browserStorage2.then((item) => {remove_artifacts = item.remove_artifacts;});
let isAndroid = false;

let platformInfo = browser.runtime.getPlatformInfo();
platformInfo.then((value) => {
    if (value.os === "android") {
        isAndroid = true;
    }
});

browser.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        console.log(details);
        if (!details.requestHeaders) {
            return;
        }
        if (details.url.startsWith("https://studio.youtube.com") || details.url.startsWith("http://studio.youtube.com")) { // fix for YouTube Studio "You are using an unsupported browser" message
            return;
        }
        if (details.url.startsWith("https://accounts.youtube.com") || details.url.startsWith("http://accounts.youtube.com")) { // fix for Google Docs/Drive becoming "unsupported"
            return;
        }
        for (let i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name.toLowerCase() === "user-agent") { // headers are case-insensitive
                if (remove_artifacts === true) {
                    console.log(`${details.url}, ${details.originUrl}}`);
                    if (details.originUrl) { // if the requested URL is not from an outside source (ex: the webpage itself), then set the user agent
                        details.requestHeaders[i].value = user_agent;
                    }
                }
                else {
                    details.requestHeaders[i].value = user_agent;
                }
                break;
            }
        }

        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://*.youtube.com/*"] },
    ["blocking", "requestHeaders"]
);

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (isAndroid) { return {}; }
        if (details.url.startsWith("https://m.youtube.com") || details.url.startsWith("http://m.youtube.com")) {
            const urlString = details.url.replace("m.youtube.com", "www.youtube.com");
            const url = new URL(urlString);
            url.searchParams.set('app', 'desktop');
            return { redirectUrl: url.href };
        }
        return {};
      },
      { urls: ["*://m.youtube.com/*"] },
      ["blocking"]

);
