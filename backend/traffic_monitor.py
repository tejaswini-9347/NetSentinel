
from collections import defaultdict
from datetime import datetime
from threading import Lock

from scapy.all import AsyncSniffer, IP, IPv6, TCP, UDP, ICMP


class TrafficMonitor:
    def __init__(self):
        self._lock = Lock()
        self._sniffer = None
        self._packets = []
        self._max_packets = 5000
        self._error = None

    def _record_packet(self, packet):
        try:
            timestamp = datetime.now().astimezone().isoformat()
            source_ip = None
            destination_ip = None
            protocol = "OTHER"
            packet_size = len(packet)

            if IP in packet:
                source_ip = packet[IP].src
                destination_ip = packet[IP].dst
            elif IPv6 in packet:
                source_ip = packet[IPv6].src
                destination_ip = packet[IPv6].dst

            if TCP in packet:
                protocol = "TCP"
            elif UDP in packet:
                protocol = "UDP"
            elif ICMP in packet:
                protocol = "ICMP"

            # Ignore packets without an IP source/destination.
            if not source_ip or not destination_ip:
                return

            record = {
                "timestamp": timestamp,
                "source_ip": source_ip,
                "destination_ip": destination_ip,
                "protocol": protocol,
                "packet_size": packet_size,
            }

            with self._lock:
                self._packets.append(record)

                # Keep memory use bounded during a demo.
                if len(self._packets) > self._max_packets:
                    self._packets = self._packets[-self._max_packets:]

        except Exception as exc:
            with self._lock:
                self._error = str(exc)

    def start(self):
        with self._lock:
            if self._sniffer is not None:
                return {
                    "running": True,
                    "message": "Traffic capture is already running."
                }

            self._error = None

        try:
            sniffer = AsyncSniffer(
                filter="ip or ip6",
                prn=self._record_packet,
                store=False,
            )
            sniffer.start()

            with self._lock:
                self._sniffer = sniffer

            return {
                "running": True,
                "message": "Traffic capture started."
            }

        except Exception as exc:
            with self._lock:
                self._sniffer = None
                self._error = str(exc)

            return {
                "running": False,
                "message": "Could not start packet capture.",
                "error": str(exc),
            }

    def stop(self):
        with self._lock:
            sniffer = self._sniffer
            self._sniffer = None

        if sniffer is not None:
            try:
                sniffer.stop()
            except Exception as exc:
                with self._lock:
                    self._error = str(exc)

        return {
            "running": False,
            "message": "Traffic capture stopped."
        }

    def get_summary(self):
        with self._lock:
            packets = list(self._packets)
            running = (
                self._sniffer is not None
                and self._sniffer.running
            )
            error = self._error

        by_device = defaultdict(
            lambda: {
                "packets_sent": 0,
                "packets_received": 0,
                "bytes_sent": 0,
                "bytes_received": 0,
                "protocols": set(),
            }
        )

        for packet in packets:
            source = packet["source_ip"]
            destination = packet["destination_ip"]
            size = packet["packet_size"]
            protocol = packet["protocol"]

            by_device[source]["packets_sent"] += 1
            by_device[source]["bytes_sent"] += size
            by_device[source]["protocols"].add(protocol)

            by_device[destination]["packets_received"] += 1
            by_device[destination]["bytes_received"] += size
            by_device[destination]["protocols"].add(protocol)

        devices = []

        for ip, stats in by_device.items():
            devices.append({
                "ip": ip,
                "packets_sent": stats["packets_sent"],
                "packets_received": stats["packets_received"],
                "bytes_sent": stats["bytes_sent"],
                "bytes_received": stats["bytes_received"],
                "protocols": sorted(stats["protocols"]),
            })

        devices.sort(
            key=lambda item: (
                item["packets_sent"] + item["packets_received"]
            ),
            reverse=True,
        )

        return {
            "running": running,
            "captured_packet_count": len(packets),
            "devices": devices,
            "recent_packets": packets[-100:],
            "error": error,
            "note": (
                "IP addresses and packet metadata are observed traffic, "
                "not verified device identities or intrusion classifications."
            ),
        }


traffic_monitor = TrafficMonitor()
