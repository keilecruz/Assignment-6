// Trivia Routes : This is where we define the routes for our trivia API. 
// Each route corresponds to a specific functionality provided by the triviaController.

const express = require('express');
const router = express.Router();

const triviaController = require('../controllers/triviaController');

router.get('/topics', triviaController.getTopics);

router.get('/topic/:topic', triviaController.getQuestionsByTopic);

router.get('/random', triviaController.getRandomQuestion);

router.post('/answer', triviaController.checkAnswer);

router.post('/question/add', triviaController.addQuestion);

module.exports = router;