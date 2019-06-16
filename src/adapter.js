const adapter = {
  isTag(node){
  	return node.type == 'component' || (node.type == 'element' && node.detail.nodeType === 1);
  },

  getChildren(node){
    return node.children.reduce((list, o) => list.concat(o.type == 'block' ? adapter.getChildren(o) : o), [])
  },

  getParent(node){
    let result = node.parent
    while (result && result.type == 'block')
      result = result.parent

    return result
  },

  removeSubsets(nodeList) {
  	let idx = nodeList.length, node, ancestor, replace;

  	// Check if each node (or one of its ancestors) is already contained in the
  	// array.
  	while(--idx > -1) {
  		node = ancestor = nodeList[idx];

  		// Temporarily remove the node under consideration
  		nodeList[idx] = null;
  		replace = true;

  		while(ancestor) {
  			if(nodeList.indexOf(ancestor) > -1) {
  				replace = false;
  				nodeList.splice(idx, 1);
  				break;
  			}
  			ancestor = adapter.getParent(ancestor)
  		}

  		// If the node has been found to be unique, re-insert it.
  		if(replace) {
  			nodeList[idx] = node;
  		}
  	}

  	return nodeList;
  },

	existsOne (test, nodeList) {
		return nodeList.some(node => adapter.isTag(node) && (test(node) || adapter.existsOne(test, adapter.getChildren(node))));
	},

	getSiblings (node){
		let parent = adapter.getParent(node);
		return parent ? adapter.getChildren(parent) : [node];
	},

	getAttributeValue (node, name){
    return node.type == 'element'
      ? name in node.detail.attributes && node.detail.attributes[name].nodeValue
      : node.type == 'component'
      ? node.detail.$$.ctx[name]
      : undefined
	},

	hasAttrib (node, name){
		return node.type == 'element'
      ? name in node.detail.attributes
      : node.type == 'component'
      ? name in node.detail.$$.ctx
      : false;
	},

	getName (node){
		return node.tagName;
	},

	findOne(test, list){
    for (const node of list) {
      if (test(node)) return node

      const result = adapter.findOne(test, adapter.getChildren(node))
      if (result) return result
    }

    return null
	},

	findAll(test, nodeList){
    let result = []
    for (const node of nodeList) {
      if (test(node)) result.push(node)

      result = result.concat(adapter.findAll(test, adapter.getChildren(node)))
    }

    return result
	},

	getText(node) {
    if (node.type == 'text') return node.detail.nodeValue

    return adapter.getChildren(node).map(adapter.getText).join('')
	}
}

export default adapter
