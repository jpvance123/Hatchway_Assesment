let chai = require("chai");
let chaiHttp = require("chai-http");
let server= require("../index");
chai.should();
chai.use(chaiHttp);


describe("First GET Route /api/ping", function(){
    describe("Get Success", function() {
        it("Should return 200", (done) => {
            console.log('Testing /api/ping ROUTE')
            chai.request(server)
                .get("api/ping")
                .end((err, response) => {
                    response.should.have.status(200);
                    reesponse.should.be.a('array');
                    response.length.should.not.be.eq(0);
                done();
                })
        })
    })
})