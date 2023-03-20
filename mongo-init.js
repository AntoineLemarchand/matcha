db.createUser({
    user: 'root',
    pwd: 'root',
    roles: [
        {
            role: 'readWrite',
            db: 'mydb',
        },
    ],
});

db = new Mongo().getDB("mydb");

db.auth('jeremy', 'root')

db.createCollection('users', { capped: false });
db.createCollection('test', { capped: false });

db.test.insert([
    { "item": 1 },
    { "item": 2 },
    { "item": 3 },
    { "item": 4 },
    { "item": 5 }
]);