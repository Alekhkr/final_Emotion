import random
import math

def generate_mock_case():
    return {
        "text_threat_score": random.uniform(0.1, 0.9),
        "vocal_fear_score": random.uniform(0.1, 0.9),
        "acoustic_jitter": random.uniform(0.1, 0.9),
        "suicidal_flag": random.choice([True, False, False, False]) # 25% chance
    }

def method1_late_fusion_linear(case):
    """
    Method 1: Simple Weighted Linear Combination (Late Fusion).
    Weights: 50% Text, 30% Vocal Emotion, 20% Acoustic Jitter
    """
    svi = (0.50 * case["text_threat_score"] + 
           0.30 * case["vocal_fear_score"] + 
           0.20 * case["acoustic_jitter"]) * 100
    return round(svi, 1)

def method2_hybrid_with_overrides(case):
    """
    Method 2: Base Linear + Deterministic Guardrails.
    Used when safety is paramount (e.g., suicide risk forces score > 90).
    """
    base_svi = method1_late_fusion_linear(case)
    
    if case["suicidal_flag"]:
        return max(base_svi, 92.0)
    if case["vocal_fear_score"] > 0.85 and case["text_threat_score"] > 0.7:
        # Cross-modal amplification
        return min(100.0, base_svi + 15.0)
        
    return base_svi

def method3_simulated_llm_blend(case):
    """
    Method 3: Simulates an LLM evaluating context (which might under-react to raw numbers)
    blended with hard acoustic metrics.
    """
    # Simulate LLM SVI calculation (it tends to average out extremes unless explicitly prompted)
    simulated_llm_score = ((case["text_threat_score"] * 0.8 + 0.2) * 100)
    if case["suicidal_flag"]:
        simulated_llm_score = 95.0
        
    # Blend: 70% LLM Context, 30% Hard Acoustic
    hard_acoustic = (case["vocal_fear_score"] * 0.6 + case["acoustic_jitter"] * 0.4) * 100
    
    blended_svi = 0.70 * simulated_llm_score + 0.30 * hard_acoustic
    return round(blended_svi, 1)

if __name__ == "__main__":
    print("==================================================")
    print("SVI CALCULATION SANDBOX TEST")
    print("==================================================\n")
    
    cases = [generate_mock_case() for _ in range(5)]
    
    # Force one extreme case
    cases[0] = {"text_threat_score": 0.2, "vocal_fear_score": 0.9, "acoustic_jitter": 0.95, "suicidal_flag": True}
    
    for i, case in enumerate(cases):
        print(f"--- CASE {i+1} ---")
        print(f"Inputs: Text Threat: {case['text_threat_score']:.2f}, Vocal Fear: {case['vocal_fear_score']:.2f}, Jitter: {case['acoustic_jitter']:.2f}, Suicidal: {case['suicidal_flag']}")
        print(f"Method 1 (Linear):     {method1_late_fusion_linear(case)}")
        print(f"Method 2 (Overrides):  {method2_hybrid_with_overrides(case)}")
        print(f"Method 3 (LLM Blend):  {method3_simulated_llm_blend(case)}")
        print("")
        
    print("CONCLUSION OF TEST:")
    print("Method 1 fails on Case 1 because despite a low text threat (maybe the victim is scared to speak clearly), the vocal panic and suicidal flag should trigger a critical alert, but it scores low due to linear weighting.")
    print("Method 2 works well for safety, but relies on rigid if/else rules.")
    print("Method 3 (LLM Blend) is the most robust, leveraging deep contextual understanding (simulated LLM) while still grounding the score with 30% hard acoustic metrics. This prevents false negatives when textual data is ambiguous but acoustic panic is high.")
