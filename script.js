let tabCount = 0;

window.addEventListener("DOMContentLoaded", () => {
    const tabContainer = document.getElementById("tab-container");
    const tabs = document.getElementById("tabs");

    const savedTabCount = parseInt(localStorage.getItem("tab-count")) || 0;
    tabCount = savedTabCount;

    for (let i = 1; i <= tabCount; i++) {
        const tabId = `Tab${i}`;
        const tabName = localStorage.getItem(`${tabId}-name`);
        const tabContent = localStorage.getItem(tabId);

        if (tabName !== null && tabContent !== null) {
            const tabBtn = createTabButton(tabId, tabName);
            tabs.insertBefore(tabBtn, document.getElementById("add-tab-button"));

            const tabEl = document.createElement("div");
            tabEl.id = tabId;
            tabEl.className = "tab-content";
            tabEl.contentEditable = true;
            tabEl.innerHTML = tabContent; // Load formatted content
            tabEl.addEventListener("input", () => saveTabContent(tabId));
            tabContainer.appendChild(tabEl);
        }
    }

    const firstTab = document.querySelector(".tab-button");
    const firstContent = document.querySelector(".tab-content");
    if (firstTab && firstContent) {
        firstTab.classList.add("active");
        firstContent.classList.add("active");
    }
});

function createTabButton(tabId, tabName = tabId) {
    const tabBtn = document.createElement("button");
    tabBtn.className = "tab-button";

    const span = document.createElement("span");
    span.contentEditable = true;
    span.innerText = tabName;
    span.oninput = () => renameTab(span, tabId);

    const del = document.createElement("span");
    del.className = "delete-tab";
    del.innerText = "✕";

    let holdTimeout;
    del.onmousedown = () => {
        del.classList.add("danger");
        holdTimeout = setTimeout(() => deleteTab(tabId, tabBtn), 1000);
    };
    del.onmouseup = del.onmouseleave = () => {
        clearTimeout(holdTimeout);
        del.classList.remove("danger");
    };

    tabBtn.appendChild(span);
    tabBtn.appendChild(del);
    tabBtn.onclick = (e) => {
        if (e.target === del) return;
        openTab(e, tabId);
    };

    return tabBtn;
}

function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function saveTabContent(id) {
    const content = document.getElementById(id).innerHTML; // Save formatted content
    localStorage.setItem(id, content);
}

function renameTab(spanEl, id) {
    const name = spanEl.innerText.trim();
    localStorage.setItem(`${id}-name`, name);
}

function createTab() {
    tabCount++;
    localStorage.setItem("tab-count", tabCount);

    const newId = `Tab${tabCount}`;
    const tabs = document.getElementById("tabs");

    const newButton = createTabButton(newId);
    tabs.insertBefore(newButton, document.getElementById("add-tab-button"));

    const newTab = document.createElement("div");
    newTab.id = newId;
    newTab.className = "tab-content";
    newTab.contentEditable = true;
    newTab.addEventListener("input", () => saveTabContent(newId));
    document.getElementById("tab-container").appendChild(newTab);

    localStorage.setItem(`${newId}-name`, newId);
    localStorage.setItem(newId, "");

    newButton.click();
}

function createTabButton(tabId, tabName = tabId) {
    const tabBtn = document.createElement("button");
    tabBtn.className = "tab-button";

    const span = document.createElement("span");
    span.contentEditable = true;
    span.innerText = tabName;
    span.oninput = () => renameTab(span, tabId);

    const del = document.createElement("span");
    del.className = "delete-tab";
    del.innerText = "✕";

    let holdTimeout;

    const initiateDelete = () => {
        del.classList.add("danger");
        holdTimeout = setTimeout(() => deleteTab(tabId, tabBtn), 1000);
    };

    const cancelDelete = () => {
        clearTimeout(holdTimeout);
        del.classList.remove("danger");
    };

    del.onmousedown = initiateDelete;
    del.onmouseup = del.onmouseleave = cancelDelete;

    del.ontouchstart = (e) => {
        e.preventDefault(); // Prevents text selection or scrolling
        initiateDelete();
    };
    del.ontouchend = del.ontouchcancel = cancelDelete;

    tabBtn.appendChild(span);
    tabBtn.appendChild(del);
    tabBtn.onclick = (e) => {
        if (e.target === del) return;
        openTab(e, tabId);
    };

    return tabBtn;
}
