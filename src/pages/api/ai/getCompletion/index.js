import { createResponse } from "./utils";

const getCompletion = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send({ message: "Only POST requests allowed" });
      return;
    }

    // Get values from json body
    const { pastConversations, incompletePrompt } = req.body;

    // Create response
    const response = await createResponse({
      pastConversations,
      incompletePrompt,
    });

    return res.json({ completion: response });
  } catch (e) {
    // Return by throwing error
    throw e;
  }
};

// API Config
export const config = {
  api: {
    bodyParser: true,
  },
};

export default getCompletion;
