package basilium.basiliumserver.global.hashMapMonitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
/*
//http://localhost:8080/actuator/hashmap
@RestController
public class HashMapMonitorController {

    private final ConcurrentHashMap<UUID, String> requestTaskMaps;

    @Autowired
    public HashMapMonitorController(ConcurrentHashMap<UUID, String> requestTaskMaps) {
        this.requestTaskMaps = requestTaskMaps;
    }

    @GetMapping("/actuator/hashmap")
    public Map<UUID, String> getHashMapContents() {
        return requestTaskMaps;
    }
}

 */

