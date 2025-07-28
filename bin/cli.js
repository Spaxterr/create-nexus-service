#! /usr/bin/env node

const { program } = require('commander');
const create = require('../lib/create');
const chalk = require('chalk');

const c = new chalk.Chalk()

program
    .name('create-nexus-service')
    .description('Create a new NexusNF service')
    .argument('[service-name]', 'name of the service')
    .action(async (projectName, options) => {
        try {
            await create(projectName, options);
        } catch (error) {
            console.error(c.red('Error:'), error.message, error.stack ?? '');
            process.exit(1);
        }
    })


program.parse();
