const searchBar = document.getElementById("searchBar");
const tabList = document.getElementById("tabList");

let tabs = [];
let activeIndex = 0;

// Fetch tabs when the popup opens
chrome.tabs.query({}, (result) => {
  tabs = result;
  renderTabs(tabs);
});

// Render tabs to the list
function renderTabs(tabArray) {
  tabList.innerHTML = "";
  tabArray.forEach((tab, index) => {
    const tabItem = document.createElement("li");
    tabItem.textContent = tab.title;
    tabItem.className = "tab";
    if (index === activeIndex) tabItem.classList.add("active");
    tabList.appendChild(tabItem);

    // Click to select the tab
    tabItem.addEventListener("click", () => selectTab(tab.id));
  });

  // Scroll the active item into view
  const activeTab = tabList.querySelector(".active");
  if (activeTab) {
    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

// Handle search input
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredTabs = tabs.filter((tab) =>
    tab.title.toLowerCase().includes(query)
  );
  activeIndex = 0; // Reset active index
  renderTabs(filteredTabs);
});

// Handle keyboard navigation
searchBar.addEventListener("keydown", (e) => {
  const visibleTabs = [...tabList.children];
  if (e.key === "ArrowDown") {
    activeIndex = (activeIndex + 1) % visibleTabs.length;
    renderTabs(tabs);
  } else if (e.key === "ArrowUp") {
    activeIndex = (activeIndex - 1 + visibleTabs.length) % visibleTabs.length;
    renderTabs(tabs);
  } else if (e.key === "Enter") {
    const activeTab = visibleTabs[activeIndex];
    if (activeTab) {
      const tabId = tabs.find((tab) => tab.title === activeTab.textContent).id;
      selectTab(tabId);
    }
  }
});

// Select and focus on the tab
function selectTab(tabId) {
  chrome.tabs.update(tabId, { active: true });
  window.close(); // Close the popup
}
