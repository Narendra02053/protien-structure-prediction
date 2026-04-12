import torch
from transformers import EsmForMaskedLM, EsmTokenizer
import math

class PerplexityComparator:
    def __init__(self, baseline_path="facebook/esm2_t6_8M_UR50D", finetuned_path="./models/esm2-finetuned-final"):
        print(f"Loading baseline model: {baseline_path}")
        self.baseline_tokenizer = EsmTokenizer.from_pretrained(baseline_path)
        self.baseline_model = EsmForMaskedLM.from_pretrained(baseline_path)
        
        print(f"Loading fine-tuned model: {finetuned_path}")
        self.finetuned_tokenizer = EsmTokenizer.from_pretrained(finetuned_path)
        self.finetuned_model = EsmForMaskedLM.from_pretrained(finetuned_path)
        
        self.baseline_model.eval()
        self.finetuned_model.eval()
        
        if torch.cuda.is_available():
            self.baseline_model.to("cuda")
            self.finetuned_model.to("cuda")

    def calculate_perplexity(self, model, tokenizer, sequence):
        inputs = tokenizer(sequence, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
            
        with torch.no_grad():
            outputs = model(**inputs, labels=inputs["input_ids"])
            loss = outputs.loss.item()
            
        return math.exp(loss)

    def compare(self, sequence):
        base_ppl = self.calculate_perplexity(self.baseline_model, self.baseline_tokenizer, sequence)
        fine_ppl = self.calculate_perplexity(self.finetuned_model, self.finetuned_tokenizer, sequence)
        
        improvement = ((base_ppl - fine_ppl) / base_ppl) * 100
        
        return {
            "baseline_perplexity": round(base_ppl, 2),
            "finetuned_perplexity": round(fine_ppl, 2),
            "improvement_percent": round(improvement, 2),
            "conclusion": "Fine-tuned model outperforms baseline" if fine_ppl < base_ppl else "Baseline performs better"
        }
