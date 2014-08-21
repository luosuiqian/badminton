var cluster = require('cluster');
var os = require('os');

var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork();
    workers[worker.pid] = worker;
  }
} else {
  var app = require('./tsinghuaba');
  app.start();
}

process.on('SIGTERM', function () {
  for (var pid in workers) {
    process.kill(pid);
  }
  process.exit(0);
});

