
import asyncio
import re
import subprocess
from datetime import datetime, timezone

from bleak import BleakScanner


def get_time():
    return datetime.now(timezone.utc).isoformat()


def scan_bluetooth(timeout=8.0):
    """Find nearby Bluetooth Low Energy devices."""

    async def perform_scan():
        found = await BleakScanner.discover(
            timeout=timeout,
            return_adv=True,
        )

        devices = []

        for address, (device, advertisement) in found.items():
            devices.append({
                "name": (
                    advertisement.local_name
                    or device.name
                    or "Unknown Bluetooth device"
                ),
                "address": address,
                "rssi": getattr(advertisement, "rssi", None),
                "type": "Bluetooth Low Energy",
                "last_seen": get_time(),
            })

        return devices

    try:
        devices = asyncio.run(perform_scan())

        return {
            "count": len(devices),
            "devices": devices,
            "method": "Bluetooth Low Energy",
        }

    except Exception as exc:
        return {
            "count": 0,
            "devices": [],
            "method": "Bluetooth Low Energy",
            "error": str(exc),
        }


def scan_wifi_networks():
    """Find Wi-Fi network names visible to Windows."""

    try:
        result = subprocess.run(
            ["netsh", "wlan", "show", "networks", "mode=bssid"],
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
            encoding="utf-8",
            errors="replace",
        )

        if result.returncode != 0:
            raise RuntimeError(
                result.stderr.strip() or "Wi-Fi scan failed."
            )

        networks = []
        current = None

        for line in result.stdout.splitlines():
            line = line.strip()

            match = re.match(
                r"SSID\s+\d+\s*:\s*(.*)",
                line,
                re.IGNORECASE,
            )

            if match:
                if current:
                    networks.append(current)

                current = {
                    "ssid": match.group(1).strip() or "(Hidden SSID)",
                    "authentication": "Unknown",
                    "encryption": "Unknown",
                    "signal": "Unknown",
                    "last_seen": get_time(),
                }

            elif current and re.match(
                r"Authentication\s*:", line, re.IGNORECASE
            ):
                current["authentication"] = line.split(":", 1)[1].strip()

            elif current and re.match(
                r"Encryption\s*:", line, re.IGNORECASE
            ):
                current["encryption"] = line.split(":", 1)[1].strip()

            elif current and re.match(
                r"Signal\s*:", line, re.IGNORECASE
            ):
                current["signal"] = line.split(":", 1)[1].strip()

        if current:
            networks.append(current)

        return {
            "count": len(networks),
            "networks": networks,
            "method": "Windows Wi-Fi scan",
        }

    except Exception as exc:
        return {
            "count": 0,
            "networks": [],
            "method": "Windows Wi-Fi scan",
            "error": str(exc),
        }
