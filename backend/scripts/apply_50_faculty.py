import json
import os
import sys

# Import FACULTY_50 from generate_50_faculty
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from generate_50_faculty import FACULTY_50

print(f"Loaded {len(FACULTY_50)} faculty records.")

# 1. Update backend/app/db/seed_data.py
seed_data_path = os.path.join(os.path.dirname(__file__), "..", "app", "db", "seed_data.py")
seed_content = f'''import json
from sqlalchemy.orm import Session
from app.models.models import User, FacultyProfile, StudentProfile
from app.core.security import get_password_hash

SEED_EXPERTS = {repr(FACULTY_50)}

def seed_faculty_and_students(db: Session):
    for item in SEED_EXPERTS:
        user = db.query(User).filter(User.id == item["id"]).first()
        if not user:
            user = User(
                id=item["id"],
                email=item["email"],
                hashed_password=get_password_hash("password123"),
                name=item["name"],
                role=item["role"],
                department=item["department"],
                is_verified=True
            )
            db.add(user)
            db.commit()

        profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == item["id"]).first()
        if not profile:
            profile = FacultyProfile(
                user_id=item["id"],
                title=item["title"],
                tier=item["tier"],
                slots_used=item["slots_used"],
                slots_total=item["slots_total"],
                quota_status=item["quota_status"],
                h_index=item["h_index"],
                office_room=item.get("office_room", "Room 401"),
                is_industry=item["is_industry"],
                bio=item["bio"],
                skills=item["skills"],
                research_areas=item["research_areas"],
                publications_data=json.dumps(item.get("publications", []))
            )
            db.add(profile)
            db.commit()
        else:
            profile.title = item["title"]
            profile.tier = item["tier"]
            profile.slots_used = item["slots_used"]
            profile.slots_total = item["slots_total"]
            profile.quota_status = item["quota_status"]
            profile.h_index = item["h_index"]
            profile.bio = item["bio"]
            profile.skills = item["skills"]
            profile.research_areas = item["research_areas"]
            profile.publications_data = json.dumps(item.get("publications", []))
            profile.is_industry = item["is_industry"]
            db.commit()

    stu = db.query(User).filter(User.id == "stu-1").first()
    if not stu:
        stu = User(
            id="stu-1",
            email="abu.zafor@diu.edu.bd",
            hashed_password=get_password_hash("password123"),
            name="Abu Zafor",
            role="student",
            department="Software Engineering",
            is_verified=True
        )
        db.add(stu)
        db.commit()

        stu_prof = StudentProfile(
            user_id=stu.id,
            student_id="232-35-331",
            batch=41,
            section="A",
            skills="TinyML, CMSIS-NN, React, BLE 5.0, Python, Sensor Fusion"
        )
        db.add(stu_prof)
        db.commit()

def ensure_seeded(db: Session):
    count = db.query(FacultyProfile).count()
    if count < len(SEED_EXPERTS):
        seed_faculty_and_students(db)
'''

with open(seed_data_path, "w", encoding="utf-8") as f:
    f.write(seed_content)
print(f"Updated {seed_data_path} with {len(FACULTY_50)} faculty profiles.")

# 2. Update frontend/src/data/mockData.ts
mock_data_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "data", "mockData.ts")

# Generate TS objects for mockExperts
ts_experts = []
for fac in FACULTY_50:
    skills_arr = [s.strip() for s in fac["skills"].split(",") if s.strip()]
    areas_arr = [a.strip() for a in fac["research_areas"].split(",") if a.strip()]
    
    pubs_ts = []
    for p_idx, p in enumerate(fac.get("publications", [])):
        pubs_ts.append(f"""      {{
        id: 'pub-{fac["id"]}-{p_idx}',
        title: {json.dumps(p.get("title", ""))},
        venue: {json.dumps(p.get("venue", "IEEE / ACM"))},
        year: {p.get("year", 2024)},
        citations: {p.get("citations", 10)},
        abstract: {json.dumps(p.get("abstract", ""))}
      }}""")
    pubs_str = ",\n".join(pubs_ts)
    
    ts_experts.append(f"""  {{
    id: '{fac["id"]}',
    name: {json.dumps(fac["name"])},
    email: '{fac["email"]}',
    role: '{fac["role"]}',
    department: {json.dumps(fac["department"])},
    title: {json.dumps(fac["title"])},
    tier: {fac["tier"]},
    slotsUsed: {fac["slots_used"]},
    slotsTotal: {fac["slots_total"]},
    quotaStatus: '{fac["quota_status"]}',
    researchAreas: {json.dumps(areas_arr)},
    skills: {json.dumps(skills_arr)},
    hIndex: {fac["h_index"]},
    publications: [
{pubs_str}
    ],
    rating: {round(4.5 + (fac["h_index"] % 5) * 0.1, 1)},
    officeHours: officeHoursTemplate,
    bio: {json.dumps(fac["bio"])},
    isIndustry: {'true' if fac["is_industry"] else 'false'}
  }}""")

all_ts_experts = ",\n".join(ts_experts)

with open(mock_data_path, "r", encoding="utf-8") as f:
    full_text = f.read()

# Find start of mockExperts and start of mockStudents
start_idx = full_text.find("export const mockExperts: Expert[] = [")
end_idx = full_text.find("export const mockStudents: Student[] = [")

if start_idx != -1 and end_idx != -1:
    new_mock_data = full_text[:start_idx] + f"export const mockExperts: Expert[] = [\n{all_ts_experts}\n];\n\n" + full_text[end_idx:]
    with open(mock_data_path, "w", encoding="utf-8") as f:
        f.write(new_mock_data)
    print(f"Updated {mock_data_path} with {len(FACULTY_50)} mock experts.")
else:
    print("Could not find start/end indices in mockData.ts!")
