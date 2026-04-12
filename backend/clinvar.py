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
        
        # Strategy A: trait_set
        trait_set = uid_data.get("trait_set", [])
        if trait_set and len(trait_set) > 0 and disease_name == "Not found in database":
            tn = trait_set[0].get("trait_name")
            if tn: disease_name = tn if isinstance(tn, str) else str(tn)
            
        # Strategy B: variation_set
        variation_set = uid_data.get("variation_set", [])
        if variation_set and len(variation_set) > 0 and disease_name == "Not found in database":
            vn = variation_set[0].get("variation_name")
            if vn: disease_name = vn if isinstance(vn, str) else str(vn)
            
        # Strategy C: condition_list
        condition_list = uid_data.get("condition_list", [])
        if condition_list and len(condition_list) > 0 and disease_name == "Not found in database":
            cn = condition_list[0].get("condition_name")
            if cn: disease_name = cn if isinstance(cn, str) else str(cn)

        # Strategy D: efetch backoff
        if disease_name == "Not found in database":
            try:
                fetch_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=clinvar&id={variant_id}&rettype=clinvarset&retmode=json"
                fetch_resp = requests.get(fetch_url, timeout=10)
                # Parse depending on the structure returned
                if 'json' in fetch_resp.headers.get('Content-Type', '').lower():
                    f_data = fetch_resp.json()
                    # Just attempt extraction if valid JSON structure provided
                    disease_name = str(f_data)
                elif '<Condition ' in fetch_resp.text:
                    root = ET.fromstring(fetch_resp.text)
                    for condition in root.iter('ConditionName'):
                        disease_name = condition.text
                        break
            except Exception as fe:
                pass
        
        # Extract severity
        severity_data = uid_data.get("clinical_significance", {})
        severity = severity_data.get("description", "Unknown")
        
        return disease_name, severity

    except Exception as e:
        print(f"Error fetching disease details: {e}")
        return "Not found in database", "Unknown"
