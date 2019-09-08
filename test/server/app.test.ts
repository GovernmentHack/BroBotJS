import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/server/app'
import sinon, { SinonSandbox, SinonFakeTimers, SinonSpy, SinonStub } from 'sinon'

const typeorm = require("typeorm")
const expect = chai.expect

chai.use(chaiHttp)

describe("app", () => {
  let insertSpy : SinonSpy
  let getManagerStub : SinonStub
  let createQueryBuilderStub : SinonStub
  let findStub : SinonStub
  
  beforeEach(() => {
    insertSpy = sinon.spy()
    createQueryBuilderStub = sinon.stub().returns({
      orderBy: () => {
        return {
          limit: () => {
            return {
              getMany: () => {
                return []
              }
            }
          }
        }
      }
    })
    findStub = sinon.stub().withArgs(0).returns({id: 0, messageLinks: [], triggerMessage: "", messageString: ""})
    getManagerStub = sinon.stub(typeorm, "getRepository").returns({
      insert: insertSpy,
      createQueryBuilder: createQueryBuilderStub,
      find: findStub
    })
  })

  afterEach(() => {
    insertSpy.resetHistory()
    getManagerStub.restore()
  })
  
  describe("index", () => {
    describe("/", () => {
      it("GET", (done) => {
        chai.request(app)
          .get('/')
          .end((err, res) => {
            expect(res).to.be.html
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
      it("GET returns last 10 entries", (done) => {
        chai.request(app)
          .get("/api/messageLog")
          .end((err, res) => {
            expect(createQueryBuilderStub.calledOnce).to.be.true
            expect(res).to.have.status(200)
            expect(res.body).to.eql([])
            done()
          })
      })

      it("GET /:entry returns entry by id", (done) => {

        chai.request(app)
          .get("/api/messageLog/0")
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.eql({id: 0, messageLinks: [], triggerMessage: "", messageString: ""})
            done()
          })
      })
    })
  })

})