export interface ILinkKey {
  first: string
  second: string
}

export interface ILinkNode {
  weight: number, 
  probability: [number, number]
  next: string
}

const linkKeyToString = (key: ILinkKey) : string => {
  return `${key.first}:${key.second}`
}

class Link {
  key: ILinkKey
  nodes: Map<string, ILinkNode>
  weightTotal: number

  constructor(key : ILinkKey, nodes?: ILinkNode[], weightTotal?: number) {
    this.key = key
    this.nodes = new Map<string, ILinkNode>()
    if(!!nodes) {
      nodes.forEach((node) => {
        this.nodes.set(node.next, node)
      })
    }
    this.weightTotal = !!weightTotal ? weightTotal : 0
  }

  insertNode(next: string) {
    let newNode : ILinkNode = {
      weight: 1,
      probability: [0, 0],
      next
    }
    if(this.nodes.has(next)) {
      newNode = this.nodes.get(next)
      newNode.weight++
    }
    this.weightTotal++
    this.nodes.set(next, newNode)
  }

  updateNodeProbabilities() {
    let counter = 0
    this.nodes.forEach((node) => {
      node.probability[0] = counter
      counter += (node.weight/this.weightTotal)
      node.probability[1] = counter
    })
  }

  getNextLinkKey() : ILinkKey {
    const keyToReturn : ILinkKey = {
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

  toJSON() {
    const key = this.key
    const nodes : ILinkNode[] = []
    const weightTotal = this.weightTotal
    this.nodes.forEach((node) => {
      nodes.push(node)
    })
    return {
      key,
      nodes,
      weightTotal
    }
  }
} 

export default Link
export {linkKeyToString}