# AGENTS.md

## Cursor Cloud specific instructions

This repo is a role-based login/registration demo made of two apps plus a database:

- `client/` — React app (Create React App, `react-scripts` 3.4.3), dev server on port **3000**.
- `server/` — Express API, listens on port **3001** (`node index.js`, run from `server/`).
- **MySQL** database `LoginSystem` with a `users` table (`id`, `username`, `password`, `role`). The server connects as `root` / password `password` over TCP on `localhost:3306`.

Standard scripts live in `client/package.json` (`yarn start`, `yarn build`, `yarn test`); the server has no test script and is started with `node index.js`.

### Startup caveats (non-obvious)

- **MySQL must be running** before the server: `sudo service mysql start` (systemd is unavailable; use the `service` command). The update script does not start it.
- **MySQL auth:** root must use `mysql_native_password` with password `password`. The old `mysql` npm driver (v2) cannot speak MySQL 8's default `caching_sha2_password`, so the server fails to authenticate otherwise. The DB/table and this auth setting are provisioned once and persist in the VM snapshot.
- **Client needs the legacy OpenSSL provider on Node 22.** `react-scripts` 3.4.3 uses webpack 4, which crashes on Node 17+ with `error:0308010C:digital envelope routines::unsupported`. Always start/build the client with `NODE_OPTIONS=--openssl-legacy-provider`, e.g. `NODE_OPTIONS=--openssl-legacy-provider yarn start` (add `BROWSER=none` in headless VMs) and `NODE_OPTIONS=--openssl-legacy-provider yarn build`.
- **`server/node_modules` is committed**, but its `bcrypt` native binary is built for a different platform ("invalid ELF header" on load). The update script runs `npm ci` in `server/` to rebuild a correct x86-64 binary; do not rely on the committed binary.

### Behavior quirks (so you don't chase non-bugs)

- **`POST /register` never sends an HTTP response.** The row is inserted, but clients (e.g. `curl`) hang waiting for a reply. This is existing app behavior, not a broken environment.
- New users are created with role `visitor`. The Main page (`/`) only renders role-specific UI when an authenticated session exists; the register/login forms are on `/registration`.
- **No automated tests exist.** `yarn test` (CI mode) reports "No tests found" and exits non-zero. Linting runs as part of `yarn start` / `yarn build` (CRA/ESLint) — the current code compiles with only pre-existing warnings.
