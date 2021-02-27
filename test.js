require("dotenv").config();
const DiscordOauth2 = require("./index");
const oauth = new DiscordOauth2();
const test = async () => {
	const r = await oauth.getGuild(process.env.TEST_BOT_TOKEN, process.env.TEST_GUILD_ID);
	console.log(r);
};
test();