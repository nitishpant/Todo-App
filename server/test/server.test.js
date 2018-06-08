const expect = require('expect');
const request = require('supertest');

const {Todo} = require('./../models/todo');
const {app} = require('./../server');
const {ObjectId} = require('mongodb');

const todos = [{
      _id: new ObjectId(),
      text: 'text 1'
    },{
      _id: new ObjectId(),
      text: 'text 2'
    }];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should not create a new todo', (done) => {
    var text = '';

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

  describe('GET /todos', () => {
    it('should return all todos', (done) => {
      request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done)
    });
  });

  describe('GET /todos/:id', () => {
    it('should return the todo by id', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        //expect(res.body.todo.id).toBe(todos[0]._id.toHexString());
        expect(res.body.todo.text).toBe('text 1');
      })
      .end(done)
    });
  });