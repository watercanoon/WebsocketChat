# ETAPA 1: Compilación (Build)
# Usamos una imagen de Maven mantenida
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Runtime)
# CAMBIO: Usamos Eclipse Temurin, que es el estándar actual y está disponible
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el JAR generado (Asegúrate de que el nombre coincida con tu pom.xml)
COPY --from=build /app/target/Chat_Websocket-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto de tu aplicación
EXPOSE 8081

# Comando de ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]