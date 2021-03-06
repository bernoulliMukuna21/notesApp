import { app } from '../app';
import debug from 'debug';
import * as http from 'http';
import dotenv from 'dotenv';
import log from '../logger/index';
import { dbConnection } from '../database/connection';

debug('Personalnotes:server');
dotenv.config();

console.log('Db connection: ', dbConnection._connectionString);

/**
 * Get port from environment and store in Express
*/
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server
*/
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val: string){
    var port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }

    if(port >= 0) {
        return port;
    }

    return false
}


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        log.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        log.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
}

  /**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  if(dbConnection._connectionString.includes('notes-test'))
            throw new Error('notes-test DB must not be used. Check database connection file!') 
  else{
    var addr = server.address();
    if (addr){
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        log.debug('Listening on ' + bind);
    } 
  }  
}
  