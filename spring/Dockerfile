FROM adoptopenjdk/openjdk11:ubi
WORKDIR /app
ADD target/familyapp-0.0.1-SNAPSHOT.jar .
EXPOSE 8081
CMD java -jar familyapp-0.0.1-SNAPSHOT.jar -Dspring.devtools.remote.secret=thisismysecret  --envname=prod
