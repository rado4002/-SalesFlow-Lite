# ============================================
# SALESFLOW-LITE — JAVA BACKEND (PROD SAFE)
# Java 17 LTS | Non-root | Container-aware
# ============================================

FROM eclipse-temurin:17-jre-jammy

# ---- Metadata (best practice)
LABEL app="salesflow-backend"
LABEL runtime="java17"
LABEL maintainer="salesflow"

# ---- Create non-root user
RUN useradd -ms /bin/bash salesflow

# ---- App directory
WORKDIR /app

# ---- Copy JAR
COPY target/inventory-0.0.1-SNAPSHOT.jar app.jar

# ---- Ownership
RUN chown -R salesflow:salesflow /app

# ---- Switch user
USER salesflow

# ---- Expose app port
EXPOSE 8080

# ---- JVM options (container safe)
ENV JAVA_OPTS="\
-XX:+UseContainerSupport \
-XX:MaxRAMPercentage=75 \
-XX:InitialRAMPercentage=50 \
-XX:+ExitOnOutOfMemoryError \
-Djava.security.egd=file:/dev/./urandom"

# ---- Start app
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
