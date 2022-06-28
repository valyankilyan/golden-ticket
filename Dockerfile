FROM python:3.8-alpine

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt

# ENTRYPOINT ["./gunicorn.sh" ]
CMD [ "gunicorn", "-b", "0.0.0.0:80", "-w", "2", "app:app" ]