/**
 *
 * @param {chrome.bookmarks.BookmarkCreateArg} bookmark
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
function createBookmark(bookmark) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.create(bookmark, (result) => {
            resolve(result);
        });
    });
}

/**
 * @param {string} name
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode[]>}
 */
function findBookmarkByName(name) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(name, (result) => {
            resolve(result);
        });
    });
}

/**
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
async function getGtdBookmarksRoot() {
    let bookmarks = await findBookmarkByName(rootNode);

    if (bookmarks.length == 0) {
        return await createBookmark({
            title: rootNode
        });
    } else if (bookmarks.length == 1) {
        return bookmarks[0];
    } else {
        throw new Error('Multiple matching roots');
    }
}

/**
 *
 * @param {chrome.bookmarks.BookmarkTreeNode} node
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode[]>}
 */
async function getChildren(node) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getChildren(node.id, (result) => {
            resolve(result);
        })
    });
}
