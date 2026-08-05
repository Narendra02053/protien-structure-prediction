import torch
from transformers import EsmForMaskedLM, EsmTokenizer
import math

class VariantAnalyzer:
    def __init__(self, model_path):
        print(f"Loading fine-tuned ESM-2 model from {model_path}...")
        self.tokenizer = EsmTokenizer.from_pretrained(model_path)
        self.model = EsmForMaskedLM.from_pretrained(model_path)
        self.model.eval()
        if torch.cuda.is_available():
            self.model.to("cuda")

    def compute_llr(self, sequence: str, original_aa: str, position: int, mutant_aa: str, clinvar_count: int = 0):
        """
        Computes LLR = log(prob of mutant AA / prob of original AA)
        position is 1-indexed (as in A23K)
        """
        # Tokenize sequence
        inputs = self.tokenizer(sequence, return_tensors="pt")
        
        # Check if position is within sequence
        if position < 1 or position > len(sequence):
            raise ValueError("Mutation position out of bounds")

        # Mask the mutation position (0-indexed in tensor)
        # Note: ESM tokenizer adds <cls> at index 0, so position 'p' is at index 'p'
        masked_seq = list(sequence)
        masked_seq[position-1] = self.tokenizer.mask_token
        masked_inputs = self.tokenizer("".join(masked_seq), return_tensors="pt")
        
        if torch.cuda.is_available():
            masked_inputs = {k: v.to("cuda") for k, v in masked_inputs.items()}

        with torch.no_grad():
            outputs = self.model(**masked_inputs)
            logits = outputs.logits # [1, seq_len, vocab_size]
            
        # Get probabilities for mutant and original AA at the masked position
        mask_pos = position # Account for <cls> token
        token_logits = logits[0, mask_pos]
        probs = torch.softmax(token_logits, dim=-1)
        
        # Get IDs for AAs
        orig_id = self.tokenizer.convert_tokens_to_ids(original_aa)
        mut_id = self.tokenizer.convert_tokens_to_ids(mutant_aa)
        
        orig_prob = probs[orig_id].item()
        mut_prob = probs[mut_id].item()
        
        # LLR = log(P_mut / P_orig)
        llr = math.log(mut_prob / orig_prob)
        
        # Use stricter threshold + cross reference ClinVar count
        if llr < -1.5:
            pathogenicity = "Likely Pathogenic"
        elif llr < 0 and clinvar_count > 1000:
            pathogenicity = "Likely Pathogenic"
        else:
            pathogenicity = "Likely Benign"
        
        return {
            "llr_score": round(llr, 4),
            "pathogenicity": pathogenicity,
            "original_prob": round(orig_prob, 6),
            "mutant_prob": round(mut_prob, 6)
        }
