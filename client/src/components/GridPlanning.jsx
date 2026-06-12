// client/src/components/GridPlanning.jsx
import React from 'react';

const GridPlanning = ({ events }) => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const heures = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h"];

    // Fonction pour calculer la position CSS
    const getEventStyle = (event) => {
        const colIndex = jours.indexOf(event.jour) + 2; // +2 car la col 1 est pour les heures
        const startHour = event.debut.replace('h', '');
        const rowIndex = heures.indexOf(`${startHour}h`) + 2; // +2 car la ligne 1 est pour les jours

        return {
            gridColumn: colIndex,
            gridRow: rowIndex,
        };
    };

    return (
        <div className="grid grid-cols-[80px_repeat(5,1fr)] grid-rows-[50px_repeat(11,80px)] gap-2 p-4 bg-slate-50 rounded-[2rem]">
            {/* Header des Jours */}
            {jours.map((j, i) => (
                <div key={j} className="flex items-center justify-center font-black italic text-slate-400 uppercase text-[10px] tracking-widest" style={{ gridColumn: i + 2, gridRow: 1 }}>
                    {j}
                </div>
            ))}

            {/* Barre latérale des Heures */}
            {heures.map((h, i) => (
                <div key={h} className="flex items-center justify-center font-bold text-slate-300 text-xs border-r border-slate-100" style={{ gridRow: i + 2, gridColumn: 1 }}>
                    {h}
                </div>
            ))}

            {/* Affichage des cours */}
            {events.map((event, index) => (
                <div 
                    key={index}
                    style={getEventStyle(event)}
                    className="bg-violet-600 text-white p-4 rounded-[1.5rem] shadow-lg shadow-violet-100 flex flex-col justify-between border-l-4 border-violet-400 group hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black opacity-70">{event.duree}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase">{event.salle}</span>
                    </div>
                    <div>
                        <p className="text-xs font-black italic leading-none mb-1 uppercase">{event.classe}</p>
                        <p className="text-[9px] font-medium opacity-80 uppercase tracking-tighter truncate">{event.matiere}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridPlanning;