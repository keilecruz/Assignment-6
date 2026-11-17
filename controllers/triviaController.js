// Trivia Controller : This file contains the controller functions that handle the logic 
// for each trivia route.

const Trivia = require('../models/triviaModel');

// GET /triviabook/topics
async function getTopics(req, res) {
    try {
        const topics = await Trivia.getTopics();
        res.json(topics);
    } catch (error) {
        console.error('Get topics error:', error);
        res.status(500).json({ error: 'Failed to get topics' });
    }
}

// GET /triviabook/topic/:topic
async function getQuestionsByTopic(req, res) {
    try {
        const { topic } = req.params;
        const { limit, difficulty } = req.query;

        if (limit !== undefined &&
            (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
            return res.status(400).json({
                error: 'Limit must be a positive number'
            });
        }

        if (difficulty &&
            !['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid difficulty'
            });
        }

        const topics = await Trivia.getTopics();

        const topicExists = topics.some(
            t => t.name.toLowerCase() === topic.toLowerCase()
        );

        if (!topicExists) {
            return res.status(404).json({
                error: 'Topic not found'
            });
        }

        const questions = await Trivia.getQuestionsByTopic(
            topic,
            limit ? Number(limit) : null,
            difficulty ? difficulty.toLowerCase() : null
        );

        res.json(questions);

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ error: 'Failed to get questions' });
    }
}

// GET /triviabook/random
async function getRandomQuestion(req, res) {
    try {
        const question = await Trivia.getRandomQuestion();

        if (!question) {
            return res.status(404).json({
                error: 'No questions available'
            });
        }

        res.json(question);

    } catch (error) {
        console.error('Random question error:', error);
        res.status(500).json({
            error: 'Failed to get random question'
        });
    }
}

// POST /triviabook/answer
async function checkAnswer(req, res) {
    try {
        const { id, guess } = req.body;

        if (id === undefined || id === null || guess === undefined) {
            return res.status(400).json({
                error: 'Question id and guess are required'
            });
        }

        if (!Number.isInteger(Number(id)) || Number(id) <= 0 ||
            typeof guess !== 'string') {
            return res.status(400).json({
                error: 'Invalid question id or guess'
            });
        }

        const question = await Trivia.getQuestionById(id);

        if (!question) {
            return res.status(404).json({
                error: 'Question not found'
            });
        }

        const correct =
            guess.trim().toLowerCase() ===
            question.answer.trim().toLowerCase();

        res.json({
            correct,
            answer: question.answer
        });

    } catch (error) {
        console.error('Check answer error:', error);
        res.status(500).json({
            error: 'Failed to check answer'
        });
    }
}

// POST /triviabook/question/add
async function addQuestion(req, res) {
    try {
        const { topic, question, answer, difficulty } = req.body;

        if (!topic || !question || !answer || !difficulty) {
            return res.status(400).json({
                error: 'Topic, question, answer, and difficulty are required'
            });
        }

        if (typeof topic !== 'string' ||
            typeof question !== 'string' ||
            typeof answer !== 'string' ||
            typeof difficulty !== 'string') {
            return res.status(400).json({
                error: 'All fields must be strings'
            });
        }

        if (!topic.trim() || !question.trim() || !answer.trim()) {
            return res.status(400).json({
                error: 'Fields cannot be empty'
            });
        }

        const validDifficulties = ['easy', 'medium', 'hard'];

        if (!validDifficulties.includes(difficulty.toLowerCase())) {
            return res.status(400).json({
                error: 'Difficulty must be easy, medium, or hard'
            });
        }

        await Trivia.addQuestion(
            topic.trim().toLowerCase(),
            question.trim(),
            answer.trim(),
            difficulty.toLowerCase()
        );

        const questions = await Trivia.getQuestionsByTopic(
            topic.trim(),
            null,
            null
        );

        res.status(201).json(questions);

    } catch (error) {
        console.error('Add question error:', error);
        res.status(500).json({
            error: 'Failed to add question'
        });
    }
}

module.exports = {
    getTopics,
    getQuestionsByTopic,
    getRandomQuestion,
    checkAnswer,
    addQuestion
};