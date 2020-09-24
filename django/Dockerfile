FROM python:3.8

ENV PYTHONBUFFERED 1

RUN mkdir /code
WORKDIR /code
COPY . /code/

RUN pip install pipenv
RUN pipenv install --dev
