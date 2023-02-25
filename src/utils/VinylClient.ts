import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "src/Command";

export default class VinylClient extends Client {
  commands: Collection<string, Command>; // use correct type :)
  constructor(options: any) {
    super(options);
    this.commands = new Collection();
    this.loadCommands();
  }
  loadCommands() {
    const commandsPath = path.join(__dirname, "../commands");
    console.log({ commandsPath });
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    console.log({ commandFiles });

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}
