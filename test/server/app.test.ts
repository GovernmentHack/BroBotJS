import chai from 'chai'
import chaiHttp from 'chai-http'
import app, {discordBot} from '../../src/server/app'

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