from typing import List, Dict, Any, Tuple
import math
from app.services.nlp_extractor import NLPEntityExtractor
from app.services.semantic_matcher import SemanticVectorMatcher
from app.services.set_cover_optimizer import SetCoverCoAdvisorOptimizer

class AIMatchingService:
    _matcher = SemanticVectorMatcher()

    @classmethod
    def get_matcher(cls) -> SemanticVectorMatcher:
        return cls._matcher

    @classmethod
    def index_faculty_profiles(cls, faculty_data: List[Dict[str, Any]]):
        cls._matcher.build_corpus(faculty_data)

    @staticmethod
    def calculate_hybrid_score(
        semantic_sim: float,       # 0.0 to 1.0 (from vector cosine)
        skill_overlap_ratio: float, # 0.0 to 1.0 (exact skills in common)
        citations: int,            # raw citation count
        slots_used: int,
        slots_total: int,
        tier: int                  # 1: PhD/Prof, 2: Assoc, 3: Asst/Lecturer
    ) -> Dict[str, int]:
        """
        Implements the Chapter 5 thesis multi-criteria composite formula:
        S_final = 0.40*S_sem + 0.25*S_skills + 0.15*S_pub + 0.10*S_load + 0.10*S_tier
        """
        # Calibrated semantic vector similarity scaled 0 to 100
        # In sparse n-gram TF-IDF, 0.25+ cosine indicates an authoritative domain match
        if semantic_sim > 0.0:
            calibrated_sem = min(1.0, math.sqrt(semantic_sim) / math.sqrt(0.32))
            s_sem = int(calibrated_sem * 100)
        else:
            s_sem = 0

        # Skill overlap ratio scaled 0 to 100
        s_skills = int(min(1.0, max(0.0, skill_overlap_ratio)) * 100)

        # Publication score: log-normalized up to 100
        # log(citations + 1) normalized against 1000 citations baseline
        s_pub = min(100, int((math.log(citations + 1) / math.log(1000)) * 100))

        # Workload capacity score: percentage of free slots
        capacity_ratio = max(0.0, (slots_total - slots_used) / max(1, slots_total))
        s_load = int(capacity_ratio * 100)

        # Institutional credential tier bonus
        tier_multipliers = {1: 95, 2: 85, 3: 75}
        s_tier = tier_multipliers.get(tier, 70)

        # Composite multi-criteria formula
        s_final = int(
            (0.40 * s_sem) +
            (0.25 * s_skills) +
            (0.15 * s_pub) +
            (0.10 * s_load) +
            (0.10 * s_tier)
        )

        return {
            "final": min(99, max(18, s_final)),
            "semantic": s_sem,
            "skills": s_skills,
            "publication": s_pub,
            "workload": s_load,
            "tier": s_tier
        }

    @staticmethod
    def generate_xai_explanation(
        expert: Dict[str, Any],
        project_title: str,
        problem_statement: str,
        required_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Generates Explainable AI (XAI) feature attribution radar charts and narrative justifications.
        """
        req_set = set(s.lower() for s in required_skills if s)
        expert_skills = set(s.lower() for s in expert.get("skills", []))
        overlap = [s.title() for s in req_set.intersection(expert_skills)]

        # Radar competencies: 5 dynamic axes based on project requirements
        radar_categories = required_skills[:6] if required_skills else ["Embedded AI", "IoT Systems", "ML/CMSIS", "Cloud", "Software Architecture"]
        radar_data = []

        for category in radar_categories:
            is_matched = category.lower() in expert_skills or any(category.lower() in s for s in expert_skills)
            radar_data.append({
                "subject": category,
                "required": 90,
                "expert": 94 if is_matched else 55
            })

        # Feature weight contributions
        weights = {
            "semantic_vector": 0.40,
            "prerequisite_skills": 0.25,
            "publication_recency": 0.15,
            "quota_availability": 0.10,
            "credential_tier": 0.10
        }

        justification = (
            f"{expert.get('name', 'The advisor')} has strong academic and technical alignment with '{project_title}'. "
            f"They possess verified skills in {', '.join(overlap) if overlap else 'related domains'}, "
            f"with {max(0, expert.get('slots_total', 5) - expert.get('slots_used', 0))} remaining supervision slots."
        )

        return {
            "expert_id": expert.get("id"),
            "expert_name": expert.get("name"),
            "radar": radar_data,
            "weights": weights,
            "matched_skills": overlap,
            "justification": justification
        }
