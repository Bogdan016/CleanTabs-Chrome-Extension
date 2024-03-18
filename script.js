document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create-group').addEventListener('click', function() {

    chrome.tabs.query({}, function(tabs) {
        tabs.sort((a, b) => a.title.localeCompare(b.title));

        let groups = {};
        tabs.forEach(function(tab) {
            let subject = determineSubject(tab);

            if (!groups[subject]) {
                groups[subject] = [];
            }

            groups[subject].push(tab);
        });

        for (let subject in groups) {
            chrome.tabs.group({tabIds: groups[subject].map(tab => tab.id)});
        }
    });
});
});

document.getElementById('create-bookmark').addEventListener('click', function() {
    chrome.tabs.query({}, function(tabs) {
        let groups = {};
        tabs.forEach(function(tab) {
            let host = getSiteName(tab.url);

            if (!groups[host]) {
                groups[host] = [];
            }

            groups[host].push(tab);
        });

        for (let host in groups) {
            chrome.bookmarks.create({title: bookmarkPrefix + host}, function(folder) {
                groups[host].forEach(function(tab) {
                    chrome.bookmarks.create({parentId: folder.id, title: bookmarkPrefix + getSiteName(tab.url), url: tab.url});
                });
            });
        }
    });
});


function showStatistics() {
    chrome.tabs.query({}, function(allTabs) {
        let totalTabs = allTabs.length;
        document.getElementById('tab-count').textContent = 'Total tabs: ' + totalTabs;

        chrome.tabs.query({active: true}, function(activeTabs) {
            let totalActiveTabs = activeTabs.length;
            document.getElementById('active-tab-count').textContent = 'Active tabs: ' + totalActiveTabs;

            let totalInactiveTabs = totalTabs - totalActiveTabs;
            document.getElementById('inactive-tab-count').textContent = 'Inactive tabs: ' + totalInactiveTabs;
        });
    });
}

document.getElementById('show-statistics').addEventListener('click', showStatistics);