# Multi-stage maven compiler for Java backend
FROM maven:3.8.4-openjdk-17-slim AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runnable stage container
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/aetheros-platform-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
