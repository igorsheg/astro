.PHONY: build

compile-server:
	@cd server && go build -o astroserver.sh cmd/server/main.go

compile-initdb:
	@cd server && go build -o initdb.sh pkg/script/initdb.go

build-docker:
	@docker build -t igorsheg/astrodash:latest .

init-db:
	@sqlite3  ./server/data/astrodb.db "VACUUM;"

seed-db:
	@cd server && go run scripts/initdb.go

clean:
	@cd server && rm -rf data/*⏎

start-dev-server:
	@cd server && go run cmd/astro/main.go

start-dev-web:
	@cd web && yarn start
