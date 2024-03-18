let tabGroups = {};
let groupId = 0;

// function that determines the subject of a tab based on its URL
function determineSubject(tab) {
    let url = new URL(tab.url);
    return url.hostname; 
}

let bookmarkPrefix = ' ';

// function that gets the site name from a URL
function getSiteName(url) {
    let hostName = new URL(url).hostname;
    
    if (hostName.startsWith('www.')) {
        hostName = hostName.slice(4);
    }

    if (hostName.endsWith('.com')) {
        hostName = hostName.slice(0, -4);
    } else if (hostName.endsWith('.net')) {
        hostName = hostName.slice(0, -4);
    } else if (hostName.endsWith('.org')) {
        hostName = hostName.slice(0, -4);
    }

    return hostName.charAt(0).toUpperCase() + hostName.slice(1);
}

// Event listener for when a bookmark is created
chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    if (!bookmark.title.startsWith(bookmarkPrefix)) {
        let suggestedTitle = bookmark.title;

        let newTitle = window.prompt("Enter a name for the bookmark:", suggestedTitle);

        if (newTitle !== null) {
            chrome.bookmarks.update(id, {title: bookmarkPrefix + newTitle});
        }
    }
});

function organizeBookmarks() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        let bookmarks = {};
        bookmarkTreeNodes.forEach(function(bookmark) {
            if (bookmark.url) {
                let url = new URL(bookmark.url);
                let host = url.hostname;

                if (!bookmarks[host]) {
                    bookmarks[host] = [];
                }

                bookmarks[host].push(bookmark);
            }
        });

        for (let host in bookmarks) {
            chrome.bookmarks.create({title: host}, function(folder) {
                bookmarks[host].forEach(function(bookmark) {
                    chrome.bookmarks.move(bookmark.id, {parentId: folder.id});
                });
            });
        }
    });
}

organizeBookmarks();



