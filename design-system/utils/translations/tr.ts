import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'tr',
    $name: 'Türkçe',
    $dir: 'ltr',

    carousel: 'Atlıkarınca',
    clearEntry: 'Girişi sil',
    close: 'Kapat',
    copied: 'Kopyalandı',
    copy: 'Kopya',
    currentValue: 'Mevcut değer',
    error: 'Hata',
    goToSlide: (slide, count) => `${count} slayttan ${slide} slayta gidin`,
    hidePassword: 'Şifreyi sakla',
    loading: 'Yükleme',
    nextSlide: 'Sonraki slayt',
    numOptionsSelected: num => {
        if (num === 0) return 'Hiçbir seçenek seçilmedi';
        if (num === 1) return '1 seçenek seçildi';
        return `${num} seçenek seçildi`;
    },
    previousSlide: 'Bir onceki slayt',
    progress: 'İlerleme',
    remove: 'Kaldır',
    resize: 'Yeniden boyutlandır',
    scrollToEnd: 'Sona kay',
    scrollToStart: 'Başa kay',
    selectAColorFromTheScreen: 'Ekrandan bir renk seçin',
    showPassword: 'Şifreyi göster',
    slideNum: slide => `Slayt ${slide}`,
    noOptionsFound: 'Eşleşen seçenek yok',
    toggleColorFormat: 'Renk biçimini değiştir',
};

registerTranslation(translation);

registerCalendarLocale('tr', {
    calendarText: {
        months: [
            'Ocak',
            'Şubat',
            'Mart',
            'Nisan',
            'Mayıs',
            'Haziran',
            'Temmuz',
            'Ağustos',
            'Eylül',
            'Ekim',
            'Kasım',
            'Aralık',
        ],
        monthsShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        weekdaysShort: ['PA', 'PT', 'SA', 'ÇA', 'PE', 'CU', 'CT'],
    },
    error: {
        required: () => 'Bu alan zorunludur.',
        invalidDate: () => 'Geçerli bir tarih girin.',
        minDate: p => `Tarih ${p?.minDate} veya sonrasında olmalıdır.`,
        maxDate: p => `Tarih ${p?.maxDate} veya öncesinde olmalıdır.`,
        minYear: p => `Yıl ≥ ${p?.minYear} olmalıdır.`,
        maxYear: p => `Yıl ≤ ${p?.maxYear} olmalıdır.`,
        disabledDate: () => 'Bu tarih kullanılamaz.',
        disablePast: () => 'Bugünden önceki tarihlere izin verilmez.',
        disableFuture: () => 'Bugünden sonraki tarihlere izin verilmez.',
        startAfterEnd: () => 'Başlangıç tarihi bitiş tarihinden önce veya ona eşit olmalıdır.',
        endBeforeStart: () => 'Bitiş tarihi başlangıç tarihinden sonra veya ona eşit olmalıdır.',
    },
    buttons: { ok: 'Tamam', cancel: 'İptal' },
    aria: {
        previousMonth: 'Önceki ay',
        nextMonth: 'Sonraki ay',
        openCalendar: 'Takvimi aç',
        selectMonth: 'Ay seçin',
        selectYear: 'Yıl seçin',
        weekdays: 'Haftanın günleri',
        calendarDateSelection: 'Takvim tarih seçimi',
        calendarIconStart: 'Başlangıç tarihi için takvimi aç',
        calendarIconEnd: 'Bitiş tarihi için takvimi aç',
    },
    rangeDialog: 'Seçilen tarih aralığı',
    fallback: { start: 'Başlangıç tarihi', end: 'Bitiş tarihi' },
    shortcuts: {
        0: 'Bu hafta',
        1: 'Gelecek hafta',
        2: 'Gelecek 2 hafta',
        3: 'Gelecek 3 hafta',
        4: 'Gelecek 4 hafta',
        5: 'Bu ay',
        6: 'Gelecek ay',
    },
    datePlaceholders: {
        DMY_DOT: 'GG.AA.YYYY',
    },
});

registerDropzoneLocale('tr', {
    titles: {
        dropzoneTitle: 'Dosyaları buraya bırakın veya seçmek için tıklayın',
        dragTitle: 'Yüklemek için dosyaları bırakın',
        fileLoadedTitle: 'Dosya seçildi',
        maxFilesReachedTitle: 'Maksimum dosya sayısına ulaşıldı',
    },
    error: {
        required: () => 'Lütfen en az bir dosya seçin.',
        fileTooLarge: p => `"${p?.name}" dosyası maksimum boyut olan ${p?.max} değerini aşıyor.`,
        fileTooSmall: p => `"${p?.name}" dosyası minimum boyut olan ${p?.min} değerinden küçük.`,
        invalidFileType: p => `"${p?.name}" dosya türü geçersiz.`,
        maxFilesReached: p => `Maksimum dosya sayısına (${p?.maxFiles}) zaten ulaşıldı.`,
        onlyNMoreFiles: p => `Sadece ${p?.remaining} adet daha dosya eklenebilir.`,
    },
    fileWord: () => 'dosya',
});

registerTableLocale('tr', {
    searchPlaceholder: 'Ara…',
    searchAriaLabel: 'Ara',
    pageSizeLabel: 'Göster',
    pageSizeSuffix: 'kayıt',
    pageSizeAriaLabel: 'Sayfa başına kayıt',
    showingEntries: (from, to, total) => `${total} kayıttan ${from}–${to} arası gösteriliyor`,
    noData: 'Veri yok',
});

export default translation;
