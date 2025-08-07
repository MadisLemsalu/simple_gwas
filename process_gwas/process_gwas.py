import re
from thefuzz import process as fuzzy_process, fuzz

# --- Constants ---
STANDARD_COLUMNS = {
    # Required
    'VARIANT_ID': {'required': True, 'dtype': str, 'fuzzy_aliases': ['variant_id', 'snp', 'markername', 'id']},
    'CHR': {'required': True, 'dtype': str, 'fuzzy_aliases': ['chrom', 'chromosome', '#chr', 'chr_name']},
    'BP': {'required': True, 'dtype': int, 'fuzzy_aliases': ['pos', 'position', 'basepair', 'base_pair_location']},
    'EA': {'required': True, 'dtype': str, 'fuzzy_aliases': ['effect_allele', 'alt', 'allele1', 'a1']},
    'NEA': {'required': True, 'dtype': str, 'fuzzy_aliases': ['non_effect_allele', 'ref', 'allele2', 'a2', 'other_allele']},
    'EAF': {'required': True, 'dtype': float, 'fuzzy_aliases': ['effect_allele_frequency', 'freq', 'maf', 'frq']},
    'EFFECT': {'required': True, 'dtype': float, 'fuzzy_aliases': ['beta', 'b', 'effect_size']},
    'STDERR': {'required': True, 'dtype': float, 'fuzzy_aliases': ['se', 'standard_error']},
    'P_VALUE': {'required': True, 'dtype': float, 'fuzzy_aliases': ['p', 'pval', 'pvalue', 'p.value']},
    'N': {'required': True, 'dtype': int, 'fuzzy_aliases': ['n', 'sample_size', 'samplesize']},
    # Optional
    'RSID': {'required': False, 'dtype': str, 'fuzzy_aliases': ['rs_id', 'rs', 'snp_rsid']},
    'OR': {'required': False, 'dtype': float, 'fuzzy_aliases': ['odds_ratio', 'oddsratio']},
    'INFO': {'required': False, 'dtype': float, 'fuzzy_aliases': ['info_score', 'imputation_quality', 'rsq']},
    'N_CASES': {'required': False, 'dtype': int, 'fuzzy_aliases': ['n_case', 'ncases', 'num_cases']},
    'N_CONTROLS': {'required': False, 'dtype': int, 'fuzzy_aliases': ['n_control', 'ncontrols', 'num_controls']},
    'IMPUTED': {'required': False, 'dtype': int, 'fuzzy_aliases': ['imputed_status', 'was_imputed']},
}

FUZZY_MATCH_THRESHOLD = 80

def standardize_header(header_row):
    """
    Standardizes a GWAS header row using fuzzy matching.
    Args:
        header_row (list): A list of column names from the GWAS file header.
    Returns:
        tuple: A tuple containing:
            - dict: The column mapping from standard names to input names.
            - list: A list of warnings.
            - list: A list of errors.
    """
    column_mapping = {}
    warnings = []
    errors = []
    used_input_cols = set()

    for std_col, details in STANDARD_COLUMNS.items():
        remaining_input_cols = [col for col in header_row if col not in used_input_cols]
        if not remaining_input_cols:
            break

        match_result = fuzzy_process.extractOne(
            std_col,
            remaining_input_cols,
            scorer=fuzz.token_sort_ratio,
            score_cutoff=FUZZY_MATCH_THRESHOLD
        )

        if match_result:
            best_match_input, score = match_result
            column_mapping[std_col] = {"mapped_from": best_match_input, "score": score}
            used_input_cols.add(best_match_input)
        else:
            if details['required']:
                errors.append(f"Missing required column: {std_col}")

    unmapped_cols = [col for col in header_row if col not in used_input_cols]
    if unmapped_cols:
        warnings.append(f"Unmapped columns: {', '.join(unmapped_cols)}")
        
    return column_mapping, warnings, errors

if __name__ == "__main__":
    # Example usage for testing
    header = ["snpid", "chrom", "pos", "allele1", "allele2", "p", "maf"]
    mapping, warnings, errors = standardize_header(header)
    print("Column Mapping:", mapping)
    print("Warnings:", warnings)
    print("Errors:", errors)
