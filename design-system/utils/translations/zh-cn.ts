import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'zh-cn',
    $name: '简体中文',
    $dir: 'ltr',

    carousel: '跑马灯',
    clearEntry: '清空',
    close: '关闭',
    copied: '已复制',
    copy: '复制',
    currentValue: '当前值',
    error: '错误',
    goToSlide: (slide, count) => `转到第 ${slide} 张幻灯片，共 ${count} 张`,
    hidePassword: '隐藏密码',
    loading: '加载中',
    nextSlide: '下一张幻灯片',
    numOptionsSelected: num => {
        if (num === 0) return '未选择任何项目';
        if (num === 1) return '已选择 1 个项目';
        return `${num} 选择项目`;
    },
    previousSlide: '上一张幻灯片',
    progress: '进度',
    remove: '删除',
    resize: '调整大小',
    scrollToEnd: '滚动至页尾',
    scrollToStart: '滚动至页首',
    selectAColorFromTheScreen: '从屏幕中选择一种颜色',
    showPassword: '显示密码',
    slideNum: slide => `幻灯片 ${slide}`,
    noOptionsFound: '没有匹配的选项',
    toggleColorFormat: '切换颜色模式',
};

registerTranslation(translation);

registerCalendarLocale('zh', {
    calendarText: {
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    },
    error: {
        required: () => '此字段为必填项。',
        invalidDate: () => '请输入有效日期。',
        minDate: p => `日期不得早于${p?.minDate}。`,
        maxDate: p => `日期不得晚于${p?.maxDate}。`,
        minYear: p => `年份必须 ≥ ${p?.minYear}。`,
        maxYear: p => `年份必须 ≤ ${p?.maxYear}。`,
        disabledDate: () => '该日期不可用。',
        disablePast: () => '不允许今天之前的日期。',
        disableFuture: () => '不允许今天之后的日期。',
        startAfterEnd: () => '开始日期必须早于或等于结束日期。',
        endBeforeStart: () => '结束日期必须晚于或等于开始日期。',
    },
    buttons: { ok: '确定', cancel: '取消' },
    aria: {
        previousMonth: '上个月',
        nextMonth: '下个月',
        openCalendar: '打开日历',
        selectMonth: '选择月份',
        selectYear: '选择年份',
        weekdays: '星期',
        calendarDateSelection: '日历日期选择',
        calendarIconStart: '打开开始日期日历',
        calendarIconEnd: '打开结束日期日历',
    },
    rangeDialog: '已选择的日期范围',
    fallback: { start: '开始日期', end: '结束日期' },
    shortcuts: {
        0: '本周',
        1: '下周',
        2: '未来两周',
        3: '未来三周',
        4: '未来四周',
        5: '本月',
        6: '下个月',
    },
});

registerDropzoneLocale('zh', {
    titles: {
        dropzoneTitle: '将文件拖到此处或点击浏览',
        dragTitle: '松开以上传文件',
        fileLoadedTitle: '已选择文件',
        maxFilesReachedTitle: '已达到最大文件数',
    },
    error: {
        required: () => '请至少选择一个文件。',
        fileTooLarge: p => `文件“${p?.name}”超过最大大小 ${p?.max}。`,
        fileTooSmall: p => `文件“${p?.name}”小于最小大小 ${p?.min}。`,
        invalidFileType: p => `文件“${p?.name}”的类型无效。`,
        maxFilesReached: p => `已达到最大文件数（${p?.maxFiles}）。`,
        onlyNMoreFiles: p => `只能再添加 ${p?.remaining} 个文件。`,
    },
    fileWord: () => '个文件',
});

registerTableLocale('zh', {
    searchPlaceholder: '搜索…',
    searchAriaLabel: '搜索',
    pageSizeLabel: '显示',
    pageSizeSuffix: '条记录',
    pageSizeAriaLabel: '每页条目',
    showingEntries: (from, to, total) => `显示第 ${from} 至 ${to} 条，共 ${total} 条`,
    noData: '暂无数据',
});

export default translation;
