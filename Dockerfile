FROM openjdk:21-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/demo-0.0.1-SNAPSHOT.jar rootsquarecavemapwebsite.jar
EXPOSE 8000
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar rootsquarecavemapwebsite.jar"]
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar rootsquarecavemapwebsite.jar"]
