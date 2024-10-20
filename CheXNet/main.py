from flask import Flask, jsonify, request
from flask_cors import CORS
from image_pred.predict import make_image_prediction


app = Flask(__name__)
CORS(app)


@app.route("/predict-image", methods=["POST"])
def predictImage():
    try:
        data = request.json
        imgUrl = data["imageUrl"]
        response = make_image_prediction(imgUrl)
        return jsonify({
            "prediction": str(response)
        })
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500
    
if __name__ == "__main__":
    app.run(port = 7070, debug = True)