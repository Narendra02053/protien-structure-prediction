import React, { createContext, useState, useContext } from 'react';

const ProteinContext = createContext();

export const ProteinProvider = ({ children }) => {
    const [proteinData, setProteinData] = useState({
        sequence: '',
        mutation: '',
        geneName: '',
        structure: null, // { pdb_string, plddt_scores, mean_plddt, sequence_length }
        analysis: null, // { llr_score, pathogenicity, clinvar_count, original_prob, mutant_prob }
        comparison: null, // { baseline_perplexity, finetuned_perplexity, improvement_percent, conclusion }
        isLoading: false,
        loadingMessage: ''
    });

    const updateProteinData = (newData) => {
        setProteinData(prev => ({ ...prev, ...newData }));
    };

    return (
        <ProteinContext.Provider value={{ proteinData, updateProteinData }}>
            {children}
        </ProteinContext.Provider>
    );
};

export const useProtein = () => useContext(ProteinContext);
