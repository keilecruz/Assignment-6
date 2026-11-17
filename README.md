# Assignment-6

## Deployed Application (Link from Render)

The Triviabook API can be accessed here:

https://assignment-6-t4ut.onrender.com/triviabook/topics

## Information about the Project
This is a full-stack application with a Node and Express backend connected to a PostgreSQL database hosted on Neon. It allows users to retrieve trivia questions, check answers, filter questions by topic and difficulty, and even add new questions to the database.

## Table : Questions

| Column | Description |
|---|---|
| id | SERIAL PRIMARY KEY |
| topic_id | INTEGER - Foreign key referencing topics(id) |
| question | TEXT - Trivia question |
| answer | TEXT - Correct answer |
| difficulty | VARCHAR - easy, medium, or hard |

## Table : Topics (categories)

| Column | Description |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR - Topic name |

## Set-Up Instructions


1. Clone the repository:

   ```bash
   git clone https://github.com/keilecruz/Assignment-6.git
   ```

2. Navigate to the project folder:

   ```bash
   cd Assignment-6
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root directory and add your Neon PostgreSQL connection string:

   ```env
   DATABASE_URL=your_neon_database_connection_string
   ```

5. Start the server:

   ```bash
   node server.js
   ```

The server will run at:

`http://localhost:3000`

## API Endpoints

All of the API Endpoints use '/triviabook' as the base path.

### 1. GET all Topics

**GET** `/triviabook/topics`

Returns all available trivia topics.

### 2. GET Questions by Topic

**GET** `/triviabook/topic/:topic`

Returns questions belonging to a specific topic.

Optional query parameters:

- `limit` - Limits the number of questions returned.
- `difficulty` - Filters questions by difficulty (easy, medium, or hard).

Example:

`/triviabook/topic/science?limit=2&difficulty=easy`

If the topic does not exist, the API returns a `404 Not Found` status code.

Example error response:

```json
{
    "error": "Topic not found"
}
``` 

### 3. GET a Random Question

**GET** `/triviabook/random`

Returns one randomly selected trivia question without revealing its answer.

### 4. Check for an Answer

**POST** `/triviabook/answer`

Checks whether a submitted answer matches the correct answer.

Request body (JSON):

```json
{
    "id": 1,
    "guess": "Mars"
}
```
If the ID or guess is missing:

```json
{
    "error": "Question id and guess are required"
}
```

Or if the Question ID does not exist:

```json
{
    "error": "Question not found"
}
```

### 5. Adding a New Question

**POST** `/triviabook/question/add`

Adds in a new trivia question to the database. If the topic does not already exist, the API creates it automatically.

Request body (JSON):

```json
{
    "topic": "science",
    "question": "What gas do plants absorb?",
    "answer": "Carbon dioxide",
    "difficulty": "easy"
}
```

If either the topic, question, answer, or difficulty is missing, or if the difficulty is invalid, the API returns a `400 Bad Request` status code with an error message.

Example error response:

```json
{
    "error": "Difficulty must be easy, medium, or hard"
}
```