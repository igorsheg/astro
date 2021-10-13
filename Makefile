clean-uploads:
	ls ./public/logos/ | grep 'upload_*'

clean-builds:
	rm -rf .next bin

build-docker:
	 docker build -t igorsheg/astro:latest .

build: clean-builds clean-uploads build-docker
