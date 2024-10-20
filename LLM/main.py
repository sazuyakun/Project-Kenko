from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2

)
messages = [
    SystemMessage("You are a medical chatbot, you shouldn't answer any other things other than medical related things. If at all the user is asking other things, just say that you are sorry and not capable of doing the task"),
]

@app.post("/llm")
def getMessage():
    data = request.json
    humanMessage = data["user"]
    messages.append(HumanMessage(f"{humanMessage}"))
    response = llm.invoke(messages).content
    # print(f"Agent: {response}")
    messages.append(AIMessage(response))
    return jsonify({
        "agent": response
    })

# print(llm.invoke([HumanMessage("Can i know what is 1+1")]).content)

if __name__ == "__main__":
    app.run(port=8080, debug=True)
