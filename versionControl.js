// versionControl.js
// Git-like version control for stories (core logic)
// Stores data in localStorage under 'storyRepo'

const VC_STORAGE_KEY = 'storyRepo';

function loadRepo() {
    const raw = localStorage.getItem(VC_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
}

function saveRepo(repo) {
    localStorage.setItem(VC_STORAGE_KEY, JSON.stringify(repo));
}

function generateId() {
    // Simple unique id: timestamp + random
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Initialize a new repo (if none exists)
function initRepo(initialContent = '') {
    let repo = loadRepo();
    if (repo) return repo;
    const rootCommitId = generateId();
    repo = {
        commits: {
            [rootCommitId]: {
                id: rootCommitId,
                parentIds: [],
                branch: 'main',
                timestamp: Date.now(),
                message: 'Initial commit',
                content: initialContent
            }
        },
        branches: {
            main: rootCommitId
        },
        HEAD: {
            branch: 'main',
            commitId: rootCommitId
        }
    };
    saveRepo(repo);
    return repo;
}

// Commit current content to HEAD branch
function commit(message, content) {
    const repo = loadRepo();
    if (!repo) throw new Error('Repo not initialized');
    const parentId = repo.HEAD.commitId;
    const branch = repo.HEAD.branch;
    const newCommitId = generateId();
    repo.commits[newCommitId] = {
        id: newCommitId,
        parentIds: [parentId],
        branch,
        timestamp: Date.now(),
        message,
        content
    };
    repo.branches[branch] = newCommitId;
    repo.HEAD.commitId = newCommitId;
    saveRepo(repo);
    return newCommitId;
}

// Create a new branch from a given commit
function createBranch(branchName, fromCommitId = null) {
    const repo = loadRepo();
    if (!repo) throw new Error('Repo not initialized');
    if (repo.branches[branchName]) throw new Error('Branch already exists');
    const commitId = fromCommitId || repo.HEAD.commitId;
    repo.branches[branchName] = commitId;
    saveRepo(repo);
}

// Checkout a commit (sets HEAD to that commit's branch and commitId)
function checkout(commitId) {
    const repo = loadRepo();
    if (!repo) throw new Error('Repo not initialized');
    const commit = repo.commits[commitId];
    if (!commit) throw new Error('Commit not found');
    // Find which branch (if any) points to this commit
    let branch = Object.keys(repo.branches).find(b => repo.branches[b] === commitId) || commit.branch;
    repo.HEAD = { branch, commitId };
    saveRepo(repo);
    return commit.content;
}

// Get full commit history as a list (for timeline)
function getHistory() {
    const repo = loadRepo();
    if (!repo) throw new Error('Repo not initialized');
    // Return commits as array, sorted by timestamp
    return Object.values(repo.commits).sort((a, b) => a.timestamp - b.timestamp);
}

// (Stub) Merge: for now, just create a merge commit with both parents and manual content
function merge(fromBranch, toBranch, mergedContent, message = 'Merge commit') {
    const repo = loadRepo();
    if (!repo) throw new Error('Repo not initialized');
    const fromCommitId = repo.branches[fromBranch];
    const toCommitId = repo.branches[toBranch];
    const newCommitId = generateId();
    repo.commits[newCommitId] = {
        id: newCommitId,
        parentIds: [toCommitId, fromCommitId],
        branch: toBranch,
        timestamp: Date.now(),
        message,
        content: mergedContent
    };
    repo.branches[toBranch] = newCommitId;
    repo.HEAD = { branch: toBranch, commitId: newCommitId };
    saveRepo(repo);
    return newCommitId;
}

// Export functions for use in other scripts
window.versionControl = {
    initRepo,
    commit,
    createBranch,
    checkout,
    getHistory,
    merge
};
