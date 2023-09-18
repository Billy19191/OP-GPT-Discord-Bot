import { Client, GatewayIntentBits } from 'discord.js'
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

async function loadModel() {
  // Load the model architecture (JSON)
  const modelArchitecture = 'http://127.0.0.1:8080/model/config.json'

  // Load the model
  const model = await tf.loadGraphModel(modelArchitecture)

  return model
}

async function makePrediction(input: string) {
  try {
    // Load the model
    const model = await loadModel()

    // Prepare the input data as a tensor (you may need preprocessing)
    const inputTensor = tf.tensor([input])

    // Make a prediction using the loaded model
    const predictions = model.predict(inputTensor)

    // Extract values from the prediction tensors and convert to JavaScript arrays
    const predictionValues = await Promise.all(
      (Array.isArray(predictions) ? predictions : [predictions]).map(
        async (tensor) => {
          // Cast the tensor to the tf.Tensor type to ensure that it has the data() method
          const tensorAsTfTensor = tensor as tf.Tensor

          const data = await tensorAsTfTensor.data()
          return Array.from(data)
        }
      )
    )

    return predictionValues
  } catch (error) {
    console.error('Error making prediction:', error)
    return 'An error occurred during prediction.'
  }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (message.content) {
    console.log('Message' + message.content)
    const prediction = await makePrediction(message.content)
    message.reply(`Prediction: ${JSON.stringify(prediction)}`)
  }
})

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log('Bot is ready'))
  .catch(console.error)
