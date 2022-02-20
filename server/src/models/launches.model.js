const axios = require("axios");
const launchesDatabase = require('./launches.mongo');
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

const launch = {
    flightNumber: 100, //flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explore IS1', //rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-442 b', // not applicaple
    customers: ['NASA', 'SpaceX'], // payload.customers for each payload
    upcoming: true, // upcoming 
    success: true, // success
};

//saveLaunch(launch);

async function populateLaunches(){
    console.log("Downloading from space-x...")
    const res = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:'rocket',
                    select:{
                        name:1
                    }
                },
                {
                    path:'payloads',
                    select:{
                        customers:1
                    }
                }
            ]
        }
    });
    if(res.status !==200){
        console.log("Error occured while downloading launch data ")
        throw new Error('Launch ata ownload failed')
    }
    const launchDocs = res.data.docs;
    //console.log(launchDocs[2]['payloads'][0]['customers']);
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
    })
        const launch = {
            flightNumber:launchDoc['flight_number'],
            mission:launchDoc['name'],
            rocket:launchDoc['rocket']['name'],
            launchDate:launchDoc['date_local'],
            customers,
            upcoming:launchDoc['upcoming'],
            success:launchDoc['success']
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}


async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
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

async function getAllLaunches(skip,limit) {
    return await launchesDatabase
    .find({})
    .sort('flightNumber')
    .skip(skip)
    .limit(limit);
}


async function loadLaunchesData(){
    const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat'
    });
    if(firstLaunch){
        console.log("Data is already loaded")
        return ;
    }else{
        populateLaunches();
    }
 
}

async function saveLaunch(launch) {
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
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (!planet) {
        throw new Error('No matching planet found!!');
    }

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
    abortFunctionById,
    loadLaunchesData
};