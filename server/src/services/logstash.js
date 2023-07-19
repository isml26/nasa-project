const axios = require("axios")

let logStream = {
    write: function(message, encoding){
      logsArray.push(message);
    },
    sendItToLogstash: async function sendLogsToLogstash(log) {
        try {
          // Define Logstash endpoint
          const logstashEndpoint = 'http://localhost:5044';
      
          // Send logs to Logstash
          const response = await axios.post(logstashEndpoint, log,{});
      
          console.log('Logs sent to Logstash:', response.data);
        } catch (error) {
          console.error('Error sending logs:', error.message);
        }
      }
    
  };

  module.exports = {
    logStream
}