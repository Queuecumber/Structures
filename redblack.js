// Red-Black Tree

var Node = function (element)
{
    this.left = null;
    this.right = null;
    this.parent = null;

    this.element = element;

    this.color = 'red';
};

// Compare two node's contents guarding against null ('external' or 'leaf') nodes
var nodeComparitor = function (a, b)
{
    a = a === null ? { element: null } : a;
    b = b === null ? { element: null } : b;
    return this(a.element, b.element);
};

var RedBlackTree = function (comparitor)
{
    this.root = null;

    if(comparitor === undefined)
    {
        comparitor = function (a, b)
        {
            if(a < b) return -1;
            if(a > b) return 1;
            if(a === b) return 0;
        };
    }

    this.comparitor = comparitor;
};

// Helper method for anything that needs to find, takes and returns some extra information
var utilityFind = function (node, parentNode, element)
{
    // Node was not found in the tree
    if(node === null)
    {
        return {
            node: null,
            parent: parentNode
        };
    }

    var comparison = this.comparitor(element, node.element);

    // Found an equal node
    if(comparison === 0)
    {
        return {
            node: node,
            parent: parentNode
        };
    }
    else
    {
        // Node is greater, move right
        if(comparison > 0)
        {
            return utilityFind.call(this, node.right, node, element);
        }
        else if(comparison < 0) // Node is smaller, move left
        {
            return utilityFind.call(this, node.left, node, element);
        }
    }
};

// Find an element in the tree
RedBlackTree.prototype.find = function (element)
{
    var findResult = utilityFind.call(this, this.root, null, element);
    return findResult.node;
};

// Get the sibling of a node
var sibling = function (node)
{
    var parent = node.parent;

    if(parent !== null)
    {
        if(node === parent.right)
            return parent.left;
        else if(node === parent.left)
            return parent.right;
    }
};

var trinodeRestructure = function (child)
{
    // This is a messy process, no way around it

    var parent = child.parent;
    var gp = parent.parent; // grandparent has to exist for us to be in this state, though it could be the root

    // List the child, parent, and grandparent in order
    var nodes = [child, parent, gp];
    nodes.sort(nodeComparitor.bind(this.comparitor));

    var a = nodes[0];
    var b = nodes[1];
    var c = nodes[2];

    // List the subtrees in order (any of which could be null)
    var T = [child.left, child.right, // Both of the current nodes subtrees
        sibling(child),  // The parents subtree (that isnt the current node)
        sibling(parent) // The grandparents subtree (that isnt the parent)
    ];
    T.sort(nodeComparitor.bind(this.comparitor));

    // Perform trinode restructuring
    // This rotates the child, parent, and grandparent into a single parent with two children
    // preserving the overall ordering

    // b becomes the new parent node
    b.parent = gp.parent;

    if(gp.parent !== null)
    {
        if(gp.parent.left === gp)
            gp.parent.left = b;
        else
            gp.parent.right = b;
    }

    // a becomes bs left child
    b.left = a;
    a.parent = b;
    a.left = null;
    a.right = null;


    // c becomes bs right child
    b.right = c;
    c.parent = b;
    c.left = null;
    c.right = null;

    // Remove null values from the subtrees
    T = T.filter(function (n) { return n !== null && !n.isNull; });

    // Add the subtrees back in the correct locations
    T.forEach(function (n)
    {
        if(this.comparitor(n.element, b.element) > 0)
        {
            n.parent = c;
            if(this.comparitor(n.element, c.element) > 0)
                c.right = n;
            else
                c.left = n;
        }
        else
        {
            n.parent = a;
            if(this.comparitor(n.element, a.element) > 0)
                a.right = n;
            else
                a.left = n;
        }
    }, this);

    return nodes;
};

// Fix a double-red which could occur after insertion (See the insert function below)
var fixDoubleRed = function (node)
{
    var parent = node.parent;

    // Two base cases for recursive calls
    if(parent === null) // current node is the root
        return;

    if(parent.color !== 'red') // Parent isn't actually red
        return;

    // Problem: both node and parent are red, which is a violation of the red-black tree structure

    // Get the 'uncle' node (sibling of the parent) this will guide the fixup
    var uncle = sibling(parent);

    if(uncle === null || uncle.color !== 'red') // parent is red, uncle is black (or null, null is always black), need to restructure the tree once
    {
        var gp = node.parent.parent; // Get original grandparent in case the root needs updating later

        // This will eliminate the double-red in one trinode restructuring operation
        var nodes = trinodeRestructure.call(this, node);

        var a = nodes[0];
        var b = nodes[1];
        var c = nodes[2];

        // Reset the root if necessary
        if(this.root === gp)
            this.root = b;

        // Recolor the new parent, b, black and its children red
        b.color = 'black';
        a.color = 'red';
        c.color = 'red';
    }
    else // Both parent and uncle are red, recolor recusivly
    {
        // Set parent and uncle to black
        parent.color = 'black';
        uncle.color = 'black';

        // If grandparent isnt the root, set its color to red and recurse to fix a possible
        // problem higher up the tree
        var gp = parent.parent;
        if(gp.parent !== null)
        {
            gp.color = 'red';
            fixDoubleRed.call(this, gp);
        }
    }
};

// Insert a new element
RedBlackTree.prototype.add = function (element)
{
    var node = new Node(element); // Note this is a red node by default

    if(this.root === null) // New root node
    {
        node.color = 'black';
        this.root = node;
    }
    else
    {
        // Standard tree insert
        var findResult = utilityFind.call(this, this.root, null, element);

        var comparison = this.comparitor(element, findResult.parent.element);

        if(comparison > 0)
            findResult.parent.right = node;
        else
            findResult.parent.left = node;

        node.parent = findResult.parent;

        // If the new nodes parent is black, nothing special to do
        if(node.parent.color === 'black')
            return;

        // Otherwise we have to fix a double-red
        fixDoubleRed.call(this, node);
    }
};

var removeExternal = function (node)
{
    var internalChild = node.left === null ? node.right : node.left;

    // We add a 'null placeholder' node here to simplify any following computations
    if(internalChild === null)
    {
        internalChild = new Node(null);
        internalChild.color = 'black';
        internalChild.isNull = true;
    }

    if(node.parent.left === node)
    {
        node.parent.left = internalChild;
        internalChild.parent = node.parent;
    }
    else
    {
        node.parent.right = internalChild;
        internalChild.parent = node.parent;
    }

    return internalChild;
};

var previousInorder = function (node)
{
    // Previous node in an inorder traversal is the rightmost node in the left subtree
    var current = node.left;

    while(current.right !== null)
    {
        current = current.right;
    }

    return current;
};

var swapNodes = function (a, b)
{
    if(a.parent !== null)
    {
        if(a.parent.left === a)
            a.parent.left = b;
        else
            a.parent.right = b;
    }

    if(b.parent !== null)
    {
        if(b.parent.left == b)
            b.parent.left = a;
        else
            b.parent.right = a;
    }

    var tmp = a.parent;
    a.parent = b.parent;
    b.parent = tmp;

    tmp = a.left;
    a.left = b.left;
    b.left = tmp;

    tmp = a.right;
    a.right = b.right;
    b.right = tmp;

    tmp = a.color;
    a.color = b.color;
    b.color = tmp;
};

var fixDoubleBlack = function (child)
{
    var sib = sibling(child);
    var parent = child.parent;

    // First two cases, sibling is black
    if(sib.color === 'black')
    {
        // First case, one of the siblings children is red (remember null nodes are black)
        if((sib.left !== null && sib.left.color === 'red') || (sib.right !== null && sib.right.color === 'red'))
        {
            // Get the red child of the sibling
            var z = (sib.left !== null && sib.left.color === 'red') ? sib.left : sib.right;

            // Do a trinode restructure on z
            var nodes = trinodeRestructure.call(this, z);

            var a = nodes[0];
            var b = nodes[1];
            var c = nodes[2];

            if(this.root === parent)
                this.root = b;

            // Recolor
            b = parent.color;
            a.color = 'black';
            c.color = 'black';

            child.color = 'black';
        }
        else // Second case, both children are black
        {
            // (Possibly) Recursive recoloring
            child.color = 'black';
            sib.color = 'red';

            if(parent.color === 'red')
            {
                parent.color = 'black';
            }
            else
            {
                if(this.root !== parent)
                {
                    parent.color = 'double-black'
                    fixDoubleBlack.call(this, parent);
                }
            }
        }
    }
    else // Third case, sibling itself is red
    {
        // Adjustment operation (type of restructuring)
        var z;
        if(sib === parent.right)
            z = sib.right;
        else
            z = sib.left;

        // Restructure and recolor
        trinodeRestructure.call(this, z);

        sib.color = 'black';
        parent.color = 'red';

        // Note: we haven't actually fixed the double black, just rearranged stuff to make it easier
        // so now we try to fix it again on the same node (this will always be possible with case 1 or 2)
        fixDoubleBlack.call(this, child);
    }
};

// Remove an existing element
RedBlackTree.prototype.remove = function (element)
{
    var node = this.find(element);

    if(node !== null)
    {
        // If the node has no 'external' children, swap it with the external node following it in an inorder traversal
        if(node.left !== null && node.right !== null)
        {
            var swappable = previousInorder(node);
            swapNodes(swappable, node);

            if(this.root === node) // make sure the root is set correctly
                this.root = swappable;
        }

        var replacement = removeExternal(node);

        if(this.root === node) // make sure the root is set correctly
            this.root = replacement;

        // In either case, we might need to fix up the tree
        // If the node was red, its replacement is red, or its replacement is the new root, set it to black and we're done
        if(node.color === 'red' || replacement.color === 'red' || this.root === replacement)
        {
            replacement.color = 'black';
        }
        else
        {
            // Otherwise we have a 'double black' problem
            replacement.color = 'double-black';
            fixDoubleBlack.call(this, replacement);
        }

        // Clean up a possible null placeholder node
        if(replacement.isNull)
        {
            if(replacement.parent.left === replacement)
                replacement.parent.left = null;
            else if(replacement.parent.right === replacement)
                replacement.parent.right = null;
        }

        // Clear out the nodes positional information
        node.parent = node.left = node.right = null;
    }

    return node;
};

RedBlackTree.prototype.InorderIterator = function ()
{
    var stack = [];
    var current = this.root;

    while(current !== null)
    {
        stack.push(current);
        current = current.left;
    }

    if(stack.length > 0)
        current = stack.pop();

    return {
        current: current,

        next: function ()
        {
            this.current = this.current.right;

            while(this.current !== null)
            {
                stack.push(this.current);
                this.current = this.current.left;
            }

            if(stack.length > 0)
                this.current = stack.pop();
        },

        hasNext: function ()
        {
            return !(stack.length === 0 && this.current === null);
        }
    };
};

RedBlackTree.prototype.PreorderIterator = function ()
{
    var stack = [];

    if(this.root !== null)
    {
        if(this.root.right !== null)
            stack.push(this.root.right)

        if(this.root.left !== null)
            stack.push(this.root.left);
    }

    return {
        current: this.root,

        next: function ()
        {
            if(stack.length > 0)
            {
                this.current = stack.pop();

                if(this.current.right !== null)
                    stack.push(this.current.right);

                if(this.current.left !== null)
                    stack.push(this.current.left);
            }
            else
            {
                this.current = null;
            }
        },

        hasNext: function ()
        {
            return stack.length > 0 || this.current !== null;
        }

    };
};

RedBlackTree.prototype.PostorderIterator = function ()
{
    var stack = [];

    current = this.root;

    while(current !== null)
    {
        if(current.right !== null)
            stack.push(current.right);

        stack.push(current);
        current = current.left;
    }

    while(true)
    {
        current = stack.pop();

        if(current.right !== null && current.right == stack[stack.length - 1])
        {
            var top = stack.pop();
            stack.push(current);
            current = top;

            while(current !== null)
            {
                if(current.right !== null)
                    stack.push(current.right);

                stack.push(current);
                current = current.left;
            }
        }
        else
        {
            break;
        }
    }

    return {
        current: current,

        next: function ()
        {
            while(true)
            {
                if(stack.length > 0)
                {
                    this.current = stack.pop();

                    if(this.current.right !== null && this.current.right == stack[stack.length - 1])
                    {
                        var top = stack.pop();
                        stack.push(this.current);
                        this.current = top;

                        while(this.current !== null)
                        {
                            if(this.current.right !== null)
                                stack.push(this.current.right);

                            stack.push(this.current);
                            this.current = this.current.left;
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    this.current = null
                    break;
                }
            }
        },

        hasNext: function ()
        {
            return !(stack.length === 0 && this.current === null);
        }
    };
};

module.exports = RedBlackTree;
