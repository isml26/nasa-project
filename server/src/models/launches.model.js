const launchesDatabase = require('./launches.mongo');
const planets = require("./planets.mongo")
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explore IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'SpaceX'],
    upcoming: true,
    success: true,
};

//saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDatabase.find({});
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (!planet) {
        throw new Error('No matching planet found!!');
    }

    await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        },
        launch, {
            upsert: true
        }
    );
}

async function abortFunctionById(id) {
    const aborted = await launchesDatabase.findOneAndUpdate({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    },{
        new:true
    }
    );
    return aborted;
}

async function scheduleNewLaunch(launch) {
    const flightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'SpaceX'],
        flightNumber,

    });
    await saveLaunch(newLaunch);
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortFunctionById
};