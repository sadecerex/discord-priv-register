const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const { token, Aktivite, AktiviteURL, prefix } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,  
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);

  client.user.setPresence({
    activities: [{
      name: Aktivite,
      type: ActivityType.Streaming,
      url: AktiviteURL
    }],
    status: 'dnd',
  });
});


client.commands = new Map();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
      await command.execute(message, args);
  } catch (error) {
      console.error(error);
      message.reply('Komut çalıştırılırken bir hata oluştu.');
  }
});

client.login(token);
