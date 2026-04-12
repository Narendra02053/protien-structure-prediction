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
        organs_to_check = [
            "Brain", "Heart", "Liver", "Kidney", "Lung", "Breast", 
            "Colon", "Pancreas", "Blood", "Muscle", "Skin", "Bone"
        ]
        
        matched_organs = []
        for organ in organs_to_check:
            if organ.lower() in tissue_text.lower():
                matched_organs.append(organ)
                
        return matched_organs if matched_organs else ["General Tissue"]

    except Exception as e:
        print(f"Error fetching UniProt data: {e}")
        return ["Not found in database"]
