const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.login(config.token);

// Set bot data START
client.on('ready', () => {
  client.user.setStatus('available')
  client.user.setPresence({
    game: {
      name: 'xonical.co.uk',
      type: "WATCHING",
      url: "https://xonical.co.uk"
    }
  });
});
// Set bot data END

// When someone joins the server, send them a welcome message with some instructions.
client.on('guildMemberAdd', member => {
  member.send(`Welcome to Xonical Networks, ` + member + `. Visit <https://xonical.co.uk> and register to start playing, competing and evolving yourself into a better gamer, all whilst earning rewards. The more you play, the more you earn.
  
  ** Before you can join any channels on the Discord server, you must select games you play by reacting to the message in <#674319980145147914> **
          
  We offer coaching to all players no matter where you are on the ladder, learn more <https://xonical.co.uk/coaching>.`)
});

// When anyone messages.
client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // COMMAND : !joined will send a direct message to the person who used the command, the message will be a replica of the welcome message.
  if (command === "joined") {
    message.author.send(`Welcome to Xonical Networks, ` + message.author +

      `. Visit <https://xonical.co.uk> and register to start playing, competing and evolving yourself into a better gamer, all whilst earning rewards. The more you play, the more you earn.
  
** Before you can join any channels on the Discord server, you must select games you play by reacting to the message in <#674319980145147914> **
        
We offer coaching to all players no matter where you are on the ladder, learn more <https://xonical.co.uk/coaching>.`)
  }

  // COMMAND : !register will send a direct message to the person who used the command.
  // if the user is already registered then tell them this.
  // if the user is not registered then send them a link to register and information about registering.
  if (command === "register") {
    message.reply("Register here https://xonical.co.uk/register for rewards and exclusive events.");
    // if (message.author === registered) {
    //   message.author.send(`You are already registered with Xonical Networks, your profile link is` + profileURL + `. If you need to reset your password or login visit https://xonical.co.uk/login`);
    // }
    // if (message.author === !registered) {
    //   message.author.send(`We have checked our database to see if you're registered but didn't find anything. If this is true and you are not registered, please go to https://xonical.co.uk/register and get gaming! If you typed !register and are already registered but see this message, please let the staff know.`);
    // }
  }

  // COMMAND : !coach will send a direct message to every single user with the role of coach so they know when someone is looking for a coach.
  if (command === "coach") {
    let coachRole = message.guild.roles.get(config.coachRoleId);
    let members = [];
    for (let i = 0; i < message.guild.members.array().length; i++) {
      if (message.guild.members.array()[i].roles.get(config.coachRoleId)) {
        members.push(message.guild.members.array()[i]);
      }
    }
    for (let i = 0; i < members.length; i++) {
      client.users.get(members[i].id).send(`Hi ${members[i].user.username}, ` +
        `A player called ${message.member.user.username} on Xonical is looking for a coach. 
        If you want to coach them you can find them quickly in ${message.url}`);
    }
  }

  // COMMAND : !points will send the user a message in the channel they sent the command in, the message will display how many points they have if they are registered.
  // if the user is not registered with Xonical Networks then the bot will send them a direct message to convert them.
  if (command === "points") {
    message.reply("!points is under development. Please register to use this command in the future - https://xonical.co.uk/register");
    // if (message.author.hasSentMessageInLast10Seconds === true) {
    //   return null;
    // }
    // else if (message.author.hasSentMessageInLast10Seconds === false) {
    //   if (message.author === registered) {
    //     addPoints(1, message.author)
    //     message.reply(" you have " + `NaN` + ` points with Xonical Networks! This includes the website and Discord server! You can redeem these points for a coaching session, purchase VIP perks or enter in tournaments. Learn more here https://xonical.co.uk/points`);
    //     message.author.send(` you have ` + message.author.XPoints + `. Redeem them here https://xonical.co.uk`)
    //   }
    //   else if (message.author === !registered) {
    //     message.author.send(`We have checked our database to see if you're registered but didn't find anything. If this is true and you are not registered, please go to https://xonical.co.uk/register and get gaming! If you typed !points and are already registered but see this message, please let the staff know.`);
    //   }
    // }
  }

  if (command === "kick") {
    if (!message.member.roles.some(r => ["Administrator", "Moderator"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  }

  if (command === "ban") {
    if (!message.member.roles.some(r => ["Administrator"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if (command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({ limit: deleteCount });
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});