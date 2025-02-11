const express = require('express');
const router = express.Router();
const { addTask, getTasks, updateTask, deleteTask, getTaskById } = require('../controllers/taskController')
const auth = require('../middleware/auth');

router.post('/addTask', auth, addTask)
router.get('/getTasks', auth, getTasks)
router.put('/updateTask/:id', auth, updateTask)
router.delete('/deleteTask/:id', auth, deleteTask)
router.get('/getTaskById/:id', auth, getTaskById)

module.exports = router;