from typing import List, Dict, Any, Set

class SetCoverCoAdvisorOptimizer:
    @staticmethod
    def optimize(
        primary_advisor_id: str,
        required_skills: List[str],
        team_skills: List[str],
        candidates: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        r"""
        Executes a Greedy Set-Cover optimization algorithm:
        ΔK = K_req \ (K_team ∪ K_primary)
        Finds candidate co-advisors that maximize coverage of ΔK.
        """
        req_set = set(s.strip().lower() for s in required_skills if s.strip())
        team_set = set(s.strip().lower() for s in team_skills if s.strip())

        # Find primary advisor
        primary_skills = set()
        for c in candidates:
            if c["id"] == primary_advisor_id:
                primary_skills = set(s.strip().lower() for s in c.get("skills", []))
                break

        # Already covered skills
        initially_covered = team_set.union(primary_skills)
        # Unaddressed skill gap: ΔK
        delta_k = req_set - initially_covered

        scored_candidates = []

        for candidate in candidates:
            # Skip the primary advisor
            if candidate["id"] == primary_advisor_id:
                continue

            cand_skills = set(s.strip().lower() for s in candidate.get("skills", []))
            
            # Intersection with unaddressed gap ΔK
            gap_covered = cand_skills.intersection(delta_k)
            # Intersection with total requirements
            total_req_covered = cand_skills.intersection(req_set)

            # Capacity availability factor
            slots_used = candidate.get("slots_used", 0)
            slots_total = candidate.get("slots_total", 5)
            avail_ratio = max(0.1, (slots_total - slots_used) / max(1, slots_total))

            # Coverage ratio of ΔK
            if len(delta_k) > 0:
                coverage_score = (len(gap_covered) / len(delta_k)) * 100
            else:
                coverage_score = (len(total_req_covered) / max(1, len(req_set))) * 100

            # Industry practitioner alignment bonus (10%)
            industry_bonus = 10 if candidate.get("is_industry", False) else 0

            # Composite co-advisory synergy score
            synergy_score = min(99, int((0.70 * coverage_score) + (0.20 * (avail_ratio * 100)) + (0.10 * industry_bonus)))

            scored_candidates.append({
                "id": candidate["id"],
                "name": candidate["name"],
                "title": candidate.get("title", "Advisor"),
                "department": candidate.get("department", "Engineering"),
                "is_industry": candidate.get("is_industry", False),
                "synergy_score": synergy_score,
                "gap_skills_covered": [s.title() for s in gap_covered],
                "all_matching_skills": [s.title() for s in total_req_covered],
                "slots_available": max(0, slots_total - slots_used),
                "quota_status": candidate.get("quota_status", "available")
            })

        # Sort by synergy score descending
        scored_candidates.sort(key=lambda x: x["synergy_score"], reverse=True)

        return {
            "required_skills": [s.title() for s in req_set],
            "covered_by_team_and_primary": [s.title() for s in initially_covered.intersection(req_set)],
            "unaddressed_gap_delta_k": [s.title() for s in delta_k],
            "recommended_co_advisors": scored_candidates
        }
