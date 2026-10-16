to restart systemd service:
sudo systemctl restart deno-http.service

to view logs:
journalctl -u deno-http.service -n 50 --no-pager

NixOS systemd config:
serviceConfig = {
    ExecStart = "${pkgs.deno}/bin/deno run --allow-write --allow-read --allow-net --allow-env --env-file=/var/www/denoserver/.env fileserver.ts";
    WorkingDirectory = "/var/www/denoserver";
    User = "gerald";

    ProtectSystem = "strict";
    ProtectHome = true;
    ReadWritePaths = [ "/var/www/denoserver" ];

    Environment = [
    "HOME=/home/gerald"
    "DENO_DIR=/var/www/denoserver/.deno_cache"
    ];

    Restart = "on-failure";
    RestartSec = "5s";
};
