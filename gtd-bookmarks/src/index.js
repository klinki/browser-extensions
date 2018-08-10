/**
 *
 * @param {browser.bookmarks.CreateDetails} bookmark
 * @returns {Promise<browser.bookmarks.BookmarkTreeNode>}
 */
function createBookmark(bookmark) {
    return browser.bookmarks.create(bookmark);
}

/**
 * @param {string} name
 * @returns {Promise<browser.bookmarks.BookmarkTreeNode[]>}
 */
function findBookmarkByName(name) {
    return browser.bookmarks.search(name);
}

/**
 * @returns {Promise<browser.bookmarks.BookmarkTreeNode>}
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
 * @param {browser.bookmarks.BookmarkTreeNode} node
 * @returns {Promise<browser.bookmarks.BookmarkTreeNode[]>}
 */
async function getChildren(node) {
    return browser.bookmarks.getChildren(node.id);
}


const rootNode = 'GTD Inbox';
let addingBookmark = false;

browser.bookmarks.onCreated.addListener(async (id, bookmark) => {
    if (!bookmark.url || addingBookmark) {
        return;
    }

    addingBookmark = true;

    let date = new Date();
    const bookmarkDirName = `${date.getDate()}. ${date.getMonth()}.`;
    const gtdDirectory = await getGtdBookmarksRoot();

    let bookmarkDir;
    let gtdChildren = await getChildren(gtdDirectory);

    if (gtdChildren.length > 0) {
        const result = gtdChildren.find((item) => item.title === bookmarkDirName);

        bookmarkDir = result
            ? result
            : await createBookmark({ title: bookmarkDirName, parentId: gtdDirectory.id });
    } else {
        bookmarkDir = await createBookmark({ title: bookmarkDirName, parentId: gtdDirectory.id });
    }

    browser.bookmarks.move(id, { parentId: bookmarkDir.id });
    addingBookmark = false;
});
