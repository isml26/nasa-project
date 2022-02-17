const request = require("supertest");
const app = require("../../loaders/app");

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const res = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});


describe('TEST POST /launches', () => {
    const completeLaunchData = {
        mission: "Kepler Exploration X",
        rocket: "Explore IS1",
        launchDate: "October 5, 2023",
        target: "Kepler-442 b",
    };
    const launchDataWithoutDate = {
        mission: "Kepler Exploration X",
        rocket: "Explore IS1",
        target: "Kepler-442 b",
    };
    const launchDataWithInvalidDate = {
        mission: "Kepler Exploration X",
        rocket: "Explore IS1",
        launchDate: "asdjbksadl",
        target: "Kepler-442 b"
    };
    test('It should respond with 201', async () => {
        const res = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
        const requestDate = new Date(completeLaunchData.launchDate);
        const responseDate = new Date(res.body.launchDate);

        expect(requestDate).toMatchObject(responseDate);
        expect(res.body).toMatchObject(launchDataWithoutDate);

    });

    test('It should catch missing required properties', async() => {
        const res = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
        
        expect(res.body).toStrictEqual({
            error:"Missing required launch property"
        });
    });
    test('It should catch invalid dates', async() => {
        const res = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
    })
});
