FROM python:3.10.9-alpine
COPY . /lucky-ticket
WORKDIR /lucky-ticket
RUN pip3 install -r requirements.txt
ENV FLASK_APP app.py
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]