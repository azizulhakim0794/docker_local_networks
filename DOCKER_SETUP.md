# Docker and local network setup

This project is a Next.js App Router application that displays demo user
profiles from JSONPlaceholder. Docker runs the production server on port 3000
and publishes that port on the Windows host so trusted computers on the same
LAN can connect.

## Project architecture

- `app/page.tsx` renders the searchable user directory.
- `app/users/[id]/page.tsx` renders an individual profile; its loading,
  not-found, and error boundaries are in the same route folder.
- `components/` contains the directory, search field, user card, and profile
  details UI.
- `lib/users.ts` contains the typed JSONPlaceholder requests and response
  validation.
- `types/user.ts` defines the API user shape.
- `next.config.ts` enables Next.js standalone output for the container.
- `Dockerfile` builds and runs the production application.
- `compose.yaml` publishes the application as the `nextjs` service.

The directory loads users from
<https://jsonplaceholder.typicode.com/users> and supports searching by name,
username, email, and company. Profile pages show contact, address, and company
details. The API supplies sample data and does not provide sign-in or editable
accounts.

## Dockerfile

The Dockerfile uses Node.js 22 Alpine in a dependency stage and build stage,
installs the locked npm dependencies with `npm ci`, and runs `npm run build`.
The final stage copies only Next.js standalone output and static assets. It
runs as the unprivileged `nextjs` user, sets `HOSTNAME=0.0.0.0`, and listens on
port 3000. `.dockerignore` keeps dependencies, build output, Git metadata,
temporary files, and environment files out of the build context.

## Docker Compose

The `nextjs` service builds the local Dockerfile, sets production environment
variables, maps host port 3000 to container port 3000, and restarts unless
stopped. It joins a dedicated bridge network. The container listens on all its
interfaces, while the port mapping makes it available on the Windows host.

Run these commands in PowerShell from the project directory (the directory
containing `compose.yaml`):

```powershell
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f nextjs
docker compose down
docker compose up -d --build
```

- `docker compose build` builds the production image.
- `docker compose up -d` starts the app in the background.
- `docker compose ps` shows service and port status.
- `docker compose logs -f nextjs` follows the app logs; press `Ctrl+C` to stop
  following logs without stopping the container.
- `docker compose down` stops and removes the container and Compose network.
- `docker compose up -d --build` rebuilds the image and starts the updated app.

After startup, open <http://localhost:3000> on the Windows host.

## Find the Windows LAN IPv4 address

In PowerShell, list IPv4 addresses for active network adapters:

```powershell
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.PrefixOrigin -ne 'WellKnown'
  } |
  Format-Table InterfaceAlias, IPAddress
```

Choose the address belonging to the active Wi-Fi or Ethernet adapter, not a
Docker, VPN, virtual-machine, or loopback adapter. For example, the LAN address
might be `192.168.1.25`.

## Allow inbound traffic through Windows Firewall

On the Windows host, open PowerShell **as Administrator** and create an inbound
rule limited to the trusted Private network profile:

```powershell
New-NetFirewallRule `
  -DisplayName "Social User Profiles TCP 3000" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 3000 `
  -Action Allow `
  -Profile Private
```

Only use the Private profile on a network you trust. Do not enable this rule for
Public networks. To remove the rule later, run PowerShell as Administrator:

```powershell
Remove-NetFirewallRule -DisplayName "Social User Profiles TCP 3000"
```

## Open the app from another computer

Make sure the second computer is connected to the same Wi-Fi or LAN, the
container is running, and the Windows network is configured as Private with the
firewall rule above. In a browser on the second computer, use the host's LAN
address:

```text
http://HOST-IP:3000
```

For example:

```text
http://192.168.1.25:3000
```

Replace the example address with the Windows host's active Wi-Fi or Ethernet
IPv4 address. `localhost` refers to the computer using the browser; it will not
reach the Windows host from another computer.

## Rebuild after code changes

From the project directory, rebuild and recreate the running service:

```powershell
docker compose up -d --build
```

Then confirm it is running and inspect logs if needed:

```powershell
docker compose ps
docker compose logs -f nextjs
```

## Troubleshooting

- **The app is not running:** use `docker compose ps` and
  `docker compose logs nextjs` to inspect startup and build errors.
- **Port 3000 is already in use:** stop the other service using that port, or
  change the host side of the `ports` mapping and use that port in the browser
  URL and firewall rule.
- **The host works but another computer cannot connect:** confirm the client is
  on the same LAN, use the Wi-Fi/Ethernet IPv4 address rather than
  `localhost`, and ensure the Private-profile firewall rule is enabled.
- **The adapter is Public:** in Windows Settings, open **Network & internet**,
  select the connected Wi-Fi or Ethernet network, and set its network profile
  to **Private** only if it is trusted.
- **The LAN address changed:** rerun the `Get-NetIPAddress` command and use the
  current address. DHCP can change a device's address.
- **The directory does not load:** the browser must be able to reach
  `jsonplaceholder.typicode.com`; check that computer's internet connection and
  retry from the directory's error state.
- **The directory loads but a profile does not:** the Docker host/container
  needs outbound access to `jsonplaceholder.typicode.com`; inspect
  `docker compose logs nextjs` and retry the profile.
- **Changes do not appear:** run `docker compose up -d --build`, then check
  `docker compose logs -f nextjs`.
