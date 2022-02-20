const app = require("./loaders/app");
const { connectDB } = require("./loaders/mongoose");
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require("./models/launches.model");
const PORT = process.env.PORT || 8000 ;


async function startServer(){
    await connectDB();
    await loadPlanetsData();
    await loadLaunchesData();
    app.listen(PORT, ()=>{
        console.log(`App started on ${PORT}`);
    });
};

startServer();


