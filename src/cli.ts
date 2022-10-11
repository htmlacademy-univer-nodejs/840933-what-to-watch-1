#!/usr/bin/env node

import VersionCommand from './cli-command/version-command.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command.js';

const cliInstance = new CLIApplication();

cliInstance.registerCommands([
  new HelpCommand, new VersionCommand,
  new ImportCommand, new GenerateCommand
]);
cliInstance.processCommand(process.argv);
