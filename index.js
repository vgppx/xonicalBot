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

  if (command === "joined") {
    message.author.send(`Welcome to Xonical Networks, ` + message.author +

      `. Visit <https://xonical.co.uk> and register to start playing, competing and evolving yourself into a better gamer, all whilst earning rewards. The more you play, the more you earn.
  
** Before you can join any channels on the Discord server, you must select games you play by reacting to the message in <#674319980145147914> **
        
We offer coaching to all players no matter where you are on the ladder, learn more <https://xonical.co.uk/coaching>.`)
  }

  // Coach Request Command START
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
  // Coach Request Command END

  // Check and Add points START
  if (command === "points") {
    message.reply(" you have " + `NaN` + ` points with Xonical Networks! This includes the website and Discord server! You can redeem these points for a coaching session, purchase VIP perks or enter in tournaments. Learn more here https://xonical.co.uk/points`);
    // has user messaged in the last 10 seconds?
    // true = do nothing
    // false = addPoints()
    /* addPoints {
      if user exists on website, add points to user
      if user doesn't exist on website, send user a message saying 
      "You're missing out on points at Xonical Networks - Sign up to not miss out https://xonical.co.uk/join"
      but only send message once per day, so if they have been messaged by the bot already today, don't send.
    }
    */

    // console.log(points);

    // message.author.send(message.author + ` you have ` + points + ` points throughout the Xonical Networks! This includes the website 
    //   and Discord server! You can use these points to hire a coach or purchase VIP perks. Learn more here https://xonical.co.uk`);
  }

  // Check and Add points END

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