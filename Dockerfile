FROM golang:1.26.0-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN GOWORK=off go mod download
COPY . ./
RUN GOWORK=off go build -mod=readonly -trimpath -ldflags "-s -w" -o /out/domainry-knowledge ./cmd/knowledge-saas

FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata && addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /out/domainry-knowledge /app/domainry-knowledge
RUN mkdir -p /app/data && chown -R app:app /app
USER app
ENV APP_ENV=production \
    KNOWLEDGE_SAAS_HTTP_ADDR=:8093 \
    KNOWLEDGE_DATABASE_DRIVER=postgres \
    KNOWLEDGE_FILE_STORAGE_DRIVER=s3
EXPOSE 8093
ENTRYPOINT ["/app/domainry-knowledge"]
