import chai from 'chai'
import { Collection, Message } from 'discord.js';
import mockMessageGenerator from './mockMessageGenerator'

const expect = chai.expect

describe("vocabulary", () => {
  let messages = new Collection<string, Message>()
  let messsageGenerator = new mockMessageGenerator() 

  beforeEach(() => {
    let message1 = messsageGenerator.getMessage({cleanContent: "I am a message from someone."})
    let message2 = messsageGenerator.getMessage({cleanContent: "I am a message from someone else."})
    let message3 = messsageGenerator.getMessage({cleanContent: "I got a message from someone."})
    let message4 = messsageGenerator.getMessage({cleanContent: "I got a different message from someone else."})

    messages.set("00000", message1)
    messages.set("00001", message2)
    messages.set("00002", message3)
    messages.set("00003", message4)

  })

  it("builds a link from a message content", () => {
    const expectedLink = {
      
    }
  })
})