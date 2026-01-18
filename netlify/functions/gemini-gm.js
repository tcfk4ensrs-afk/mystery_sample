const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    const { context, message, history } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: `
あなたはマーダーミステリーのGMです。以下の資料を読み込み、全キャラを演じてください。
資料: ${context}

【必須ルール】
1. 2回目の会話では「そういえば…」と切り出し、レベル1の情報（手がかり）を出してください。
2. 1名だけ「ノイズ担当」を選び、無意味な情報を重要そうに出してください。
3. 情報を出す際は「大したことじゃないですが」と前置きし、重要性を否定してください。
`
    });

    const chat = model.startChat({ history: history });
    const result = await chat.sendMessage(message);
    const response = await result.response;

    return {
        statusCode: 200,
        body: JSON.stringify({ reply: response.text() })
    };
};
