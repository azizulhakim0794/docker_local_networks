# Social User Profiles

A responsive Next.js user directory powered by
[JSONPlaceholder](https://jsonplaceholder.typicode.com/). Browse and search
sample profiles, then open a profile to see contact, address, and company
details.

## Run the application with Docker

Install and start Docker Desktop on Windows. In PowerShell, go to the project
folder containing `compose.yaml`, then build and start the application:

```powershell
Set-Location "C:\path\to\docker_local_networks"
docker compose up -d --build
docker compose ps
```

Replace `C:\path\to\docker_local_networks` with the actual project folder. On
the same Windows computer, open <http://localhost:3000>.

To see logs or stop the app:

```powershell
docker compose logs -f nextjs
docker compose down
```

Press `Ctrl+C` to stop following logs; this does not stop the app. To rebuild
and restart after code changes, run `docker compose up -d --build` again.

## Open the app on another device on your Wi-Fi or LAN

1. Keep the application running on the Windows computer.
2. On that computer, open PowerShell or Command Prompt and run:

   ```powershell
   ipconfig
   ```

3. Find **IPv4 Address** under the connected **Wireless LAN adapter Wi-Fi** or
   **Ethernet adapter**. Use that address, not a Docker adapter address. For
   example, it might be `192.168.1.25`.
4. If Windows Firewall blocks access, open PowerShell **as Administrator** on
   the host and allow TCP port 3000 on the trusted Private network:

   ```powershell
   New-NetFirewallRule `
     -DisplayName "Social User Profiles TCP 3000" `
     -Direction Inbound `
     -Protocol TCP `
     -LocalPort 3000 `
     -Action Allow `
     -Profile Private
   ```

   Only use the Private profile on a network you trust.
5. Connect the other device to the same Wi-Fi or LAN and open
   `http://HOST-IP:3000`, replacing `HOST-IP` with the Windows computer's IPv4
   address. For example, if `ipconfig` shows `192.168.1.25`, open
   <http://192.168.1.25:3000>.

`localhost` only refers to the device using the browser; it will not reach the
Windows computer from another device.

For architecture, additional Docker commands, and troubleshooting, see
[DOCKER_SETUP.md](./DOCKER_SETUP.md).