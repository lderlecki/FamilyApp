FROM python:3.8

ENV PYTHONBUFFERED 1

WORKDIR /familyapp

RUN pip install pipenv

COPY ./Pipfile* /familyapp/

RUN pipenv install --dev
