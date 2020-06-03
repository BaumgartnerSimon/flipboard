FROM python:3.6

EXPOSE 5000

WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY *.py /app/
COPY ./summary/ /app/summary/
COPY ./adblockparser/ /app/adblockparser/
CMD python app.py
