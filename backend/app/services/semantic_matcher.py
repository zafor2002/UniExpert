from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SemanticVectorMatcher:
    def __init__(self):
        # 100% Free, zero-cost, sublinear TF-IDF with character and word n-grams (1 to 3)
        self.vectorizer = TfidfVectorizer(
            sublinear_tf=True,
            ngram_range=(1, 3),
            stop_words='english',
            token_pattern=r"(?u)\b[\w\-\.\+\#]{2,}\b"
        )
        self.is_fitted = False
        self.faculty_corpus: List[str] = []
        self.faculty_ids: List[str] = []
        self.faculty_tfidf_matrix = None

    def build_corpus(self, faculty_records: List[Dict[str, Any]]):
        """
        Builds and vectorizes the faculty publication & research corpus.
        faculty_records: list of dicts with 'id', 'name', 'research_areas', 'publications', 'bio', 'skills'
        """
        self.faculty_corpus = []
        self.faculty_ids = []

        for record in faculty_records:
            self.faculty_ids.append(record["id"])
            # Combine all research signals
            areas = " ".join(record.get("research_areas", []))
            skills = " ".join(record.get("skills", []))
            bio = record.get("bio", "")
            
            pub_texts = []
            for pub in record.get("publications", []):
                pub_texts.append(f"{pub.get('title', '')} {pub.get('abstract', '')}")
            all_pubs = " ".join(pub_texts)

            corpus_entry = f"{areas} {areas} {skills} {skills} {all_pubs} {bio}"
            self.faculty_corpus.append(corpus_entry)

        if self.faculty_corpus:
            self.faculty_tfidf_matrix = self.vectorizer.fit_transform(self.faculty_corpus)
            self.is_fitted = True

    def calculate_similarities(self, proposal_text: str) -> Dict[str, float]:
        """
        Computes cosine similarity between proposal and all indexed faculty.
        Returns a dict mapping faculty_id -> cosine_similarity (0.0 to 1.0).
        """
        if not self.is_fitted or self.faculty_tfidf_matrix is None:
            return {}

        proposal_vec = self.vectorizer.transform([proposal_text])
        sim_matrix = cosine_similarity(proposal_vec, self.faculty_tfidf_matrix)
        
        sims = sim_matrix[0]
        results = {}
        for idx, fac_id in enumerate(self.faculty_ids):
            # Float normalized between 0.05 and 0.98
            raw_sim = float(sims[idx])
            results[fac_id] = round(raw_sim, 4)

        return results

    def extract_top_matching_terms(self, proposal_text: str, faculty_idx: int, top_n: int = 5) -> List[Tuple[str, float]]:
        """
        Extracts the highest-weight shared n-grams for Explainable AI (XAI) feature attribution.
        """
        if not self.is_fitted or self.faculty_tfidf_matrix is None:
            return []

        feature_names = np.array(self.vectorizer.get_feature_names_out())
        proposal_vec = self.vectorizer.transform([proposal_text]).toarray()[0]
        fac_vec = self.faculty_tfidf_matrix[faculty_idx].toarray()[0]

        # Element-wise product gives shared contribution
        overlap_weights = proposal_vec * fac_vec
        top_indices = np.argsort(overlap_weights)[::-1]

        top_terms = []
        for idx in top_indices:
            if overlap_weights[idx] > 0 and len(top_terms) < top_n:
                top_terms.append((feature_names[idx], round(float(overlap_weights[idx]), 4)))

        return top_terms
