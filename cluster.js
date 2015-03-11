var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster) {
  var numCPUs = os.cpus().length;
  var workers = {};
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork();
    console.log('worker ' + worker.process.pid + ' begin');
    workers[worker.process.pid] = 1;
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' end');
    delete workers[worker.process.pid];
    var worker = cluster.fork();
    console.log('worker ' + worker.process.pid + ' begin');
    workers[worker.process.pid] = 1;
  });
  process.on('SIGTERM', function () {
    for (var pid in workers) {
      console.log('worker ' + pid + ' end');
      process.kill(parseInt(pid.toString()));
    }
    process.exit(0);
  });
} else {
  var app = require('./tsba');
  app.start();
}

