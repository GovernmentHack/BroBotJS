import Link, { ILinkKey } from "./Link";


class Chain {
  links : Map<ILinkKey, Link>
  
  constructor() {
    this.links = new Map<ILinkKey, Link>()
  }
  
  insertLink(newLinkKey: ILinkKey, next: string) {
    if(this.links.has(newLinkKey)){
      this.links.get(newLinkKey).insertNode(next)
    }
    else {
      const linkToAdd = new Link(newLinkKey)
      linkToAdd.insertNode(next)
      this.links.set(newLinkKey, linkToAdd)
    }
  }
  
  updateProbabilities() {
    this.links.forEach((link) => {
      link.updateNodeProbabilities()
    })
  }

}

export default Chain