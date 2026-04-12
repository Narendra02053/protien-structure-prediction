from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import os
import re

from predictor import predict_structure
from variant import VariantAnalyzer
from clinvar import fetch_clinvar_pathogenic_count, get_disease_details
from uniprot import get_organ_affected
from perplexity import PerplexityComparator

app = FastAPI(title="Protein Disease Predictor API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models (loaded on startup)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "esm2-finetuned-final")
analyzer = None
comparator = None

@app.on_event("startup")
async def load_models():
    global analyzer, comparator
    print("Startup event triggered. Path check...")
    if os.path.exists(MODEL_PATH):
        try:
            print(f"Loading analyzer from {MODEL_PATH}...")
            analyzer = VariantAnalyzer(MODEL_PATH)
            print("Analyzer loaded. Loading comparator...")
            comparator = PerplexityComparator(finetuned_path=MODEL_PATH)
            print("Models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
    else:
        print(f"Model path {MODEL_PATH} not found. Some features will be disabled.")

# Pydantic Models for Validation
class SequenceRequest(BaseModel):
    sequence: str = Field(..., max_length=400)

    @validator('sequence')
    def validate_sequence(cls, v):
        if not re.match(r'^[ACDEFGHIKLMNPQRSTVWY]+$', v.upper()):
            raise ValueError('Sequence must only contain standard amino acid characters')
        return v.upper()

class AnalyzeRequest(BaseModel):
    sequence: str = Field(..., max_length=400)
    mutation: str = Field(..., pattern=r'^[A-Z]\d+[A-Z]$')
    gene_name: str

    @validator('sequence')
    def validate_sequence(cls, v):
        if not re.match(r'^[ACDEFGHIKLMNPQRSTVWY]+$', v.upper()):
            raise ValueError('Sequence must only contain standard amino acid characters')
        return v.upper()

# Endpoints
@app.post("/predict")
async def endpoint_predict(req: SequenceRequest):
    try:
        result = predict_structure(req.sequence)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def endpoint_analyze(req: AnalyzeRequest):
    if analyzer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Parse mutation A23K
        match = re.match(r'^([A-Z])(\d+)([A-Z])$', req.mutation)
        orig_aa, pos, mut_aa = match.groups()
        pos = int(pos)
        
        # 1. ClinVar Pathogenic Var Count
        clinvar_count = fetch_clinvar_pathogenic_count(req.gene_name)
        
        # 2. AI Analysis (LLR Score thresholded with ClinVar data)
        analysis = analyzer.compute_llr(req.sequence, orig_aa, pos, mut_aa, clinvar_count)
        
        # 3. Specific Disease & Severity (ClinVar)
        disease_name, severity = get_disease_details(req.gene_name, req.mutation)
        
        # 4. Organs Affected (UniProt)
        organs_affected = get_organ_affected(req.gene_name)
        
        # Combine results
        analysis.update({
            "gene_name": req.gene_name,
            "mutation": req.mutation,
            "clinvar_count": clinvar_count,
            "disease_name": disease_name,
            "severity": severity,
            "organs_affected": organs_affected,
            "plddt_at_position": None # Filled by frontend
        })
        
        return analysis
    except Exception as e:
        print(f"Server Error in /analyze: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def endpoint_compare(req: SequenceRequest):
    if comparator is None:
        raise HTTPException(status_code=503, detail="Comparator models not loaded")
    
    try:
        return comparator.compare(req.sequence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models_loaded": analyzer is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
