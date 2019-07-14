import chai from 'chai'
import chaiHttp from 'chai-http'
import app, {discordBot} from '../../src/server/app'
import Link from '../../src/vocabulary/Link';
import sinon, { SinonSandbox, SinonFakeTimers } from 'sinon';
import { IMessageLogEntry } from '../../src/discordBot/DiscordBot';

const expect = chai.expect

chai.use(chaiHttp)

describe("index", () => {
    describe("/", () => {
        it("GET", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })
    })
})

describe("api", () => {
    let sandbox: SinonSandbox
    let clock: SinonFakeTimers
    const now = new Date()

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers(now.getTime());
    })

    afterEach(() => {
        sandbox.restore();
        clock.restore();
      });

    describe("/messageLog", () => {
        it("GET", (done) => {
            chai.request(app)
                .get("/api/messageLog")
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.eql([])
                    done()
                })
        })

        it("GET /:entry", (done) => {
            const link: Link = new Link({first: "1", second: "2"}, [{weight: 1, probability: [0, 1], next: "3"}], 1)
            discordBot.addMessageLogEntry(
                "1 2 3",
                [link],
                "test")

            const expectedEntry: IMessageLogEntry = {
                messageString: "1 2 3",
                messageLinks: [link],
                triggerMessage: "test",
                timeStamp: new Date()
            }

            chai.request(app)
                .get("/api/messageLog/0")
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.eql(JSON.parse(JSON.stringify(expectedEntry)))
                    done()
                })
        })
    })
})