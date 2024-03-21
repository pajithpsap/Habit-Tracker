const express = require('express');
const router = express.Router();
const HomeController = require('../controller/controller.js');

const homeController = new HomeController();
// Render the home page with all habits
router.get('/', (req,res)=>{
    homeController.getHomePage(req,res);
});

// Add a new habit
router.post('/habits', (req,res)=>{
    homeController.addHabit(req,res)
});

// Update a habit (mark as done/not done)
router.patch('/habits/:id', (req,res)=>{
    homeController.updateHabit(req,res);
});

// Delete a habit
router.delete('/habits/:id', (req,res)=>{
    homeController.deleteHabit(req,res);
});

module.exports = router;