from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.pdf_dossier import BAETEDossierService

router = APIRouter(prefix="/reports", tags=["Accreditation & Institutional Governance"])

@router.get("/accreditation/summary")
def get_accreditation_summary(
    term: str = Query("Fall 2026", description="Academic semester term"),
    department: str = Query("Software Engineering", description="Department scope"),
    db: Session = Depends(get_db)
):
    """Returns dynamic statistics, faculty workload counts, and Merkle chain validity for UI preview."""
    data = BAETEDossierService.get_dossier_data(db, term=term, department=department)
    return data

@router.get("/accreditation/pdf")
def export_accreditation_pdf(
    term: str = Query("Fall 2026", description="Academic semester term"),
    department: str = Query("Software Engineering", description="Department scope"),
    db: Session = Depends(get_db)
):
    """Generates an official, signed BAETE Criterion 4 & 5 Accreditation PDF dossier on CPU."""
    pdf_bytes = BAETEDossierService.generate_pdf(db, term=term, department=department)
    filename = f"BAETE_Accreditation_Dossier_{term.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.get("/accreditation/csv")
def export_accreditation_csv(
    term: str = Query("Fall 2026", description="Academic semester term"),
    department: str = Query("Software Engineering", description="Department scope"),
    db: Session = Depends(get_db)
):
    """Exports structured supervisory workload and Merkle ledger as signed CSV."""
    csv_text = BAETEDossierService.generate_csv(db, term=term, department=department)
    filename = f"BAETE_Supervisory_Ledger_{term.replace(' ', '_')}.csv"
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
