import requests
import json

def fetch_clinvar_pathogenic_count(gene_name: str):
    """
    Calls ClinVar NCBI API to get count of known pathogenic variants for a gene.
    """
    try:
        url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        params = {
            "db": "clinvar",
            "term": f"{gene_name}[gene] AND pathogenic[clinical_significance]",
            "retmode": "json"
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        count = data.get("esearchresult", {}).get("count", "0")
        return int(count)
    except Exception as e:
        print(f"Error fetching ClinVar count: {e}")
        return 0

def get_disease_details(gene_name: str, mutation: str):
    """
    Fetches specific disease name and severity from NCBI ClinVar APIs.
    """
    import xml.etree.ElementTree as ET
    
    try:
        search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        
        searches = [
            f"{mutation}[variant name] AND {gene_name}[gene]",
            f"{gene_name}[gene] AND pathogenic[clinical_significance]",
            f"{gene_name}[gene]"
        ]
        
        variant_id = None
        for term in searches:
            params = {
                "db": "clinvar",
                "term": term,
                "retmax": 1,
                "retmode": "json"
            }
            response = requests.get(search_url, params=params, timeout=10)
            response.raise_for_status()
            search_data = response.json()
            id_list = search_data.get("esearchresult", {}).get("idlist", [])
            if id_list:
                variant_id = id_list[0]
                break
                
        if not variant_id:
            return "Not found in database", "Unknown"

        # 2. Get Summary for that ID
        summary_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
        summary_params = {
            "db": "clinvar",
            "id": variant_id,
            "retmode": "json"
        }
        
        summary_resp = requests.get(summary_url, params=summary_params, timeout=10)
        summary_resp.raise_for_status()
        summary_data = summary_resp.json()
        
        uid_data = summary_data.get("result", {}).get(variant_id, {})
        
        # Extract disease name using cascading priority
        disease_name = "Not found in database"
        
        # Try these fields in order
        try:
            disease_name = uid_data["germline_classification"]["trait_set"][0]["trait_name"]
        except:
            try:
                disease_name = uid_data["trait_set"][0]["trait_name"]
            except:
                pass
        
        # If trait_name wasn't found, try description
        if disease_name == "Not found in database" or disease_name == "":
            try:
                disease_name = uid_data["germline_classification"]["description"]
            except:
                pass
                
        # If still not found, try title
        if disease_name == "Not found in database" or disease_name == "":
            try:
                disease = uid_data["title"]
                # clean up — remove variant notation
                if "(" in disease:
                    disease = disease.split("AND")[-1].strip()
                    disease = disease.replace(")", "").replace("(", "").strip()
                disease_name = disease
            except:
                pass
        
        # Extract severity
        severity_data = uid_data.get("clinical_significance", {})
        severity = severity_data.get("description", "Unknown")
        
        return disease_name, severity

    except Exception as e:
        print(f"Error fetching disease details: {e}")
        return "Not found in database", "Unknown"
