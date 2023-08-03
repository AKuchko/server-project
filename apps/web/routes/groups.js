const express = require('express');

const {Group} = require('../../../models');

const groupsRouter = express.Router();

groupsRouter.get('/', async (req, res) => {
    try {
        console.log('get groups');

        const groups = await Group.find({});
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.json([]);
    }
})

groupsRouter.post('/', async (req, res) => {
    try {
        console.log('post group');
        const group = new Group(req.body);
        res.json(await group.save());
    } catch (error) {
        console.error(error);

        res.json({});
    }
})

groupsRouter.post('/:id', async (req, res) => {
    try {
        console.log('edit group | id ', req.params.id);

        const group = await Group.findOne({ _id: req.params.id });

        console.log(req.body);

        if (group) {
            res.json(await (Object.assign(group, req.body)).save())
        }
        else {
            res.json({})
        }
    } catch (error) {
        console.error(error);

        res.json({});
    }
})

groupsRouter.get('/:id', async (req, res) => {
    try {
        console.log(`get group | id ${req.params.id}`);
        const group = await Group.findOne({ _id: req.params.id });
        res.json(group);
    } catch (error) {
        console.error(error);
        res.json([]);
    }
})

module.exports = {
    groupsRouter,
}