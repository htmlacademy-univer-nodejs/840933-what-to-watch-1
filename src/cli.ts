#!/usr/bin/env node

import 'reflect-metadata';

import { VersionCommand } from './cliCommand/versionCommand.js';
import { HelpCommand } from './cliCommand/helpCommand.js';
import { ImportCommand } from './cliCommand/importCommand.js';
import { CLIApplication } from './app/cliApplication.js';
import { GenerateCommand } from './cliCommand/generateCommand.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
  new GenerateCommand(),
]);
myManager.processCommand(process.argv);
