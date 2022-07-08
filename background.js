// Run on installation
chrome.runtime.onInstalled.addListener(function(details) {

    if (details.reason == "install") {

        async function getCurrentTab() {
            let queryOptions = { active: true, currentWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);

            // Get query
            let query = tab.url.split("?")[1];
            let cid = 'empty';

            if (query != undefined && query != "") {
                // Split each 
                query = query.split("&");
                query.forEach((element) => {

                    element = element.split("=");

                    // Save cid 
                    if (element[0] == 'cid') cid = element[1];
                });
            }

            // Open extension thank-you page
            chrome.tabs.create({
                active: true,
                url: "https://monadweather.com/thank-you/index.php?cid=" + cid
            })
        }

        // Call the function
        getCurrentTab();
    }

});

// Set redirection link
chrome.runtime.setUninstallURL("https://monadweather.com/uninstall/index.php", () => {});