const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');


const {Server, UserAction, Group} = require('../../../models');

const serversRouter = express.Router();

serversRouter.get('/', async (req, res) => {
  try {
    console.log('get servers');
    const servers = await Server.find({});
    res.json(servers);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

serversRouter.get('/:id', async (req, res) => {
  try {
    console.log('get servers id ', req.params.id);
    let server = await Server.findOne({ _id: req.params.id }).lean()
    const group = await Group.findOne({_id: server.groupId});

    server.groupName = group.name
    res.json(server);
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

serversRouter.post('/', async (req, res) => {
  try {
    console.log('post servers');
    const server = new Server(req.body);
    res.json(await server.save());
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

serversRouter.post('/:id', async (req, res) => {
  try {
    console.log('post servers id ', req.params.id);
    const server = await Server.findOne({
      _id: req.params.id,
    });
    if (server) {
      res.json(await (Object.assign(server, req.body)).save());
    } else {
      res.json({});
    }
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

serversRouter.delete('/:id', async (req, res) => {
  try {
    console.log('delete servers id ', req.params.id);
    await Server.remove({_id: req.params.id});
    res.send({status: 'ok'});
  } catch (err) {
    console.log(err);
    res.status(500).send('');
  }
});

serversRouter.get('/group/:group_id', async (req, res) => {
  try {
    console.log('Get group servers');
    const servers = await Server.find({groupId: req.params.group_id});
    res.json(servers);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
})

serversRouter.get('/:id/start', async (req, res) => {
  try {
    console.log('get start servers id ', req.params.id);
    const server = await Server.findOne({
      _id: req.params.id,
    });
    server.status='started';
    await server.save();
    await UserAction.create({
      serverId: req.params.id,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      user: 'Тестовый пользователь',
      action: 'Пользователь запустил сервер',
    });
    res.json(server);
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

serversRouter.get('/:id/stop', async (req, res) => {
  try {
    console.log('get stop servers id ', req.params.id);
    const server = await Server.findOne({
      _id: req.params.id,
    });
    server.status = 'stoped';
    await server.save();
    await UserAction.create({
      serverId: req.params.id,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      user: 'Тестовый пользователь',
      action: 'Пользователь остановил сервер',
    });
    res.json(server);
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

serversRouter.get('/:id/restart', async (req, res) => {
  try {
    console.log('get restart servers id ', req.params.id);

    const server = await Server.findOne({
      _id: req.params.id
    });

    server.status = 'stoped';
    await server.save();

    server.status = 'started';
    await server.save();

    await UserAction.create({
      serverId: req.params.id,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      user: 'Тестовый пользователь',
      action: 'Пользователь перезапустил сервер',
    });

    res.json(server);
  } catch (error) {
    console.log(error);
    res.json({});
  }
})

module.exports = {
  serversRouter,
};
