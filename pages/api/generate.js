import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write me a LinkedIn headline in the style of Justin Welsh with the topic below. Please make sure the headline uses active and punchy verbs. The aim is to stop readers from scrolling.

Topic:
`
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // Prompt #2
  const secondPrompt = 
  `
  Take the topic and LinkedIn headline below and generate a LinkedIn post written in the style of Justin Welsh. Please make sure the post uses active and punchy verbs and shows that the writer did his research. Maximize on-screen skimmability. Do not make up facts.

  Topic: ${req.body.userInput}

  LinkedIn Headline: ${basePromptOutput.text}

  LinkedIn Post:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.8,
		// I also increase max_tokens.
    max_tokens: 500,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;