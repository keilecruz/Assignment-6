// Trivia Model : This file contains the functions that interact with the database to 
// perform CRUD operations related to trivia questions and topics.

const pool = require('../db');

// Get all topics
async function getTopics() {
    const result = await pool.query(
        'SELECT * FROM topics ORDER BY id'
    );

    return result.rows;
}

// GET questions for a topic
async function getQuestionsByTopic(topic, limit, difficulty) {
    let query = `
        SELECT questions.id, topics.name AS topic,
               questions.question, questions.answer,
               questions.difficulty
        FROM questions
        JOIN topics ON questions.topic_id = topics.id
        WHERE LOWER(topics.name) = LOWER($1)
    `;

    const values = [topic];

    if (difficulty) {
        values.push(difficulty);
        query += ` AND questions.difficulty = $${values.length}`;
    }

    query += ' ORDER BY questions.id';

    if (limit) {
        values.push(limit);
        query += ` LIMIT $${values.length}`;
    }

    const result = await pool.query(query, values);

    return result.rows;
}

// GET a random question
async function getRandomQuestion() {
    const result = await pool.query(`
        SELECT questions.id, topics.name AS topic,
               questions.question, questions.difficulty
        FROM questions
        JOIN topics ON questions.topic_id = topics.id
        ORDER BY RANDOM()
        LIMIT 1
    `);

    return result.rows[0];
}

// GET a question by ID
async function getQuestionById(id) {
    const result = await pool.query(
        'SELECT * FROM questions WHERE id = $1',
        [id]
    );

    return result.rows[0];
}

// Adding in a new question
async function addQuestion(topic, question, answer, difficulty) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const topicResult = await client.query(
            `INSERT INTO topics (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [topic]
        );

        const topicId = topicResult.rows[0].id;

        const questionResult = await client.query(
            `INSERT INTO questions
             (topic_id, question, answer, difficulty)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [topicId, question, answer, difficulty]
        );

        await client.query('COMMIT');

        return questionResult.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
}

module.exports = {
    getTopics,
    getQuestionsByTopic,
    getRandomQuestion,
    getQuestionById,
    addQuestion
};