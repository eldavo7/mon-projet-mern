
// client/src/utils/formatters.js

/**
 * Formate le nom et prénom au standard administratif : John DOE
 */
export const formatFullName = (prenom, nom) => {
    if (!prenom || !nom) return "";
    
    const formattedPrenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    const formattedNom = nom.toUpperCase();
    
    return `${formattedPrenom} ${formattedNom}`;
};

/**
 * Optionnel : Une fonction pour n'avoir que le NOM en majuscule
 */
export const formatLastName = (nom) => nom ? nom.toUpperCase() : "";