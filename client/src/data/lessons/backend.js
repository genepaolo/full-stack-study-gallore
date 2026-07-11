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

// ---------- be-data (aggregation pipeline) ----------
const aggregationStarter = `// MongoDB's AGGREGATION PIPELINE runs documents through stages, each transforming the stream:
//   $match (filter) -> $group (accumulate) -> $sort -> $limit.
// It's just data transformation — so here it is in plain JS. Same shapes, no database needed.
const orders = [
  { _id: 1, customerId: "ada", status: "paid",     total: 30 },
  { _id: 2, customerId: "ada", status: "paid",     total: 20 },
  { _id: 3, customerId: "lin", status: "paid",     total: 50 },
  { _id: 4, customerId: "lin", status: "refunded", total: 15 },
  { _id: 5, customerId: "sam", status: "paid",     total: 10 },
];

// $match — keep only the docs that match (like .filter / a WHERE clause).
function matchPaid(docs) {
  return docs.filter((o) => o.status === "paid");
}

// $group — collapse docs sharing a key into one, accumulating a value ($sum here).
// Returns [{ customerId, revenue }] — the _id of a $group is the key you grouped by.
function revenueByCustomer(docs) {
  const totals = new Map();
  for (const o of docs) totals.set(o.customerId, (totals.get(o.customerId) || 0) + o.total);
  return [...totals].map(([customerId, revenue]) => ({ customerId, revenue }));
}

// The whole pipeline: $match -> $group -> $sort (desc) -> $limit.
function topCustomers(docs, n) {
  return revenueByCustomer(matchPaid(docs))
    .sort((a, b) => b.revenue - a.revenue) // $sort: { revenue: -1 }
    .slice(0, n);                          // $limit: n
}

console.log("paid orders:", matchPaid(orders).length);        // 4 (the refund is dropped)
console.log("revenue:    ", revenueByCustomer(matchPaid(orders)));
console.log("top 2:      ", topCustomers(orders, 2));         // ada 50, lin 50 -> top 2
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
  {
    id: 'be-mongo-crud', module: 'be-data', order: 3, kind: 'concept',
    title: 'CRUD & query operators', difficulty: 'medium', tags: ['mongodb', 'crud', 'queries'],
    summary: 'Create/read/update/delete with query operators ($gt, $in, $regex), projection, and update operators ($set, $inc, $push) — plus upsert.',
    prompt: `Every app is **CRUD** over documents. MongoDB queries are themselves **documents**: \`{ age: { $gt: 21 } }\` reads "age greater than 21". Learn the everyday **query operators** (comparison, membership, logical), **projection** (which fields to return), and the **update operators** (\`$set\`, \`$inc\`, \`$push\`) — these come up constantly and are the same whether you use the driver or Mongoose.`,
    keyTerms: [
      { term: 'insertOne / insertMany', def: 'Create documents. Each gets an `_id` (an ObjectId) if you don’t supply one. Mongoose: `Model.create(doc)`.' },
      { term: 'find / findOne', def: '`find(filter)` returns a cursor of matches; `findOne` returns the first (or null). The filter is a document of field→condition.' },
      { term: 'Comparison operators', def: '`$eq $ne $gt $gte $lt $lte` compare a field; `$in`/`$nin` test membership in an array of values: `{ status: { $in: ["paid","shipped"] } }`.' },
      { term: 'Logical & element operators', def: '`$and`/`$or`/`$not` combine conditions; `$exists` tests a field’s presence; `$regex` matches strings. Multiple keys in one filter are ANDed implicitly.' },
      { term: 'Projection', def: 'Choose returned fields: `find(filter, { name: 1, _id: 0 })` returns only `name`. Fetch less over the wire — the DB analogue of not over-selecting.' },
      { term: 'Update operators', def: '`$set` replaces a field, `$inc` adds to a number, `$push`/`$pull` add/remove array items, `$addToSet` pushes only if absent. Without them a raw doc *replaces* the whole document.' },
      { term: 'Upsert', def: '`updateOne(filter, update, { upsert: true })` updates the match or inserts it if none exists — atomic "create-or-update".' },
    ],
    codeNotes: [
      { label: 'Read with operators + projection', code: `// users 21+, only name & email, newest first\ndb.users.find(\n  { age: { $gte: 21 }, status: { $in: ["active", "trial"] } },\n  { name: 1, email: 1, _id: 0 }\n).sort({ createdAt: -1 }).limit(20);`, note: "The filter and projection are both plain documents." },
      { label: 'Update operators (not whole-doc replace)', code: `db.posts.updateOne(\n  { _id: id },\n  { $inc: { likes: 1 }, $set: { updatedAt: new Date() },\n    $addToSet: { likedBy: userId } }   // no duplicate likers\n);\n// ⚠️ { likes: 1 } WITHOUT $set replaces the ENTIRE document.`, note: "Forgetting $set and replacing the doc is a classic data-loss bug." },
      { label: 'Upsert = create-or-update atomically', code: `db.counters.updateOne(\n  { name: "visits" },\n  { $inc: { value: 1 } },\n  { upsert: true }   // first call inserts { name, value: 1 }\n);`, note: "One atomic op instead of read-then-write (which races)." },
    ],
    explanation: `**Queries are documents describing a shape to match.** \`{ age: { $gt: 21 }, active: true }\`
reads "age > 21 AND active === true" — multiple keys are **implicitly ANDed**. The operator families you'll
use daily: **comparison** (\`$gt\`, \`$gte\`, \`$lt\`, \`$lte\`, \`$ne\`), **membership** (\`$in\`, \`$nin\`),
**logical** (\`$or\`, \`$and\`, \`$not\`), and **element/eval** (\`$exists\`, \`$regex\`). Pair every query with a
**projection** so you return only the fields you need — the database equivalent of not over-fetching, and it
directly cuts payload and enables *covered queries* (indexes lesson).

**Updates are where people get burned.** You almost always want an **update operator**: \`$set\` to change a
field, \`$inc\` to bump a counter, \`$push\`/\`$pull\`/\`$addToSet\` for arrays. If you pass a bare document
(\`{ likes: 1 }\`) instead of \`{ $set: { likes: 1 } }\`, MongoDB **replaces the whole document** — silently
dropping every other field. **Upsert** (\`{ upsert: true }\`) folds create-and-update into one atomic
operation, avoiding a read-then-write race.

**The AI-audit angle:** generated Mongo code frequently (a) forgets \`$set\` and clobbers documents,
(b) builds \`$regex\` filters from unsanitized input (a query-injection / ReDoS risk), and (c) omits
projections and ships whole documents to the client including fields like \`passwordHash\`. Check all three
when reviewing. *Source: [MongoDB Manual — Query & Projection Operators](https://www.mongodb.com/docs/manual/reference/operator/query/),
[Update Operators](https://www.mongodb.com/docs/manual/reference/operator/update/).*`,
  },
  {
    id: 'be-mongo-modeling', module: 'be-data', order: 4, kind: 'concept',
    title: 'Data modeling: embed vs reference', difficulty: 'medium', tags: ['mongodb', 'schema-design', 'nosql'],
    summary: 'The central NoSQL decision: nest related data in one document (embed) or store an id and look it up (reference). Driven by how you read and how data grows.',
    prompt: `The defining MongoDB skill is **schema design**, and it turns on one question: **embed or reference?** Embedding nests related data in a single document (one read, no join); referencing stores an \`_id\` you resolve separately (like a foreign key). The right call is driven by **how you access the data** and **how it grows** — get it wrong and you hit the 16MB document limit or a storm of extra queries.`,
    keyTerms: [
      { term: 'Embedding', def: 'Nesting related data inside the parent document (e.g. a post’s comments as an array). One read gets everything; no join. Best when data is read together and bounded.' },
      { term: 'Referencing', def: 'Storing another document’s `_id` and looking it up separately (Mongoose `ref` + `populate`, or `$lookup`). Best for large, shared, or unbounded data.' },
      { term: 'One-to-few / one-to-many / many-to-many', def: 'Few (a person’s addresses) → embed. Many (a blog’s posts) → reference. Many-to-many (students↔courses) → reference ids on one or both sides.' },
      { term: '16MB document limit', def: 'A single BSON document can’t exceed 16MB. An **unbounded** embedded array (e.g. every event for a user, forever) will eventually blow this — reference instead.' },
      { term: 'Denormalization & duplication', def: 'Embedding/duplicating data for read speed means an update must touch every copy. Trade write complexity for read simplicity — acceptable when reads dominate.' },
      { term: 'populate / $lookup', def: 'Resolve references at read time: Mongoose `.populate("author")` or the aggregation `$lookup` (a left outer join). Convenient, but it’s N+1 / an extra stage — don’t over-reference.' },
    ],
    codeNotes: [
      { label: 'Embed one-to-few (read together, bounded)', code: `// A user with a handful of addresses — always loaded with the user.\n{\n  _id: 1, name: "Ada",\n  addresses: [                 // embedded array, small & bounded\n    { label: "home", city: "LA" },\n    { label: "work", city: "SF" },\n  ],\n}\n// One read, no join. Adding an address = $push.`, note: "Embed data you read together and that won't grow without bound." },
      { label: 'Reference one-to-many / unbounded', code: `// A blog post can have thousands of comments (unbounded) -> reference.\n// posts:    { _id: 10, title: "...", authorId: 1 }\n// comments: { _id: 99, postId: 10, text: "...", userId: 7 }\ndb.comments.find({ postId: 10 }).limit(50); // paginate them`, note: "Unbounded or independently-queried data → its own collection." },
      { label: 'Resolve a reference at read time', code: `// Mongoose:\nPost.findById(id).populate("author");   // fills authorId -> author doc\n// Aggregation ($lookup = left outer join):\n{ $lookup: { from: "users", localField: "authorId",\n             foreignField: "_id", as: "author" } }`, note: "Populate/$lookup are the join you gave up by referencing — use sparingly." },
    ],
    explanation: `**MongoDB has no schema police and no cheap joins, so *you* design for your access
pattern** — this is the skill interviewers probe. The decision tree:

- **Embed** when the related data is **read together**, **owned** by the parent, and **bounded** in size —
  a user's few addresses, an order's line items. One document, one read, no join. Mutate with \`$push\`/\`$set\`.
- **Reference** when the data is **large**, **shared** across parents, **queried on its own**, or
  **unbounded** — a post's comments, a user's activity log. Store an \`_id\`; resolve with \`populate\`/\`$lookup\`
  only when you actually need it.

Two failure modes to name out loud: the **unbounded embedded array** (embedding an ever-growing list until
the document nears the **16MB limit** and every read drags the whole thing), and **over-referencing**
(splitting data you always read together into five collections, then firing five queries — the NoSQL version
of N+1). The guiding rule from MongoDB's own guidance: *favor embedding unless there is a compelling reason
not to* — usually growth, sharing, or independent access.

**Tie to the rest of the stack:** this is the same **denormalization** trade-off as caching (duplicate for
read speed, pay on write) and the same "model for your reads" instinct as designing a **cursor-paginated
feed**. Close an interview answer by stating the access pattern first, then justifying embed-vs-reference
from it. *Source: [MongoDB Manual — Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/),
[Embedded vs References](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/).*`,
  },
  {
    id: 'be-mongo-indexes', module: 'be-data', order: 5, kind: 'concept',
    title: 'Indexes & the ESR rule', difficulty: 'hard', tags: ['mongodb', 'indexes', 'performance'],
    summary: 'Without an index, MongoDB scans every document. Compound-index field order follows ESR (Equality, Sort, Range); explain() proves it.',
    prompt: `An **index** is the single biggest lever on database performance — the same Big-O idea from the algorithms track, applied to data. Without one, a query is an **O(n) collection scan**; with the right one it's an **O(log n)** B-tree lookup. The hard part is **compound indexes**: field order matters, and the rule that gets it right is **ESR — Equality, Sort, Range**.`,
    keyTerms: [
      { term: 'Collection scan (COLLSCAN)', def: 'No usable index → MongoDB reads every document to answer the query. O(n) and it gets slower as data grows. The thing indexes prevent.' },
      { term: 'Index (B-tree)', def: 'A sorted structure mapping field values → document locations, giving O(log n) lookups and free ordering. `_id` is always indexed; you add others.' },
      { term: 'Compound index', def: 'An index on multiple fields, e.g. `{ status: 1, createdAt: -1 }`. Order matters: it supports queries on a **left-to-right prefix** of its fields.' },
      { term: 'ESR rule', def: 'Order compound-index fields as **Equality** first (fields matched by `$eq`/`$in`), then **Sort** fields, then **Range** fields (`$gt`/`$lt`). Follows how the B-tree is traversed.' },
      { term: 'Covered query', def: 'A query answered entirely from the index — the projection asks only for indexed fields, so MongoDB never touches the documents. The fastest kind of read.' },
      { term: 'explain()', def: '`explain("executionStats")` shows the plan: look for **IXSCAN** (good) vs **COLLSCAN** (bad), `totalDocsExamined` vs `nReturned`, and whether a sort was done in memory.' },
      { term: 'Index cost', def: 'Indexes speed reads but slow writes (each insert/update maintains them), use disk, and want to fit in RAM. Index the fields you query/sort on — not every field.' },
    ],
    codeNotes: [
      { label: 'The ESR rule for compound-index order', code: `// Query: status equals, sort by date, price in a range\ndb.orders.find({ status: "paid", price: { $gte: 20 } })\n         .sort({ createdAt: -1 });\n// Index fields in ESR order:\ndb.orders.createIndex({ status: 1, createdAt: -1, price: 1 });\n//                       ^Equality   ^Sort        ^Range`, note: "Equality → Sort → Range. Wrong order = an in-memory sort or a scan." },
      { label: 'Prefix rule: one index serves many queries', code: `// createIndex({ a: 1, b: 1, c: 1 }) supports queries on:\n//   {a}, {a,b}, {a,b,c}  (left-to-right prefixes)\n// but NOT {b} or {c} alone — the leading field must be used.`, note: "Design the compound index around your most important query's prefix." },
      { label: 'Prove it with explain()', code: `db.orders.find({ status: "paid" }).explain("executionStats");\n// win: stage "IXSCAN", totalDocsExamined ≈ nReturned\n// lose: stage "COLLSCAN", totalDocsExamined = whole collection`, note: "Never guess — explain() tells you if the index is actually used." },
    ],
    explanation: `**Indexes are where "it works on my laptop" meets "it times out in production."** Without an
index, MongoDB does a **COLLSCAN** — reads every document — which is fine at 100 docs and fatal at 10 million.
An index is a **B-tree**: sorted, so lookups are **O(log n)** and results can come back already ordered.

**Single-field indexes are easy; compound indexes are the interview topic.** A compound index
\`{ status: 1, createdAt: -1 }\` only helps queries that use a **left-to-right prefix** of its fields (\`status\`,
or \`status\`+\`createdAt\` — never \`createdAt\` alone). To order the fields correctly, use **ESR**:

1. **E — Equality** fields first (matched exactly, \`$eq\`/\`$in\`) — they narrow the tree to a tight range.
2. **S — Sort** fields next — so results come out of the index already ordered (no expensive in-memory sort).
3. **R — Range** fields last (\`$gt\`/\`$lt\`/\`$gte\`) — a range scans a span, so it must come after the parts
   that pin down where to start.

Get ESR wrong and MongoDB either can't use the index for the sort (an **in-memory sort**, capped at 100MB) or
falls back toward a scan. A **covered query** — projection touches only indexed fields — is the fastest read
of all, because the documents are never fetched. And always **verify with \`explain("executionStats")\`**:
\`IXSCAN\` with \`totalDocsExamined ≈ nReturned\` is the win; \`COLLSCAN\` or examining far more docs than you
return is the tell. **The trade-off (say it):** indexes cost write speed, disk, and RAM — index the fields you
filter and sort on, not everything. This is the exact Big-O-in-the-hot-path thinking from the performance
module, at the data layer. *Source: [MongoDB Manual — Indexes](https://www.mongodb.com/docs/manual/indexes/),
[The ESR Rule](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/).*`,
  },
  {
    id: 'be-mongo-aggregation', module: 'be-data', order: 6, kind: 'utility', template: 'vanilla',
    title: 'The aggregation pipeline', difficulty: 'hard', tags: ['mongodb', 'aggregation', 'queries'],
    summary: 'Analytics in the database: stages ($match → $group → $sort → $limit) transform a document stream. The editor implements the pipeline as pure JS.',
    prompt: `When you need **grouping, totals, and analytics** — "revenue per customer", "top posts this week" — you reach for the **aggregation pipeline**: an ordered list of **stages**, each transforming the stream of documents and passing it to the next. The live editor implements the core stages (\`$match\`, \`$group\`, \`$sort\`, \`$limit\`) as **pure JavaScript**, so you can see exactly what each one does.`,
    keyTerms: [
      { term: 'Pipeline & stages', def: 'An array of stages run in order; each takes the previous stage’s output. Order matters — `$match` early shrinks the stream (and can use indexes).' },
      { term: '$match', def: 'Filters documents (same syntax as `find`). Put it first so later stages process fewer docs and it can use an index.' },
      { term: '$group', def: 'Collapses docs sharing a key into one. `_id` is the group key; accumulators build values: `$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`.' },
      { term: '$sort / $limit / $skip', def: 'Order, cap, and page the results — same as their query counterparts, but as pipeline stages (great for "top N").' },
      { term: '$project', def: 'Reshape each document: include/exclude fields, rename, or compute new ones. Like a projection but more powerful.' },
      { term: '$lookup', def: 'A left outer join to another collection — the aggregation way to resolve a reference (the join you gave up by referencing).' },
    ],
    codeNotes: [
      { label: 'A real pipeline (revenue per customer, top 2)', code: `db.orders.aggregate([\n  { $match: { status: "paid" } },                       // filter first\n  { $group: { _id: "$customerId",\n              revenue: { $sum: "$total" } } },          // accumulate\n  { $sort:  { revenue: -1 } },                          // order\n  { $limit: 2 },                                        // top N\n]);`, note: "This is exactly what the editor implements in plain JS." },
      { label: '$group accumulators', code: `{ $group: {\n  _id: "$category",              // group key (the _id of the group)\n  count:   { $sum: 1 },          // count docs\n  revenue: { $sum: "$total" },   // sum a field\n  avg:     { $avg: "$total" },\n  items:   { $push: "$name" },   // collect into an array\n} }`, note: "_id is the key you group by; accumulators fold each group." },
      { label: '$match early = index-friendly & cheap', code: `// ✅ filter, THEN group a small stream\n[{ $match: { createdAt: { $gte: since } } }, { $group: … }]\n// ❌ group everything, then filter — scans the whole collection\n[{ $group: … }, { $match: … }]`, note: "Stage order is a performance decision: shrink the stream early." },
    ],
    starterCode: { '/index.js': aggregationStarter },
    explanation: `**The aggregation pipeline is MongoDB's answer to SQL \`GROUP BY\` / analytics** — and it's
just **data transformation**, which is why the editor can implement it in plain JS with \`filter\`, a \`Map\`,
and \`sort\`. Documents flow through **stages** in order; each reshapes the stream:

- **\`$match\`** — filter (put it **first** so everything downstream is cheaper, and so it can use an index).
- **\`$group\`** — the heart of it: collapse documents that share a key (\`_id: "$customerId"\`) into one,
  building values with **accumulators** (\`$sum\`, \`$avg\`, \`$min\`, \`$max\`, \`$push\`). The editor's
  \`revenueByCustomer\` is exactly a \`$group\` with \`$sum\`.
- **\`$sort\` / \`$limit\`** — order and cap, the classic "top N" tail.
- **\`$project\`** reshapes each document; **\`$lookup\`** joins another collection (the read-time resolution
  of a reference from the modeling lesson).

**Two things interviewers listen for:** (1) **stage order is a performance decision** — \`$match\` and
\`$limit\` early shrink the stream and let indexes help; grouping the whole collection and filtering afterward
scans everything (the same *filter-before-you-work* instinct as \`$match\` vs a late filter, or map/filter
ordering on the front end). (2) It runs **in the database**, next to the data, instead of pulling every
document into Node and reducing there — far less data over the wire. Run the editor: watch \`$match\` drop the
refund, \`$group\` sum per customer, and \`$sort\`+\`$limit\` produce the top 2. *Source:
[MongoDB Manual — Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/),
[\\$group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/).*`,
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

  // ---------- be-graphql (high-level tour) ----------
  {
    id: 'be-gql-what', module: 'be-graphql', order: 1, kind: 'concept',
    title: 'What GraphQL is (vs REST)', difficulty: 'easy', tags: ['graphql', 'api', 'rest'],
    summary: 'A query language for your API: one endpoint, and the client asks for exactly the fields it needs — no over- or under-fetching.',
    prompt: `**GraphQL is "a query language for APIs"** (and a runtime to answer those queries), open-sourced by Facebook. The headline idea: instead of many REST endpoints that each return a **fixed** shape, GraphQL exposes **one endpoint** and lets the **client ask for exactly the fields it wants** — "a client can specify exactly what data it needs." That single move fixes REST's two classic annoyances: **over-fetching** and **under-fetching**. This is a *high-level* tour — enough to hold a confident interview conversation, not a deep implementation.`,
    keyTerms: [
      { term: 'Query language for your API', def: 'GraphQL sits between client and server: the client sends a query describing the shape of data it wants, the server returns JSON in exactly that shape. It’s not a database — it’s an API layer over whatever data sources you have.' },
      { term: 'Single endpoint', def: 'Typically one URL (e.g. `POST /graphql`) handles everything, versus REST’s many resource URLs (`/users`, `/users/1/posts`, …). What you get back is decided by the query, not the URL.' },
      { term: 'Over-fetching', def: 'REST endpoints return a fixed payload, so you often get more than you need (a whole user object when you wanted the name). GraphQL returns only the fields you asked for.' },
      { term: 'Under-fetching (n+1 requests)', def: 'A REST screen often needs several endpoints (user, then their posts, then each post’s comments) — multiple round trips. One GraphQL query can fetch it all at once.' },
      { term: 'Schema as a typed contract', def: 'The API is described by a strongly-typed schema both sides share. It documents what’s available and is validated automatically — a big part of GraphQL’s appeal.' },
    ],
    codeNotes: [
      { label: 'Ask for exactly what you need', code: `# one request, only these fields:\nquery {\n  user(id: 1) {\n    name\n    posts { title }      # nested — no second round trip\n  }\n}`, note: "The response JSON mirrors the query shape: { user: { name, posts: [{title}] } }." },
      { label: 'The REST equivalent (more trips, fixed shapes)', code: `GET /users/1            # returns the WHOLE user (over-fetch)\nGET /users/1/posts      # a second round trip (under-fetch fix)\n// N screens -> N+ endpoints, each a fixed payload`, note: "REST: the URL decides the shape; GraphQL: the query does." },
    ],
    explanation: `**The one-paragraph version to say in an interview:** GraphQL is a query language and runtime for
APIs. Rather than many REST endpoints that each return a fixed JSON shape, you expose a **single endpoint**
and the client sends a **query naming exactly the fields it wants**, nested as deeply as it needs. The server
resolves that and returns JSON in the same shape. Because the client picks the fields, you avoid
**over-fetching** (REST handing you data you didn't want) and **under-fetching** (having to hit several
endpoints to assemble one screen — the "n+1 requests" problem).

**Why teams adopt it:** efficient data-loading for mobile/low-bandwidth (its original motivation at Facebook),
a **strongly-typed schema** that self-documents and validates, and the ability to evolve the API by adding
fields without versioning. **When REST is still fine:** simple CRUD, heavy reliance on HTTP caching/CDNs, file
uploads/downloads, or when you don't want the extra server-side machinery. Interviewers rarely want you to
*build* a GraphQL server on the spot — they want to hear that you understand **what problem it solves and its
trade-offs**. *Sources: [How to GraphQL — Introduction](https://www.howtographql.com/basics/0-introduction/),
[graphql.org](https://graphql.org/).*`,
  },
  {
    id: 'be-gql-schema', module: 'be-graphql', order: 2, kind: 'concept',
    title: 'Schema, queries & mutations', difficulty: 'medium', tags: ['graphql', 'schema', 'resolvers'],
    summary: 'A typed schema defines the data; three operation types use it — Query (read), Mutation (write), Subscription (real-time) — and resolvers return the data per field.',
    prompt: `The heart of GraphQL is the **schema**: a strongly-typed description of your data written in the Schema Definition Language (SDL). Clients then use **three operation types** against it — **Query** (read), **Mutation** (write), and **Subscription** (real-time updates). On the server, **resolvers** are the functions that actually return the data for each field. High-level is enough here — recognize the pieces and how they fit.`,
    keyTerms: [
      { term: 'Schema (SDL)', def: 'The typed contract: `type User { id: ID!, name: String!, posts: [Post!]! }`. `!` means non-null, `[ ]` a list. Both client and server share it, and it’s introspectable (self-documenting).' },
      { term: 'Query (read)', def: 'The read operation — like GET. `query { user(id: 1) { name } }`. Fields can take arguments and nest arbitrarily.' },
      { term: 'Mutation (write)', def: 'The write operation — like POST/PUT/DELETE. `mutation { createPost(title: "Hi") { id } }`. By convention it also returns the changed data.' },
      { term: 'Subscription (real-time)', def: 'A long-lived operation that pushes updates to the client (usually over WebSockets) when events happen — e.g. new chat messages. The third, less-common operation type.' },
      { term: 'Resolver', def: 'A server-side function that returns the value for one field. GraphQL walks the query and calls a resolver per field; a resolver can read a DB, call a REST API, anything.' },
    ],
    codeNotes: [
      { label: 'A tiny schema (SDL)', code: `type User { id: ID!, name: String!, posts: [Post!]! }\ntype Post { id: ID!, title: String! }\n\ntype Query    { user(id: ID!): User }\ntype Mutation { createPost(title: String!): Post }`, note: "Types + the Query/Mutation entry points = the whole API surface." },
      { label: 'Query and mutation in action', code: `query    { user(id: "1") { name posts { title } } }\nmutation { createPost(title: "Hello") { id title } }\n// mutations conventionally return the object they changed`, note: "Same endpoint; the operation keyword says read vs write." },
      { label: 'A resolver returns one field’s data', code: `const resolvers = {\n  Query: { user: (_, { id }) => db.users.find(id) },\n  User:  { posts: (user) => db.posts.byAuthor(user.id) },\n};`, note: "GraphQL calls a resolver per field — which is where the N+1 gotcha (next lesson) comes from." },
    ],
    explanation: `**Three pieces, and they interlock.** (1) The **schema** declares your types and the two/three
root operations. (2) The client sends an **operation**: a **Query** to read, a **Mutation** to change data
(conventionally returning the changed object), or a **Subscription** to receive a live stream of updates over
a persistent connection. (3) On the server, **resolvers** produce the data — GraphQL walks the requested
query tree and calls **one resolver per field**, so a resolver can pull from a database, another service, or a
REST API underneath.

**What to take away:** the schema is the **typed contract** everyone codes against — it's introspectable, so
tools like GraphiQL/Apollo Studio give you autocomplete and live docs for free. You don't need to memorize SDL
syntax for a high-level interview; just be able to say *"types in a schema, Query to read, Mutation to write,
Subscription for real-time, and resolvers fetch each field."* That per-field resolver model is elegant — and
it's exactly what creates the performance gotcha in the next lesson. *Sources:
[graphql.org — Learn](https://graphql.org/learn/),
[Apollo — Resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers/).*`,
  },
  {
    id: 'be-gql-tradeoffs', module: 'be-graphql', order: 3, kind: 'concept',
    title: 'Trade-offs & the N+1 gotcha', difficulty: 'medium', tags: ['graphql', 'performance', 'tradeoffs'],
    summary: 'GraphQL’s flexibility costs you easy HTTP caching and invites the N+1 query problem (fixed with DataLoader) and query-complexity abuse.',
    prompt: `GraphQL isn't free lunch — and interviewers probe whether you know the **trade-offs**. The big three: **caching is harder** than REST, resolvers invite the **N+1 query problem** (solved with **DataLoader**), and a single flexible endpoint means you must guard against **expensive/abusive queries**. Knowing these signals real experience, even at a high level.`,
    keyTerms: [
      { term: 'N+1 query problem', def: 'The classic GraphQL performance bug: a list field runs one query for the list, then one more **per item** (1 + N). A `users { posts }` over 100 users can fire 101 DB queries.' },
      { term: 'DataLoader (batching + caching)', def: 'The standard fix: it "combines loads during a single event-loop tick into a batched request" and "provides a memoization cache" so the same object isn’t loaded twice — created **per request** to avoid cross-request cache leaks.' },
      { term: 'Caching is harder', def: 'REST gets HTTP/CDN caching almost free (GET + URL = cache key). GraphQL usually POSTs to one URL, so you lean on client caches (Apollo/Relay) and server field-caches instead of the HTTP layer.' },
      { term: 'Query complexity / abuse', def: 'Because clients compose their own queries, a deeply nested or huge query can be expensive. Defenses: depth limiting, complexity/cost analysis, timeouts, and persisted queries.' },
      { term: 'No versioning (schema evolution)', def: 'GraphQL avoids `/v2` URLs: you add fields freely and mark old ones `@deprecated` rather than versioning the whole API. A stated benefit, but it puts schema stewardship on you.' },
    ],
    codeNotes: [
      { label: 'The N+1 problem, concretely', code: `query { users { name posts { title } } }\n// naive resolvers:\n//   1 query  -> get all users\n//   N queries -> posts for EACH user (one per user)\n// => 1 + N database round trips`, note: "The per-field resolver model causes this the moment you nest a list." },
      { label: 'DataLoader batches the N into 1', code: `const postLoader = new DataLoader(\n  (userIds) => db.posts.byAuthors(userIds) // ONE batched query\n);\n// resolver: User.posts = (u) => postLoader.load(u.id)\n// new DataLoader PER REQUEST (don't share the cache across users)`, note: "Batches all .load() calls in a tick into one query; memoizes within the request." },
    ],
    explanation: `**Three trade-offs worth naming out loud:**

1. **The N+1 query problem.** GraphQL calls a resolver **per field**, so nesting a list — \`users { posts }\`
   — naively runs 1 query for the users plus **N** more (one per user). The fix is **DataLoader**, which
   **batches** all the per-item loads in one tick into a single query and **caches** repeats within the
   request. Crucially you create a **new DataLoader per request** so one user's cache never leaks into
   another's. Just saying "resolvers can cause N+1; you fix it with DataLoader batching" is a strong signal.
2. **Caching is harder.** REST rides HTTP/CDN caching almost for free (a \`GET\` URL is a natural cache key).
   GraphQL typically \`POST\`s to one endpoint, so that free layer largely goes away — you rely on **client
   caches** (Apollo/Relay normalize by object id) and server-side field caching instead.
3. **A flexible endpoint is an attack surface.** Clients write their own queries, so a maliciously deep or
   broad query can be expensive. Real servers add **depth limiting, query cost/complexity analysis, timeouts,
   and persisted queries.**

Plus a genuine upside to mention: **no version churn** — you evolve the schema by adding fields and
\`@deprecated\`-ing old ones instead of shipping \`/v2\`. **Bottom line for the interview:** GraphQL trades
REST's simplicity and free HTTP caching for precise, typed, client-driven data-fetching — and you pay for that
flexibility with N+1 management, caching effort, and query-abuse defenses. *Sources:
[Apollo — Fetching data / N+1 & DataLoader](https://www.apollographql.com/docs/apollo-server/data/fetching-data/),
[graphql.org](https://graphql.org/learn/).*`,
  },
]
