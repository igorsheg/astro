<p align="center">
  <img src="https://github.com/igorsheg/astro/blob/5544a1a347e26230cdc2f246f0e2d71ed54acd09/imgs/logo.png?raw=true" height="128" alt="Astro Logo" />
</p>
<p align="center">
  <i>An open, extensible, dashboard for all of your homelab services.</i>
  <br/>
  <br/>
  <img src="https://github.com/igorsheg/astro/blob/5544a1a347e26230cdc2f246f0e2d71ed54acd09/imgs/preview.png?raw=true" alt="Astro Dashboard Preview" width="800" />
</p>

## Getting Started

### Using docker

To launch container:

```sh
docker run -d \
  -p 8088:8088 \
  -v </your/local/path/>:/server/data \
  igorsheg/astro
```

### Build manually

1. Clone the repository

```sh
git clone https://github.com/igorsheg/astro.git
cd astro
```

2. Install dependencies

```sh
make install-dep
```

3. Init Database

```sh
make init-db
make seed-db
```

4. Run Backend

```sh
make start-dev-server
```

5. Run Frontend

```sh
make start-dev-web
```
