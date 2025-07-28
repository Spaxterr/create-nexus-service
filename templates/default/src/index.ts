import { connect } from 'nats';
import { NexusApp } from 'nexus-nf';
import MathController from './controllers/math.controller';

// Connect to NATS and register the service
const nc = await connect();
const service = await nc.services.add({
    name: '%project_name%',
    version: '1.0.0',
});

// Initialize Nexus app
const app = new NexusApp(nc, service);

// Register the controllers
app.registerController(MathController);
