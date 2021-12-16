<p align="center">
  <img src="https://github.com/igorsheg/astro/blob/master/imgs/logo.png?raw=true" height="128" alt="Astro Logo" />
</p>
<p align="center">
  <i>An open, extensible, dashboard for all of your homelab services.</i>
  <br/>
  <br/>
  <img src="https://github.com/igorsheg/astro/blob/master/imgs/preview.png?raw=true" alt="Astro Dashboard Preview" width="800" />
</p>

## Getting Started

### Using docker

To launch container:

```sh
docker run -d \
  -p 3000:3000 \
  -v </your/local/path/>:/data \
  igorsheg/astro
```

### Build manually

1. Clone the repository

```sh
git clone https://github.com/igorsheg/astro.git
cd astro
```

2. Install dependencies & run

```sh
yarn install
yarn build
yarn db:init
yarn start
```
