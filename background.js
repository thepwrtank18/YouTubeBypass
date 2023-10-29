const user_agent = "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Mobile Edge/42.0.0.2028";
let isAndroid = false;

var browser = browser || chrome;

let platformInfo = browser.runtime.getPlatformInfo();
if (platformInfo.os === "android") {
    isAndroid = true;
}

browser.webRequest.onBeforeSendHeaders.addListener(
    function (details) {

        if (!details.requestHeaders) {
            return;
        }

        for (let i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name.toLowerCase() === "user-agent") { // headers are case-insensitive
                details.requestHeaders[i].value = user_agent;
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