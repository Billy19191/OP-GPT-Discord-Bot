import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import * as tf from '@tensorflow/tfjs-node'
import dotenv from 'dotenv'
dotenv.config()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// const model = await tf.loadLayersModel('path/to/your/model.h5')
const askModel = (message: string) => {}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (message.content) {
    console.log('Message' + message.content)
    // const prediction = await askModel(message.content)
    message.reply('Test Integration // Waiting for model *TFJS-Node')
  }
})
client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log('Bot is ready'))
  .catch(console.error)
