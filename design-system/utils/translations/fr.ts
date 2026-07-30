import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'fr',
    $name: 'Français',
    $dir: 'ltr',

    carousel: 'Carrousel',
    clearEntry: "Effacer l'entrée",
    close: 'Fermer',
    copied: 'Copié',
    copy: 'Copier',
    currentValue: 'Valeur actuelle',
    error: 'Erreur',
    goToSlide: (slide, count) => `Aller à la diapositive ${slide} de ${count}`,
    hidePassword: 'Masquer le mot de passe',
    loading: 'Chargement',
    nextSlide: 'Diapositive suivante',
    numOptionsSelected: num => {
        if (num === 0) return 'Aucune option sélectionnée';
        if (num === 1) return '1 option sélectionnée';
        return `${num} options sélectionnées`;
    },
    previousSlide: 'Diapositive précédente',
    progress: 'Progrès',
    remove: 'Retirer',
    resize: 'Redimensionner',
    scrollToEnd: "Faire défiler jusqu'à la fin",
    scrollToStart: "Faire défiler jusqu'au début",
    selectAColorFromTheScreen: "Sélectionnez une couleur à l'écran",
    showPassword: 'Montrer le mot de passe',
    slideNum: slide => `Diapositive ${slide}`,
    noOptionsFound: 'Aucune option correspondante',
    toggleColorFormat: 'Changer le format de couleur',
};

registerTranslation(translation);

registerCalendarLocale('fr', {
    calendarText: {
        months: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
        ],
        monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        weekdaysShort: ['DI', 'LU', 'MA', 'ME', 'JE', 'VE', 'SA'],
    },
    error: {
        required: () => 'Ce champ est obligatoire.',
        invalidDate: () => 'Saisissez une date valide.',
        minDate: p => `La date doit être le ${p?.minDate} ou après.`,
        maxDate: p => `La date doit être le ${p?.maxDate} ou avant.`,
        minYear: p => `L'année doit être ≥ ${p?.minYear}.`,
        maxYear: p => `L'année doit être ≤ ${p?.maxYear}.`,
        disabledDate: () => "Cette date n'est pas autorisée.",
        disablePast: () => "Les dates avant aujourd'hui ne sont pas autorisées.",
        disableFuture: () => "Les dates après aujourd'hui ne sont pas autorisées.",
        startAfterEnd: () => 'La date de début doit être antérieure ou égale à la date de fin.',
        endBeforeStart: () => 'La date de fin doit être postérieure ou égale à la date de début.',
    },
    buttons: { ok: 'OK', cancel: 'Annuler' },
    aria: {
        previousMonth: 'Mois précédent',
        nextMonth: 'Mois suivant',
        openCalendar: 'Ouvrir le calendrier',
        selectMonth: 'Sélectionner le mois',
        selectYear: "Sélectionner l'année",
        weekdays: 'Jours de la semaine',
        calendarDateSelection: 'Sélection de date du calendrier',
        calendarIconStart: 'Ouvrir le calendrier pour la date de début',
        calendarIconEnd: 'Ouvrir le calendrier pour la date de fin',
    },
    rangeDialog: 'Plage de dates sélectionnée',
    fallback: { start: 'Date de début', end: 'Date de fin' },
    shortcuts: {
        0: 'Cette semaine',
        1: 'La semaine prochaine',
        2: 'Les 2 prochaines semaines',
        3: 'Les 3 prochaines semaines',
        4: 'Les 4 prochaines semaines',
        5: 'Ce mois-ci',
        6: 'Le mois prochain',
    },
    datePlaceholders: {
        DMY_SLASH: 'JJ/MM/AAAA',
    },
});

registerDropzoneLocale('fr', {
    titles: {
        dropzoneTitle: 'Déposez des fichiers ici ou cliquez pour parcourir',
        dragTitle: 'Déposez les fichiers pour les téléverser',
        fileLoadedTitle: 'Fichier sélectionné',
        maxFilesReachedTitle: 'Nombre maximal de fichiers atteint',
    },
    error: {
        required: () => 'Veuillez sélectionner au moins un fichier.',
        fileTooLarge: p => `Le fichier « ${p?.name} » dépasse la taille maximale de ${p?.max}.`,
        fileTooSmall: p => `Le fichier « ${p?.name} » est inférieur à la taille minimale de ${p?.min}.`,
        invalidFileType: p => `Le fichier « ${p?.name} » a un type de fichier non valide.`,
        maxFilesReached: p => `Le nombre maximum de fichiers (${p?.maxFiles}) est déjà atteint.`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Vous pouvez ajouter seulement ${p?.remaining} ${n === 1 ? 'fichier' : 'fichiers'} supplémentaire(s).`;
        },
    },
    fileWord: n => (n === 1 ? 'fichier' : 'fichiers'),
});

registerTableLocale('fr', {
    searchPlaceholder: 'Rechercher…',
    searchAriaLabel: 'Rechercher',
    pageSizeLabel: 'Afficher',
    pageSizeSuffix: 'entrées',
    pageSizeAriaLabel: 'Éléments par page',
    showingEntries: (from, to, total) => `Affichage de ${from} à ${to} sur ${total} entrées`,
    noData: 'Aucune donnée',
});

export default translation;
