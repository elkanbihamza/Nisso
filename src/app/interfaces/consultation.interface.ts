export interface Consultation {
    id_consultation: number;
    motif: string,
    temperature: number,
    symptomes: string,
    tension_arterielle_systolique: number,
    tension_arterielle_diastolique: number,
    saturation_oxygene: number,
    frequence_cardiaque: number,
    poids: number,
    taille: number,
    diagnostic_principal: string,
    traitement: string
}