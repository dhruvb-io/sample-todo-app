# Todo App Learning Notes

This repository contains a small full-stack Todo application. It is useful for learning how a browser interface, an HTTP API, application logic, and a database work together.

This document is a review of what has been built so far. It intentionally describes the current code, including unfinished parts and known mismatches, so it can be used as a reliable revision guide later.

## 1. Project Timeline

The Git history shows these milestones:

| Commit | Date | What it represents |
| --- | --- | --- |
| `aec8c6d` | 2026-09-10 | Initial repository setup |
| `2dfdf00` | 2026-09-11 | Components were added |
| `d6475d4` | 2026-09-11 | React frontend was added |
| `49e6ad2` | 2026-09-15 | Backend section was updated |

The project is split into two independent Node.js projects:

```text
sample-todo-app/
  todo-backend/     Express API and MongoDB access
  todo-frontend/    React browser application
  README.md         This learning and revision guide
```

## 2. What the Application Is Supposed to Do

The basic workflow is:

1. A user types a todo in the React form.
2. React sends an HTTP `POST` request to the backend.
3. Express receives the request and chooses the matching route.
4. The controller reads the request body and creates a Mongoose document.
5. Mongoose saves the document in MongoDB.
6. The backend returns the saved todo as JSON.

The backend also has a `GET` endpoint that reads all todos from MongoDB and returns them to a client.

## 3. Backend Concepts

### 3.1 Node.js and CommonJS

The backend runs JavaScript outside the browser using Node.js. Its `package.json` contains `"type": "commonjs"`, so files use:

```js
const express = require("express")
module.exports = app
```

`require` imports another module. `module.exports` makes a value available to other files. Splitting the application into modules keeps each file responsible for one concern.

### 3.2 Express Application and Middleware

The backend application is created in `todo-backend/server.js`.

- `express()` creates the application object.
- `cors()` allows a browser frontend running on another origin, such as port `3000`, to call the API on port `3001`.
- `bodyParser.json()` and `express.json()` parse JSON request bodies into `req.body`.
- `app.use('/api', todoRoutes)` mounts all todo routes below the `/api` prefix.

Middleware is code that runs during the request/response process. It can parse data, authenticate users, log requests, or handle errors before the route handler runs.

### 3.3 Server Startup

`todo-backend/start.js` is the executable entry point. It:

1. Imports the Express app.
2. Imports the database connection function.
3. Uses `process.env.PORT` if present, otherwise port `3001`.
4. Starts the MongoDB connection.
5. Starts listening for HTTP requests.

`server.js` defines the app without starting it. This is important for tests because Supertest can import the app directly without opening a real network port.

### 3.4 Routes

`todo-backend/routes/todoRoutes.js` maps HTTP methods and paths to controller functions:

| Method | URL | Handler | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/get-todo` | `getTodos` | Return all todos |
| `GET` | `/api/get-todos` | `getTodos` | Alias for the same operation |
| `POST` | `/api/add-todo` | `addTodo` | Create one todo |
| `DELETE` | `/api/delete-todo/:id` | `deleteTodo` | Delete one todo by ID |

An HTTP method describes the kind of operation. `GET` reads data, while `POST` submits data to create something new.

### 3.5 Controller Layer

`todo-backend/controllers/todoController.js` contains the application behavior.

The `getTodos` controller calls `Todo.find()`, waits for the database promise with `await`, and sends the result with status `200`.

The `addTodo` controller reads a title, constructs a `Todo`, calls `.save()`, and returns the saved document. The `try/catch` blocks convert unexpected failures into an HTTP `500` response.

The response object is sent as JSON. JSON is a text-based data format commonly used to exchange JavaScript-like objects between a frontend and a backend.

### 3.6 Mongoose Model and Schema

`todo-backend/models/todoModel.js` defines the shape of a todo:

| Field | Type | Current rule |
| --- | --- | --- |
| `title` | String | Required |
| `completed` | Boolean | Defaults to `false` |
| `createdAt` | Date | Gets a default date |
| `completedAt` | Date | Optional |

Mongoose is an Object Data Modeling library for MongoDB. A schema describes expected fields and types. A model, created from that schema, provides methods such as `find()` and `save()`.

MongoDB stores records as documents. A newly saved document also receives an `_id`, which uniquely identifies it.

### 3.7 Database Connection

`todo-backend/db.js` calls `mongoose.connect(process.env.MONGO_URI)`. The connection string is read from an environment variable so a secret or machine-specific URL does not need to be committed to source control.

The `.gitignore` file excludes `.env` files. Create a local `todo-backend/.env` file with a MongoDB connection string before starting the real backend:

```env
MONGO_URI=mongodb://127.0.0.1:27017/todo-app
PORT=3001
```

This assumes MongoDB is running locally. A MongoDB Atlas connection string can be used instead.

### 3.8 Logging

`todo-backend/utils/logger.js` configures Winston. Logs are written to the console and to `combined.log`. Logging helps show what the server is doing without stopping the program in a debugger.

The logger has an `info` level by default. Error messages are recorded when database operations fail.

## 4. Frontend Concepts

### 4.1 React Entry Point

`todo-frontend/src/index.js` is the browser entry point. `ReactDOM.createRoot` connects React to the HTML element with `id="root"` in `public/index.html`.

`<React.StrictMode>` enables extra development checks. It does not change the production build.

### 4.2 Components

React applications are built from components, which are reusable functions that return JSX.

- `App.js` is the top-level component.
- `AddTodo.js` contains the todo input and submit button.
- `App.js` renders `<AddTodo />`.

JSX looks like HTML but is written inside JavaScript. It lets a component describe the browser UI declaratively: the component says what the UI should look like for the current state.

### 4.3 State and Controlled Inputs

`AddTodo.js` uses `useState`:

```js
const [todo, setTodo] = useState('This is a new state')
```

State is data owned by a component. `todo` is the current value and `setTodo` changes it. When state changes, React renders the component again.

The input is controlled because its `value` comes from React state and its `onChange` handler updates that state. This keeps the browser input and the React value synchronized.

### 4.4 Events and Fetch

When the form is submitted, `handleSubmit` receives the browser event. `e.preventDefault()` stops the browser's normal full-page form submission.

The `fetch` call sends an asynchronous HTTP request:

- URL: `http://localhost:3001/api/add-todo`
- Method: `POST`
- Header: says the body is JSON
- Body: serializes JavaScript data with `JSON.stringify`

`async` and `await` make the asynchronous request easier to read. The `try/catch` handles network-level failures.

## 5. Testing Concepts

### 5.1 Unit Tests

`todo-backend/__tests__/todoController.test.js` tests controller functions in isolation. The real Mongoose model is mocked, so these tests focus on controller behavior rather than requiring a live database.

`jest.fn()` creates fake functions. `mockResolvedValue` simulates a successful promise, while `mockRejectedValue` simulates a rejected promise. This makes success and failure paths testable and repeatable.

### 5.2 Integration Tests

`todo-backend/__tests__/integration/todoApi.test.js` tests the complete API path. It uses:

- Supertest to send HTTP requests to the Express app.
- MongoDB Memory Server to provide a temporary database.
- Mongoose to connect the application model to that temporary database.

An integration test checks that routes, controllers, models, and database behavior work together. It is broader than a unit test.

### 5.3 Frontend Tests

The frontend uses Jest and React Testing Library. `setupTests.js` loads DOM matchers such as `toBeInTheDocument()`.

The current generated `App.test.js` still searches for the original Create React App text, but `App.js` now renders the todo form. That test should be updated to assert the actual todo UI.

## 6. How to Run the Project

Install dependencies separately in each project:

```bash
cd todo-backend
npm install

cd ../todo-frontend
npm install
```

Start MongoDB, create `todo-backend/.env`, then use separate terminal windows:

```bash
# Terminal 1
cd todo-backend
npx nodemon start.js
```

```bash
# Terminal 2
cd todo-frontend
npm start
```

The frontend normally opens at `http://localhost:3000`. The backend listens at `http://localhost:3001`.

Use `start.js` for the backend startup command. `server.js` creates and exports the Express app for tests, but it does not call `app.listen()`, so running `npx nodemon server.js` exits without starting an API server.

Useful commands:

```bash
# Backend tests
cd todo-backend
npm test

# Backend tests with automatic restart while editing
npm run dev

# Frontend tests
cd ../todo-frontend
npm test

# Frontend production build
npm run build
```

## 7. Current Known Gaps

These are the next items to understand or fix. They are recorded here so later work can be compared with the current baseline.

1. **Frontend request field mismatch:** `AddTodo.js` sends `{ todo }`, but `addTodo` reads `req.body.title`. The frontend and backend should agree on one field name, most likely `{ title: todo }`.
2. **No frontend todo list:** the frontend currently only renders the add form. It does not fetch or display saved todos.
3. **No completion workflow:** there is a `completed` field in the schema, but no route or UI updates it.
4. **Generated frontend test is stale:** `App.test.js` expects the removed "learn react" link.
5. **Error responses are intentionally generic:** the API hides the underlying error from the client, which is safer, but it makes debugging from the client harder. Server logs provide the detailed error.
6. **Input validation is minimal:** an empty or whitespace-only title is not explicitly rejected by the controller.
7. **Database startup is not awaited:** `start.js` starts listening immediately after calling `connectDB()`. A production-ready version would handle a failed connection before accepting requests.
8. **Duplicate JSON middleware:** both `bodyParser.json()` and `express.json()` are registered. One JSON parser is enough.
9. **Date default can be improved:** `createdAt` uses `default: Date.now()`. Using `default: Date.now` lets Mongoose evaluate the function separately for each new document.

## 8. Suggested Learning Order

1. Read `todo-frontend/src/components/AddTodo.js` and understand state, events, and `fetch`.
2. Follow the request into `todo-backend/routes/todoRoutes.js`.
3. Read `todoController.js` to see how the request becomes a database operation.
4. Read `todoModel.js` and compare the schema with the JSON returned by the API.
5. Run the unit tests, then the integration tests, and compare what each one proves.
6. Fix the `todo` versus `title` mismatch and update the frontend test.
7. Add a GET request in the frontend to display saved todos.

The most important full-stack idea is that every layer must agree on the contract: the frontend field name, route URL, HTTP method, controller logic, schema fields, and response shape all need to match.