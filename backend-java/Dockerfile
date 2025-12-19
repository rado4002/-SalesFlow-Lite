# backend-java/Dockerfile (LOCAL JAR MODE - NO PULL NEEDED)
FROM openjdk:17-jre-slim
EXPOSE 8080
WORKDIR /app
COPY target/inventory-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]