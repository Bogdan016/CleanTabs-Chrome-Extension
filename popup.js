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

// Function to organize bookmarks
function organizeBookmarks() {
    // Get the entire bookmark tree
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        // Initialize an empty object to store bookmarks
        let bookmarks = {};

        // Loop through each bookmark in the tree
        bookmarkTreeNodes.forEach(function(bookmark) {
            // Check if the bookmark has a URL
            if (bookmark.url) {
                // Create a new URL object from the bookmark's URL
                let url = new URL(bookmark.url);
                // Get the hostname from the URL
                let host = url.hostname;

                // If there's no array for this hostname yet, create one
                if (!bookmarks[host]) {
                    bookmarks[host] = [];
                }

                // Add the bookmark to the array for its hostname
                bookmarks[host].push(bookmark);
            }
        });

        // Loop through each hostname in the bookmarks object
        for (let host in bookmarks) {
            // Create a new bookmark folder with the hostname as the title
            chrome.bookmarks.create({title: host}, function(folder) {
                // Loop through each bookmark for this hostname
                bookmarks[host].forEach(function(bookmark) {
                    // Move the bookmark into the new folder
                    chrome.bookmarks.move(bookmark.id, {parentId: folder.id});
                });
            });
        }
    });
}


organizeBookmarks();



