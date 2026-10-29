
import re
import socket
import subprocess
from datetime import datetime


def discover_devices():
    """
    Discover devices currently listed in this Windows computer's
    ARP cache. Results depend on recent network activity.
    """
    try:
        result = subprocess.run(
            ["arp", "-a"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError(
            f"Could not read the Windows ARP table: {exc}"
        ) from exc

    if result.returncode != 0:
        raise RuntimeError(
            result.stderr.strip() or "The ARP command failed."
        )

    devices = []
    seen_ips = set()

    for line in result.stdout.splitlines():
        match = re.search(
            r"(\d{1,3}(?:\.\d{1,3}){3})\s+"
            r"([0-9a-fA-F]{2}(?:-[0-9a-fA-F]{2}){5})\s+"
            r"(dynamic|static)",
            line,
            re.IGNORECASE,
        )

        if not match:
            continue

        ip, mac, entry_type = match.groups()

        try:
            socket.inet_aton(ip)
        except OSError:
            continue

        if ip in seen_ips or ip.startswith("224.") or ip == "255.255.255.255":
            continue

        seen_ips.add(ip)

        devices.append({
            "ip": ip,
            "mac": mac.replace("-", ":").lower(),
            "entry_type": entry_type.lower(),
            "status": "Seen in ARP cache",
            "last_seen": datetime.now().astimezone().isoformat(
                timespec="seconds"
            ),
        })

    devices.sort(key=lambda device: tuple(
        int(part) for part in device["ip"].split(".")
    ))

    return {
        "count": len(devices),
        "devices": devices,
        "method": "Windows ARP cache",
        "note": (
            "This lists devices in the current ARP cache, not a "
            "guaranteed complete list of all connected devices. "
            "A scan may be needed to discover additional devices."
        ),
    }
