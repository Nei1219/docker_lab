

FROM ubuntu:21.04
ARG VERSION=2.8.1
WORKDIR /tmp
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxvf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    ls && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 ipinfo
# RUN ./ipinfo 8.8.8.8
COPY ip.txt .
RUN cat ip.txt | ./ipinfo
