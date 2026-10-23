# Stage 1 - Build (dependencies cached separately from source)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q clean package -DskipTests

# Stage 2 - Run as non-root
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 1001 verdex && mkdir -p /app/uploads && chown -R verdex /app
COPY --from=build /app/target/*.jar app.jar
USER verdex
ENV PORT=8081
EXPOSE 8081
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-jar", "app.jar"]
