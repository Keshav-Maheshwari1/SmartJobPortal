# --------- BUILD STAGE ---------
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy only portal directory content
COPY portal ./

# Build the application
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# --------- RUNTIME STAGE ---------
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy built jar from previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose your custom port
EXPOSE 9000

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
    