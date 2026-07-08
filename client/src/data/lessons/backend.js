// Backend track lessons. Interactive examples run as pure JS in Sandpack's `vanilla` sandbox
// (browser-safe illustrations of server-side logic). The real Express server lives in /server.

// ---------- be-node ----------
const middlewareStarter = `// Express middleware is a chain of (req, res, next) functions.
// Each can read/modify req+res, then call next() to pass control on.
// Here's a tiny runner that mimics how Express walks the chain.

function runChain(middlewares, req, res) {
  let i = 0;
  function next() {
    const mw = middlewares[i++];
    if (mw) mw(req, res, next);   // call the next middleware
  }
  next();
}

const logger = (req, res, next) => { console.log("→", req.method, req.url); next(); };
const auth = (req, res, next) => {
  if (!req.headers.token) { res.status = 401; res.body = "Unauthorized"; return; } // stop the chain
  req.user = "paolo";
  next();
};
const handler = (req, res) => { res.status = 200; res.body = "Hello " + req.user; };

const res = {};
runChain([logger, auth, handler], { method: "GET", url: "/me", headers: { token: "abc" } }, res);
console.log(res); // { status: 200, body: "Hello paolo" }

// Try deleting the token header — auth stops the chain and handler never runs.
`

// ---------- be-rest ----------
const crudStarter = `// A REST resource is just CRUD over a collection. Here's an in-memory "users" API
// expressed as pure handlers — the same shape you'd put in an Express router.

let users = [{ id: 1, name: "Ada" }];
let nextId = 2;

const api = {
  list: () => ({ status: 200, body: users }),                       // GET /users
  get: (id) => {
    const u = users.find((x) => x.id === id);
    return u ? { status: 200, body: u } : { status: 404, body: "Not found" }; // GET /users/:id
  },
  create: (data) => {                                               // POST /users
    const u = { id: nextId++, ...data };
    users.push(u);
    return { status: 201, body: u };                                // 201 Created
  },
  remove: (id) => {                                                 // DELETE /users/:id
    users = users.filter((x) => x.id !== id);
    return { status: 204 };                                         // 204 No Content
  },
};

console.log("POST →", api.create({ name: "Grace" }));
console.log("GET list →", api.list());
console.log("GET 99 →", api.get(99));
console.log("DELETE 1 →", api.remove(1), "→ list:", api.list().body);
`

// ---------- be-auth ----------
const jwtStarter = `// A JWT is three base64url parts: header.payload.signature — separated by dots.
// The payload is NOT encrypted, just encoded. Anyone can read it; only the server can
// VERIFY the signature (with its secret). Let's decode the payload.

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJ1XzEyMyIsIm5hbWUiOiJwYW9sbyIsInJvbGUiOiJhZG1pbiJ9." +
  "signature-would-be-here";

function decodeJwt(jwt) {
  const [header, payload] = jwt.split(".");
  const b64 = (s) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return { header: JSON.parse(b64(header)), payload: JSON.parse(b64(payload)) };
}

console.log(decodeJwt(token));
// { header: { alg:"HS256", typ:"JWT" }, payload: { sub:"u_123", name:"paolo", role:"admin" } }
// Lesson: never put secrets in a JWT payload — it's readable by anyone who has the token.
`

const hashStarter = `// NEVER store raw passwords. Store a SALTED HASH. This toy shows the shape;
// in production use bcrypt or argon2 (slow + salted on purpose).

function toyHash(str) {           // <-- do NOT use in real life
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16);
}

function register(password) {
  const salt = "s" + Math.floor(Math.random() * 1e6); // unique per user
  return { salt, hash: toyHash(salt + password) };    // store salt + hash, never the password
}
function verify(password, record) {
  return toyHash(record.salt + password) === record.hash;
}

const record = register("hunter2");
console.log("stored:", record);
console.log("correct password →", verify("hunter2", record)); // true
console.log("wrong password   →", verify("guess", record));   // false
`

export const backendLessons = [
  // be-node
  {
    id: 'be-what-is-a-server', module: 'be-node', order: 1, kind: 'concept',
    title: 'What a web server does', difficulty: 'easy', tags: ['node', 'http'],
    summary: 'Request in, response out. Node, Express, and the shape of a backend.',
    prompt: `A **server** listens for **HTTP requests** and returns **responses**. **Node.js** runs JavaScript outside the browser; **Express** is a thin framework that maps *(method + path)* to a handler function.`,
    keyTerms: [
      { term: 'HTTP request', def: 'method (GET/POST/…), path (/users/1), headers, and an optional body.' },
      { term: 'HTTP response', def: 'a status code (200/404/500), headers, and a body (often JSON).' },
      { term: 'Route', def: 'A (method, path) pair mapped to a handler, e.g. GET /users → listUsers.' },
      { term: 'Event loop', def: 'Node’s single-threaded loop that handles many connections without blocking, using async I/O.' },
    ],
    explanation: `Node is **single-threaded** but **non-blocking**: while one request waits on the database, the event loop serves others. That’s why you use \`async/await\` and avoid CPU-heavy work on the main thread. Express turns this into ergonomic routing:

\`\`\`js
app.get('/users/:id', (req, res) => res.json(user))
\`\`\`

See this project’s real server in \`server/src/index.js\`.`,
  },
  {
    id: 'be-middleware', module: 'be-node', order: 2, kind: 'utility', template: 'vanilla',
    title: 'Express middleware', difficulty: 'medium', tags: ['express', 'middleware'],
    summary: 'The (req, res, next) chain — logging, auth, parsing all plug in here.',
    prompt: `**Middleware** are functions \`(req, res, next)\` run in order for each request. Each can inspect/modify \`req\`/\`res\`, then call \`next()\` — or stop the chain. Delete the token header and watch \`auth\` short-circuit.`,
    keyTerms: [
      { term: 'Middleware', def: 'A function (req, res, next) in the request pipeline. Order matters.' },
      { term: 'next()', def: 'Passes control to the next middleware. Not calling it ends the request there.' },
      { term: 'Short-circuit', def: 'Responding (e.g. 401) without calling next() — the handler never runs.' },
    ],
    starterCode: { '/index.js': middlewareStarter },
    explanation: `This is exactly how \`app.use(cors())\`, \`app.use(express.json())\`, and auth guards work — a pipeline. Ordering is the classic bug: put \`express.json()\` **before** routes that read \`req.body\`, and put auth **before** the protected handler.`,
  },

  // be-rest
  {
    id: 'be-rest-design', module: 'be-rest', order: 1, kind: 'concept',
    title: 'RESTful API design', difficulty: 'medium', tags: ['rest', 'api'],
    summary: 'Nouns for URLs, verbs for actions, status codes that mean something.',
    prompt: `**REST** models your API as **resources** (nouns) acted on by HTTP **verbs**: \`GET\` (read), \`POST\` (create), \`PUT/PATCH\` (update), \`DELETE\` (remove). URLs name resources: \`/users\`, \`/users/1\`, \`/users/1/orders\`.`,
    keyTerms: [
      { term: 'Resource', def: 'A thing your API exposes, named by a plural noun URL: /users, /orders.' },
      { term: 'Idempotent', def: 'Same request, same effect. GET/PUT/DELETE are idempotent; POST is not.' },
      { term: 'Status code', def: '2xx success, 3xx redirect, 4xx client error (400/401/403/404), 5xx server error.' },
      { term: 'Statelessness', def: 'Each request carries everything the server needs; the server keeps no session memory between calls.' },
    ],
    explanation: `**Cheat sheet:** \`200\` OK, \`201\` Created (return the new resource), \`204\` No Content (after DELETE), \`400\` bad input, \`401\` not authenticated, \`403\` authenticated-but-forbidden, \`404\` not found, \`500\` server bug. Use **nouns not verbs** in URLs (\`POST /users\`, never \`/createUser\`), and version breaking changes (\`/api/v1\`).`,
  },
  {
    id: 'be-crud', module: 'be-rest', order: 2, kind: 'utility', template: 'vanilla',
    title: 'CRUD handlers', difficulty: 'medium', tags: ['rest', 'crud'],
    summary: 'The four operations over a collection, with the right status codes.',
    prompt: `Implement **CRUD** over an in-memory \`users\` collection. Note the status codes: \`201\` on create, \`404\` when missing, \`204\` on delete. Same shape you'd drop into an Express router.`,
    keyTerms: [
      { term: 'CRUD', def: 'Create, Read, Update, Delete — the four basic data operations.' },
      { term: 'Collection vs item', def: '/users is the collection; /users/:id is one item. List vs get.' },
    ],
    starterCode: { '/index.js': crudStarter },
    explanation: `In Express these become \`router.get('/', list)\`, \`router.post('/', create)\`, etc. Real handlers \`await\` the database and wrap logic in \`try/catch\`, forwarding errors with \`next(err)\` to a central error handler — see \`server/src/routes/progress.js\` in this project.`,
  },

  // be-data
  {
    id: 'be-documents', module: 'be-data', order: 1, kind: 'concept',
    title: 'MongoDB documents & collections', difficulty: 'easy', tags: ['mongodb', 'nosql'],
    summary: 'JSON-like documents in collections. Schema-flexible, denormalized by default.',
    prompt: `MongoDB stores **documents** (JSON-like objects) inside **collections** (like tables, but schema-flexible). A user document can nest its addresses instead of joining another table.`,
    keyTerms: [
      { term: 'Document', def: 'A BSON/JSON record with a unique _id. Can nest arrays and objects.' },
      { term: 'Collection', def: 'A group of documents — the rough equivalent of a SQL table.' },
      { term: 'Denormalization', def: 'Embedding related data in one document to avoid joins — trades duplication for read speed.' },
      { term: 'Index', def: 'A data structure that makes queries on a field fast; without one Mongo scans every doc.' },
    ],
    explanation: `**SQL vs NoSQL trade-off:** relational DBs enforce a schema and excel at joins/transactions; MongoDB is flexible and fast for document-shaped reads but pushes consistency concerns to you. Rule of thumb: **embed** data you always read together, **reference** (store an id) data that’s large or shared. Always index fields you query or sort on.`,
  },
  {
    id: 'be-mongoose', module: 'be-data', order: 2, kind: 'concept',
    title: 'Mongoose schemas & models', difficulty: 'medium', tags: ['mongoose', 'odm'],
    summary: 'Add structure and validation on top of MongoDB from Node.',
    prompt: `**Mongoose** is an ODM: you declare a **Schema** (fields, types, validation), compile it into a **Model**, and call methods like \`Model.find()\` / \`Model.create()\`.`,
    keyTerms: [
      { term: 'ODM', def: 'Object-Document Mapper — maps JS objects to MongoDB documents (like an ORM for SQL).' },
      { term: 'Schema', def: 'A Mongoose definition of a document’s fields, types, defaults and validation rules.' },
      { term: 'Model', def: 'A constructor compiled from a schema; the interface you query and save with.' },
    ],
    explanation: `\`\`\`js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
})
export const User = mongoose.model('User', userSchema)
await User.create({ email: 'a@b.com' })
\`\`\`

This project uses exactly this pattern — see \`server/src/models/Progress.js\`, including a **compound unique index** on \`(userId, challengeId)\`.`,
  },

  // be-auth
  {
    id: 'be-hashing', module: 'be-auth', order: 1, kind: 'utility', template: 'vanilla',
    title: 'Password hashing', difficulty: 'medium', tags: ['auth', 'security'],
    summary: 'Never store raw passwords. Store a salted, slow hash.',
    prompt: `Never store a raw password — store a **salted hash**. The toy below shows the *shape* of register/verify. In production use **bcrypt** or **argon2** (deliberately slow, salted for you).`,
    keyTerms: [
      { term: 'Hash', def: 'A one-way function: easy to compute, infeasible to reverse. You compare hashes, never decrypt.' },
      { term: 'Salt', def: 'Random per-user data mixed in before hashing, so identical passwords get different hashes and rainbow tables fail.' },
      { term: 'bcrypt / argon2', def: 'Purpose-built password hashes that are slow (tunable), defeating brute-force at scale.' },
    ],
    starterCode: { '/index.js': hashStarter },
    explanation: `Why *slow* is good: a fast hash (SHA-256) lets attackers try billions/sec. bcrypt/argon2 add a **work factor** you tune upward as hardware improves. Rules: unique salt per user (bcrypt embeds it in the output), never log or return the hash, and compare in constant time.`,
  },
  {
    id: 'be-jwt', module: 'be-auth', order: 2, kind: 'utility', template: 'vanilla',
    title: 'JWTs & sessions', difficulty: 'medium', tags: ['auth', 'jwt'],
    summary: 'Signed tokens vs server sessions — and why the payload is readable.',
    prompt: `A **JWT** is \`header.payload.signature\`, base64url-encoded. The payload is **encoded, not encrypted** — decode it below. The server trusts a token only after **verifying the signature** with its secret.`,
    keyTerms: [
      { term: 'JWT', def: 'JSON Web Token: a self-contained, signed token carrying claims (user id, role, expiry).' },
      { term: 'Signature', def: 'A hash of header+payload with the server’s secret. Proves the token wasn’t tampered with.' },
      { term: 'Session vs token', def: 'Sessions store state server-side (a cookie holds an id). JWTs are stateless (state lives in the token).' },
    ],
    starterCode: { '/index.js': jwtStarter },
    explanation: `Because anyone can *read* a JWT, **never put secrets in the payload**. Store tokens carefully (httpOnly cookies resist XSS; localStorage is convenient but exposed). JWTs are hard to revoke before expiry — keep them short-lived and pair with a refresh token. Server **sessions** are easier to revoke but need shared storage to scale.`,
  },
]
