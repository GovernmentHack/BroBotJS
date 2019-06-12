
export interface linkKey {
  first: string
  second: string
}

export interface LinkNode {
  weight: number, 
  probability: [number, number]
  next: string
}

class Link {
  key: linkKey
  nodes: Map<string, LinkNode>
  weightTotal: number
  dirty: boolean

  constructor(key : linkKey) {
    this.key = key
    this.nodes = new Map<string, LinkNode>()
    this.weightTotal = 0
    this.dirty = false
  }

  addNode(next: string) {
    let newNode : LinkNode = {
      weight: 1,
      probability: [0, 0],
      next
    }
    if(this.nodes.has(next)) {
      newNode = this.nodes.get(next)
      newNode.weight++
      this.weightTotal++
    }
    this.nodes.set(next, newNode)
    this.dirty = true
  }

  updateNodeProbabilities() {
    let counter = 0
    this.nodes.forEach((node) => {
      node.probability[0] = counter
      counter += (node.weight/this.weightTotal)
      node.probability[1] = counter
    })
    this.dirty = false
  }

  getNextLinkKey() : linkKey {
    const keyToReturn = {
      first: this.key.second,
      second: ""
    }
    const diceRoll = Math.random()
    for (let node of this.nodes.values()) {
      if(diceRoll >= node.probability[0] && diceRoll < node.probability[1]) {
        keyToReturn.second = node.next
        return keyToReturn
      }
    }
    return keyToReturn
  }

} 

export default Link