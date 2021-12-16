.PHONY: build

compile-server:
	@cd server && go build -o astroserver.sh cmd/server/main.go

build-docker:
	@docker build -t igorsheg/astrodash:latest .

init-db:
	@sqlite3  ./server/data/astrodb.db "VACUUM;"

clean:
	@cd server && rm -rf data/*

install-dep:
	@cd web && yarn
	
start-dev-server:
	@cd server && go run cmd/astro/main.go

start-dev-web:
	@cd web && yarn start
