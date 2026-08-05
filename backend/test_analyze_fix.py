"""Test /analyze with a short BRCA1 fragment that fits under 400 chars"""
import requests, json

BASE = "http://127.0.0.1:8000"

# Use first 200 residues of BRCA1 so it stays under 400-char limit
# C61G mutation is at position 61, well within range
short_brca1 = (
    "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGP"
    "SQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPE"
    "HLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQ"
    "KTSVYIELGSDSSEDTVNK"
)

print(f"Sequence length: {len(short_brca1)}")
print(f"\n{'='*60}")
print(f"  Analyze Mutation (BRCA1 C61G)")
print(f"  POST {BASE}/analyze")
print(f"{'='*60}")

r = requests.post(f"{BASE}/analyze", json={
    "sequence": short_brca1,
    "mutation": "C61G",
    "gene_name": "BRCA1"
}, timeout=60)

print(f"Status: {r.status_code}")
print(f"Response:\n{json.dumps(r.json(), indent=2)}")
