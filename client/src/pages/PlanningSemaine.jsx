import React from 'react';

const PlanningSemaine = () => {
  // 1. Obtenir la date actuelle à Paris
  const now = new Date();
  const options = { timeZone: 'Europe/Paris', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateParis = new Intl.DateTimeFormat('fr-FR', options).format(now);

  // 2. Calculer les jours de la semaine (Lundi à Vendredi)
  const getWeekDays = () => {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour que la semaine commence Lundi
    
    const monday = new Date(startOfWeek.setDate(diff));
    const days = [];

    for (let i = 0; i < 5; i++) { // 0 to 4 = Lundi à Vendredi
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      days.push({
        nom: nextDay.toLocaleDateString('fr-FR', { weekday: 'short' }),
        numero: nextDay.getDate(),
        complet: nextDay.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Planning de la semaine</h2>
        <p className="text-sm text-slate-500 font-medium capitalize">{dateParis}</p>
      </div>

      {/* Grille des jours (5 colonnes pour Lundi-Vendredi) */}
      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const isToday = day.numero === now.getDate();
          return (
            <div 
              key={day.complet} 
              className={`flex flex-col items-center p-4 rounded-lg border transition-all 
                ${isToday 
                  ? 'bg-violet-50 border-violet-200 ring-2 ring-violet-100' 
                  : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <span className={`text-xs font-bold uppercase ${isToday ? 'text-violet-600' : 'text-slate-400'}`}>
                {day.nom}
              </span>
              <span className={`text-2xl font-black mt-1 ${isToday ? 'text-violet-700' : 'text-slate-700'}`}>
                {day.numero}
              </span>
              
              {/* Zone pour les futurs cours/événements */}
              <div className="mt-4 w-full h-32 bg-white/50 rounded border border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">Aucun cours</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningSemaine;