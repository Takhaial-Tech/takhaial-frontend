import automotiveIcon from '../../../assets/icons/sectors/automotive-sector.svg'
import educationIcon from '../../../assets/icons/sectors/education-sector.svg'
import militaryIcon from '../../../assets/icons/sectors/military-training-sector.svg'
import oilGasIcon from '../../../assets/icons/sectors/oil-gas-sector.svg'
import realEstateIcon from '../../../assets/icons/sectors/real-estate-sector.svg'
import safetyIcon from '../../../assets/icons/sectors/safety-sector.svg'
import tourismIcon from '../../../assets/icons/sectors/tourism-sector.svg'
import defaultIcon from '../../../assets/icons/sectors/sector-default.svg'

const normalize = (value) => String(value || '').toLowerCase()

export const getSectorIcon = (sector) =>
{
    const searchableText = normalize(`${sector?.title || ''} ${sector?.titleAr || ''}`)

    if (searchableText.includes('tourism')) return tourismIcon
    if (searchableText.includes('oil') || searchableText.includes('gas')) return oilGasIcon
    if (searchableText.includes('real estate')) return realEstateIcon
    if (searchableText.includes('military')) return militaryIcon
    if (searchableText.includes('health') || searchableText.includes('safety')) return safetyIcon
    if (searchableText.includes('automotive')) return automotiveIcon
    if (searchableText.includes('education') || searchableText.includes('interactive')) return educationIcon

    return defaultIcon
}
