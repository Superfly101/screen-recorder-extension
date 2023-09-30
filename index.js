async function sayHello() {


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];

        chrome.scripting
            .insertCSS({
                target: { tabId: activeTab.id },
                files: ["dist/output.css"]
            })

        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ["scripts/RecordRTC.js", "scripts/content.js"]
        });
    });
}

const recordBtn = document.querySelector("#start");

const handleClick = async (event) => {
    console.log("sending")
}

const handleRemove = async (event) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];


        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                const videoRecorder = document.getElementById("superfly-very-unique-id");
                if (videoRecorder) videoRecorder.remove();
            }
        });
    });

}

document.getElementById("start").addEventListener("click", sayHello);
document.getElementById("close").addEventListener("click", handleRemove);



