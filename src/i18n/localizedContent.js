import { LANGUAGES, translateText } from './translations';

export const arabicFieldName = (field) => `${field}Ar`;

export const getLocalizedField = (item = {}, field, language, fallback = '') =>
{
    const englishValue = item?.[field] ?? fallback ?? '';

    if (language !== LANGUAGES.ar.code)
    {
        return englishValue || '';
    }

    return item?.[arabicFieldName(field)] || translateText(englishValue, language) || englishValue || '';
};

export const getBilingualInitialValues = (item = {}, fields = [], fallback = {}) =>
{
    return fields.reduce((values, field) =>
    {
        const englishValue = item?.[field] ?? fallback?.[field] ?? '';
        const arabicValue = item?.[arabicFieldName(field)] ?? fallback?.[arabicFieldName(field)] ?? translateText(englishValue, LANGUAGES.ar.code);

        values[field] = englishValue;
        values[arabicFieldName(field)] = arabicValue;
        return values;
    }, {});
};
