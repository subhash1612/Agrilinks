const should = require('chai').should()
const expect = require('chai').expect
const supertest = require('supertest')
var server = supertest.agent("http://localhost:3000");

//Example test case

describe("SAMPLE unit test",function(){

    // #1 should return home page
  
    it("should return home page",function(done){
  
      // calling home page api
      server
      .get("/")
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
    });
  
  });