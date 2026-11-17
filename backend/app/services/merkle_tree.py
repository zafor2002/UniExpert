import hashlib
import json
from typing import List, Dict, Any

class MerkleAuditService:
    @staticmethod
    def calculate_hash(index: int, prev_hash: str, event_type: str, actor_id: str, payload: str, timestamp: str) -> str:
        data = f"{index}:{prev_hash}:{event_type}:{actor_id}:{payload}:{timestamp}"
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_chain(blocks: List[Dict[str, Any]]) -> bool:
        """Verifies integrity of the entire audit chain."""
        for i in range(1, len(blocks)):
            prev = blocks[i - 1]
            curr = blocks[i]
            if curr["prev_hash"] != prev["block_hash"]:
                return False
            recalculated = MerkleAuditService.calculate_hash(
                curr["block_index"],
                curr["prev_hash"],
                curr["event_type"],
                curr["actor_id"],
                curr["payload"],
                curr["timestamp"]
            )
            if recalculated != curr["block_hash"]:
                return False
        return True
