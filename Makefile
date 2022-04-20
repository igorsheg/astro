.PHONY: build

build:
	@cd server && go build -o astroserver.sh cmd/server/main.go

build-docker:
	@docker build -t igorsheg/astrodash:latest .

init-db:
	@sqlite3  ./server/data/astrodb.db "VACUUM;"

clean:
	@cd server && rm -rf data/*

dev:
	make -j 2 dev-server dev-web
	
dev-server:
	@cd server && air

dev-web:
	@cd web && yarn start
