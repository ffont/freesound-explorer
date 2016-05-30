from flask import Flask, render_template, jsonify
import json
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    response = json.load(open('other/fake_response.json', 'r'))
    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
