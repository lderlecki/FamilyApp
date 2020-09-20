FROM adoptopenjdk/openjdk11:ubi
ADD target/familyapp-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
CMD java -jar familyapp-0.0.1-SNAPSHOT.jar --envname=prod
