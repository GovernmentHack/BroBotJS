import { SinonSpy } from 'sinon'

export interface iMockMsg {
  reply: SinonSpy,
  channel: iMockChannel,
  mentions:  iMockMentions,
  client: iMockClient,
}

export interface iMockChannel {
  send: SinonSpy,
}

export interface iMockMentions {
  members: iMockMember[]
}

export interface iMockMember {
  id: string,
  nickname: string,
}

export interface iMockClient {
  user: iMockClientUser,
}

export interface iMockClientUser {
  id: string
}