from typing import List, Dict, Any
import math

class AIMatchingService:
    @staticmethod
    def calculate_hybrid_score(
        semantic_sim: float,  # 0.0 to 1.0
        citations: int,       # raw count
        slots_used: int,
        slots_total: int,
        tier: int             # 1, 2, or 3
    ) -> Dict[str, int]:
        # Semantic score: 0 to 100
        s_sem = int(semantic_sim * 100)
        
        # Publication score: log normalized up to 100
        s_pub = min(100, int((math.log(citations + 1) / math.log(1000)) * 100))
        
        # Workload score: capacity remaining
        capacity_ratio = max(0.0, (slots_total - slots_used) / max(1, slots_total))
        s_load = int(capacity_ratio * 100)
        
        # Tier bonus / co-advisory factor
        tier_multipliers = {1: 95, 2: 85, 3: 75}
        s_coadv = tier_multipliers.get(tier, 70)
        
        # 45% semantic + 30% publication + 15% workload + 10% co-advisory
        s_final = int(
            (0.45 * s_sem) +
            (0.30 * s_pub) +
            (0.15 * s_load) +
            (0.10 * s_coadv)
        )
        
        return {
            "final": min(99, max(15, s_final)),
            "semantic": s_sem,
            "publication": s_pub,
            "workload": s_load,
            "coadv": s_coadv
        }
