import requests
import io
import re

def predict_structure(sequence: str):
    """
    Calls ESMFold API and parses the PDB response.
    """
    url = "https://api.esmatlas.com/foldSequence/v1/pdb/"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    try:
        response = requests.post(url, data=sequence, headers=headers, timeout=60)
        response.raise_for_status()
        pdb_string = response.text
        
        plddt_scores = []
        # ATOM records start with ATOM
        # Residue position is column 23-26 (1-indexed)
        # B-factor (pLDDT) is column 61-66
        # Residue name is column 18-20
        
        residues_seen = set()
        total_plddt = 0
        
        lines = pdb_string.splitlines()
        for line in lines:
            if line.startswith("ATOM") and line[12:16].strip() == "CA":
                res_pos = int(line[22:26].strip())
                res_name = line[17:20].strip()
                plddt = float(line[60:66].strip())
                
                if res_pos not in residues_seen:
                    plddt_scores.append({
                        "position": res_pos,
                        "residue": res_name,
                        "score": plddt
                    })
                    residues_seen.add(res_pos)
                    total_plddt += plddt
        
        mean_plddt = total_plddt / len(plddt_scores) if plddt_scores else 0
        
        return {
            "pdb_string": pdb_string,
            "plddt_scores": plddt_scores,
            "mean_plddt": round(mean_plddt, 2),
            "sequence_length": len(sequence)
        }
    except Exception as e:
        raise Exception(f"ESMFold API Error: {str(e)}")
