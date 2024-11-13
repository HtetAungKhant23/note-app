// import { Injectable, Logger } from '@nestjs/common';
// import * as cluster from 'cluster';
// import * as os from 'os';

// const numCPUs = os.cpus().length - 1 || 1;

// const logger = new Logger();

// @Injectable()
// export class ClusterService {
//   static clusterize(callback: any): void {
//     if (cluster.isMaster) {
//       logger.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

//       for (let i = 0; i < numCPUs; i += 1) {
//         cluster.fork();
//       }

//       cluster.on('exit', (worker, code, signal) => {
//         logger.debug(`worker ${worker.process.pid} died`);
//       });
//     } else {
//       callback();
//     }
//   }
// }
