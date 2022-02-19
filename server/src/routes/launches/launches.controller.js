const { getAllLaunches,scheduleNewLaunch,existsLaunchWithId,abortFunctionById } = require('../../models/launches.model');

async function httpGetAllLaunches(req,res){
    return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunch(req,res){
    const launch = req.body;
   
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        
        return res.status(400).json({
            error:"Missing required launch property"
        });
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invalid date"
        })
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res){
    const id = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(id);
    if(!existsLaunch){
        return res.status(404).json({
            error:'Cannot found launch'
        });
    }
    const aborted = await abortFunctionById(id);
    if(!aborted){
        return res.status(400).json({
            error:"Cannot aborted"
        });
    }
    return res.status(200).json(aborted);

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}