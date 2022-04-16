const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Structure of past completions:
// [{ prompt: "Hey peter, How are you?", response: "I'm good, how about you?" }];

const getCustomPrompt = ({ pastConversations, incompletePrompt }) => {
  // Slice pastConversations the last 10 conversations, then loop over each
  const pasties = pastConversations
    .slice(-10)
    .map(
      ({ type, line }) =>
        `${{ prompt: "Ned", completion: "Spiderman" }[type]}: ${line}`
    );

  const finalPrompt = `
This is a conversation between Peter Parker's Spider-Man, thor and a regular human after \"No-Way Home\". Spiderman is funny, optimistic and gives positive vibes.

${pasties.join("\n")}

Ned: ${incompletePrompt}
Spiderman: [Change This]
  `;

  return finalPrompt;
};

export const createResponse = async ({
  pastConversations,
  incompletePrompt,
}) => {
  try {
    // Edit engine used instead of completions, because it is free in beta
    const res = await openai.createEdit("text-davinci-edit-001", {
      input: getCustomPrompt({ pastConversations, incompletePrompt }),
      instruction:
        "Change [Change This] text and replace with an appropriate reply",
      temperature: 0.7,
      top_p: 1,
    });

    const resp = /\n.*$/
      .exec(res?.data?.choices[0]?.text.trim())[0]
      .slice(1)
      ?.replace("Spiderman: ", "");

    return resp;
  } catch (e) {
    // Return by throwing error
    throw e;
  }
};
