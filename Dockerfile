FROM nikolaik/python-nodejs:python2.7-nodejs12

RUN mkdir /code
WORKDIR /code

COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY package.json /code/
RUN npm install

COPY . /code/
RUN cp backend/settings.example.py backend/settings.py
RUN npm run build

CMD ["gunicorn", "backend:app", "-b", "0.0.0.0:8000"]
