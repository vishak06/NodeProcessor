function processData(data) {
    const user_id = "vishakj_06062005";
    const email_id = "vj7235@srmist.edu.in";
    const college_roll_number = "RA2311003010140";

    const invalid_entries = [];
    const validEntries = [];

    // STEP 1 - VALIDATION
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'string') {
            invalid_entries.push(String(data[i]));
            continue;
        }
        const trimmed = data[i].trim();
        if (/^[A-Z]->[A-Z]$/.test(trimmed)) {
            const p = trimmed[0];
            const c = trimmed[3];
            if (p === c) {
                invalid_entries.push(trimmed);
            } else {
                validEntries.push(trimmed);
            }
        } else {
            invalid_entries.push(trimmed);
        }
    }

    // STEP 2 - DUPLICATE DETECTION
    const duplicate_edges = [];
    const uniqueEdges = [];
    const seenEdges = new Set();
    const duplicateSet = new Set();

    for (const edge of validEntries) {
        if (seenEdges.has(edge)) {
            if (!duplicateSet.has(edge)) {
                duplicate_edges.push(edge);
                duplicateSet.add(edge);
            }
        } else {
            seenEdges.add(edge);
            uniqueEdges.push(edge);
        }
    }

    // STEP 3 - BUILD ADJACENCY MAP
    const children = {};
    const parentOf = {};
    const allNodes = new Set();

    for (const edge of uniqueEdges) {
        const parent = edge[0];
        const child = edge[3];
        allNodes.add(parent);
        allNodes.add(child);

        if (parentOf[child] !== undefined) {
            // Silently discard
            continue;
        } else {
            parentOf[child] = parent;
            if (!children[parent]) children[parent] = [];
            children[parent].push(child);
        }
    }

    // STEP 4 - UNION-FIND GROUPING
    const parentUF = {};
    const find = (i) => {
        if (parentUF[i] === undefined) parentUF[i] = i;
        if (parentUF[i] === i) return i;
        return parentUF[i] = find(parentUF[i]);
    };
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parentUF[rootI] = rootJ;
        }
    };

    allNodes.forEach(n => parentUF[n] = n);
    for (const edge of uniqueEdges) {
        union(edge[0], edge[3]);
    }

    const groups = {};
    allNodes.forEach(n => {
        const root = find(n);
        if (!groups[root]) groups[root] = new Set();
        groups[root].add(n);
    });

    // STEP 6 - HELPER FUNCTIONS
    function buildTree(node) {
        const kids = children[node] || [];
        const kidsObj = {};
        for (const child of kids) {
            kidsObj[child] = buildTree(child)[child];
        }
        return { [node]: kidsObj };
    }

    function calcDepth(node) {
        const kids = children[node] || [];
        if (kids.length === 0) return 1;
        let maxChildDepth = 0;
        for (const child of kids) {
            maxChildDepth = Math.max(maxChildDepth, calcDepth(child));
        }
        return 1 + maxChildDepth;
    }

    // STEP 5 - PER-GROUP PROCESSING
    const hierarchies = [];

    for (const groupKey in groups) {
        const groupNodes = Array.from(groups[groupKey]);

        // A) CYCLE DETECTION
        let hasCycle = false;
        const color = {}; // 0 or undefined = WHITE, 1 = GRAY, 2 = BLACK

        const dfs = (node) => {
            color[node] = 1; // GRAY
            const neighbors = children[node] || [];
            for (const neighbor of neighbors) {
                if (color[neighbor] === 1) {
                    hasCycle = true;
                } else if (color[neighbor] !== 2) {
                    dfs(neighbor);
                }
            }
            color[node] = 2; // BLACK
        };

        for (const node of groupNodes) {
            if (color[node] !== 2) {
                dfs(node);
            }
        }

        // B) FIND TREE ROOT
        let possibleRoots = [];
        for (const node of groupNodes) {
            if (parentOf[node] === undefined) {
                possibleRoots.push(node);
            }
        }

        possibleRoots.sort();
        groupNodes.sort();

        let root;
        if (possibleRoots.length > 0) {
            root = possibleRoots[0];
        } else {
            root = groupNodes[0];
        }

        // C) BUILD OUTPUT
        if (hasCycle) {
            hierarchies.push({ root, tree: {}, has_cycle: true });
        } else {
            hierarchies.push({ root, tree: buildTree(root), depth: calcDepth(root) });
        }
    }

    // Sort hierarchies
    

    // STEP 7 - SUMMARY
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = "";
    let max_depth = 0;

    for (const h of hierarchies) {
        if (h.has_cycle) {
            total_cycles++;
        } else {
            total_trees++;
            if (h.depth > max_depth) {
                max_depth = h.depth;
                largest_tree_root = h.root;
            } else if (h.depth === max_depth) {
                if (largest_tree_root === "" || h.root < largest_tree_root) {
                    largest_tree_root = h.root;
                }
            }
        }
    }

    // STEP 8 - RETURN
    return {
        user_id,
        email_id,
        college_roll_number,
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processData };
