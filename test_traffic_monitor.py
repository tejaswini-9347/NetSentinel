import time

from backend.traffic_monitor import traffic_monitor

print("Starting live traffic capture...")
result = traffic_monitor.start()
print(result)

if not result.get("running"):
    print("Capture failed. Check Npcap and permissions.")
else:
    print("Generate some network activity, then wait 10 seconds.")
    time.sleep(10)

    print("\nTraffic summary:")
    print(traffic_monitor.get_summary())

    print("\nStopping capture...")
    print(traffic_monitor.stop())