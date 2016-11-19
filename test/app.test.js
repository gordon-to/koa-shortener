import test from 'ava';
import request from 'supertest-as-promised';
import appFactory from '../src/app';

test('url to shorturl', async (t) => {
  const url = 'http://test.test';
  const hash = 'somehash';
  let app = request(appFactory(h => url, url => hash).listen())
  let res = await app.post('/s').send({url: url});
  t.is(200, res.status);
  t.true(res.body.shortUrl.indexOf(hash) > 1);
})

test('shorturl to hash', async (t) => {
  const url = 'http://test.test';
  const hash = 'somehash';
  let app = request(appFactory(h => h == hash ? url : null , () => {}).listen())
  let res = await app.get(`/s/${hash}`);
  t.is(301, res.status);
  t.is(url, res.header.location);
})

test('hash not found', async (t) => {
  const url = 'http://test.test';
  const hash = 'somehash';
  let app = request(appFactory(h => null , () => {}).listen())
  let res = await app.get(`/s/${hash}`);
  t.is(404, res.status);
})

test('db error get', async (t) => {
  const url = 'http://test.test';
  const hash = 'somehash';
  let app = request(appFactory(h => {throw new Error('db error')} , () => {}).listen())
  let res = await app.get(`/s/${hash}`);
  t.is(500, res.status);
})

test('db error post', async (t) => {
  const url = 'http://test.test';
  const hash = 'somehash';
  let app = request(appFactory((h) => {url}, url => {throw new Error('db error')}).listen())
  let res = await app.post(`/s`).send({url: url});
  t.is(500, res.status);
})