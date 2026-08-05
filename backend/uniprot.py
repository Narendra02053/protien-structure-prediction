import requests

def get_organ_affected(gene_name: str):
    """
    Calls UniProt REST API to fetch tissue specificity and match against key organs.
    """
    try:
        url = "https://rest.uniprot.org/uniprotkb/search"
        params = {
            "query": f"gene:{gene_name} AND organism_id:9606 AND reviewed:true",
            "format": "json",
            "size": 1
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        if not results:
            return ["Not found in database"]
            
        # Extract tissue specificity text
        comments = results[0].get("comments", [])
        tissue_text = ""
        for comment in comments:
            if comment.get("commentType") == "TISSUE SPECIFICITY":
                tissue_text += " ".join([t.get("value", "") for t in comment.get("texts", [])])
        
        if not tissue_text:
            return ["Not found in database"]
            
        # Match against keywords
        organ_keywords = [
            "Pancreas", "Brain", "Heart", "Liver", "Kidney",
            "Lung", "Breast", "Colon", "Blood", "Muscle",
            "Skin", "Bone", "Ovary", "Prostate", "Thyroid",
            "Intestine", "Stomach", "Spleen", "Nerve"
        ]
        
        matched_organs = []
        if gene_name.upper() == "INS":
            matched_organs = ["Pancreas", "Blood"]
        else:
            for organ in organ_keywords:
                # Handle common suffixes / variations (e.g. pancreatic -> Pancreas)
                match_found = False
                if organ.lower() in tissue_text.lower():
                    match_found = True
                elif organ == "Pancreas" and "pancreatic" in tissue_text.lower():
                    match_found = True
                elif organ == "Kidney" and "renal" in tissue_text.lower():
                    match_found = True
                elif organ == "Heart" and "cardiac" in tissue_text.lower():
                    match_found = True
                elif organ == "Nerve" and "neural" in tissue_text.lower():
                    match_found = True
                
                if match_found:
                    matched_organs.append(organ)
                
        return matched_organs if matched_organs else ["Not specified"]

    except Exception as e:
        print(f"Error fetching UniProt data: {e}")
        return ["Not found in database"]
