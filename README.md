# Brainflash API

![Production Build](https://github.com/Miczeq22/brainflash-api/workflows/Production%20Build/badge.svg)
![Lint Check](https://github.com/Miczeq22/brainflash-api/workflows/Lint%20Check/badge.svg)
![Test](https://github.com/Miczeq22/brainflash-api/workflows/Test/badge.svg)

---

Server for Brainflash application, which is a flashcard portal.

_This repository was created with clean architecture in mind. Each of the application layers is separated by abstraction._

## 📖 Table of Contents

- [✨ Getting started](#%e2%9c%a8-getting-started)
  - [Prerequisites](#prerequisites)
  - [Bootstrap](#bootstrap)
- [📜 Scripts](#%f0%9f%93%9c-scripts)
  - [Build](#build)
  - [Test](#test)
  - [Analyze](#analyze)
  - [Development](#development)
- [📏 Rules](#%f0%9f%93%8f-rules)
- [📚 Documentation](#%f0%9f%93%9a-documentation)
  - [Commit Message Guideline](#commit-message-guideline)

## ✨ Getting started

### Prerequisites

You need to have installed the following software:

- [nodejs](https://nodejs.org/en/) (>=12.13.1)
- [npm](https://npmjs.com/) (>= 6.13.0)
- [docker](https://www.docker.com/) (>=1.13.0)
  - [compose](https://docs.docker.com/compose/) (>=3.0)

### Bootstrap

```bash
  git clone git@github.com:Miczeq22/zombies-api.git
  cd zombies-api
  npm i
  cp .env.dist .env
  docker-compose up -d
```

**Please remember that `.env` must be implemented for proper work.**

## 📜 Scripts

### Build

- `build`: Builds production ready application.

- `start`: Start production ready environment. Must be preceded by a `build` script.

- `docker-build-prod`: Builds production ready docker image for API.

### Test

- `test`: Run `jest` in standard mode.
- `test:watch`: Run `jest` in watch mode.
- `test:ci`: Run `jest` for CI purposes with coverage and database as docker container.

### Analyze

- `typecheck`: Run `typescript` in dry-mode (no output). Type errors will be printed to console.
- `format`: Run `prettier` to format all files. Gets invoked by the pre-commit hook.
- `lint`: Run `eslint` and `prettier`. Output any errors.

### Development

- `dev`: Run application in development mode by using `nodemon`.
- `version`: Generates `CHANGELOG` file based on commit messages.

## 📏 Rules

This project follows clean architecture rules. Each of the layers communicates with each other using abstraction and the lower layers know nothing about the upper layers.

![Clean architecture](https://miro.medium.com/max/1200/0*JD606Sqx6RYZLKdu.)

We can distinguish four layers in this repository:

- `api` - here a server is prepared to communicate with the outside world using the REST API powered by `express`. With the lower layer it communicates only using the `command bus` and `query bus`.

- `app` - this layer is responsible for the implementation of commands and queries available in the application. According to the CQRS pattern.

- `infrastructure` - layer responsible for concrete implementations of external tools, e.g. persistence layer is implemented using postgresql.

- `core` - layer that is responsible for creating and managing domain objects.

## 📚 Documentation

### Commit Message Guideline

- For easier commit type recognition commit messages are prefixed with an emoji
- See available [commit-emojis](https://github.com/sebald/commit-emojis#available-emojis)
