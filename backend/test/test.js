import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('splitwise App', () => {
  // login with correct password
  describe('POST /api/login', () => {
    it('it should get auth token', (done) => {
      const data = {
        userEmail: 'eddie@gmail.com',
        userPassword: 'fullstack',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(data)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('token');
          done();
        });
    });
  });
  //login with incorrect password
  describe('POST /api/login', () => {
    it('it throws password incorrect error because', (done) => {
      const data = {
        userEmail: 'eddie@gmail.com',
        userPassword: 'fulstack',
      };
      chai
        .request(app)
        .post('/api/login')
        .send(data)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('errors');
          done();
        });
    });
  });

  //get group activity without token
  describe('GET /api/groups', () => {
    it('it should throw error because of trying to access groups page without token', (done) => {
      chai
        .request(app)
        .get('/api/groups/6081bf4e96b23811480210cc')

        .end((err, response) => {
          response.should.have.status(401);
          response.text.should.eq('Unauthorized');
          // expect(res.body).to.equal('wrong header');
          done();
        });
    });
  });

  //get group with token
  describe('GET /api/groups', () => {
    it('it should show summary of the authorized user', (done) => {
      chai
        .request(app)
        .get('/api/groups/6081bf4e96b23811480210cc')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZWRkaWVAZ21haWwuY29tIiwiaWQiOiI2MDgxYmYyMGRhNjUwYzE1MmRiMmZmZmMifSwiaWF0IjoxNjE5MTM4NzIyLCJleHAiOjE2MTk0OTg3MjJ9.sHWVuecH-HKvq2zzDcReIsPd8VNhjcZzz0NHbO0YBQw'
        )
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('groupExpense');
          done();
        });
    });
  });

  //post leave group
  describe('POST /api/my-groups/leave-group', () => {
    it('it should throw error when the user leaves the group without settling all the balances', (done) => {
      const data = {
        groupID: '6081bf4e96b23811480210cc',
        groupName: 'Team Event',
      };
      chai
        .request(app)
        .post('/api/my-groups/leave-group')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZWRkaWVAZ21haWwuY29tIiwiaWQiOiI2MDgxYmYyMGRhNjUwYzE1MmRiMmZmZmMifSwiaWF0IjoxNjE5MTM4NzIyLCJleHAiOjE2MTk0OTg3MjJ9.sHWVuecH-HKvq2zzDcReIsPd8VNhjcZzz0NHbO0YBQw'
        )
        .send(data)
        .end((err, response) => {
          response.should.have.status(500);
          response.body.should.have.property('errors');
          done();
        });
    });
  });

  // create new group
  describe('POST /api/new-group', () => {
    it('it should throw error if group name is not unique', (done) => {
      const data = {
        groupName: 'Team Event',
      };
      chai
        .request(app)
        .post('/api/new-group')
        .send(data)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZWRkaWVAZ21haWwuY29tIiwiaWQiOiI2MDgxYmYyMGRhNjUwYzE1MmRiMmZmZmMifSwiaWF0IjoxNjE5MTM4NzIyLCJleHAiOjE2MTk0OTg3MjJ9.sHWVuecH-HKvq2zzDcReIsPd8VNhjcZzz0NHbO0YBQw'
        )
        .end((err, response) => {
          response.should.have.status(500);
          response.body.should.have.property('errors');
          done();
        });
    });
  });

  // Update profile
  describe('POST /api/me', () => {
    it('it should throw error if profile information is not valid', (done) => {
      const data = {
        userName: '',
      };
      chai
        .request(app)
        .post('/api/me')
        .send(data)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA4MWY3N2ZkYTY1MGMxNTJkYjJmZmZlIn0sImlhdCI6MTYxOTEzMDIzOSwiZXhwIjoxNjE5NDkwMjM5fQ.z-YcujfVTnpOiie_UY98cxlsqWDqsYjTM7oxlj9f6sI'
        )
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('errors');
          done();
        });
    });
  });
});
