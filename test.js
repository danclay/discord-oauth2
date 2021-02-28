require("dotenv").config();
const DiscordOauth2 = require("./index");
const oauth = new DiscordOauth2();
const test = async () => {
	const r = await oauth.getBotGuilds(process.env.TEST_BOT_TOKEN);
	console.log(r);
};
test();