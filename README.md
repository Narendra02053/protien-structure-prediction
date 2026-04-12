# Protein Structure Prediction and Disease Mutation Analysis

A full-stack web application designed for predicting 3D protein structures and analyzing the pathogenicity of amino acid mutations using state-of-the-art Deep Learning models.

## 🚀 Project Overview
This project integrates advanced bioinformatics and machine learning to assist researchers in understanding how single-point mutations (SNPs) affect protein structure and function. It leverages **ESMFold** for atomic-accuracy structural prediction and a **Fine-tuned ESM-2 (8M)** model for variant effect prediction.

### Key Features
- **3D Structure Prediction**: Real-time folding using ESMFold API.
- **Mutation Analysis**: Pathogenicity scoring using Log Likelihood Ratio (LLR) from domain-specific fine-tuned ESM-2.
- **Clinical Evidence**: Integration with NCBI ClinVar database for known pathogenic variants.
- **Model Comparison**: Perplexity comparison proving the efficacy of domain-specific fine-tuning.
- **Interactive UI**: Dark-themed biotech dashboard with 3Dmol.js visualization and Recharts analytics.

## 🛠️ Technology Stack
- **Frontend**: React.js, Tailwind CSS, Recharts, 3Dmol.js, Lucide Icons.
- **Backend**: FastAPI (Python), PyTorch, Hugging Face Transformers.
- **Models**: ESMFold, Fine-tuned ESM-2 (Masked Language Modeling).
- **Deployment**: Docker, Docker Compose.

## 📁 Folder Structure
```text
protein-disease-predictor/
├── backend/
│   ├── models/             # Fine-tuned ESM-2 saved weights
│   ├── sample_data/         # Protein PDB files
│   ├── main.py             # FastAPI entry point
│   ├── predictor.py        # Structural prediction logic
│   ├── variant.py          # LLR & Pathogenicity logic
│   ├── clinvar.py          # NCBI API integration
│   ├── perplexity.py       # Model benchmarking
│   └── requirements.txt
├── frontend/
│   ├── src/                # React source code
│   └── package.json
├── docker-compose.yml
└── Dockerfile.backend
```

## ⚙️ Setup & Installation

### Option 1: Using Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. Access the frontend at `http://localhost:80` and API at `http://localhost:8000`.

### Option 2: Local Manual Setup
**Backend:**
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

**Frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📊 Technical Details
### Fine-tuning Results
The ESM-2 model was fine-tuned on 9,752 human protein sequences. 
- **Training Loss**: Improved from 6.58 to 1.42.
- **Perplexity Improvement**:
  - Insulin: 13.63 → 11.85
  - Hemoglobin: 14.57 → 14.40
  - Lysozyme: 18.42 → 18.29

### Pathogenicity Metric
The Log Likelihood Ratio (LLR) is calculated as:
`LLR = log(P(mutant) / P(wildtype))`
A score < -2.0 is classified as **Likely Pathogenic**.

## 🛡️ License
MIT License - Created for B.E. Computer Science Engineering Major Project.
