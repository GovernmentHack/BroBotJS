import Link, { ILinkKey, linkKeyToString } from "./Link";

const END_PUNCTUATION_MATCHER = /[!?.,()]/g

const getTokensFromString = (sentence: string) : string[] => {
  const wordTokens = sentence.toLowerCase().split(" ")
  const wordAndPunctuationTokens : string[] = []
  wordTokens.forEach((token) => {
    const punctuationIndex = token.search(END_PUNCTUATION_MATCHER)
    if(punctuationIndex !== -1){
      const firstTokenSplit = token.slice(0, punctuationIndex)
      if(!!firstTokenSplit) wordAndPunctuationTokens.push(firstTokenSplit)

      const secondTokenSplit = token.slice(punctuationIndex, punctuationIndex + 1)
      wordAndPunctuationTokens.push(secondTokenSplit)
      
      if(punctuationIndex !== token.length-1) {
        const thirdTokenSplit = token.slice(punctuationIndex+1)
        if(!!thirdTokenSplit) wordAndPunctuationTokens.push(thirdTokenSplit)
      }
    }
    else wordAndPunctuationTokens.push(token)
  })
  return wordAndPunctuationTokens
}

class Chain {
  private links : Map<string, Link>
  private startingLinks : Map<string, Link>
  
  constructor(links? : any[], startingLinks? : any[]) {
    this.links = new Map<string, Link>()
    if(!!links) {
      links.forEach((link) => {
        this.links.set(linkKeyToString(link.key), new Link(link.key, link.nodes, link.weightTotal))
      })
    }
    this.startingLinks = new Map<string, Link>()
    if(!!startingLinks) {
      startingLinks.forEach((link) => {
        this.startingLinks.set(linkKeyToString(link.key), new Link(link.key, link.nodes, link.weightTotal))
      })
    }
  }
  
  insertLink(newLinkKey: ILinkKey, next: string) {
    if(this.links.has(linkKeyToString(newLinkKey))){
      this.links.get(linkKeyToString(newLinkKey)).insertNode(next)
    }
    else {
      const linkToAdd = new Link(newLinkKey)
      linkToAdd.insertNode(next)
      this.links.set(linkKeyToString(newLinkKey), linkToAdd)
    }
  }

  insertStartingLink(newLinkKey: ILinkKey, next: string) {
    if(this.startingLinks.has(linkKeyToString(newLinkKey))){
      this.startingLinks.get(linkKeyToString(newLinkKey)).insertNode(next)
    }
    else {
      const linkToAdd = new Link(newLinkKey)
      linkToAdd.insertNode(next)
      this.startingLinks.set(linkKeyToString(newLinkKey), linkToAdd)
    }
  }

  getLink(key : ILinkKey) : Link {
    return this.links.get(linkKeyToString(key))
  }

  getStartingLink(key : ILinkKey) : Link {
    return this.startingLinks.get(linkKeyToString(key))
  }

  getRandomStartingLink() : Link {
    const randomKeyIndex = Math.floor(Math.random() * Math.floor(this.startingLinks.size - 1))
    const randomKey = [...this.startingLinks.keys()][randomKeyIndex]
    let randomLink = this.startingLinks.get(randomKey)
    return randomLink
  }

  getChainSize() : number {
    return this.links.size + this.startingLinks.size
  }
  
  updateProbabilities() {
    this.links.forEach((link) => {
      link.updateNodeProbabilities()
    })
    this.startingLinks.forEach((link) => {
      link.updateNodeProbabilities()
    })
  }

  parseSentence(sentence: string) {
    const tokens = getTokensFromString(sentence)
    if (tokens.length === 1){
      this.insertStartingLink({first: tokens[0], second: ""}, "")
      return
    }
    if (tokens.length === 2) {
      this.insertStartingLink({first: tokens[0], second: tokens[1]}, "")
      return
    }
    else {
      this.insertStartingLink({first: tokens[0], second: tokens[1]}, tokens[2])
      for (let index = 1; index < tokens.length; index++) {
        if(index + 2 === tokens.length) {
          this.insertLink({ first: tokens[index], second: tokens[index+1] }, "")
        }
        else if(index + 1 === tokens.length) {
          this.insertLink({ first: tokens[index], second: "" }, "")
        }
        else {
          this.insertLink({ first: tokens[index], second: tokens[index+1] }, tokens[index+2])
        }
      }
    }
  }

  getSentence() : {sentence: string, links: Link[]} {
    let currentLink : Link
    let sentence : string
    let links : Link[] = []

    if(this.startingLinks.size === 0) {
      return {
        sentence: "Error: I don't know anything yet...",
        links: []
      }
    }
    currentLink = this.getRandomStartingLink()
    links.push(currentLink)
    sentence = currentLink.key.first
    
    while (!!currentLink && !!currentLink.key.second) {
      const isNotPunctuation = currentLink.key.second.search(END_PUNCTUATION_MATCHER) === -1
      if (isNotPunctuation) sentence += " "
      sentence += currentLink.key.second
      currentLink = this.getLink(currentLink.getNextLinkKey())
      links.push(currentLink)
    }
    return {
      sentence,
      links
    }
  }

  toJSON() {
    const links : any = []
    const startingLinks : any = []

    this.links.forEach((link) => {
      links.push(link.toJSON())
    })
    this.startingLinks.forEach((startingLink) => {
      startingLinks.push(startingLink.toJSON())
    })

    return {
      links,
      startingLinks
    }
  }
}

export default Chain